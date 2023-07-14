// This file will take readings using ADC, then output a weight reading.

/*

In order to determine if the weight has stabilised, the scale measurements can be minimally processed at the embedded level. First, we should ignore values of, or close to zero, as these indicate that the scales are not actually measuring anything. As for what should be taken to be zero, this is dependent on the load cell tolerances. After beginning to read non-zero values, we should wait until the value has begun to “settle down”. What this means is that we are constantly checking if the current sample is acceptably close to the sample immediately previous. 

If this condition is met, then we start the sampling window, where all measurements must stay within the specified thresholds for the entire duration of the window. Factors such as measurement noise mean that even if a dog is not moving, we could still observe fluctuations in the scale measurements. It is for this reason that we require thresholding, as we are very unlikely to observe a perfectly constant value.

The duration of the sampling window, as well as the thresholds are to be calculated empirically. If at any point during the sampling window the thresholds are exceeded, then the sampling window restarts, until a stable measurement is taken. It is assumed that a high sampling rate and longer sampling window will provide the most accurate result, although the window cannot be too long, because we have to consider that a dog might (will) move while on the scales. The final measurement is to be taken as some kind of average of the values from the sampling window, again, this is to be determined empirically.

The advantage of doing the processing on-board is that the communication channels between the scales and the backend do not need to transport a continuous stream of data, thus reducing the complexity of the communication.

*/

// Includes for Pico W.
#include <stdio.h>
#include <math.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/adc.h"

// ADC macros.
#define ADC_FREQ 500000 // ADC sampling frequency of 500kS/s.
#define ADC_LEVELS 4096 // Quantisation level for the ADC on the Pico W.
#define ADC_INPUT_MIN 1000 // Minimum input voltage in millivolts.
#define ADC_INPUT_MAX 3300 // Maximum input voltage in millivolts.
#define INPUT_RANGE ADC_INPUT_MAX - ADC_INPUT_MIN // Allowed input range for the ADC.

// Sampling macros.
#define WEIGHT_FACTOR 0.01 // This needs to be determined through testing.
#define CONF_RANGE INPUT_RANGE / ADC_LEVELS // Number of millivolts above a reading that the true reading could vary by. "Effective" ADC resolution.
#define NOISE_THRESH 0.05 // Noise threshold (multiply by 100 to get the percentage).
#define NOISE_MULTI_HI 1 + NOISE_THRESH
#define NOISE_MULTI_LO 1 - NOISE_THRESH
#define WINDOW_LENGTH 500 // Sampling window length in milliseconds.

void init() {

    // Initialise the ADC.
    adc_init();

    // GPIO needs to be high impendance for ADC0 pin.
    adc_gpio_init(31); // We are using pin 31 for ADC channel 0.
    adc_select_input(0); // Select channel 0 (pin 31, which was just initialised).
}

float calculate_weight(float reading) {

    reading -= ADC_INPUT_MIN; // Apply the offset to the reading.

    // If we assume a linear correlation, then weight calculation is relatively straightforward:
    float weight_reading = WEIGHT_FACTOR * reading / INPUT_RANGE;
    return weight_reading;
}

float window_scan() {

    // Tracking variables.
    uint32_t this_time = 0, start_time = 0;
    int window_counter = 0;
    float min_prev_reading = 0;
    float max_prev_reading = 0;
    float window_readings[WINDOW_LENGTH] = {0};

    // Initialise IO after clocks have been set up. Needed for UART, USB, semihosting.
    // stdio_init_all();
    init();

    // Get the current time (32 bit) as a reference.
    this_time = time_us_32();
    start_time = this_time;

    // Main loop runs until stable weight is found, or until timeout (30s).
    while(!time_reached(start_time + 3 * pow(10, 7))) {

        // Wait until 2000 microseconds (2ms) has elapsed since the last loop began. Then get the new reference.
        busy_wait_until(this_time + 2 * pow(10, 3));
        this_time = time_us_32();

        // ADC reading can be between 0 and ADC_LEVELS.
        uint16_t adc_result = adc_read();

        // Get the ADC reading in millivolts.
        float millvolt_reading = (float)adc_result / ADC_LEVELS * ADC_INPUT_MAX;

        // If we get a reading near zero, we can ignore this. Count should reset.
        if (millivolt_reading - ADC_INPUT_MIN < CONF_RANGE * NOISE_MULTI_HI) {
            window_counter = 0;
            min_prev_reading = 0;
            max_prev_reading = 0;
        } else {
            /* 
            We have a *true* reading, but due to noise effects, our ADC reading could differ...
            Looks something like this: |   0   || where 0 is the true reading, | represents possible ADC readings.
            Minimum noisy value (corresponds to maximum true value):
            adc_read = true * NOISE_MULTI_LO =>                 true = adc_read / NOISE_MULTI_LO
            Maximum noisy value (corresponds to minimum true value):
            adc_read = true * NOISE_MULTI_HI - CONF_RANGE =>    true = (adc_read + CONF_RANGE) / NOISE_MULTI_HI
            */
            float min_this_reading = (millivolt_reading + CONF_RANGE) / NOISE_MULTI_HI;
            float max_this_reading = millivolt_reading / NOISE_MULTI_LO;
            float prev_median = max_prev_reading - min_prev_reading; // Average (median) true value for the previous reading.

            // Set the current reading in the tracking array.
            window_readings[window_counter] = millivolt_reading;

            // So long as there is at least a 50% overlap between the two windows, this means that one window's true value will lie within the other's confidence interval.
            if ((min_this_reading < prev_median / 2) && (max_this_reading > prev_median / 2)) {
                window_counter++; // Increment our counter.
            } else {
                window_counter = 0; // Reset our counter, as the values are unstable.
            }

            // If values have been stable for long enough, perform a weight calculation.
            if (window_counter == WINDOW_LENGTH) {
                window_counter = 0; // Reset the counter so we don't end up sending values to the backend too often.

                // Sum the ADC readings for the whole duration of the window.
                double floatsum = 0;
                for (int i = 0; i < WINDOW_LENGTH; i++) {
                    floatsum += window_readings[i];
                }
                // In calculating the mean, we are assuming that noise follows a gaussian distribution. This means that our window must be sufficiently long to mitigate the effects of outliers.
                floatsum /= WINDOW_LENGTH;
                float weight_reading = calculate_weight(floatsum);
                return weight_reading; // If we want to take another reading, call the window_scan function again.
            }

            // Update the readings for the next loop cycle.
            min_prev_reading = min_this_reading;
            max_prev_reading = max_this_reading;
        }

    }

    return 0; // Default return if we don't get a stable weight in time.
}

int main () {
    float weight = window_scan(); // Can be called like so from main in different file (remember to include).
    return 0;
}



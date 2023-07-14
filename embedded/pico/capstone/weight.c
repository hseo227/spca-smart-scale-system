// This file will take readings using ADC, then output a weight reading.

/*

In order to determine if the weight has stabilised, the scale measurements can be minimally processed at the embedded level. First, we should ignore values of, or close to zero, as these indicate that the scales are not actually measuring anything. As for what should be taken to be zero, this is dependent on the load cell tolerances. After beginning to read non-zero values, we should wait until the value has begun to “settle down”. What this means is that we are constantly checking if the current sample is acceptably close to the sample immediately previous. 

If this condition is met, then we start the sampling window, where all measurements must stay within the specified thresholds for the entire duration of the window. Factors such as measurement noise mean that even if a dog is not moving, we could still observe fluctuations in the scale measurements. It is for this reason that we require thresholding, as we are very unlikely to observe a perfectly constant value.

The duration of the sampling window, as well as the thresholds are to be calculated empirically. If at any point during the sampling window the thresholds are exceeded, then the sampling window restarts, until a stable measurement is taken. It is assumed that a high sampling rate and longer sampling window will provide the most accurate result, although the window cannot be too long, because we have to consider that a dog might (will) move while on the scales. The final measurement is to be taken as some kind of average of the values from the sampling window, again, this is to be determined empirically.

The advantage of doing the processing on-board is that the communication channels between the scales and the backend do not need to transport a continuous stream of data, thus reducing the complexity of the communication.

*/

/* INCLUDES */
#include "weight.h"

/* MACROS */

// ADC macros.
#define ADC_FREQ 500000 // ADC sampling frequency of 500kS/s.
#define ADC_LEVELS 4096 // Quantisation level for the ADC on the Pico W.
#define ADC_INPUT_MIN 204 // Minimum input voltage in millivolts.
#define ADC_ON_TIME 200000 // ADC on time in idle state.
#define ADC_ON_OFF_TIME 500000 // Switching time for the ADC in microseconds.
#define CONF_RANGE 1 // Amount ADC reading can vary by due to discretisation.
 
// Sampling macros.
#define WEIGHT_FACTOR 138 // This needs to be determined through testing.
#define NOISE_THRESH 0.0244 // Noise threshold (multiply by 100 to get the percentage).
#define NOISE_MULTI_HI (1 + NOISE_THRESH)
#define NOISE_MULTI_LO (1 - NOISE_THRESH)
#define WINDOW_DURATION 500000 // Sampling window length in microseconds.
#define SAMPLE_INTERVAL 2000 // Time between samples in microseconds.
#define WINDOW_LENGTH (WINDOW_DURATION / SAMPLE_INTERVAL) // Window length in frames.

// Pin assignments.
#define GPIO_ENABLE 22 // Pin 29/GP22.
#define GPIO_ADC 26 // Pin 31/GP26.
#define GPIO_TARE 2 // Pin 4/GP2.
#define GPIO_LED_POWER 14 // Pin 19/GP14.
#define GPIO_LED_MEASUREMENT 10 // Pin 14/GP10.

// State definitions to improve human readability.
#define ON true
#define OFF false

/* GLOBALS */

volatile uint16_t isr_read = ADC_INPUT_MIN; // ISR ADC reading initialised to zero kg ADC reading.

/* ISRS */

void isr_handler() {

    // Set the ISR reading to the instantaneous ADC reading.
    isr_read = adc_read();

}

/* FUNCTIONS */

void set_led(uint8_t led_name, bool on_state) {

    // Set a specified LED to on or off.
    gpio_put(led_name, on_state);

}

void enable_circuit(bool enable) {

    // When enable pin outputs high, this puts the external circuitry into a low power state.
    gpio_put(GPIO_ENABLE, !enable);

}

void init_enable() {

    gpio_init(GPIO_ENABLE);
    // Configure enable pin as output and drive with 2mA.
    gpio_set_dir(GPIO_ENABLE, true);
    gpio_set_drive_strength(GPIO_ENABLE, GPIO_DRIVE_STRENGTH_2MA);
    // Enable the external circuitry.
    enable_circuit(true);
}

void init_adc() {

    adc_init();
    // GPIO needs to be high impendance for ADC0 pin.
    adc_gpio_init(GPIO_ADC);
    adc_select_input(0); // Select channel 0 (on the pin which was just initialised).

}

void init_led() {

    // Initialise pins for the LEDs.
    gpio_init(GPIO_LED_MEASUREMENT);
    gpio_init(GPIO_LED_POWER);
    // Set LED pins as output pins.
    gpio_set_dir(GPIO_LED_MEASUREMENT, true);
    gpio_set_dir(GPIO_LED_POWER, true);
    // LEDs typically have a forward current rating of 10 to 30mA. Here we are driving 12mA.
    gpio_set_drive_strength(GPIO_LED_MEASUREMENT, GPIO_DRIVE_STRENGTH_12MA);
    gpio_set_drive_strength(GPIO_LED_POWER, GPIO_DRIVE_STRENGTH_12MA);
    // Set the power and measurement LEDs to off.
    set_led(GPIO_LED_POWER, OFF);
    set_led(GPIO_LED_MEASUREMENT, OFF);

}

void init_tare() {

    // Initialise the tare button as an input.
    gpio_init(GPIO_TARE);
    gpio_set_dir(GPIO_TARE, false);
    // Enable interrupts for tare button and set the callback function.
    gpio_set_input_enabled(GPIO_TARE, true);
    gpio_set_irq_enabled_with_callback(GPIO_TARE, GPIO_IRQ_EDGE_FALL, true, &isr_handler);

}

uint16_t calculate_tare_reading(uint16_t adc_read) {

    // If tare button has been pressed since the scale has been turned on, change the adc reading accordingly.
    if (adc_read < isr_read) {
        isr_read = adc_read;
    }

    return adc_read - isr_read + ADC_INPUT_MIN;

}

float calculate_weight(double reading) {

    reading -= ADC_INPUT_MIN; // Apply the offset to the reading.

    // If we assume a linear correlation, then weight calculation is relatively straightforward:
    float weight_reading = reading / WEIGHT_FACTOR;
    return weight_reading;

}

void idle_wait() {

    // Count to turn off the measurement LED.
    uint16_t led_count = 0;

    // Get the current timestamp.
    uint64_t this_time = time_us_64();

    // For this loop we are sampling at 20Hz to see if we need to exit the idle state.
    while(1) {

        // Turn the measurement complete LED off after 1 second.
        if (led_count == pow(10, 6) / ADC_ON_OFF_TIME) {
            set_led(GPIO_LED_POWER, OFF);
            set_led(GPIO_LED_MEASUREMENT, OFF);

        }

        // Enable the rest of the external circuitry so that we can take an ADC reading.
        enable_circuit(true);

        // Wait for 1ms to allow the external circuitry to turn on.
        busy_wait_until(this_time + ADC_ON_TIME);
        
        // Get an ADC reading and convert to millivolts so that we can account for noise appropriately.
        uint16_t adc_result = adc_read();

        // If the ADC reading is above zero (minimum 333g), need to start weighing.
        if (adc_result >= (ADC_INPUT_MIN + (float)WEIGHT_FACTOR / 3) / NOISE_MULTI_LO) {
            return;
        }

        // Disable the external circuitry to save power.
        enable_circuit(false);

        // Wait until 50ms has elapsed since the last loop began. Then get the new reference.
        busy_wait_until(this_time + ADC_ON_OFF_TIME);

        this_time = time_us_64();

        led_count++;

    } 

}

float window_scan() {

    // Turn on the power LED.
    set_led(GPIO_LED_POWER, ON);

    // Tracking variables.
    uint32_t this_time = 0, start_time = 0;
    int window_counter = 0;
    float min_prev_reading = 0;
    float max_prev_reading = 0;
    uint16_t window_readings[WINDOW_LENGTH] = {0};
    uint16_t adc_tare = 0;
    uint16_t zero_counter = 0;
    float sum = 0;

    // Get the current time (64 bit) as a reference.
    this_time = time_us_64();
    start_time = this_time;

    // Main loop runs until stable weight is found, or until timeout (500ms).
    while(1) {

        // Wait until 2000 microseconds (2ms) has elapsed since the last loop began. Then get the new reference.
        busy_wait_until(this_time + SAMPLE_INTERVAL);
        this_time = time_us_64();        
        
        // If we have been sampling for 500ms without getting a non-zero reading, timeout.
        if (zero_counter == WINDOW_LENGTH) {
            return 0; // Timeout.
        }

        // ADC reading can be between 0 and ADC_LEVELS.
        uint16_t adc_result = adc_read();

        // Change the ADC reading according to when the tare was last pressed.
        adc_result = calculate_tare_reading(adc_result);

        // If we get a reading near zero (less than 333g), we can ignore this. Count should reset.
        if (adc_result < (ADC_INPUT_MIN + CONF_RANGE + (float)WEIGHT_FACTOR / 3) / NOISE_MULTI_HI) {
            window_counter = 0;
            min_prev_reading = 0;
            max_prev_reading = 0;
            zero_counter++; // Increase the zero counter for timeout.
        } else {
            /* 
            We have a *true* reading, but due to noise effects, our ADC reading could differ...
            Looks something like this: |   0   || where 0 is the true reading, | represents possible ADC readings.
            Minimum noisy value (corresponds to maximum true value):
            adc_read = true * NOISE_MULTI_LO =>                 true = adc_read / NOISE_MULTI_LO
            Maximum noisy value (corresponds to minimum true value):
            adc_read = true * NOISE_MULTI_HI - CONF_RANGE =>    true = (adc_read + CONF_RANGE) / NOISE_MULTI_HI
            */
            float min_this_reading = (adc_result + CONF_RANGE) / NOISE_MULTI_HI;
            float max_this_reading = adc_result / NOISE_MULTI_LO;
            float prev_range = max_prev_reading - min_prev_reading;

            // Set the current reading in the tracking array.
            window_readings[window_counter] = adc_result;
          
            // So long as there is at least a 50% overlap between the two windows, this means that one window's true value will lie within the other's confidence interval.
            if (min_this_reading < ((prev_range / 2) + min_prev_reading) && max_this_reading > ((prev_range / 2) + min_prev_reading)) {
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
                set_led(GPIO_LED_MEASUREMENT, ON); // Set the led to indicate that we have completed a measurement.

                return weight_reading; // If we want to take another reading, call the window_scan function again.
            }

            // Get the average for the values so far.
            for (int i = 0; i < window_counter; i++) {
                sum += window_readings[i];
            }

            if (window_counter != 0) {
                sum /= window_counter;

                // Update the readings for the next loop cycle.
                min_prev_reading = (sum + CONF_RANGE) / NOISE_MULTI_HI;
                max_prev_reading = sum / NOISE_MULTI_LO;
            } else {
                min_prev_reading = min_this_reading;
                max_prev_reading = max_this_reading;
            }

            sum = 0;
            zero_counter = 0; // Reset the zero counter for timeout.
        }

    }
    
    return 0; // Default return if we don't get a stable weight in time.
    
}





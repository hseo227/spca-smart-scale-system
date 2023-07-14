#ifndef WEIGHT_H
#define WEIGHT_H

#include <stdio.h>
#include <math.h>
#include <stdbool.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/adc.h"

// ADC macros.
#define ADC_FREQ 500000 // ADC sampling frequency of 500kS/s.
#define ADC_LEVELS 4096 // Quantisation level for the ADC on the Pico W.
#define ADC_INPUT_MIN 204 // Minimum input voltage in millivolts.
#define ADC_ON_OFF_RATIO (9/10) // Time on versus time off for the ADC in the idle state.
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


void isr_handler();
void set_led(uint8_t led_name, bool on_state);
void enable_circuit(bool enable);
void init_measurement();
uint16_t calculate_tare_reading(uint16_t adc_read);
float calculate_weight(double reading);
void idle_wait();
float window_scan();

#endif /* WEIGHT_H */

#include "pico/stdlib.h"
#include "pico/cyw43_arch.h"

#include "http.h"
#include "weight.h"
#include <time.h>

//Entry point

int main() {

    stdio_init_all();
    initialize_wifi();
    init_enable();
    init_adc();
    init_led();
    init_tare();

    float weight_reading = 0;
    char scaleid[] = "646d3c629bb47a7b43177a59";
    //char serial[] = "SPCAS67DKG1C";
    while (1) {
        
        idle_wait();
        weight_reading = 1;
        while(weight_reading!= 0) {
            weight_reading = window_scan();
            printf("%f\n", weight_reading);
            //Generate new HTTP request with JSON.
            generateHTTPFormat(scaleid, weight_reading);
            // Send via HTTP to the backend.
            run_tls_client_test();
        }

    }

}

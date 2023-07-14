cmake_minimum_required(VERSION 3.13)

include(pico_sdk_import.cmake)

project(capstone C CXX ASM)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)
pico_sdk_init()

add_executable(capstone
	main.c
	http.c
	weight.c
)
target_compile_definitions(capstone PRIVATE
        WIFI_SSID=\"${WIFI_SSID}\"
        WIFI_PASSWORD=\"${WIFI_PASSWORD}\"
        )
target_include_directories(capstone PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}
        ${CMAKE_CURRENT_LIST_DIR}/.. # for our common lwipopts
        )
target_link_libraries(capstone 
	 pico_cyw43_arch_lwip_poll
        pico_lwip_mbedtls
        pico_mbedtls
        pico_stdlib
        hardware_adc
)

pico_enable_stdio_usb(capstone 1)
pico_enable_stdio_uart(capstone 0)

pico_add_extra_outputs(capstone)

# Ignore warnings from lwip code
set_source_files_properties(
        ${PICO_LWIP_PATH}/src/apps/altcp_tls/altcp_tls_mbedtls.c
        PROPERTIES
        COMPILE_OPTIONS "-Wno-unused-result"
        )





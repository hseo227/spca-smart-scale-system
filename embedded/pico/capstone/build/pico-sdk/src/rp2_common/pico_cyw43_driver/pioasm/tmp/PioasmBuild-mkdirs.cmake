# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/home/anthony/capstone-project-team-23/project/embedded/pico/pico-sdk/tools/pioasm"
  "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pioasm"
  "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm"
  "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm/tmp"
  "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm/src/PioasmBuild-stamp"
  "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm/src"
  "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm/src/PioasmBuild-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm/src/PioasmBuild-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "/home/anthony/capstone-project-team-23/project/embedded/pico/capstone/build/pico-sdk/src/rp2_common/pico_cyw43_driver/pioasm/src/PioasmBuild-stamp${cfgdir}") # cfgdir has leading slash
endif()

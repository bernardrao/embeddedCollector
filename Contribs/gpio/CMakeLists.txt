project(gpio)

include_directories(${CMAKE_CURRENT_SOURCE_DIR})
add_compile_options(-g -std=c99 -Wall -MMD -MF -Wno-format-truncation -fwrapv  -D_GNU_SOURCE -DCONFIG_VERSION=\"2024-01-13\" -DCONFIG_BIGNUM -O2 -lm -ldl -lpthread) 

# target_link_libraries(${PROJECT_NAME} m dl pthread)
add_library(gpio
    # STATIC
    gpio.c
    )
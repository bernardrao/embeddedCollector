project(rjs)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}../Contribs)
include_directories(${CMAKE_CURRENT_SOURCE_DIR})
add_compile_options(-g -std=gnu99 -Wall -MMD -MF -Wno-array-bounds -Wno-format-truncation -fwrapv  -D_GNU_SOURCE -DCONFIG_VERSION=\"2024-01-13\" -DCONFIG_BIGNUM -O2 -lm -ldl -lpthread) 

add_library(rjs
    # STATIC
    rjs.c
    mod_core.c
    mod_db.c
    mod_socketcan.c
    mod_gpio.c
    mod_uart.c
    mod_kafka.c
    mod_mqtt.c
    mod_bson.c #rox
    )
    
target_link_libraries(rjs m dl pthread)
target_link_libraries(rjs sqlite3)
target_link_libraries(rjs rdkafka)
target_link_libraries(rjs socketcan uartlib)
target_link_libraries(rjs gpio)
target_link_libraries(rjs bson_static)
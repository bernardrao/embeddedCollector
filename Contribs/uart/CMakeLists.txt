project(uartlib)
add_library(uartlib uartlib.c)

target_link_libraries(${PROJECT_NAME} mongoose)
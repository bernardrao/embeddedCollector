cmake_minimum_required( VERSION 3.0 )


# Shenku Embedded Server
project(ske)
set(CMAKE_BUILD_TYPE Debug)
add_compile_options(-g)
include_directories(${CMAKE_CURRENT_SOURCE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/Contribs)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/CWebEngine)
# include_directories(${CMAKE_CURRENT_SOURCE_DIR}/Extensions)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/RjsEngine)

# 生成pack(可执行文件)，用于打包文件  
add_executable(pack pack.c)

# sqlite 客户端 
add_executable(sqlcli Contribs/sqlite3/shell.c Contribs/sqlite3/sqlite3.c)
target_link_libraries(sqlcli pthread dl)



# 定义全局变量
# set(SHARED_VARIABLE "Hello, World!" CACHE INTERNAL "Shared variable")

# 添加子目录
add_subdirectory(RjsEngine)
add_subdirectory(Contribs/libbson)
add_subdirectory(Contribs/rdkafka)
add_subdirectory(Contribs/quickjs)
add_subdirectory(Contribs/mongoose)
add_subdirectory(Contribs/sqlite3)
add_subdirectory(Contribs/socketcan)
add_subdirectory(Contribs/uart)
add_subdirectory(Contribs/gpio)

# add_subdirectory(Extensions/Can)
# add_subdirectory(Extensions/Gpio)
# add_subdirectory(Extensions/Rdkafka)
# add_subdirectory(cJSON)

# file(GLOB_RECURSE SRC_FILES     
    # ${CMAKE_CURRENT_LIST_DIR}/CWebEngine/Api/*.c 
    # ${CMAKE_CURRENT_LIST_DIR}/CWebEngine/*.c 
# )

# 输出目录 为 out 
set(out_dir ${PROJECT_SOURCE_DIR}/out)
# set(out_dir ${CMAKE_BINARY_DIR}/out)
SET(EXECUTABLE_OUTPUT_PATH ${out_dir})


execute_process(COMMAND ${CMAKE_COMMAND} -E remove_directory ${out_dir}/server)
execute_process(COMMAND ${CMAKE_COMMAND} -E copy_directory ${PROJECT_SOURCE_DIR}/server ${out_dir}/server)

# file(COPY ${PROJECT_SOURCE_DIR}/server DESTINATION "${CMAKE_BINARY_DIR}/server")


add_subdirectory(CWebEngine)
 
# add_compile_options(-W -Wall -Wextra -O0 -g3  -DMG_ENABLE_PACKED_FS=1 -DMG_ENABLE_LINES=1) 
# 主项目的构建规则
add_executable(${PROJECT_NAME} main.c www_root.c)
# add_executable(${PROJECT_NAME} zyp.c www_root.c)
# target_sources(${PROJECT_NAME} PUBLIC ${SRC_FILES})


# target_link_directories(${PROJECT_NAME} PUBLIC Contribs/rdkafka)
# 链接子目录生成的库
target_link_libraries(${PROJECT_NAME} CWebEngine)
target_link_libraries(${PROJECT_NAME} bson_static)
target_link_libraries(${PROJECT_NAME} socketcan uartlib)
target_link_libraries(${PROJECT_NAME} mongoose sqlite3)
target_link_libraries(${PROJECT_NAME} rjs quickjs)
# target_link_libraries(${PROJECT_NAME} rdkafka extKafka)
# target_link_libraries(${PROJECT_NAME} cjson)


# 打印全局变量值
message(STATUS "Shared variable value: ${SHARED_VARIABLE}")





# ##############设置目标文件生成位置#####################
# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${PROJECT_BINARY_DIR}/bin")
# set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${PROJECT_BINARY_DIR}/bin")
# set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${PROJECT_BINARY_DIR}/lib")
# # define RUNTIME_INSTALL_DIR LIBRARY_INSTALL_DIR INCLUDE_INSTALL_DIR CONFIG_INSTALL_DIR
# set (RUNTIME_INSTALL_DIR bin)
# set (LIBRARY_INSTALL_DIR lib)
# set (INCLUDE_INSTALL_DIR include)
# #添加头文件包含路径
# include_directories(${CMAKE_CURRENT_SOURCE_DIR}/inc)

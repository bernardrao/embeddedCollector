# submodule1/CMakeLists.txt
project(CWebEngine)

file(GLOB_RECURSE SRC_FILES     
    ${CMAKE_CURRENT_LIST_DIR}/Api/*.c 
    # ${CMAKE_CURRENT_LIST_DIR}/CWebEngine/*.c 
)

add_library(CWebEngine Router.c User.c)
target_sources(CWebEngine PUBLIC ${SRC_FILES})

# target_include_directories(libCore PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
# target_include_directories(libCore PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
# submodule1/CMakeLists.txt
project(mongoose)

add_compile_options(-W -Wall -Wextra -O0 -g3 -std=gnu99 -DMG_ENABLE_PACKED_FS=1 -DMG_ENABLE_LINES=1) 
add_library(mongoose
    # STATIC
    mongoose.c)



# project(mongoose)

# add_library(libmongoose mongoose.c)

# target_include_directories(libCore PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
# target_include_directories(libmongoose PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
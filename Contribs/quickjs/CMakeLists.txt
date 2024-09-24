project(quickjs)

add_compile_options(-g -std=c99 -Wall -MMD -MF -Wno-array-bounds -Wno-format-truncation -fwrapv  -D_GNU_SOURCE -DCONFIG_VERSION=\"2024-01-13\" -DCONFIG_BIGNUM -O2 -lm -ldl -lpthread) 

add_library(quickjs
    # STATIC
    quickjs.c 
    libunicode.c 
    libbf.c
    libregexp.c
    quickjs-libc.c
    cutils.c)
# target_link_libraries(quickjs m dl pthread)

#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <stdio.h>
#include <unistd.h>


extern void mg_hexdump(const void *buf, size_t len);
extern int gpioSet(const char* pinGroup, const char * pinGPIO, int dat);


static JSValue js_gpio_set(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    // void(argc);
    const char * pinGroup = JS_ToCString(ctx, argv[0]);
    const char * pin = JS_ToCString(ctx, argv[1]);
    int dat;
    if (JS_ToInt32(ctx, &dat, argv[2])) return JS_EXCEPTION;

    int ret = gpioSet(pinGroup, pin, dat);
  
    return JS_NewInt32(ctx, ret);
}


// sub functions map 子函数映射  
static const JSCFunctionListEntry js_gpio_functions[] = 
{
    JS_CFUNC_DEF("set", 2, js_gpio_set),
};

// init module functions list 初始化函数列表 
static int js_gpio_init(JSContext *ctx, JSModuleDef *module)
{
  // demo 
  // js_core_gen_version(); // generate version string
  return JS_SetModuleExportList(ctx, module, js_gpio_functions, countof(js_gpio_functions));
}

// init 'gpio' module 初始化gpio模块 
JSModuleDef *js_init_module_gpio(JSContext *ctx, const char *module_name)
{
  JSModuleDef *module;
  module = JS_NewCModule(ctx, module_name, js_gpio_init);
  if (!module)
  {
    return NULL;
  }
  JS_AddModuleExportList(ctx, module, js_gpio_functions, countof(js_gpio_functions));
  return module;
}
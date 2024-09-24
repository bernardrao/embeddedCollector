// #include "rjs.h"

#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>

// extern const char *db_path;  // rox
// extern DynBuf RJS_dbuf_new(JSContext *ctx, const char *fmt, ...);



// const char * help = " sqlite execute aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
static JSValue js_core_help(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    // DynBuf res = RJS_dbuf_new(ctx, "sqlite execute aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    
    
    // char * help = " sqlite execute";
    // printf("\nC: js_core_help %s\n", help);
    // printf("\nC: query result %s\n", (char *)res.buf);
	// getc(stdin);
    
	// return JS_NewString(ctx, (char *)res.buf);
  
  const char * help = " core help ccccccccccccccccccc";
  return JS_NewString(ctx, help);
}


// 子函数映射  
static const JSCFunctionListEntry js_core_functions[] = 
{
    JS_CFUNC_DEF("help", 0, js_core_help),
};

// 初始化函数列表 
static int js_core_init(JSContext *ctx, JSModuleDef *module)
{
  return JS_SetModuleExportList(ctx, module, js_core_functions, countof(js_core_functions));
}



// 初始化模块 
JSModuleDef *js_init_module_core(JSContext *ctx, const char *module_name)
{
  JSModuleDef *module;
  module = JS_NewCModule(ctx, module_name, js_core_init);
  if (!module)
  {
    return NULL;
  }
  JS_AddModuleExportList(ctx, module, js_core_functions, countof(js_core_functions));
  return module;
}
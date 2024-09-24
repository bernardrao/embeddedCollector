#ifndef LIBRJS_H
#define LIBRJS_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdio.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <string.h>
#include <stdarg.h>
// typedef JSModuleDef *(*js_fn_init_module)(JSContext *, const char *);


typedef struct  {
    int fd;
    const char * portname;
    const char * js_callback;
    JSValue * config;
    JSContext* context; 
} RJS_File;


extern JSModuleDef *js_init_module_core(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_db(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_socketcan(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_uart(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_gpio(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_kafka(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_mqtt(JSContext *ctx, const char *module_name);
extern JSModuleDef *js_init_module_bson(JSContext *ctx, const char *module_name);


// extern const char *db_path;  // rox
// extern const char *js_path;  // rox  
// extern const char *js_modules;  // rox  


JSRuntime *RJS_NewRuntime(void *userdata);
JSContext *RJS_NewContext(JSRuntime *rt);
void RJS_LoadModules(JSContext *ctx);
void RJS_LoadScript(JSContext *ctx, const char * script);
void RJS_LoadScriptFromFile(JSContext *ctx, const char * filename);
JSContext * RJS_init(const char * js_file, void *userdata);
void RJS_Destory(JSContext *ctx);
JSValue RJS_ExecFunction(JSContext *ctx, const char* func_name, int argc, JSValueConst *args);


// DynBuf __attribute__((format(printf, 2, 3))) RJS_dbuf_new(JSContext *ctx, const char *fmt, ...);
DynBuf RJS_dbuf_new(JSContext *ctx, const char *fmt, ...);
DynBuf RJS_dbuf_string(JSContext *ctx, const char *fmt, ...);

double RJS_GetFloat64(JSContext *ctx, JSValueConst val);
int32_t RJS_GetInt32(JSContext *ctx, JSValueConst val);
uint32_t RJS_GetUInt32(JSContext *ctx, JSValueConst val);
int64_t RJS_GetInt64(JSContext *ctx, JSValueConst val);
// uint64_t RJS_GetUInt64(JSContext *ctx, JSValueConst val);
const char *RJS_GetString(JSContext *ctx, JSValueConst val);
const char *RJS_GetStringView(JSContext *ctx, size_t *plen, JSValueConst val1);


#ifdef __cplusplus
}
#endif
#endif  // LIBRJS_H
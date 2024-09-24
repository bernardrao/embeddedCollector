#include "rjs.h"
#define MOD_NAME_MAX 50

extern const char *js_modules;  // rox

// RJS_LoadModule(ctx, "uart", js_init_module_uart)

#define _LoadModule(ctx, name) RJS_LoadModule(ctx, name, js_init_module_##name(ctx,name))


JSValue RJS_ExecFunction(JSContext *ctx, const char* func_name, int argc, JSValueConst *args)
{
    JSValue global = JS_GetGlobalObject(ctx);
    JSValue func = JS_GetPropertyStr(ctx, global, func_name); //找出要调用的函数
    if (JS_IsException(func))
        printf("C Error: Can't retrieving function %s !\r\n", func_name);

    if (!JS_IsFunction(ctx, func))
        printf("C Error: %s is not function!\r\n", func_name);
    
    JSValue jsResult = JS_Call(ctx, func, JS_UNDEFINED, argc, args);

    JS_FreeValue(ctx, func);
    JS_FreeValue(ctx, global);
    return jsResult;
}

JSRuntime *RJS_NewRuntime(void *userdata)
{
    JSRuntime *rt = JS_NewRuntime();
    js_std_set_worker_new_context_func(RJS_NewContext);
    js_std_init_handlers(rt);
    JS_SetModuleLoaderFunc(rt, NULL, js_module_loader, NULL);
    JS_SetRuntimeData(rt, userdata); // rox 
    
    return rt;
}

JSContext *RJS_NewContext(JSRuntime *rt)
{
    // JSRuntime *rt = RJS_NewRuntime();
    JSContext *ctx = JS_NewContextRaw(rt);
    if (!ctx)
        return NULL;
    
    JS_AddIntrinsicBaseObjects(ctx);
    JS_AddIntrinsicDate(ctx);
    JS_AddIntrinsicEval(ctx);
    JS_AddIntrinsicStringNormalize(ctx);
    JS_AddIntrinsicRegExp(ctx);
    JS_AddIntrinsicJSON(ctx);
    JS_AddIntrinsicProxy(ctx);
    JS_AddIntrinsicMapSet(ctx);
    JS_AddIntrinsicTypedArrays(ctx);
    JS_AddIntrinsicPromise(ctx);
    JS_AddIntrinsicBigInt(ctx);
    
    js_std_add_helpers(ctx, 0, NULL);
    
    return ctx;
}

void RJS_LoadModule(JSContext *ctx, const char * name)
{
    if(0 == strcmp("uart",name))
        js_init_module_uart(ctx, name);
    else if(0 == strcmp("socketcan",name))
        js_init_module_socketcan(ctx, name);
    else if(0 == strcmp("gpio",name))
        js_init_module_gpio(ctx, name);
    else if(0 == strcmp("kafka",name))
        js_init_module_kafka(ctx, name);
    else if(0 == strcmp("mqtt",name))
        js_init_module_mqtt(ctx, name);
	else if(0 == strcmp("bson",name))
        js_init_module_bson(ctx, name);
    
    char script[512]; 
    sprintf(script, "import * as %s from '%s';globalThis.%s = %s;\n", name, name, name, name);
       
    // size_t script_len;
    // char * script = (char *) js_load_file(ctx, &script_len, js_modules);
    
    JSValue val;   
    val = JS_Eval(ctx, script, strlen(script), "<input>",
                  JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY);
    if (!JS_IsException(val)) {
        js_module_set_import_meta(ctx, val, TRUE, TRUE);
        val = JS_EvalFunction(ctx, val);
    }
    
    JS_FreeValue(ctx, val);  
}


/*  import modules：
    std: include 
        js_std_funcs:
            exit, gc, evalScript, loadScript, getenv, setenv, unsetenv, getenviron, urlGet, loadFile, strerror, parseExtJSON
        FILE I/O:
            open, popen, fdopen, tmpfile, puts, printf, sprintf, SEEK_SET, SEEK_CUR, SEEK_END, Error
        File Proto:
            close, puts, printf, flush, tell, tello, seek, eof, fileno, error, clearerr, read, write, getline, readAsString, getByte, putByte
    os: include setTimeout
    cmd: inculde canSend, gpioWrite, 
    db: include query
*/
void RJS_LoadDefaultModules(JSContext *ctx)
{
    js_init_module_std(ctx, "std");
    js_init_module_os(ctx, "os");
    js_init_module_core(ctx, "core");
    js_init_module_db(ctx, "db");
    
    RJS_LoadModule(ctx, "uart");
    RJS_LoadModule(ctx, "socketcan");
    RJS_LoadModule(ctx, "gpio");
    RJS_LoadModule(ctx, "kafka");
    RJS_LoadModule(ctx, "mqtt");
    RJS_LoadModule(ctx, "bson");
    
    
    // RJS_LoadModule(ctx, "uart", js_init_module_uart);
    // RJS_LoadModule(ctx, "socketcan", js_init_module_socketcan);
    // RJS_LoadModule(ctx, "gpio", js_init_module_gpio);
    // RJS_LoadModule(ctx, "kafka", js_init_module_kafka);
    
    // js_init_module_uart(ctx, "uart");
    // js_init_module_socketcan(ctx, "socketcan");
    // js_init_module_gpio(ctx, "gpio");
    // js_init_module_kafka(ctx, "kafka");
    
    // const char *script =
       // "import * as std from 'std';\n"
       // "import * as os from 'os';\n"
       // "import * as db from 'db';\n"
       // "globalThis.std = std;\n"
       // "globalThis.os = os;\n"
       // "globalThis.db = db;\n"  
       // "";
    // size_t script_len = strlen(script);   
    size_t script_len;
    char * script = (char *) js_load_file(ctx, &script_len, js_modules);
    
    // printf("C:script: %s\n", script);
    JSValue val;   
    val = JS_Eval(ctx, script, script_len, "<input>",
                  JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY);
    if (!JS_IsException(val)) {
        js_module_set_import_meta(ctx, val, TRUE, TRUE);
        val = JS_EvalFunction(ctx, val);
    }
    
    JS_FreeValue(ctx, val);
}

void RJS_LoadScript(JSContext *ctx, const char * script)
{
    
    size_t script_len = strlen(script);
    
    
    //加载 JS 脚本   JSValue ret = JS_Eval(ctx, scripts, scripts_len, "<input>", JS_EVAL_FLAG_STRICT);
    // JS_Eval(ctx, script, script_len, "main", 0);  
    JSValue jsRes = JS_Eval(ctx, script, script_len, "main", 0);  
    JS_FreeValue(ctx, jsRes);

    // eval JS 字节码， 使用 qjsc 导出字节码 
    // js_std_eval_binary(ctx, scripts_binary, scripts_binary_size, 0);
    
}

// 从文件加载
void RJS_LoadScriptFromFile(JSContext *ctx, const char * filename)
{
    size_t script_len;
    char * script = (char *) js_load_file(ctx, &script_len, filename);

    RJS_LoadScript(ctx, script);
    js_free(ctx, script);
}

JSContext * RJS_init(const char * js_file, void *userdata) 
{
    JSRuntime *rt = RJS_NewRuntime(userdata);
    JSContext *ctx = RJS_NewContext(rt);
    RJS_LoadDefaultModules(ctx);
    
    // 这里加载多次，每次一个文件 
    RJS_LoadScriptFromFile(ctx, js_file);
    
    // 也可以加载 字串脚本，脚本可以放在 sqlite 中 
    // void RJS_LoadScript(JSContext *ctx, const char * script);
    
    return ctx;
}

void RJS_Destory(/* JSRuntime *rt,  */JSContext *ctx)
{
    js_std_loop(ctx);
    JSRuntime *rt = JS_GetRuntime(ctx);
    js_std_free_handlers(rt);
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
}

double RJS_GetFloat64(JSContext *ctx, JSValueConst val)
{
    double ret = 0;    
    if (JS_ToFloat64(ctx, &ret, val)<0)
        printf("C :(RJS_GetFloat64)     Error!  ---- \n");
    
    return ret;    
}

int32_t RJS_GetInt32(JSContext *ctx, JSValueConst val)
{
    int32_t ret = 0;    
    if (JS_ToInt32(ctx, &ret, val)<0)
        printf("C :(RJS_GetInt32)     Error!  ---- \n");
    
    return ret;    
}

uint32_t RJS_GetUInt32(JSContext *ctx, JSValueConst val)
{
    uint32_t ret = 0;    
    if (JS_ToUint32(ctx, &ret, val)<0)
        printf("C :(RJS_GetUInt32)     Error!  ---- \n");
    
    return ret;    
}
int64_t RJS_GetInt64(JSContext *ctx, JSValueConst val)
{
    int64_t ret = 0;    
    if (JS_ToInt64(ctx, &ret, val)<0)
        printf("C :(RJS_GetInt64)     Error!  ---- \n");
    
    return ret;    
}
/* uint64_t RJS_GetUInt64(JSContext *ctx, JSValueConst val)
{
    uint64_t ret = 0;    
    if (JS_ToUint64(ctx, &ret, val)<0)
        printf("C :(RJS_GetUInt64)     Error!  ---- \n");
    
    return ret;    
} */
const char *RJS_GetString(JSContext *ctx, JSValueConst val)
{
    return JS_ToCStringLen2(ctx, NULL, val, 0);
}
const char *RJS_GetStringView(JSContext *ctx, size_t *plen, JSValueConst val)
{
    return JS_ToCStringLen2(ctx, plen, val, 0);
}

// 不以 \0 结束 
// DynBuf __attribute__((format(printf, 2, 3))) RJS_dbuf_new(JSContext *ctx, const char *fmt, ...)
DynBuf RJS_dbuf_new(JSContext *ctx, const char *fmt, ...)
{
    DynBuf s;
    dbuf_init2(&s, JS_GetRuntime(ctx), (DynBufReallocFunc *)js_realloc_rt);
    if(sizeof(fmt)==0) return s;
    
    va_list ap;
    va_start(ap, fmt);
    char buf[128];
    int len;
    len = vsnprintf(buf, sizeof(buf), fmt, ap);
    va_end(ap);
    if (len < sizeof(buf)) {
        /* fast case */
        if(dbuf_put(&s, (uint8_t *)buf, len))
            return s;
        
    } else {
        if (dbuf_realloc(&s, s.size + len + 1))
            return s;
        va_start(ap, fmt);
        vsnprintf((char *)(s.buf + s.size), s.allocated_size - s.size,
                  fmt, ap);
        va_end(ap);
        s.size += len;
    }

    return s;
}

// 以 \0 结束 
DynBuf RJS_dbuf_string(JSContext *ctx, const char *fmt, ...)
{
    /* va_list ap;
    va_start(ap, fmt);
    DynBuf s = dbuf_new(ctx, fmt, ap);
    va_end(ap);
    if(dbuf_putc(&s, '\0')<0)
        return s;
    
    return s; */
    
    DynBuf s;
    dbuf_init2(&s, JS_GetRuntime(ctx), (DynBufReallocFunc *)js_realloc_rt);
    
    if(sizeof(fmt)==0) return s;
        
    char buf[128];
    int len;
    
    va_list ap;
    va_start(ap, fmt);
    len = vsnprintf(buf, sizeof(buf), fmt, ap);
    va_end(ap);
    
    if (len+1 < sizeof(buf)) {
        // fast case 
        if(dbuf_put(&s, (uint8_t *)buf, len))     
            return s;
        
    } else {
        if (dbuf_realloc(&s, s.size + len + 2))
            return s;
        
        va_start(ap, fmt);
        vsnprintf((char *)(s.buf + s.size), s.allocated_size - s.size,
                  fmt, ap);
        va_end(ap);
        s.size += len;
    }
    
    if(dbuf_putc(&s, '\0')<0)
        return s;
    
    
    return s;
}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <net/if.h>
#include <sys/ioctl.h>
#include <sys/socket.h>

#include <linux/can.h>
#include <linux/can/raw.h>

#include <signal.h>

// #include <inttypes.h>
// #include <stdarg.h>
#include "RjsEngine/rjs.h"
#include "quickjs/quickjs-libc.h"
#include "quickjs/cutils.h"
extern int JS_DeletePropertyInt64(JSContext *ctx, JSValueConst obj, int64_t idx, int flags);


static volatile int running = 1;

void sigterm(int signo)
{
    running = 0;
}

// 从 json 中取数据的示例 
void printDemo(JSValue* config, JSContext *context)
{
    // 打印修改后的数据 config.data[1]["value"]    
    JSValue data_arr = JS_GetPropertyStr(context, *config, "data");
    JSValue data_field = JS_GetPropertyUint32(context, data_arr, 1); // 取数组
    JSValue data_val = JS_GetPropertyStr(context, data_field, "value"); // 取数组
    if (!JS_IsUndefined(data_val)) {
        // double val = RJS_GetFloat64(context, data_val);    
        printf("C :(realtimeCalc)     value: %f \n", RJS_GetFloat64(context, data_val));
    }
    JS_FreeValue(context, data_arr);
    JS_FreeValue(context, data_field);
    JS_FreeValue(context, data_val);
}

// 初始化配置，可用考虑从 sqlite 中读取 
void initCfg(JSContext *ctx, JSValue* config)
{
    JSValue args_cfg[]={*config};
    
    // 调用 js 中定义的 initConfig 函数
    JSValue ret=RJS_ExecFunction(ctx,  "initConfig", sizeof(args_cfg)/sizeof(args_cfg[0]), args_cfg);
    JS_FreeValue(ctx,ret);
}

// 收到报文的处理，然后提交给 js 处理 
void onMessage(const char * _message, JSValue* config, JSValue* temp, JSContext *ctx)
{
    // 转成js可用的数据格式
    JSValue message = JS_NewString(ctx, _message);  
    if (JS_IsException(message)) return;
        
    JSValue args[]={*config, message, *temp};
    
    // 调用 js 中定义的 onMessage 函数
    JSValue ret=RJS_ExecFunction(ctx,  "onMessage", sizeof(args)/sizeof(args[0]),  args);
    
    JS_FreeValue(ctx,ret);
    // 等待 js 里面可能有 timer， 等它结束
    js_std_loop(ctx);
    
    // 释放 message 变量，避免内存泄露 
    JS_FreeValue(ctx, message);
}

// 启动采集程序 
void init_collect()
{
  
}

int main(int argc, char **argv)
{
    signal(SIGTERM, sigterm);
    signal(SIGHUP, sigterm);
    signal(SIGINT, sigterm);
    
    
    JSContext *context = RJS_init("testExample.js");

    // 新建 config 配置与数据存储区 
    JSValue config = JS_NewObject(context);
    if (JS_IsException(config)) return 0;
    
    // 新建 temp 计算存储区  
    JSValue temp = JS_NewObject(context);
    if (JS_IsException(temp)) return 0;
    
    // 初始化 config 
    initCfg(context, &config);
    
    // todo:: 初始化采集程序 
    //init_collect();
    
    
    while (running) 
    {
        sleep(1);  
        printf("\nC : CAN Sockets Received \r\n");
        // can_read();
        // canfd_read();
        
        
        
        // todo：收到报文
        const char * message = "18F14103#000000000100000C"; // 这个是采集到的真实数据(can 协议) 
        
        // 处理收到的报文，数据区 和 临存temp 也要给 js，方便修改  
        onMessage(message, &config, &temp, context);
        
        
       
        // 监测内存使用 
        JSRuntime *rt = JS_GetRuntime(context);
        JSMemoryUsage stats;
        JS_ComputeMemoryUsage(rt, &stats);
        JS_DumpMemoryUsage(stdout, &stats, rt);

        
    }
    
    
    
    JS_FreeValue(context, config);
    JS_FreeValue(context, temp);
    
    RJS_Destory(context);
    
    return -1;
}
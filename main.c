// Copyright (c) 2022 Cesanta Software Limited
// All rights reserved

#include <mongoose/mongoose.h>
#include <quickjs/quickjs-libc.h>
// #include <quickjs/quickjs.h>
#include <quickjs/cutils.h>
#include <rdkafka/rdkafka.h>

#include "common.h"
#include "User.h"
#include "Router.h"
#include "RjsEngine/rjs.h"
// #include "Extensions/Rdkafka/extKafka.h"
#include <stdio.h>
#include <stdlib.h>
// #include "cJSON.h"
#include <time.h>
#include <sys/time.h>
#include <unistd.h>
#include <stdint.h>
#include "uart/uartlib.h"

#define CONKONG_BMS_COUNT 10
#define BATTERY_COUNT_IN_PACK 24

#define BATTERY_COUNT 240

// const char *s_listening_url = "http://0.0.0.0:5580";

static long g_lInterval = 250;

static struct mg_connection *s_conn; // Client connection
/* typedef struct  {
    int fd;
    char * portname;
    JSValue * config;
    JSContext* context;
} RJS_File; */

typedef struct  {
    int fd;
    char * name;
    struct mg_connection * conn;
} RJS_CONNECTION;


// const char* Uint32ToHexStr(uint32_t num, char* args)
void Uint32ToHexStr(uint32_t num, char *args)
{
    char hexStr[11]; // 十六进制最多需要8个字符，加上字符串结束符'\0'
    sprintf(args, "%08x", num);
}

uint32_t uint32_swap_endian(uint32_t x)
{
    return bswap32(x); // quickjs cutils.h
	// return ((x >> 24) & 0x000000FF) | // 移动字节3到字节0
           // ((x << 8) & 0x00FF0000) |  // 移动字节1到字节2
           // ((x >> 8) & 0x0000FF00) |  // 移动字节2到字节1
           // ((x << 24) & 0xFF000000);  // 移动字节0到字节3
}

uint16_t uint16_swap_endian(uint16_t x)
{
    return bswap16(x); // quickjs cutils.h
	// return ((x << 8) & 0x00FF) | // 移动字节0到字节1
           // ((x >> 8) & 0xFF00);  // 移动字节1到字节0
}

uint16_t Hex2Uint16(const char *src)
{
    uint16_t tDst = strtol(src, NULL, 16);
    return tDst;
}

// 从 json 中取数据的示例
void printDemo(JSContext *context, JSValue *config)
{
    // 在 js 中设置  cfg_data["ttt"] = 1.2;
    // 此处打印出 1.2

    // 打印 cfg_data.data[1].value

    JSValue data_array = JS_GetPropertyStr(context, *config, "data");
    JSValue data_element = JS_GetPropertyUint32(context, data_array, 1);
    JSValue data_value = JS_GetPropertyStr(context, data_element, "value");
    printf("C :(printDemo)     value: %s \n", RJS_GetString(context, data_value));

    JS_FreeValue(context, data_value);
    JS_FreeValue(context, data_element);
    JS_FreeValue(context, data_array);

    // JS_IsArray
    // uint8 * darr= JS_GetArrayBuffer(context, 10, data_val);
    // double val = RJS_GetFloat64(context, data_val);
    // printf("C :(printDemo)     value: %f \n", RJS_GetFloat64(context, data_val));
}

// 初始化配置，可用考虑从 sqlite 中读取
void init_rjs_config(JSContext *ctx, JSValue *config)
{
    // 调用 js 中定义的 initConfig 函数
    JSValue args_cfg[] = {};
    JSValue ret = RJS_ExecFunction(ctx, "initConfig", sizeof(args_cfg) / sizeof(args_cfg[0]), args_cfg);
    JS_FreeValue(ctx, ret);
}








static inline void sk_hex_id(char *buf, int end_offset, canid_t id)
{
    end_offset--;
    const char hex_upper[] = "0123456789ABCDEF";
    while (end_offset >= 0)
    {
        buf[end_offset--] = hex_upper[((id) & 0x0F)]; // sk_hex_asc_upper_lo(id);
        id >>= 4;
    }
}

static void callback_canok(struct mg_connection *c, int ev, void *ev_data)
{
    if (ev == MG_EV_READ || ev == MG_EV_CLOSE)
    {

        const char *buf = (char *)c->recv.buf;
        MG_ERROR(("CAN%lu received %lu bytes ", c->loc.port, c->recv.len));
        mg_hexdump(buf, c->recv.len);
        c->recv.len = 0;
    }
    (void)ev_data;
}

void callback_can(struct mg_connection *c, int ev, void *ev_data)
{
    if (ev == MG_EV_READ || ev == MG_EV_CLOSE)
    {
        if (c->recv.len < 1) {
            return;
        }

        const char* buf = (char*)c->recv.buf;

        // 打印原始消息
        MG_ERROR(("CAN%lu received %lu bytes ", c->loc.port, c->recv.len));
        mg_hexdump(buf, c->recv.len);

        // DynBuf point_name = RJS_dbuf_string(ctx, "mypoint_%u", j);
        // JSValue* config = (JSValue *) ev_data;
        // JSValue* config = (JSValue *) c->fn_data;

        JSContext* ctx = (JSContext*)c->mgr->userdata;

        // JSValue global = JS_GetGlobalObject(ctx);

        // 转成js可用的数据格式
        // JSValue message = JS_NewString(ctx, (const char *)buf);
        // JSValue message = JS_NewStringLen(ctx, buf, c->recv.len);
        JSValue message = JS_UNDEFINED;
        message = JS_NewArrayBufferCopy(ctx, buf, c->recv.len);
        // JSValue message = JS_NewStringLen(ctx, c->recv.buf, c->recv.len);
        if (JS_IsException(message))
            return;

        JSValue can_port = JS_NewInt64(ctx, c->loc.port);
        // JSValue args[]={can_port, message, *config};
        JSValue args[] = { can_port, message };

        // // 调用 js 中定义的 onMessage 函数
        JSValue ret = RJS_ExecFunction(ctx, "onCANMessage", sizeof(args) / sizeof(args[0]), args);

        // 打印数据
        // printDemo(ctx, config);

        JS_FreeValue(ctx, ret);

        // // 等待 js 里面可能有 timer， 等它结束
        js_std_loop(ctx);

        // // 释放 message 变量，避免内存泄露
        JS_FreeValue(ctx, message);

        // JS_FreeValue(ctx,global);

        c->recv.len = 0;
    }
    (void)ev_data;
}

void RJS_Memory_Monitor(JSContext *ctx)
{
    JSRuntime *rt = JS_GetRuntime(ctx);
    JSMemoryUsage stats;
    JS_ComputeMemoryUsage(rt, &stats);
    JS_DumpMemoryUsage(stdout, &stats, rt);
}

static void uart_timer_fn(void *_file)
{
    RJS_File *file = (RJS_File *)_file;
    int fd = file->fd;
    char buf[256];
    int len = uart_read(fd, buf, sizeof(buf));
    if (len > 0)
    {
        MG_ERROR(("C: uart_timer_fn %s recv %d byte", file->portname, len));
        mg_hexdump(buf, len);
        JSContext *ctx = (JSContext *)file->context;
        JSValue global = JS_GetGlobalObject(ctx);
        JSValue message = JS_UNDEFINED;
        message = JS_NewArrayBufferCopy(ctx, buf, len);
        if (JS_IsException(message))
            return;

        JSValue uart = JS_NewString(ctx, file->portname);
        JSValue args[] = {uart, message};
        JSValue ret = RJS_ExecFunction(ctx, "onUartMessage", sizeof(args) / sizeof(args[0]), args);
        JS_FreeValue(ctx, ret);
        js_std_loop(ctx);
        // 释放 message 变量，避免内存泄露
        JS_FreeValue(ctx, message);

        JS_FreeValue(ctx, global);
    }
    else
    {
        // MG_ERROR((" uart_timer_fn try dddd "));

        // char * msg =" test dddd \n";
        // uart_write(*fd,msg, strlen(msg));
    }
}


void load_http(struct mg_mgr *mgr)
{
    mg_http_listen(mgr, s_listening_url, Router, NULL);

    // JSContext *js_context = RJS_init(js_path, mgr);
}

static void Compute(void *_file)
{
    RJS_File *file = (RJS_File *)_file;
    JSContext *js_context = file->context;
    JSValue config = *(file->config);

    bool bCalcuate = false;
    {
        JSValue args_cfg[] = {};
        JSValue ret = RJS_ExecFunction(js_context, "IsCompute", 0, args_cfg);
        bCalcuate = JS_ToBool(js_context, ret);
        JS_FreeValue(js_context, ret);

        /* if (bCalcuate){
            MG_INFO(("calculate:true"));
        }
        else{
            MG_INFO(("calculate:false"));
        } */
    }

    // 获取毫秒级别当前时间
    //struct timeval tv_now;
    //gettimeofday(&tv_now, NULL);
    //long ms_now = tv_now.tv_sec * 1000 + tv_now.tv_usec / 1000;
    //MG_INFO(("PROFUCER time_ms:%ld", ms_now));

    if (!bCalcuate){
        return;
    }

    // 计算接口
    JSValue args_cfg[] = {};
    JSValue ret = RJS_ExecFunction(js_context, "ComputeAndChecCharge", sizeof(args_cfg) / sizeof(args_cfg[0]), args_cfg);

    JS_FreeValue(js_context, ret);
    //}
}

void LOG_TEST(JSContext *js_context)
{
    JSValue args_cfg[] = {};
    JSValue ret = RJS_ExecFunction(js_context, "LogTest", 0, args_cfg);
    ret = RJS_ExecFunction(js_context, "LogTest", 0, args_cfg);
    ret = RJS_ExecFunction(js_context, "LogTest", 0, args_cfg);
    JS_FreeValue(js_context, ret);
}

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;

uint16_t crc16(uint8_t *data, uint16_t size)
{
    uint16_t crc = 0xffff;
    for (uint16_t i = 0; i < size; i++)
    {
        crc = crc ^ data[i];
        for (uint16_t j = 0; j < 8; j++)
        {
            if ((crc & 0x0001) == 1)
            {
                crc >>= 1;
                crc ^= 0xa001;
            }
            else
            {
                crc >>= 1;
            }
        }
    }
    return crc;
}

// 数据回复：	地址码	1字节	系统地址
// 功能码	1字节	0x03
// 字节数	1字节	2*N
// 寄存器值	2*N字节	1-125
// CRC校验	2字节	低8位在前，高8位在后
void produce_uart_data()
{
    printf("produce_data fun : 0x03\n");
    uint8_t addressId = 0x01;            // 从地址
    uint8_t funcode = 0x03;              // 功能码
    int quantity = 58;                   // 寄存器个数
    int data_len = 3 + 2 * quantity + 2; // 数据长度
    uint8_t data[data_len];              //  数据字节数组
    memset(data, 0, data_len);
    data[0] = addressId;    // 地址码
    data[1] = funcode;      // 功能码
    data[2] = quantity * 2; // 字节数

    // 寄存器地址0,逆变状态
    int sno = 0;
    if (quantity > sno)
    {
        uint16_t status_inverter = 0;
        // 逆变状态定义
        uint16_t excpt_10 = 0x0400; // 母线电压异常
        uint16_t excpt_7 = 0x0080;  // 自检异常
        uint16_t excpt_5 = 0x0020;  // 锁相异常
        uint16_t excpt_4 = 0x0010;  // 温度异常
        uint16_t excpt_3 = 0x0008;  // 输出电流短路异常
        uint16_t excpt_2 = 0x0004;  // 输出电流过流异常
        uint16_t excpt_0 = 0x0001;  // 电网电压异常

        uint8_t value_array[] = {1, 0, 0, 0, 0, 1, 0}; // 1表示异常
        uint16_t excep_array[] = {excpt_10, excpt_7, excpt_5, excpt_4, excpt_3, excpt_2, excpt_0};
        int arr_length = sizeof(value_array) / sizeof(value_array[0]);
        for (int i = 0; i < arr_length; i++)
        {
            if (value_array[i] == 1)
            {
                status_inverter = status_inverter | excep_array[i];
            }
        }

        data[sno * 2 + 3] = (status_inverter >> 8) & 0xff;
        data[sno * 2 + 4] = status_inverter & 0xff;
    }

    // 寄存器地址2,电池状态
    sno = 2;
    if (quantity > sno)
    {
        uint16_t status_battery = 0; // 电池状态
        // 电池状态定义
        uint16_t excpt_6 = 0x0040; // 母线电压异常
        uint16_t excpt_4 = 0x0010; // 温度异常
        uint16_t excpt_3 = 0x0008; // 短路保护
        uint16_t excpt_2 = 0x0004; // 电流过流
        uint16_t excpt_1 = 0x0002; // 母线故障
        uint16_t excpt_0 = 0x0001; // 电池电压异常

        uint8_t value_array[] = {0, 1, 0, 0, 0, 1}; // 1表示异常
        uint16_t excep_array[] = {excpt_6, excpt_4, excpt_3, excpt_2, excpt_1, excpt_0};
        int arr_length = sizeof(value_array) / sizeof(value_array[0]);
        for (int i = 0; i < arr_length; i++)
        {
            if (value_array[i] == 1)
            {
                status_battery = status_battery | excep_array[i];
            }
        }

        data[sno * 2 + 3] = (status_battery >> 8) & 0xff;
        data[sno * 2 + 4] = status_battery & 0xff;
    }

    // 寄存器地址3,运行状态
    sno = 3;
    if (quantity > sno)
    {
        // 运行状态定义
        uint16_t run_0 = 0; // 关机
        uint16_t run_1 = 1; // 待机
        uint16_t run_2 = 2; // VF运行
        uint16_t run_3 = 3; // PQ运行

        uint16_t status_run = run_3; // 运行状态;
        data[sno * 2 + 3] = (status_run >> 8) & 0xff;
        data[sno * 2 + 4] = status_run & 0xff;
    }

    // 寄存器地址4,旁路状态
    sno = 4;
    if (quantity > sno)
    {
        uint16_t status_bypass = 0; // 旁路状态

        // 旁路状态定义
        // uint16_t excpt_15 = 0x8000; // 1:晶闸管开通, 0:晶闸管关断
        uint16_t excpt_8 = 0x0100; // 瞬时检测异常
        uint16_t excpt_6 = 0x0040; // C相电压异常
        uint16_t excpt_5 = 0x0020; // B相电压异常
        uint16_t excpt_4 = 0x0010; // A相电压异常

        uint8_t value_array[] = {1, 0, 1, 0}; // 1表示异常
        uint16_t excep_array[] = {excpt_8, excpt_6, excpt_5, excpt_4};
        int arr_length = sizeof(value_array) / sizeof(value_array[0]);
        for (int i = 0; i < arr_length; i++)
        {
            if (value_array[i] == 1)
            {
                status_bypass = status_bypass | excep_array[i];
            }
        }

        data[sno * 2 + 3] = (status_bypass >> 8) & 0xff;
        data[sno * 2 + 4] = status_bypass & 0xff;
    }

    sno = 8;
    if (quantity > sno)
    {
        uint16_t value_ = 10; // 电池充放电电流
        data[sno * 2 + 3] = (value_ >> 8) & 0xff;
        data[sno * 2 + 4] = value_ & 0xff;
    }

    sno = 9;
    if (quantity > sno)
    {
        uint16_t value_ = 12; // 交流有功功率控制
        data[sno * 2 + 3] = (value_ >> 8) & 0xff;
        data[sno * 2 + 4] = value_ & 0xff;
    }

    sno = 10;
    if (quantity > sno)
    {
        uint16_t value_ = 13; // 交流无功功率控制
        data[sno * 2 + 3] = (value_ >> 8) & 0xff;
        data[sno * 2 + 4] = value_ & 0xff;
    }

    sno = 50;
    if (quantity > sno)
    {
        uint16_t value_ = 1000; // 正BUS绝缘电阻
        data[sno * 2 + 3] = (value_ >> 8) & 0xff;
        data[sno * 2 + 4] = value_ & 0xff;
    }

    sno = 51;
    if (quantity > sno)
    {
        uint16_t value_ = 1000; // 负BUS绝缘电阻
        data[sno * 2 + 3] = (value_ >> 8) & 0xff;
        data[sno * 2 + 4] = value_ & 0xff;
    }

    // crc16
    uint16_t crc_value = crc16(data, data_len - 2);
    data[data_len - 2] = crc_value & 0xff;        // crc 低地址
    data[data_len - 1] = (crc_value >> 8) & 0xff; // crc 高地址

    // 输出
    printf("data_len:%d\n", data_len);
    for (int i = 0; i < data_len; i++)
    {
        // printf("%d----%02X \n", i, data[i]);
        printf("%02X ", data[i]);
    }
    printf("\n");
}



int main(int argc, char *argv[])
{
    // can_port serial_port
    if (argc < 2)
    {
        MG_ERROR(("Start parameter error. Please start in the following order: ./ske can_port compute_interval"));
        return -1;
    }
    else
    {
        if (strcmp(argv[1], "-p") == 0)
        {
            produce_uart_data();
            exit(0);
        }
    }

    char s_can_port[64];
    strcpy(s_can_port, argv[1]);
    g_lInterval = strtol(argv[2], NULL, 10);

    MG_INFO(("can:%s producer_interval:%ld", s_can_port,g_lInterval));

    struct mg_mgr mgr;
    mg_log_set(MG_LL_INFO);
    mg_mgr_init(&mgr);

    mg_http_listen(&mgr, s_listening_url, Router, NULL);

    JSContext *js_context = RJS_init(js_path, &mgr);

    // 新建 config 配置与数据存储区
    JSValue config = JS_NewObject(js_context);
    if (JS_IsException(config))
        return 0;

    // 初始化 config
    init_rjs_config(js_context, &config);

    // 将上下文 置于 mgr 中，便于回调函数使用
    mgr.userdata = js_context;

    // 启用 socketCAN 采集服务
    mg_socketcan_listen(&mgr, s_can_port, callback_can, &config);
	
    // RJS_File fileProduce = {-1, NULL, NULL, &config, js_context};
    // mg_timer_add(&mgr, g_lInterval, MG_TIMER_REPEAT | MG_TIMER_RUN_NOW, Compute, &fileProduce);

    // js_context->userdata = &mgr; // 便于 RJS module 使用 mgr
    while (mgr.conns != NULL)
    {
        // canfd_read("can0");
        mg_mgr_poll(&mgr, 50);
        // RJS_Memory_Monitor(js_context);
    }
    mg_mgr_free(&mgr);

    JS_FreeValue(js_context, config);
    RJS_Destory(js_context);
    return 0;
}

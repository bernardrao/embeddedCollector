#include <mongoose/mongoose.h>
#include <rjs.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <errno.h>
#include "uart/uartlib.h"

typedef struct
{
    int fd;
    char portname[64];
    char js_callback[64];
    JSContext *context;
} RJS_Conetxt;

// 监听串口读取数据
static RJS_Conetxt g_listen_context = {-1, {0}, {0}, NULL};
// 间隔执行任务
static RJS_Conetxt g_interval_context = {-1, {0}, {0}, NULL};

#define DATA_TEST 1

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;

static uint16_t crc16(uint8_t *data, uint16_t size)
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
static void produce_uart_data(uint8_t *pBuffer, int *p_buf_len)
{
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
        // uint16_t run_0 = 0; // 关机
        // uint16_t run_1 = 1; // 待机
        // uint16_t run_2 = 2; // VF运行
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

    if (pBuffer)
    {
        *p_buf_len = data_len;
        for (int i = 0; i < data_len; i++)
        {
            pBuffer[i] = data[i];
        }
    }
}
static int fre_produce = 0;
static void uart_timer_listen(void *_file)
{
    // MG_INFO(("uart_timer_listen"));
    RJS_Conetxt *file = (RJS_Conetxt *)_file;
    int fd = file->fd;
    uint8_t buf[256];
    int len = uart_read(fd, buf, sizeof(buf));
	
#ifdef DATA_TEST
    if (len <= 0)
    {
        fre_produce++;
        if (fre_produce % 40 == 0)
        {
            fre_produce = 0;
            produce_uart_data(buf, &len);
        }
    }
#endif
    if (len > 0)
    {
        // MG_INFO(("uart_read: %s recv %d byte", file->portname, len));
        // mg_hexdump(buf, len);
        JSContext *ctx = (JSContext *)file->context;
        // JSValue global = JS_GetGlobalObject(ctx);
        JSValue message = JS_UNDEFINED;
        message = JS_NewArrayBufferCopy(ctx, (uint8_t*)buf, len);
        if (JS_IsException(message))
            return;

        JSValue args[] = {message};
        JSValue ret = RJS_ExecFunction(ctx, file->js_callback, sizeof(args) / sizeof(args[0]), args);
        JS_FreeValue(ctx, ret);
        // js_std_loop(ctx);
        JS_FreeValue(ctx, message);
        // JS_FreeValue(ctx, global);
    }
}

static JSValue js_uart_listen(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    // uart.listen("/dev/ttyS1", 9600, 8, "1", 'N', "call_test");
    if (g_listen_context.context)
    {
        return JS_NewString(ctx, "already listened");
    }

    if (argc < 6)
    {
        // 参数个数不对
        return JS_NewString(ctx, "argc value must >= 6");
    }
    // 串口
    const char *port = JS_ToCString(ctx, argv[0]);
    // 波特率
    int baud_array[] = {B110, B300, B600, B1200, B2400, B4800, B9600, B19200, B57600, B115200};
    int baud_array_name[] = {110, 300, 600, 1200, 2400, 4800, 9600, 19200, 57600, 115200};
    int baud;
    if (JS_ToInt32(ctx, &baud, argv[1]))
        return JS_EXCEPTION;
    int baud_array_length = sizeof(baud_array) / sizeof(baud_array[0]);
    for (int i = 0; i < baud_array_length; i++)
    {
        if (baud_array_name[i] == baud)
        {
            baud = baud_array[i];
            break;
        }
    }
    // 数据位
    int data_bit;
    if (JS_ToInt32(ctx, &data_bit, argv[2]))
        return JS_EXCEPTION;
    // 停止位
    const char *stop_bit = JS_ToCString(ctx, argv[3]);
    // 校验位
    const char *parity_bit = JS_ToCString(ctx, argv[4]);
    // 回调函数
    const char *js_callback = JS_ToCString(ctx, argv[5]);

    MG_INFO(("js_uart_listen port:%s,baud:%d, data_bit:%d,stop_bit:%s,parity_bit:%s,js_callback:%s",
             port, baud, data_bit, stop_bit, parity_bit, js_callback));
    int fd = uart_init(port, baud, data_bit, stop_bit, *parity_bit);
    if (fd < 0)
        return JS_NewString(ctx, "uart_init error");
    g_listen_context.fd = fd;
    strcpy(g_listen_context.portname, port);
    strcpy(g_listen_context.js_callback, js_callback);
    g_listen_context.context = ctx;
    struct mg_mgr *mgr = (struct mg_mgr *)JS_GetRuntimeData(JS_GetRuntime(ctx));
    mg_timer_add(mgr, 50, MG_TIMER_REPEAT | MG_TIMER_RUN_NOW, uart_timer_listen, &g_listen_context);
    return JS_NewString(ctx, "success");
}

static JSValue js_uart_write(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    if (g_listen_context.fd < 0)
    {
        return JS_NewString(ctx, "not open uart");
    }
    size_t length;
    uint8_t *data = JS_GetArrayBuffer(ctx, &length, argv[0]);

    // MG_INFO(("uart_write: %d byte sizeof %d", length, sizeof("uart_write:        ")));
    // mg_hexdump((void *)data, length);
	// mg_hexdump_sk("uart_write: ",(void *)data, length);
	// char to[2*length+1];
	// MG_INFO(("uart_write(%d byte): %s", length, mg_hex((void *)data, length, to)));

    int ret = uart_write(g_listen_context.fd, (const uint8_t *)data, length);
    if (ret < 0)
        return JS_NewString(ctx, "uart write error");
    return JS_NewString(ctx, "success");
}

static void uart_set_interval(void *_file)
{
    // MG_INFO(("uart_set_interval"));
    RJS_Conetxt *file = (RJS_Conetxt *)_file;
    JSContext *ctx = (JSContext *)file->context;
    JSValue args[] = {};
    JSValue ret = RJS_ExecFunction(ctx, file->js_callback, sizeof(args) / sizeof(args[0]), args);
    JS_FreeValue(ctx, ret);
}

// 间隔执行任务
static JSValue js_uart_setInterval(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    if (g_interval_context.context)
    {
        return JS_NewString(ctx, "already setInterval");
    }
    const char *js_callback = JS_ToCString(ctx, argv[0]);
    int interval;
    if (JS_ToInt32(ctx, &interval, argv[1]))
        return JS_EXCEPTION;
    if (interval <= 0)
    {
        return JS_NewString(ctx, "error,interval <= 0");
    }
    strcpy(g_interval_context.js_callback, js_callback);
    g_interval_context.context = ctx;
    struct mg_mgr *mgr = (struct mg_mgr *)JS_GetRuntimeData(JS_GetRuntime(ctx));
    mg_timer_add(mgr, interval, MG_TIMER_REPEAT | MG_TIMER_RUN_NOW, uart_set_interval, &g_interval_context);
    return JS_NewString(ctx, "success");
}

// sub functions map 子函数映射
static const JSCFunctionListEntry js_uart_functions[] =
    {
        JS_CFUNC_DEF("write", 2, js_uart_write),
        JS_CFUNC_DEF("listen", 2, js_uart_listen),
        JS_CFUNC_DEF("setInterval", 2, js_uart_setInterval),
};

// init module functions list 初始化函数列表
static int js_uart_init(JSContext *ctx, JSModuleDef *module)
{
    return JS_SetModuleExportList(ctx, module, js_uart_functions, countof(js_uart_functions));
}

// init 'uart' module 初始化uart模块
JSModuleDef *js_init_module_uart(JSContext *ctx, const char *module_name)
{
    JSModuleDef *module;
    module = JS_NewCModule(ctx, module_name, js_uart_init);
    if (!module)
    {
        return NULL;
    }
    JS_AddModuleExportList(ctx, module, js_uart_functions, countof(js_uart_functions));
    return module;
}
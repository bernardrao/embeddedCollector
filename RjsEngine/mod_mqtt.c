#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <mongoose/mongoose.h>


#include <stdio.h>
#include <unistd.h>
#include <errno.h> 

#include "RjsEngine/rjs.h"

// quote extCan & extGPIO  from /Extentsions
extern int canSend(const char * device, const char * can_frame);
extern int gpioSet(const char* pinGroup, const char * pinGPIO, int dat);
extern void mg_hexdump(const void *buf, size_t len);
// extern JSValue RJS_ExecFunction(JSContext *ctx, const char* func_name, int argc, JSValueConst *args);


// static const char *mqtt_url = "192.168.2.54:1883";              // mqtt server
// static const char *mqtt_sub_topic = "can/#";                 // Publish topic
// static const char *mqtt_pub_topic = "can/192.168.2.55/can0"; // Subscribe topic
static struct mg_connection *s_conn; // Client connection

static char mqtt_url[255] = {0};              // mqtt server
static char mqtt_pub_topic[255] = {0};
static int mqtt_qos = 1;                                     // MQTT QoS
static char mqtt_js_onConn[255] = {0};
static char mqtt_js_onMsg[255] = {0};


static JSValue js_mqtt_pub(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
	// 获取 manager 
	struct mg_mgr *mgr = (struct mg_mgr *)JS_GetRuntimeData(JS_GetRuntime(ctx));
	
	
	// 通过 conn_id 获取 连接，最好是通过地址端口来定位 连接
	// const char * conn_id = JS_ToCString(ctx, argv[0]);
	
	struct mg_connection *c = NULL;
	for (c = mgr->conns; c != NULL; c = c->next)
	{		
		if(c->mgr->mqtt_id >0)
			break;
	}
	
	if(c == NULL)	// 未找到 mqtt 连接 
	{
		MG_ERROR(("js_mqtt_pub: No mqtt connection! "));

		return JS_NULL;
	}
	
	
	
	static uint8_t s_qos = 1;             // MQTT QoS
	
    const char * topic = JS_ToCString(ctx, argv[0]);
	
	size_t payload_len = 0;
    uint8_t *payload = JS_GetArrayBuffer(ctx, &payload_len, argv[1]);
	
	struct mg_mqtt_opts pub_opts;
	memset(&pub_opts, 0, sizeof(pub_opts));
	pub_opts.topic = mg_str(topic);
	pub_opts.message = mg_str_n((char*)payload, payload_len);
	pub_opts.qos = s_qos;
	mg_mqtt_pub(c, &pub_opts);
	
	return JS_NULL;
	
}

// mqtt 事件处理 
static void mod_mqtt_callback(struct mg_connection *c, int ev, void *ev_data)
{
    if (ev == MG_EV_OPEN)
    {
        // 开始连接 
		// MG_INFO(("%lu CREATED", c->id));
        // c->is_hexdumping = 1;
    }
    else if (ev == MG_EV_CONNECT)
    {
        // 是否加密连接 
		if (mg_url_is_ssl(mqtt_url))
        {
            struct mg_tls_opts opts = {.ca = mg_unpacked("/certs/ca.pem"),
                                       .name = mg_url_host(mqtt_url)};
            mg_tls_init(c, &opts);
        }
    }
    else if (ev == MG_EV_ERROR)
    {
        // 错误日志： On error, log error message
        MG_ERROR(("%lu ERROR %s", c->id, (char *)ev_data));
    }
    else if (ev == MG_EV_MQTT_OPEN)
    {
        // struct mg_mqtt_message *mm = (struct mg_mqtt_message *)ev_data;
        // MG_INFO(("id(%lu) RECEIVED %.*s <- %.*s", c->id, (int)mm->data.len,
                 // mm->data.ptr, (int)mm->topic.len, mm->topic.ptr));
		
		// 准备参数 
		JSContext* ctx = (JSContext*)c->mgr->userdata;
        JSValue connid = JS_NewInt32(ctx, c->id);
        // JSValue payload = JS_UNDEFINED;
		
		// 调用 js 函数 
        JSValue args[] = {connid};
        // JSValue ret = RJS_ExecFunction(ctx, "onMqttConn", sizeof(args) / sizeof(args[0]), args);
        JSValue ret = RJS_ExecFunction(ctx, mqtt_js_onConn, sizeof(args) / sizeof(args[0]), args);
        JS_FreeValue(ctx, ret);
        js_std_loop(ctx);
		
		
		
		
		// 打开时增加订阅 
		// SUBSCRIBE topic s_sub_topic ， after MQTT connect is successful
        /* struct mg_str sub_topic = mg_str(s_sub_topic);
        // MG_INFO(("%lu CONNECTED to %s", c->id, s_url));
        struct mg_mqtt_opts sub_opts;
        memset(&sub_opts, 0, sizeof(sub_opts));
        sub_opts.topic = sub_topic;
        sub_opts.qos = s_qos;
        mg_mqtt_sub(c, &sub_opts);
        MG_INFO(("%lu SUBSCRIBED to %.*s", c->id, (int)sub_topic.len, sub_topic.ptr)); */
		
		
		

        // 打开时发送通知， Publish topic s_pub_topic
        /*struct mg_str pub_topic = mg_str(s_pub_topic), data = mg_str("hello");
        struct mg_mqtt_opts pub_opts;
        memset(&pub_opts, 0, sizeof(pub_opts));
        pub_opts.topic = pub_topic;
        pub_opts.message = data;
        pub_opts.qos = s_qos, pub_opts.retain = false;
        mg_mqtt_pub(c, &pub_opts);  */
        // MG_INFO(("%lu PUBLISHED %.*s -> %.*s", c->id, (int)data.len, data.ptr,
                 // (int)pub_topic.len, pub_topic.ptr));
    }

    else if (ev == MG_EV_MQTT_MSG)
    {
        // 收到消息 
		// When we get echo response, print it
        struct mg_mqtt_message *mm = (struct mg_mqtt_message *)ev_data;
        // MG_INFO(("id(%lu) RECEIVED[%lu] %.*s <- %.*s", c->id, (int)mm->data.len,
                 // (int)mm->data.len, mm->data.ptr, (int)mm->topic.len, mm->topic.ptr));
		
		
		/* JSValue message = JS_UNDEFINED;
        message = JS_NewArrayBufferCopy(ctx, buf, len);
        if (JS_IsException(message))
            return; */
		
		
		// 准备参数 
		JSContext* ctx = (JSContext*)c->mgr->userdata;
        JSValue url = JS_NewInt64(ctx, c->id);
        // JSValue payload = JS_UNDEFINED;
		JSValue topic = JS_NewStringLen(ctx, mm->topic.ptr, (int)mm->topic.len);
		JSValue payload = JS_NewArrayBufferCopy(ctx, (uint8_t*)mm->data.ptr, (int)mm->data.len);
		if (JS_IsException(payload))
            return;
		
		// 调用 js 函数 
        JSValue args[] = {url, topic, payload};
        // JSValue ret = RJS_ExecFunction(ctx, "onMqttMessage", sizeof(args) / sizeof(args[0]), args);
        JSValue ret = RJS_ExecFunction(ctx, mqtt_js_onMsg, sizeof(args) / sizeof(args[0]), args);
        JS_FreeValue(ctx, ret);
        js_std_loop(ctx);
			 
    }

    else if (ev == MG_EV_CLOSE)
    {
        // 关闭连接 
		// MG_INFO(("%lu CLOSED", c->id));
        s_conn = NULL; // Mark that we're closed
    }
}

// 检查状态，并自动重连 
static void mod_mqtt_timer_reconnect(void *arg)
{
    struct mg_mgr *mgr = (struct mg_mgr *)arg;
    struct mg_mqtt_opts opts = {.clean = true,
                                .qos = mqtt_qos,
								// .user = "skclient",
								// .pass = "123456",
								// .keepalive = 60,
                                .topic = mg_str(mqtt_pub_topic),
                                // .version = 4,
                                .message = mg_str("bye")};
    if (s_conn == NULL)
	{
        s_conn = mg_mqtt_connect(mgr, mqtt_url, &opts, mod_mqtt_callback, NULL);
	}
    // char * can_device = "can0";
    // canfd_read(can_device);
}

 
static JSValue js_mqtt_conn(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
	
	const char * url = JS_ToCString(ctx, argv[0]);
	const char * pub_topic = JS_ToCString(ctx, argv[1]);	
	const char * js_onConn = JS_ToCString(ctx, argv[3]);	
	const char * js_onMsg = JS_ToCString(ctx, argv[4]);	
	JS_ToInt32(ctx,&mqtt_qos, argv[2]);
	strcpy(mqtt_url, url);
	strcpy(mqtt_pub_topic, pub_topic);
	strcpy(mqtt_js_onConn, js_onConn);
	strcpy(mqtt_js_onMsg, js_onMsg);
	
	// 启用定时检测并重连 
	struct mg_mgr *mgr = (struct mg_mgr *)JS_GetRuntimeData(JS_GetRuntime(ctx));
	mg_timer_add(mgr, 10000, MG_TIMER_REPEAT | MG_TIMER_RUN_NOW, mod_mqtt_timer_reconnect, mgr);
	
	return JS_NULL;
}
static JSValue js_mqtt_sub(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    // 获取 manager 
	struct mg_mgr *mgr = (struct mg_mgr *)JS_GetRuntimeData(JS_GetRuntime(ctx));
	
	uint32_t connid;
	if (JS_ToUint32(ctx, &connid, argv[0]))
        return JS_EXCEPTION;

    const char * topic = JS_ToCString(ctx, argv[1]);
	// MG_ERROR(("topic[%s]: connid [%lu]", topic, connid));
	
	struct mg_connection *c = NULL;
	for (c = mgr->conns; c != NULL; c = c->next)
	{		
		// if(c->is_mqtt5 == 1)
		if(c->id == connid)
			break;
	}
	
	if(c == NULL)	// 未找到 mqtt 连接 
	{
		MG_ERROR(("js_mqtt_publish: No mqtt connection! "));

		return JS_NULL;
	}
	// 通过 conn_id 获取 连接，最好是通过地址端口来定位 连接
	// const char * conn_id = JS_ToCString(ctx, argv[0]);
	
	static uint8_t s_qos = 1;             // MQTT QoS
    
	
	struct mg_mqtt_opts sub_opts;
	memset(&sub_opts, 0, sizeof(sub_opts));
	sub_opts.topic = mg_str(topic);
	sub_opts.qos = s_qos;
	mg_mqtt_sub(c, &sub_opts);
		
	
	return JS_NULL;
}



// sub functions map 子函数映射  
static const JSCFunctionListEntry js_mqtt_functions[] = 
{
    JS_CFUNC_DEF("pub", 3, js_mqtt_pub),
    JS_CFUNC_DEF("sub", 1, js_mqtt_sub),
    JS_CFUNC_DEF("conn", 5, js_mqtt_conn), 
    // JS_PROP_STRING_DEF("url", mqtt_url, JS_PROP_C_W_E),
    // JS_PROP_STRING_DEF("pub_topic", mqtt_pub_topic, JS_PROP_C_W_E),
	
	
	
	/* static const char *mqtt_url = "192.168.2.54:1883";              // mqtt server
	// static const char *mqtt_sub_topic = "can/#";                 // Publish topic
	static const char *mqtt_pub_topic = "can/192.168.2.55/can0"; // Subscribe topic
	static int mqtt_qos = 1;                                     // MQTT QoS */
};

// init module functions list 初始化函数列表 
static int js_mqtt_init(JSContext *ctx, JSModuleDef *module)
{
  return JS_SetModuleExportList(ctx, module, js_mqtt_functions, countof(js_mqtt_functions));
}

// init 'mqtt' module 初始化mqtt模块 
JSModuleDef *js_init_module_mqtt(JSContext *ctx, const char *module_name)
{
  JSModuleDef *module;
  module = JS_NewCModule(ctx, module_name, js_mqtt_init);
  if (!module)
  {
    return NULL;
  }
  JS_AddModuleExportList(ctx, module, js_mqtt_functions, countof(js_mqtt_functions));
  return module;
}
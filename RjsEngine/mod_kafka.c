#include <string.h>
#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include "rdkafka/rdkafka.h"


#include <stdio.h>
#include <unistd.h>
#include <errno.h> 

// quote extCan & extGPIO  from /Extentsions
extern int canSend(const char * device, const char * can_frame);
extern int gpioSet(const char* pinGroup, const char * pinGPIO, int dat);
extern void mg_hexdump(const void *buf, size_t len);


static JSValue js_kafka_produce(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    const char * brokers = JS_ToCString(ctx, argv[0]);
    const char * topic = JS_ToCString(ctx, argv[1]);
    // const char * payload = JS_ToCString(ctx, argv[2]);
    size_t payload_len = 0;
    uint8_t *payload = JS_GetArrayBuffer(ctx, &payload_len, argv[2]);
    
         // size_t payload_len = sizeof(payload);
    char errstr[512];

		rd_kafka_conf_t *conf = rd_kafka_conf_new();
    if (rd_kafka_conf_set(conf, "client.id", "rjs_server",
                          errstr, sizeof(errstr)) != RD_KAFKA_CONF_OK) {
      return JS_NewString(ctx, errstr);
    }

    /* if (rd_kafka_conf_set(conf, "bootstrap.servers", brokers,
                          errstr, sizeof(errstr)) != RD_KAFKA_CONF_OK) {
      return JS_NewString(ctx, errstr);
    } */

    /* rd_kafka_topic_conf_t *topic_conf = rd_kafka_topic_conf_new();

    if (rd_kafka_topic_conf_set(topic_conf, "acks", "all",
                          errstr, sizeof(errstr)) != RD_KAFKA_CONF_OK) {
      return JS_NewString(ctx, errstr);
    } */
    
    // set call back
    // rd_kafka_conf_set_dr_msg_cb(conf, msg_delivered);
    
    rd_kafka_t *rdkafka;
		/* Create Kafka handle */
		if (!(rdkafka = rd_kafka_new(RD_KAFKA_PRODUCER, conf, errstr, sizeof(errstr)))) 
        return JS_NewString(ctx, errstr);
		

		/* Add brokers */
		if (rd_kafka_brokers_add(rdkafka, brokers) == 0)
        return JS_NewString(ctx, errstr);

		/* Create topic */
		// rd_kafka_topic_t *rkt = rd_kafka_topic_new(rdkafka, topic, topic_conf);
		rd_kafka_topic_t *rkt = rd_kafka_topic_new(rdkafka, topic, NULL);

    if (rd_kafka_produce(rkt, RD_KAFKA_PARTITION_UA, RD_KAFKA_MSG_F_COPY, (char*)payload, payload_len, NULL, 0, NULL) == -1)
        return JS_NewString(ctx, rd_kafka_err2str(rd_kafka_last_error()));
        
    rd_kafka_poll(rdkafka, 1000);

		/* Destroy topic */
		rd_kafka_topic_destroy(rkt);

		/* Destroy the handle */
		// rd_kafka_destroy(rdkafka);

    return JS_NewString(ctx, errstr);
}


// sub functions map 子函数映射  
static const JSCFunctionListEntry js_kafka_functions[] = 
{
    JS_CFUNC_DEF("produce", 3, js_kafka_produce),
    
};

// init module functions list 初始化函数列表 
static int js_kafka_init(JSContext *ctx, JSModuleDef *module)
{
  return JS_SetModuleExportList(ctx, module, js_kafka_functions, countof(js_kafka_functions));
}

// init 'kafka' module 初始化kafka模块 
JSModuleDef *js_init_module_kafka(JSContext *ctx, const char *module_name)
{
  JSModuleDef *module;
  module = JS_NewCModule(ctx, module_name, js_kafka_init);
  if (!module)
  {
    return NULL;
  }
  JS_AddModuleExportList(ctx, module, js_kafka_functions, countof(js_kafka_functions));
  return module;
}
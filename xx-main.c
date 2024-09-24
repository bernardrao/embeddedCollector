// Copyright (c) 2022 Cesanta Software Limited
// All rights reserved

#include <mongoose/mongoose.h>
#include "Core/User.h"
#include "Core/Router.h"
#include "Core/Can.h"

const char *s_listening_url = "http://0.0.0.0:5580";

static const char *s_url = "127.0.0.0:1883";  // mqtt server
static const char *s_sub_topic = "can/#";      // Publish topic
static const char *s_pub_topic = "can/192.168.2.54/can0";   // Subscribe topic
static int s_qos = 1;                             // MQTT QoS
static struct mg_connection *s_conn;              // Client connection

static void callback_mqtt(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_OPEN) 
  {
    MG_INFO(("%lu CREATED", c->id));
    // c->is_hexdumping = 1;
  } 
  else if (ev == MG_EV_CONNECT) 
  {
    if (mg_url_is_ssl(s_url)) {
      struct mg_tls_opts opts = {.ca = mg_unpacked("/certs/ca.pem"),
                                 .name = mg_url_host(s_url)};
      mg_tls_init(c, &opts);
    }
  } 
  else if (ev == MG_EV_ERROR) 
  {
    // On error, log error message
    MG_ERROR(("%lu ERROR %s", c->id, (char *) ev_data));
  } 
  else if (ev == MG_EV_MQTT_OPEN) 
  {
    // SUBSCRIBE topic s_sub_topic ， after MQTT connect is successful
    struct mg_str subt = mg_str(s_sub_topic);
    MG_INFO(("%lu CONNECTED to %s", c->id, s_url));
    struct mg_mqtt_opts sub_opts;
    memset(&sub_opts, 0, sizeof(sub_opts));
    sub_opts.topic = subt;
    sub_opts.qos = s_qos;
    mg_mqtt_sub(c, &sub_opts);
    MG_INFO(("%lu SUBSCRIBED to %.*s", c->id, (int) subt.len, subt.ptr));
    
    
    // Publish topic s_pub_topic
    struct mg_str pubt = mg_str(s_pub_topic), data = mg_str("hello");
    struct mg_mqtt_opts pub_opts;
    memset(&pub_opts, 0, sizeof(pub_opts));
    pub_opts.topic = pubt;
    pub_opts.message = data;
    pub_opts.qos = s_qos, pub_opts.retain = false;
    mg_mqtt_pub(c, &pub_opts);
    MG_INFO(("%lu PUBLISHED %.*s -> %.*s", c->id, (int) data.len, data.ptr,
             (int) pubt.len, pubt.ptr));
  } 
  
  
  else if (ev == MG_EV_MQTT_MSG) 
  {
    // 收到消息，此处增加控制指令  
    
    // When we get echo response, print it
    struct mg_mqtt_message *mm = (struct mg_mqtt_message *) ev_data;
    MG_INFO(("%lu RECEIVED %.*s <- %.*s", c->id, (int) mm->data.len,
             mm->data.ptr, (int) mm->topic.len, mm->topic.ptr));
  } 
  
  
  else if (ev == MG_EV_CLOSE) 
  {
    MG_INFO(("%lu CLOSED", c->id));
    s_conn = NULL;  // Mark that we're closed
  }
}

static void timer_mqtt(void *arg) {
  struct mg_mgr *mgr = (struct mg_mgr *) arg;
  struct mg_mqtt_opts opts = {.clean = true,
                              .qos = s_qos,
                              .topic = mg_str(s_pub_topic),
                              .version = 4,
                              .message = mg_str("bye")};
  if (s_conn == NULL) s_conn = mg_mqtt_connect(mgr, s_url, &opts, callback_mqtt, NULL);
  
  // char * can_device = "can0";
  // canfd_read(can_device);
  
  
}

static void callback_can(struct mg_connection *c, int ev, void *ev_data)
{
  if (ev == MG_EV_READ || ev == MG_EV_CLOSE) {

      const char *buf = (char *) c->recv.buf;
      MG_ERROR(("CAN%lu received %lu bytes ", c->loc.port, c->recv.len));
      mg_hexdump(buf, c->recv.len );
      c->recv.len = 0;
      
  }
  (void) ev_data;
}

int main(void) {
  struct mg_mgr mgr;
  mg_log_set(MG_LL_DEBUG);
  mg_mgr_init(&mgr);
  
  // char * can_device = "can0";
  // mg_timer_add(&mgr, 1000, MG_TIMER_REPEAT, canfd_read, &can_device);
  // mg_timer_add(&mgr, 1000, MG_TIMER_REPEAT | MG_TIMER_RUN_NOW, timer_mqtt, &mgr);
  
  
  mg_http_listen(&mgr, s_listening_url, Router, &mgr);
  
  const char *s_socketcan_url = "can0";
  mg_socketcan_listen(&mgr, s_socketcan_url, callback_can, &mgr);
  
  while (mgr.conns != NULL)
  {    
      // canfd_read("can0");
      mg_mgr_poll(&mgr, 500);
      
  }
  mg_mgr_free(&mgr);
  return 0;
}

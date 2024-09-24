#include <mongoose/mongoose.h>
#include "User.h"
#include "Api/ApiRouter.h"

// #include <common.h>


#include <quickjs/quickjs-libc.h>
#include <quickjs/cutils.h>
#include <rjs.h>

extern const char *s_json_header;
extern const char *root_dir;

static void rjs_handle_events(struct mg_connection *c,
                              struct mg_http_message *hm) {
    // char * str_api = mg_json_get_str(hm->body, "$.api");
    // char * str_data = mg_json_get_str(hm->body, "$.data");
    // mg_str mg_data = mg_json_get_tok(hm->body, "$.data");
    // char * str_data = mg_data.ptr;
    // MG_ERROR(("api %s data %s", str_api, str_data));
    
    
    
    // MG_ERROR(("hm->body %s", hm->body));
    
    JSContext *js_context =(JSContext*) c->mgr->userdata; // rox ++++++++
    JSValue jv_data = JS_NewString(js_context, hm->body.ptr);
    JSValue args_cfg[]={jv_data};
    JSValue ret=RJS_ExecFunction(js_context,  "jsapi_router", sizeof(args_cfg)/sizeof(args_cfg[0]), args_cfg);
    
    const char * aa = RJS_GetString(js_context,ret);
    MG_ERROR(("C: jsapi_router return %s", aa));
    
    mg_http_reply(c, 200, s_json_header, aa);
    JS_FreeValue(js_context,ret);
    
    /* int pageno = 1;
    mg_http_reply(c, 200, s_json_header,
        "{%m:%m,%m:%m,%m:%d}\n",    // 类似 printf, json 名使用 MG_ESC 
        MG_ESC("text"), MG_ESC("Hello!"),
        MG_ESC("data"), MG_ESC("somedata"),
        MG_ESC("devid"),pageno); */
}


void Router(struct mg_connection *conn, int ev, void *ev_data) 
{
    //MG_INFO(("Router 0. ev:%d", ev));
  if (ev == MG_EV_HTTP_MSG) 
  {
    MG_INFO(("Router"));  
    struct mg_http_message *msg = (struct mg_http_message *) ev_data;
    
    
    
    MG_INFO(("Router %lu length %lu", conn->id, msg->message.len));
    
    struct User *usr = getUser(msg);
    if (usr == NULL && 
            (
                mg_http_match_uri(msg, "/api/#") || 
                mg_http_match_uri(msg, "/system/#")
            )
        ) 
    {
        MG_ERROR(("%lu 403 Denied %s", conn->id, (char *) ev_data));
        
        mg_http_reply(conn, 403, "", "Denied\n");
        return;
    }

    
    /// 在这里添加 api 之外的 router
    // if(ApiRouter(conn, msg)) return;    
    
    if (mg_http_match_uri(msg, "/rjs")) {
        rjs_handle_events(conn, msg);
    }
    
    /// 登录过程 
    //if (mg_http_match_uri(msg, "/system/login")) 
    //{
    //    MG_ERROR(("%lu /system/login Denied %s", conn->id, (char *) ev_data));
    //    mg_http_reply(conn, 200, "Content-Type: application/json\r\n",
    //                "{%m:%m,%m:%m}\n", MG_ESC("user"), MG_ESC(usr->name),
    //                MG_ESC("token"), MG_ESC(usr->token));
    //    return;
    //} 
    
    /// read from files
    {
       //sprintf(path,"%s/%s",get_current_dir_name())
       //struct mg_http_serve_opts opts = {.root_dir = "./../server/front"};
      struct mg_http_serve_opts opts = {.root_dir = root_dir};
      // MG_ERROR(("%lu read from files Denied %s", conn->id, (char *) ev_data));
      
      // struct mg_http_serve_opts opts = {
      //  .root_dir = "server/front",
      //  .fs = &mg_fs_packed
      //};
      
      mg_http_serve_dir(conn, ev_data, &opts);
    }
  }
}
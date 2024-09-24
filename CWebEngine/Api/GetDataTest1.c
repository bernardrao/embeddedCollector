// #include "common.h"
#include <mongoose/mongoose.h>

extern const char *s_json_header; 
bool GetDataTest1(struct mg_connection *conn, struct mg_http_message * msg)
{
    if (mg_http_match_uri(msg, "/api/getDataTest1"))
    {
        // 获取参数
        int devid = mg_json_get_long(msg->body, "$.devid", 1);
        // char *dev = mg_json_get_str(msg->body, "$.device_name");
        
        // 参考以下读取函数  
        // bool mg_json_get_num(struct mg_str json, const char *path, double *v);
        // bool mg_json_get_bool(struct mg_str json, const char *path, bool *v);
        // long mg_json_get_long(struct mg_str json, const char *path, long default);
        // char *mg_json_get_str(struct mg_str json, const char *path);
        // char *mg_json_get_hex(struct mg_str json, const char *path, int *len);
        // char *mg_json_get_b64(struct mg_str json, const char *path, int *len);
        
        // 以下返回数据 
        mg_http_reply(conn, 200, s_json_header,
                    "{%m:%m,%m:%m,%m:%d}\n",    // 类似 printf, json 名使用 MG_ESC 
                    MG_ESC("text"), MG_ESC("Hello!"),
                    MG_ESC("data"), MG_ESC("somedata"),
                    MG_ESC("devid"),devid);
        return true;
    }
    return false;
    
}
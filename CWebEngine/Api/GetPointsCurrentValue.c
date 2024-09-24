// #include "common.h"
#include <mongoose/mongoose.h>

extern const char *s_json_header;
static size_t print_int_arr(void (*out)(char, void *), void *ptr, va_list *ap) {
    size_t i, len = 0, num = va_arg(*ap, size_t);  // Number of items in the array
    int *arr = va_arg(*ap, int *);              // Array ptr
    for (i = 0; i < num; i++) 
    {
        len += mg_xprintf(out, ptr, "%s%d", i == 0 ? "" : ",", arr[i]);
    }
    return len;
}

bool GetPointsCurrentValue(struct mg_connection *conn, struct mg_http_message * msg) 
{
    if (mg_http_match_uri(msg, "/api/getPointsCurrentValue"))
    {
        int pageNum = mg_json_get_long(msg->body, "$.page", 1);
        
        int points[] = {21, 22, 22, 19, 18, 20, 23, 23, 22, 22, 22, 23, 22};
        mg_http_reply(conn, 200, s_json_header, "{%m:%d,%m:%d,%m:[%M]}\n",
                MG_ESC("temperature"), 21,  //
                MG_ESC("humidity"), 67,     //
                MG_ESC("points"), print_int_arr,
                sizeof(points) / sizeof(points[0]), points);
        return true;
    }
    return false;
}
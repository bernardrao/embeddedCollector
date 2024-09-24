#include <Api/ApiRouter.h>
#include <mongoose/mongoose.h>

extern bool GetPointsCurrentValue(struct mg_connection *conn, struct mg_http_message * msg);
extern bool GetDataTest1(struct mg_connection *conn, struct mg_http_message * msg);


bool ApiRouter(struct mg_connection *conn, struct mg_http_message * msg)
{
    if(GetPointsCurrentValue(conn, msg)) return true; // /api/getPointsCurrentValue
    
    if(GetDataTest1(conn, msg)) return true; // /api/getDataTest1
            
    
       
    return false;
    
}
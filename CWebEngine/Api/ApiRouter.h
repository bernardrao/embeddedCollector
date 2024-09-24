#ifndef API_LIST_H
#define API_LIST_H
#ifdef __cplusplus
extern "C" {
#endif


#include <mongoose/mongoose.h>
bool ApiRouter(struct mg_connection *conn, struct mg_http_message * msg);



#ifdef __cplusplus
}
#endif
#endif  // API_LIST_H
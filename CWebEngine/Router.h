#ifndef CORE_ROUTER_H
#define CORE_ROUTER_H
#ifdef __cplusplus
extern "C" {
#endif



#include <mongoose/mongoose.h>
void Router(struct mg_connection *c, int ev, void *ev_data);




#ifdef __cplusplus
}
#endif
#endif  // CORE_ROUTER_H
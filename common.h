#ifndef CORE_COMMON_H
#define CORE_COMMON_H
#ifdef __cplusplus
extern "C" {
#endif

const char *s_json_header =
    "Content-Type: application/json\r\n"
    "Cache-Control: no-cache\r\n";

const char *s_listening_url = "http://0.0.0.0:8916";
const char *root_dir = "server/front";    
const char *db_path = "server/back/sk.db";  // rox
const char *js_path = "server/back/server.js";  // rox  
const char *js_modules = "server/back/modules.js";  // rox  


//typedef struct ST_COLLECTOR_INFO
//{
//    uint8_t tBmsNum;
//    uint8_t tBatteryNum;
//    float fBatteryV[200];//单体电压
//    float fBatteryT[200];//单体温度
//    uint8_t   batteryRelay[200];//电池继电器状态
//    float fCurrentE;//实时电流
//    float fCurrentT;//实时温度
//    uint8_t   totalRelay[4];//总继电器、预充继电器
//}ST_COLLECTOR_INFO;

#ifdef __cplusplus
}
#endif
#endif  // CORE_COMMON_H
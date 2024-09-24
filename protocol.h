#ifndef __PROTOCOL_H
#define __PROTOCOL_H

typedef enum EM_PROTOCOL_TYPE
{
	EM_BATTERY_VOL,//单体电压
	EM_BATTERY_TEMP,//单体温度
	EM_BATTERY_RELAY,//电池继电器状态
	EM_FIR_CONDITIONER_WARN,//消防告警
	EM_UNKNOW_PROTOCOL
}EM_PROTOCOL_TYPE;

typedef enum EM_FUNC_CODE 
{
	EM_FUNCCODE_HEX_02=2, //空调告警
	EM_FUNCCODE_HEX_03=3, //PCS数据
	EM_FUNCCODE_HEX_06=6, //空调温湿度
	EM_FUNCCODE_HEX_10=16,
	EM_FUNCCODE_UNDEFINE
}EM_FUNC_CODE;


#define INVALID_VOL_FFFF 65535
#define INVALID_TEMP_7FFF 32767

typedef struct CollectorInfo
{
	bool  bBMSAvailable;
	bool  bPCSAvailable;
	bool  bAirAvailable;
	bool  bFileAvailable;
	float fBatteryVol[240];
	float fBatteryTemp[240];
	bool nHightVolRelay; //高压继电器状态
	float fPCSProperty[6]; //PCS属性值
	bool bPCSAlert[17];//PCS告警
	float fAirProperty[5]; //空调属性值
	bool bAirAlert[18];//空调告警
	int nFireAlert;
}CollectorInfo;

#endif
#ifndef __PROTOCOL_H
#define __PROTOCOL_H

typedef enum EM_PROTOCOL_TYPE
{
	EM_BATTERY_VOL,//�����ѹ
	EM_BATTERY_TEMP,//�����¶�
	EM_BATTERY_RELAY,//��ؼ̵���״̬
	EM_FIR_CONDITIONER_WARN,//�����澯
	EM_UNKNOW_PROTOCOL
}EM_PROTOCOL_TYPE;

typedef enum EM_FUNC_CODE 
{
	EM_FUNCCODE_HEX_02=2, //�յ��澯
	EM_FUNCCODE_HEX_03=3, //PCS����
	EM_FUNCCODE_HEX_06=6, //�յ���ʪ��
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
	bool nHightVolRelay; //��ѹ�̵���״̬
	float fPCSProperty[6]; //PCS����ֵ
	bool bPCSAlert[17];//PCS�澯
	float fAirProperty[5]; //�յ�����ֵ
	bool bAirAlert[18];//�յ��澯
	int nFireAlert;
}CollectorInfo;

#endif
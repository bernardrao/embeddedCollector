#include <mongoose/mongoose.h>
#include <quickjs/quickjs-libc.h>
// #include <quickjs/quickjs.h>
#include <quickjs/cutils.h>
#include <rdkafka/rdkafka.h>

#include "common.h"
#include "User.h"
#include "Router.h"
#include "RjsEngine/rjs.h"


static volatile int running = 1;

int rack_size = 1;
int pack_size = 88;
int core_size = 2;
int alert_size = 60;
char bms_table_rack_fields[13][50] = {"current","soc","soh","sumCharge","sumDischarge","sumChargeEnergy","sumDischargeEnergy","maxU","minU","maxTemp","minTemp","relay","preRelay"};
char bms_table_pack_fields[2][50] = {"groupSumChargeEnergy","groupSumDischargeEnergy"};
char bms_table_core_fields[3][50] = {"voltage","temperature","status"};

void sigterm(int signo)
{
	running = 0;
}


/* 这里手工生成一个 json，作为存储 */
JSValue generate_storage(JSContext *ctx)
{
    printf("C : generate_data ---- \n");
	JSValue cfg_data = JS_NewObject(ctx);
	JSValue data = JS_NewObject(ctx);
	JSValue bms_table = JS_NewObject(ctx);
	int m,n,i,j,k;
	// 簇级数据
	for(m=0;m<14;m++) 
	{
		JSValue rack_arr = JS_NewArray(ctx);
		for(i=0;i<rack_size;i++)
		{
			JSValue rack_obj = JS_NewObject(ctx);
			JSValue rack_data = JS_NewObject(ctx);
			JS_DefinePropertyValueStr(ctx, rack_data, "t", JS_NewInt64(ctx,0), JS_PROP_C_W_E);
			JS_DefinePropertyValueStr(ctx, rack_data, "v", JS_NewFloat64(ctx,0.0), JS_PROP_C_W_E);
			JS_DefinePropertyValueStr(ctx, rack_obj, "data", rack_data, JS_PROP_C_W_E);
			JS_DefinePropertyValueUint32(ctx, rack_arr, i, rack_obj, JS_PROP_C_W_E);
		}
		JS_DefinePropertyValueStr(ctx, bms_table, bms_table_rack_fields[m], rack_arr, JS_PROP_C_W_E);
	}
	
	// pack级数据
	for(m=0;m<2;m++) 
	{
		JSValue rack_arr = JS_NewArray(ctx);
		for(i=0;i<rack_size;i++)
		{
			JSValue pack_arr = JS_NewArray(ctx);
			for(j=0;j<pack_size;j++)
			{
				JSValue pack_obj = JS_NewObject(ctx);
				JSValue pack_data = JS_NewObject(ctx);
				JS_DefinePropertyValueStr(ctx, pack_data, "t", JS_NewInt64(ctx,0), JS_PROP_C_W_E);
				JS_DefinePropertyValueStr(ctx, pack_data, "v", JS_NewFloat64(ctx,0.0), JS_PROP_C_W_E);
				JS_DefinePropertyValueStr(ctx, pack_obj, "data", pack_data, JS_PROP_C_W_E);
				JS_DefinePropertyValueUint32(ctx, pack_arr, k, pack_obj, JS_PROP_C_W_E);
			}
			JS_DefinePropertyValueUint32(ctx, rack_arr, i, pack_arr, JS_PROP_C_W_E); 
		}
		JS_DefinePropertyValueStr(ctx, bms_table, bms_table_core_fields[m], rack_arr, JS_PROP_C_W_E);
	}
	
	// 告警数据
	JSValue rack_arr = JS_NewArray(ctx);
	for(i=0;i<rack_size;i++)
	{
		JSValue alert_arr = JS_NewArray(ctx);
		for(n=0;n<alert_size;n++)
		{
			JSValue alert_obj = JS_NewObject(ctx);
			JSValue alert_data = JS_NewObject(ctx);
			JS_DefinePropertyValueStr(ctx, alert_data, "t", JS_NewInt64(ctx,0), JS_PROP_C_W_E);
			JS_DefinePropertyValueStr(ctx, alert_data, "v", JS_NewInt32(ctx,0), JS_PROP_C_W_E);
			JS_DefinePropertyValueStr(ctx, alert_obj, "data", alert_data, JS_PROP_C_W_E);
			JS_DefinePropertyValueUint32(ctx, alert_arr, n, alert_obj, JS_PROP_C_W_E);
		}
		JS_DefinePropertyValueUint32(ctx, rack_arr, i, alert_arr, JS_PROP_C_W_E);		
	}
	JS_DefinePropertyValueStr(ctx, bms_table, "alert", rack_arr, JS_PROP_C_W_E);
	
	// 电芯级数据
	for(m=0;m<2;m++) 
	{
		JSValue rack_arr = JS_NewArray(ctx);
		for(i=0;i<rack_size;i++)
		{
			JSValue pack_arr = JS_NewArray(ctx);
			for(j=0;j<pack_size;j++)
			{
				JSValue core_arr = JS_NewArray(ctx);
				for(k=0;k<core_size;k++)
				{
					JSValue core_obj = JS_NewObject(ctx);
					JSValue core_data = JS_NewObject(ctx);
					JS_DefinePropertyValueStr(ctx, core_data, "t", JS_NewInt64(ctx,0), JS_PROP_C_W_E);
					JS_DefinePropertyValueStr(ctx, core_data, "v", m == 2 ? JS_NewInt32(ctx,0) : JS_NewFloat64(ctx,0.0), JS_PROP_C_W_E);
					JS_DefinePropertyValueStr(ctx, core_obj, "data", core_data, JS_PROP_C_W_E);
					JS_DefinePropertyValueUint32(ctx, core_arr, k, core_obj, JS_PROP_C_W_E);
					
				}
				JS_DefinePropertyValueUint32(ctx, pack_arr, j, core_arr, JS_PROP_C_W_E);
			}
			JS_DefinePropertyValueUint32(ctx, rack_arr, i, pack_arr, JS_PROP_C_W_E); 
		}
		JS_DefinePropertyValueStr(ctx, bms_table, bms_table_core_fields[m], rack_arr, JS_PROP_C_W_E);
   
	}
	JS_DefinePropertyValueStr(ctx, data, "bms_table", bms_table, JS_PROP_C_W_E);
    JS_DefinePropertyValueStr(ctx, cfg_data, "data", data, JS_PROP_C_W_E);
    
    return cfg_data;
    
}


int main(void)
{
	signal(SIGTERM, sigterm);
	signal(SIGHUP, sigterm);
	signal(SIGINT, sigterm);
	
	struct mg_mgr mgr;
    mg_log_set(MG_LL_DEBUG);
    mg_mgr_init(&mgr);
  
    // printf("C : CAN Sockets Receive Demo\r\n");
  
    JSContext *ctx = RJS_init("main.js", &mgr);
    JSValue cfg_data = generate_storage(ctx);
    
    JSValue calc_temp = JS_NewObject(ctx);
    if (JS_IsException(calc_temp)) return 0;
	
	printf("C : run_status ---- %d\n", running);
	JSValue args[]={cfg_data};
    int argcnt = 1; // args 数组长度 
	int i;
    while (running) 
    {
        sleep(1);  

		// 模拟电流变化
		RJS_ExecFunction(ctx,  "genData", argcnt, args);  
		// 计算相关数据
        RJS_ExecFunction(ctx,  "realCompute", argcnt, args);  
        js_std_loop(ctx);

        // 打印修改后的数据     
        JSValue data_obj = JS_GetPropertyStr(ctx, cfg_data, "data");
		JSValue data_bms_table = JS_GetPropertyStr(ctx, data_obj, "bms_table");
		JSValue data_soc = JS_GetPropertyStr(ctx, data_bms_table, "soc");
		for(i=0;i<rack_size;i++)
		{
			JSValue soc_data = JS_GetPropertyUint32(ctx, data_soc, i);
			JSValue data = JS_GetPropertyStr(ctx, soc_data, "data");
			JSValue data_val = JS_GetPropertyStr(ctx, data, "v");
			if (!JS_IsUndefined(data_val)) {
				double val = RJS_GetFloat64(ctx, data_val);    
				printf("C :(socData)     rack_%d_soc: %f \t", i+1,RJS_GetFloat64(ctx, data_val));
			}
			JS_FreeValue(ctx, data_val);
			JS_FreeValue(ctx, data);
			JS_FreeValue(ctx, soc_data);
		}
		printf("\n");
        //if (!JS_IsUndefined(data_soc)) {
            // double val = RJS_GetFloat64(ctx, data_val);    
        //    printf("C :(socData)     value: %s \n", data_soc);
        //}
        JS_FreeValue(ctx, data_obj);
        JS_FreeValue(ctx, data_bms_table);
        JS_FreeValue(ctx, data_soc);
    }
	
	mg_mgr_free(&mgr);
    
    JS_FreeValue(ctx, cfg_data);
    JS_FreeValue(ctx, calc_temp);
    
    
    RJS_Destory(ctx);
    
	return 0;
}
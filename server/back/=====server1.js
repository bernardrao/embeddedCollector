const password = 'Sk@001';

const deviceSize = 1;
const packSize = 10;
const coreSize = 24;

const defaultChargeConfig = {
    "enabled": 0,
    "actions": [
        {"startHour": 19, "endHour": 20, "action": 1, "p": 40},
        {"startHour": 21, "endHour": 22, "action": 2, "p": 55}
    ]
};
let chargeConfig = {};


function MineinitConfig(cfg_data, cfg_data_str)
{   
    //console.log('initConfig:',cfg_data_str);
    //console.log('js:(initConfig)  original:',JSON.stringify(cfg_data));
    var data=JSON.parse(cfg_data_str);
    cfg_data["data"]=data["data"];
    cfg_data.data["init"]= true;
    gdata["cfg"] = cfg_data; 
	gdata["cfg"]['data']['bms_table']['soh'][0]['data']['v'] = 100; 
	checkpointInit();
    //console.log(JSON.stringify(cfg_data));
}

function initConfig(cfg_data, cfg_data_str)
{
    
}


initChargeConfig();

//两字节转uint16
function uint8sToUint16(byte1, byte2) {
    return (byte1 << 8) | byte2;
}

function arrayToHexStr(array_data, interval_str){
    let str="";
    for(let i = 0; i < array_data.length; ++i){
        str += (array_data[i]>15?interval_str:(interval_str+"0")) + array_data[i].toString(16);
    }
    return str;
}

// 实时计算函数 , 
// cfg_data： json规范初稿, 
// msg： 为本次采集到的数据, 
// calc_temp： 为临时数据存储区
function onCANMessage(port, msg, cfg_data, calc_temp){
	 console.log('onCANMessage');

	//获取并打印当前时间戳 
	let timestamp = Date.parse(new Date());
	console.log('js:(onCANMessage) timestamp:',timestamp);

	// 打印采集到的数据 
	let array = new Uint8Array(msg);
    let str=arrayToHexStr(array," ");
	console.log('js:(onCANMessage) CAN'+port+':',str);

	if(16 !==  array.length){
        //暂不处理
		return;
	}

	//messageID 取前29位，字节序需要反转
	let messageid=new Uint8Array(4);
	messageid[0]=array[3] & 0x1F;
	messageid[1]=array[2];
	messageid[2]=array[1];
	messageid[3]=array[0];
	let str_id = arrayToHexStr(messageid,"");
	console.log('js:(onCANMessage) messageID:',str_id);
    
    if(0x18 === messageid[0]){
        if(0x27 === messageid[2] && 0x01 === messageid[3]){
            switch (messageid[1])
            {
                case 0x01:
                    console.log('js:(onCANMessage) SOC');
                break;
                case 0x02:
                case 0x03:
                case 0x04:
                    console.log('js:(onCANMessage) SOE');
                break;
                case 0x05:
                    console.log('js:(onCANMessage) SOH');
                break;
                case 0x06:
                    console.log('js:(onCANMessage) SOP');
                break;
                case 0x07:
                    console.log('js:(onCANMessage) SOP2');
                break;
                case 0x08:
                    console.log('js:(onCANMessage) working_condition');
                break;
                case 0x09:
                    console.log('js:(onCANMessage) balance_info');
                break;
                case 0x0a:
                    console.log('js:(onCANMessage) relay_info');
                break;
                case 0x0b:
                    console.log('js:(onCANMessage) resistance');
                break;
                case 0x0c:
                    console.log('js:(onCANMessage) clusterInfo');
                break;
                case 0x0d:
                    console.log('js:(onCANMessage) module_vol');
                break;
                case 0x0e:
                    console.log('js:(onCANMessage) batterry_vol_info');
                break;
                case 0x0f:
                    console.log('js:(onCANMessage) batterry_temp_info');
                break;
                case 0x10:
                case 0x11:
                case 0x12:
                case 0x13:
                    console.log('js:(onCANMessage) batterry_vol');
                break;
                case 0x14:
                case 0x15:
                    console.log('js:(onCANMessage) batterry_temp');
                break;
                case 0x16:
                    console.log('js:(onCANMessage) fan_info');
                break;
                case 0x1f:
                case 0x20:
                    console.log('js:(onCANMessage) system_info');
                break;
                case 0x21:
                    console.log('js:(onCANMessage) soc2');
                break;
                case 0x22:
                    console.log('js:(onCANMessage) relay_info2');
                break;
                case 0x23:
                    console.log('js:(onCANMessage) relay_info3');
                break;
                case 0x24:
                    console.log('js:(onCANMessage) power_limit');
                break;
                case 0x30:
                case 0x31:
                case 0x34:
                case 0x35:
                    console.log('js:(onCANMessage) over_under_voltage');
                break;
                case 0x32:
                case 0x33:
                case 0x36:
                case 0x37:
                        console.log('js:(onCANMessage) over_under_voltage_exp');
                break;
                case 0x38:
                case 0x39:
                case 0x3c:
                case 0x3d:
                    console.log('js:(onCANMessage) over_under_temp');
                break;
                case 0x3a:
                case 0x3b:
                case 0x3e:
                case 0x3f:
                    console.log('js:(onCANMessage) over_under_temp_exp');
                break;
                case 0x40:
                case 0x41:
                case 0x42:
                    console.log('js:(onCANMessage) battery_warm');
                break;
                case 0x43:
                case 0x44:
                case 0x45:
                case 0x46:
                    console.log('js:(onCANMessage) battery_temp_diff');
                break;
                case 0x47:
                case 0x48:
                case 0x4b:
                case 0x4c:
                    console.log('js:(onCANMessage) fault_dis_charge_voltage');
                break;
                case 0x49:
                case 0x4a:
                case 0x4d:
                case 0x4e:
                    console.log('js:(onCANMessage) fault_dis_charge_voltage_exp');
                break;
                case 0x4f:
                case 0x6e:
                case 0x50:
                case 0x62:
                    console.log('js:(onCANMessage) fault_soc');
                break;
                case 0x51:
                case 0x52:
                    console.log('js:(onCANMessage) fault_insulation');
                break;
                case 0x53:
                    console.log('js:(onCANMessage) fault_insulation_3');
                break;
                case 0x54:
                    console.log('js:(onCANMessage) fault_insulation_4');
                break;
                case 0x55:
                case 0x56:
                case 0x57:
                case 0x58:
                    console.log('js:(onCANMessage) fault_vol_diff_over');
                break;
                case 0x59:
                case 0x5a:
                case 0x5d:
                case 0x5e:   
                    console.log('js:(onCANMessage) fault_cluster_vol');
                break;
                case 0x5b:
                case 0x5c:
                case 0x5f:
                case 0x60:   
                    console.log('js:(onCANMessage) fault_cluster_vol');
                break;
                case 0xe0:
                    console.log('js:(onCANMessage) fault_information');
                break;
                case 0xe1:
                    console.log('js:(onCANMessage) fault_log_1');
                break;
                case 0xe2:
                case 0xe3:
                    console.log('js:(onCANMessage) fault_log_2_3');
                break;
                case 0xe4:
                    console.log('js:(onCANMessage) fault_log_4');
                break;
            }
        }
    }else if(0x14 == messageid[0]){

    }

	if(str_id === "18102701"
	|| str_id === "18112701"
	|| str_id === "18122701"
	|| str_id === "18132701"){
		//电芯电压
		console.log('battery voltage:',str_id);
		let idx_in_meg = array[8];

		let idx_vol=0;
		let idx_diff=1;
		if(str_id === "18102701"){
			idx_diff=1;
		}else if(str_id === "18112701"){
			idx_diff=5;
		}else if(str_id === "18122701"){
			idx_diff=9;
		}else if(str_id === "18132701"){
			idx_diff=13;
		}

		idx_vol=16*idx_in_meg+idx_diff;
		
		let data_array=new Uint8Array(7);
		for(let i = 0; i < 7; ++i)
		{
			data_array[i]=array[15-i];
		}

		let str_data = "";
		for(let i = 0; i < data_array.length; ++i){
			str_data += (data_array[i]>15?" ":" 0") + data_array[i].toString(16);
		}
		console.log('js:(onCANMessage) data:',str_data);
		
		//电压1
		let vol1 =uint8sToUint16(data_array[0],data_array[1]);
		vol1=vol1 & 0xfffc;
		vol1=vol1>>2;
		vol1=vol1/1000;
		
		idx_vol=16*idx_in_meg+idx_diff;
		let pack_idx= Math.floor(idx_vol/coreSize);
		let idx_in_pack=idx_vol%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
		console.log('js:(onCANMessage) battery_num: idx_in_pack: pack_idx: vol:',idx_vol,pack_idx,idx_in_pack,vol1);
        console.log('js:(onCANMessage) battery_num:%d vol1:%f',idx_vol,vol1);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['v'] = Number(vol1);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;


		//电压2
		let vol2_pre=uint8sToUint16(data_array[1],data_array[2]);
		vol2_pre=vol2_pre & 0x03ff;
		vol2_pre=vol2_pre<<4;
		let vol2=uint8sToUint16(data_array[2],data_array[3]);
		vol2=vol2 & 0x00F0;
		vol2=vol2>>4;
		vol2=vol2_pre | vol2;
		vol2=vol2/1000;
		console.log('js:(onCANMessage) vol2:',vol2);

		idx_diff++;
		idx_vol=16*idx_in_meg+idx_diff;
		pack_idx= Math.floor(idx_vol/coreSize);
		idx_in_pack=idx_vol%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        console.log('js:(onCANMessage) battery_num: idx_in_pack: pack_idx: vol:',idx_vol,pack_idx,idx_in_pack,vol2);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['v'] = Number(vol2);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;


		//电压3
		let vol3_pre=uint8sToUint16(data_array[3],data_array[4]);
		vol3_pre=vol3_pre & 0x0fff;
		vol3_pre=vol3_pre<<2;
		let vol3=uint8sToUint16(data_array[4],data_array[5]);
		vol3 = vol3 & 0x00C0;
		vol3 = vol3 >> 6;
		vol3= vol3_pre | vol3;
		vol3=vol3/1000;
		console.log('js:(onCANMessage) vol3:',vol3);
		
		idx_diff++;
		idx_vol=16*idx_in_meg+idx_diff;
		pack_idx= Math.floor(idx_vol/coreSize);
		idx_in_pack=idx_vol%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        console.log('js:(onCANMessage) battery_num: idx_in_pack: pack_idx: vol:',idx_vol,pack_idx,idx_in_pack,vol3);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['v'] = Number(vol3);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

		//电压4
		let vol4=uint8sToUint16(data_array[5],data_array[6]);
		vol4 = vol4 & 0x3FFF;
		vol4=vol4/1000;
		console.log('js:(onCANMessage) vol4:',vol4);
		idx_diff++;
		idx_vol=16*idx_in_meg+idx_diff;
		pack_idx= Math.floor(idx_vol/coreSize);
		idx_in_pack=idx_vol%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        console.log('js:(onCANMessage) battery_num: idx_in_pack: pack_idx: vol:',idx_vol,pack_idx,idx_in_pack,vol4);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['v'] = Number(vol4);
		gdata["cfg"]['data']['bms_table']['voltage'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

	}
	else if(str_id === "18142701"
	||str_id === "18152701"){
		//电芯温度
		console.log('battery temperature:',str_id);
		let idx_in_meg = array[8];

		let idx_vol=0;
		let idx_diff=1;
		if(str_id === "18142701"){
			idx_diff=1;
		}else if(str_id === "18152701"){
			idx_diff=5;
		}
		idx_temp=8*idx_in_meg+idx_diff;

		let data_array=new Uint8Array(7);
		for(let i = 0; i < 7; ++i)
		{
			data_array[i]=array[15-i];
		}

		let str_data = "";
		for(let i = 0; i < data_array.length; ++i){
			str_data += (data_array[i]>15?" ":" 0") + data_array[i].toString(16);
		}
		console.log('js:(onCANMessage) temp_data:',str_data);

		//温度1
		let temp1 =uint8sToUint16(data_array[0],data_array[1]);
		temp1=temp1 & 0xfffc;
		temp1=temp1>>2;
		temp1=(temp1-40)/10;
		console.log('js:(onCANMessage) temp1:',temp1);

        idx_temp--;
        let battery_id=3*idx_temp;
        battery_id++;
		let pack_idx= Math.floor(battery_id/coreSize);
		let idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp1);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;
        
        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp1);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp1);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

		//温度2
		let temp2_pre=uint8sToUint16(data_array[1],data_array[2]);
		temp2_pre=temp2_pre & 0x03ff;
		temp2_pre=temp2_pre<<4;
		let temp2=uint8sToUint16(data_array[2],data_array[3]);
		temp2=temp2 & 0x00F0;
		temp2=temp2>>4;
		temp2=temp2_pre | temp2;
		temp2=(temp2-40)/10;
		console.log('js:(onCANMessage) temp2:',temp2);
		idx_diff++;
		idx_temp=8*idx_in_meg+idx_diff;

        idx_temp--;
        battery_id=3*idx_temp;
        battery_id++;
		pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp2);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp2);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp2);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

		//温度3
		let temp3_pre=uint8sToUint16(data_array[3],data_array[4]);
		temp3_pre=temp3_pre & 0x0fff;
		temp3_pre=temp3_pre<<2;
		let temp3=uint8sToUint16(data_array[4],data_array[5]);
		temp3 = temp3 & 0x00C0;
		temp3 = temp3 >> 6;
		temp3= temp3_pre | temp3;
		temp3=(temp3-40)/10;
		console.log('js:(onCANMessage) temp3:',temp3);
		idx_diff++;
		idx_temp=8*idx_in_meg+idx_diff;

        idx_temp--;
        battery_id=3*idx_temp;
        battery_id++;
		pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp3);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp3);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp3);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

		//温度4
		let temp4=uint8sToUint16(data_array[5],data_array[6]);
		temp4 = temp4 & 0x3FFF;
		temp4=(temp4-40)/10;
		console.log('js:(onCANMessage) temp4:',temp4);
		idx_diff++;
		idx_temp=8*idx_in_meg+idx_diff;

        idx_temp--;
        battery_id=3*idx_temp;
        battery_id++;
		pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp4);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp4);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

        battery_id++;
        pack_idx= Math.floor(battery_id/coreSize);
		idx_in_pack=battery_id%coreSize;
        if(0 === idx_in_pack){
            pack_idx--;
            idx_in_pack=24;
        }
        idx_in_pack--;
        gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['v'] = Number(temp4);
		gdata["cfg"]['data']['bms_table']['temperature'][0][pack_idx][idx_in_pack]['data']['t'] = timestamp;

	}else if(str_id === "180b2701"){
		//绝缘阻值及高温箱温度
		console.log('resistance');
		let positive_resistance=uint8sToUint16(array[8],array[9]);
		let negative_resistance=uint8sToUint16(array[10],array[11]);
		console.log('js:(onCANMessage) positive_resistance:',positive_resistance);
		console.log('js:(onCANMessage) negative_resistance:',negative_resistance);

		positive_resistance=positive_resistance>3000?3000:positive_resistance;
		negative_resistance=negative_resistance>3000?3000:negative_resistance;

		gdata["cfg"]['data']['bms_table']['positive_resistance'][0]['data']['v']=positive_resistance;
		gdata["cfg"]['data']['bms_table']['positive_resistance'][0]['data']['t']=timestamp;

		gdata["cfg"]['data']['bms_table']['negative_resistance'][0]['data']['v']=negative_resistance;
		gdata["cfg"]['data']['bms_table']['negative_resistance'][0]['data']['t']=timestamp;

	}else if(str_id === "180c2701"){
		//簇电压 实时电流 功率
		console.log('resistance');
		let cluster_vol=uint8sToUint16(array[8],array[9]);
		let cluster_ele=uint8sToUint16(array[10],array[11]);
		let cluster_power=uint8sToUint16(array[12],array[13]);
		console.log('js:(onCANMessage) cluster_vol:',cluster_vol);
		console.log('js:(onCANMessage) cluster_ele:',cluster_ele);
		console.log('js:(onCANMessage) cluster_power:',cluster_power);

		gdata["cfg"]['data']['bms_table']['sumU'][0]['data']['v']=cluster_vol;
		gdata["cfg"]['data']['bms_table']['sumU'][0]['data']['t']=timestamp;

		gdata["cfg"]['data']['bms_table']['current'][0]['data']['v']=cluster_ele;
		gdata["cfg"]['data']['bms_table']['current'][0]['data']['t']=timestamp;

		gdata["cfg"]['data']['bms_table']['p'][0]['data']['v']=cluster_power;
		gdata["cfg"]['data']['bms_table']['p'][0]['data']['t']=timestamp;

	}else if(str_id === "180a2701"){
		//继电器状态(负极、正极、预充)
		console.log('relay status');
		let data_array=new Uint8Array(8);
		for(let i = 0; i < 8; ++i){
			data_array[i]=array[i+8];
		}

		let str_data = "";
		for(let i = 0; i < data_array.length; ++i){
			str_data += (data_array[i]>15?" ":" 0") + data_array[i].toString(16);
		}

		console.log('js:(onCANMessage) relay_data:',str_data);
		let fuji_relay=data_array[0] & 0x80;
		fuji_relay=fuji_relay>0?1:0;
		gdata["cfg"]['data']['bms_table']

		let zhenji_relay=data_array[0] & 0x40;
		zhenji_relay=zhenji_relay>0?1:0;

		let yuchong_relay=data_array[0] & 0x20;
		yuchong_relay=yuchong_relay>0?1:0;

		gdata["cfg"]['data']['bms_table']['negativeRelay'][0]['data']['v']=fuji_relay;
		gdata["cfg"]['data']['bms_table']['negativeRelay'][0]['data']['t']=timestamp;

		gdata["cfg"]['data']['bms_table']['relay'][0]['data']['v']=zhenji_relay;
		gdata["cfg"]['data']['bms_table']['relay'][0]['data']['t']=timestamp;

		gdata["cfg"]['data']['bms_table']['preRelay'][0]['data']['v']=yuchong_relay;
		gdata["cfg"]['data']['bms_table']['preRelay'][0]['data']['t']=timestamp;
	}
}


function onUartMessage(port, msg, cfg_data){
    // 打印修改前的数据
    // console.log('js:(onUartMessage)  original:',JSON.stringify(cfg_data));
    console.log('js:(onUartMessage)  original:',JSON.stringify(gdata["cfg"]));
    
    console.log(JSON.stringify(data));
     
    //uart.write("/dev/ttyS3","test aaaaaaa\n");
    // 打印当前时间戳 
    var timestamp = Date.parse(new Date()); // 当前时间戳
    // console.log('js:(onUartMessage) timestamp:',timestamp); // 打印时间戳 
    
    // 打印采集到的数据，16进制打印 好像有点问题  
    var array = new Uint8Array(msg);
    //let str = "js:(onUartMessage)       msg:";
    let str = "";
    for(var i = 0; i < array.length; ++i){
        str += (array[i]>15?" ":" 0") + array[i].toString(16);
    }

    //array[0] 设备ID array[1]功能码
    if(0x03 === array[0]) //可能是帝森克罗德或盛宏PCS的应答报文 需要功能码（提前配置）进一步判断
    {
        if(dicekeluod_slave_id === array[1]){
            //...
        }else if(shenhon_pcs_id === array[1]){
            //...
        }
    }
    else if(0x04 === array[0])
    {
        //...
    }
    
    data[timestamp] = array;
    
    //uart.write("/dev/ttyS3",str);
    //uart.write("/dev/ttyS3","\n");
    
    console.log('js:(onUartMessage)'+port+'      msg:',str);
}

function jsapi_router(apidata){
	const response = {
        "code": 200,
        "msg": "success",
        "data": {}
    }
	
	try {
		
		const data = JSON.parse(apidata);
		if (!data.hasOwnProperty('type')) {
			response.code = 500;
			response.msg = "type is required";
			return response;
		}
		if (data.type !== 'list' && data.type !== 'getaAutoConfig' && !data.hasOwnProperty('param')) {
			response.code = 500;
			response.msg = "param is required, request body is: " + apidata;
			return response;
		}
		switch (data.type) {
			case "list":
				list(gdata["cfg"], response);
				break;
			case "updateAutoConfig":
				changeControlMode(data.param, response);
				break;
			case "controlCharge":
				manualControl(data.param, response);
				break;
			case "getaAutoConfig":
				getControlConfig(response);
				break;
			default:
				response.code = 500;
				response.msg = `not support type '${data.type}'`;
				break;
		}
	} catch(err) {
		response.code = 500;
		response.msg = err.message;
	} finally {
		return JSON.stringify(response); 
	}
    
	
    
}

// 自定义计算函数 
function calculate(ttt, bbb){
    return ttt+2000+bbb;
}

// timer 定时器 
function timerTest()
{
    console.log('js:',"Timer testing");
    
    os.setTimeout(()=>{std.printf('js: Timer after 2000ms: AABC============\n')}, 2000);
}

// 修改 json 实例 
function testJson(json){
    
    console.log('js:(testJson)',JSON.stringify(json));
    
    json["parsers"]["canid_0"]["myfield_1"]["value"]=9.1;
    console.log('js:(testJson new)',JSON.stringify(json));
    
    // return ttt+2000+bbb;
}


function printTest()
{
    console.log('js:',"std printf testing");
    std.printf('AAB============\n');
    //console.log('js:',calculate(1,2));
    
    // console.log('js:',core.writeVersion("0.0.1"));
    // console.log('js:',core.readVersion());
    // console.log('js:',"ver:" + core.version);
    
    
    var objaaa = {"a": 1,"b": 2,"c": 3};
    for(var key in objaaa){
        console.log('js:',"-->" + key + ":" + objaaa[key]);
    }
    console.log('js:========');
    // var props = Object.keys(objaaa);
    // console.log('js:(props)',props);
    
    var obj_new = {"t1": objaaa, "t2":{"d":4}};
    objaaa["a"]=5;
    console.log('js:',JSON.stringify(obj_new));
    
    
    return "aaaa";
    // return props;
}

// 调用系统指令 
function osTest()
{   
    console.log('js:',"OS testing");
    console.log('js:',os.getcwd());
    
    return os.getcwd();
}



// ================================================================
// =====                     	 计算                         =====
// ================================================================

// 告警阈值
const alertConfig = {
    tempDiff: {threshold : [20, 15, 10], index: [0, 1, 2]},
    chargeOverTemp: {threshold : [60, 55, 50], index: [3, 4, 5]},
    stopOverTemp: {threshold : [60, 0, 0], index: [6, 7, 8]},
    chargeOverSumU: {threshold : [876, 864, 840], index: [9, 10, 11]},
    stopOverSumU: {threshold : [864, 0, 0], index: [12, 13, 14]},
    chargeLowSumU: {threshold : [600, 624, 672], index: [15, 16, 17]},
    stopLowSumU: {threshold : [600, 0, 0], index: [18, 19, 20]},
    dischargeLowSoc: {threshold : [5, 15, 20], index: [21, 22, 23]},
    chargeLowSoc: {threshold : [0, 0, 20], index: [24, 25, 26]},
    dischargeOverU: {threshold : [3.65, 3.6, 0], index: [27, 28, 29]},
    chargeOverU: {threshold : [3.65, 0, 0], index: [30, 31, 32]},
    dischargeLowU: {threshold : [2.5, 2.6, 2.7], index: [33, 34, 35]},
    chargeLowU: {threshold : [2.0, 0, 2.8], index: [36, 37, 38]},
    overSoc: {threshold : [100, 95, 90], index: [39, 40, 41]},
    socJump: {threshold : [0, 0, 10], index: [42, 43, 44]},
    uDiff: {threshold : [700, 500, 300], index: [45, 46, 47]},
    overI: {threshold : [1.2, 1.15, 1.1], index: [48, 49, 50]},
    chargeLowTemp: {threshold : [0, 0, 0], index: [51, 52, 53]},
    dischargeLowTemp: {threshold : [-20, -10, 0], index: [54, 55, 56]},
    overIDiff: {threshold : [10, 8, 5], index: [57, 58, 59]}
}
const capacity = 280; // 电池容量，单位Ah
const variableI = 5;
const iMax = 280;


let count = 1;
let sleep = 5;
let init_flag = 0;
let charge_type =  1;

// 中间数据存储
const temp_data = {
    soh: [{charge: 0, discharge: 0},{charge: 0, discharge: 0}],
    socJump: [[{t:0,v:0}],[{t:0,v:0}]],
    alert: [{tempDiffOne: {t:0,v:0}},{tempDiffOne: {t:0,v:0}}]
}

// 数据持久化
function checkpointInit(){
    const checkpointValue = {};
    const creatTableSql = 'create table if not exists checkpoint(data_key TEXT,data_value TEXT)';
    db.query(creatTableSql);

    const configStr = db.query('select data_key,data_value from checkpoint');
    if(configStr) {
        const dataArr = configStr.split("\n").slice(1).filter(x => x !== "");
        for (let i = 0; i < dataArr.length; i++) {
            const valueArr = dataArr[i].split(",");
            checkpointValue[valueArr[0]] = valueArr[1];
        }
    }
    function addCheckpoint(key, value) {
        const insertSql = `insert into checkpoint(data_key,data_value) values('${key}','${value}')`;
        db.query(insertSql);
    }
    if (checkpointValue.hasOwnProperty('sumChargeEnergy')) {
        gdata['cfg']['data']['bms_table']['sumChargeEnergy'][0]['data']['v'] = Number(checkpointValue['sumChargeEnergy']);
    } else {
        addCheckpoint('sumChargeEnergy',0);
    }
    if (checkpointValue.hasOwnProperty('sumDischargeEnergy')) {
        gdata['cfg']['data']['bms_table']['sumDischargeEnergy'][0]['data']['v'] = Number(checkpointValue['sumDischargeEnergy']);
    } else {
        addCheckpoint('sumDischargeEnergy',0);
    }
    if (checkpointValue.hasOwnProperty('sumCharge')) {
        gdata['cfg']['data']['bms_table']['sumCharge'][0]['data']['v'] = Number(checkpointValue['sumCharge']);
    } else {
        addCheckpoint('sumCharge',0);
    }
    if (checkpointValue.hasOwnProperty('sumDischarge')) {
        gdata['cfg']['data']['bms_table']['sumDischarge'][0]['data']['v'] = Number(checkpointValue['sumDischarge']);
    } else {
        addCheckpoint('sumDischarge',0);
    }
    if (checkpointValue.hasOwnProperty('soh')) {
        gdata['cfg']['data']['bms_table']['soh'][0]['data']['v'] = Number(checkpointValue['soh']);
    } else {
        gdata['cfg']['data']['bms_table']['soh'][0]['data']['v'] = 100;
        addCheckpoint('soh',100);
    }
}

// 保存数据
function checkpointSave(){
    if (Date.now() - checkPointConfig.lastSaveTime < checkPointConfig.interval) {
        return;
    }
    const sumChargeEnergy = gdata['cfg']['data']['bms_table']['sumChargeEnergy'][0]['data']['v'];
    const sumDischargeEnergy = gdata['cfg']['data']['bms_table']['sumDischargeEnergy'][0]['data']['v'];
    const sumCharge = gdata['cfg']['data']['bms_table']['sumCharge'][0]['data']['v'];
    const sumDischarge = gdata['cfg']['data']['bms_table']['sumDischarge'][0]['data']['v'];
    const soh = gdata['cfg']['data']['bms_table']['soh'][0]['data']['v'];
    function updateCheckpoint(key, value) {
        const updateSql = `update checkpoint set data_value='${value}' where data_key='${key}'`;
        db.query(updateSql);
    }
    updateCheckpoint('sumChargeEnergy',sumChargeEnergy);
    updateCheckpoint('sumDischargeEnergy',sumDischargeEnergy);
    updateCheckpoint('sumCharge',sumCharge);
    updateCheckpoint('sumDischarge',sumDischarge);
    updateCheckpoint('soh',soh);
    checkPointConfig.lastSaveTime = Date.now();
    console.log(`${Date.now()} checkpoint save success !!!`);
}

//json串转对象计算
function ComputeAndChecCharge(cfg_data,update_str)
{
	console.log('Compute!!!!');
	//console.log('update:',update_str);
	
    var cfg_update = JSON.parse(update_str);
	// cfg_data['data']['bms_table']['voltage']=cfg_update['voltage'];
	// cfg_data['data']['bms_table']['temperature']=cfg_update['temperature'];
	//cfg_data['data']['bms_table']['relay']=cfg_update['relay'];
	//cfg_data['data']['bms_table']['preRelay']=cfg_update['preRelay'];
	cfg_data['data']['bms_table']['status']=cfg_update['status'];
	// 温度分配
/* 	for (let i = 0; i < packSize; i++) {
		for (let j = 0; j < coreSize; j++) {
			cfg_data['data']['bms_table']['temperature'][0][i][j]['data']['v'] =  Number(((cfg_update['temperature'][Math.floor((i*coreSize+j)/3)]['v']-40)/10).toFixed(1));
			cfg_data['data']['bms_table']['temperature'][0][i][j]['data']['t'] = cfg_update['temperature'][Math.floor((i*coreSize+j)/3)]['t'];
		}
	}
	// 电压分配
	for (let i = 0; i < packSize; i++) {
		for (let j = 0; j < coreSize; j++) {
			cfg_data['data']['bms_table']['voltage'][0][i][j]['data']['v'] = Number((cfg_update['voltage'][(i*coreSize+j)]['v']/1000).toFixed(3));
			cfg_data['data']['bms_table']['voltage'][0][i][j]['data']['t'] = cfg_update['voltage'][(i*coreSize+j)]['t'];
		}
	} */

    cfg_data['data']['pcs_table']=cfg_update['pcs_table'];
    cfg_data['data']['kongtiao']=cfg_update['kongtiao'];
    cfg_data['data']['fire']=cfg_update['fire'];
    cfg_data['data']['connection_status']=cfg_update['connection_status'];

    // console.log('ComputeAndChecCharge:',JSON.stringify(cfg_data));

    realCompute(cfg_data);
    checkChargeStatus(cfg_data);
	// 触发checkpoint
	checkpointSave();
}

// 所有计算
function realCompute(cfg_data) {
    // const start = Date.now();
    computeChargeEnergy(cfg_data);
    computeMaxMin(cfg_data)
    computeSoc(cfg_data);
    computeSoh(cfg_data, temp_data);
    tempDiffCompute(cfg_data, temp_data);
    chargeOverTempCompute(cfg_data, temp_data);
    stopOverTempCompute(cfg_data, temp_data);
    chargeOverSumUCompute(cfg_data, temp_data);
    stopOverSumUCompute(cfg_data, temp_data);
    chargeLowSumUCompute(cfg_data, temp_data);
    stopLowSumUCompute(cfg_data, temp_data);
    dischargeLowSocCompute(cfg_data, temp_data);
    chargeLowSocCompute(cfg_data, temp_data);
    dischargeOverUCompute(cfg_data, temp_data);
    chargeOverUCompute(cfg_data, temp_data);
    dischargeLowUCompute(cfg_data, temp_data);
    chargeLowUCompute(cfg_data, temp_data);
    overSocCompute(cfg_data, temp_data);
    socJumpCompute(cfg_data, temp_data);
    uDiffCompute(cfg_data, temp_data);
	overICompute(cfg_data, temp_data);
    chargeLowTempCompute(cfg_data, temp_data);
    // console.log("计算耗时：" + (Date.now() - start) + "ms")
}

// 模拟数据变化
function genDataLocal(cfg_data){
    // 初始化电压，温度,串充放电量
    for (let deviceIndex = 0; deviceIndex < deviceSize; deviceIndex++) {
        cfg_data['data']['bms_table']['voltage'][deviceIndex] = [];
        cfg_data['data']['bms_table']['temperature'][deviceIndex] = [];
        cfg_data['data']['bms_table']['status'][deviceIndex] = [];
        for (let j = 0; j < packSize; j++) {
            cfg_data['data']['bms_table']['voltage'][deviceIndex][j] = [];
            cfg_data['data']['bms_table']['temperature'][deviceIndex][j] = [];
            cfg_data['data']['bms_table']['status'][deviceIndex][j] = [];
            cfg_data['data']['bms_table']['groupSumChargeEnergy'][deviceIndex][j] = {"data":{"t":0,"v":0}};
            cfg_data['data']['bms_table']['groupSumDischargeEnergy'][deviceIndex][j] = {"data":{"t":0,"v":0}};
            for (let k = 0; k < coreSize; k++) {
                cfg_data['data']['bms_table']['voltage'][deviceIndex][j][k] = {"data":{"t":0,"v":0}};
                cfg_data['data']['bms_table']['temperature'][deviceIndex][j][k] = {"data":{"t":0,"v":0}};
                cfg_data['data']['bms_table']['status'][deviceIndex][j][k] = {"data":{"t":0,"v":1}};
            }
        }
    }
    // 初始化告警状态
    for (let deviceIndex = 0; deviceIndex < deviceSize; deviceIndex++) {
        for (let i = 0; i < 60; i++) {
            cfg_data['data']['bms_table']['alert'][deviceIndex][i] = {"data":{"t":0,"v":0}};
        }
    }
    function updateChargeData() {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
        let run = 1;
        if (1 === 1) {
            const time = Date.now();
            const u = 0.01 * count + 3;
            for (let i = 0; i < deviceSize; i++) {
                // 更改电流数据
                cfg_data['data']['bms_table']['current'][i]['data']['v'] = u >= getStopChargeU() ? 0 : Math.random() * (-30) + (-140*200);
                cfg_data['data']['bms_table']['current'][i]['data']['t'] = time;
                // 更改继电器状态数据
                cfg_data['data']['bms_table']['relay'][i]['data']['t'] = time;
                if (Math.abs(cfg_data['data']['bms_table']['current'][i]['data']['v']) < 5) {
                    cfg_data['data']['bms_table']['relay'][i]['data']['v'] = 0;
                } else {
                    cfg_data['data']['bms_table']['relay'][i]['data']['v'] = 1;
                }
                // 更改电压温度数据
                for (let j = 0; j < packSize; j++) {
                    for (let k = 0; k < coreSize; k++) {
                        const t = Math.random() * 5 + 30;
                        cfg_data['data']['bms_table']['voltage'][i][j][k]['data']['v'] = u;
                        cfg_data['data']['bms_table']['voltage'][i][j][k]['data']['t'] = time;
                        cfg_data['data']['bms_table']['temperature'][i][j][k]['data']['v'] = t;
                        cfg_data['data']['bms_table']['temperature'][i][j][k]['data']['t'] = time;
                    }
                }

            }
            if (u >= getStopChargeU()) {
                sleep--;
                if (sleep === 0) {
                    run = 0;
                    count = 1;
                    updateDischargeData();
                    sleep = 5;
                }
            }
            count++;
            // console.log(cfg_data['data']['bms_table']['current']);
            // if (run === 1) setTimeout(updateChargeData, 1000);
        }
    };

    function updateDischargeData() {
        console.log("----------------------------------------------------------")
        let run = 1;
        if (1 === 1) {
            const time = Date.now();
            const u = 3.3 - 0.01 * count;
            for (let i = 0; i < deviceSize; i++) {
                // 更改电流数据
                cfg_data['data']['bms_table']['current'][i]['data']['v'] = u <= getStopDischargeU() ? 0 : Math.random() * (30) + (140*200);
                cfg_data['data']['bms_table']['current'][i]['data']['t'] = time;
                // 更改继电器状态数据
                cfg_data['data']['bms_table']['relay'][i]['data']['t'] = time;
                if (Math.abs(cfg_data['data']['bms_table']['current'][i]['data']['v']) < 5) {
                    cfg_data['data']['bms_table']['relay'][i]['data']['v'] = 0;
                } else {
                    cfg_data['data']['bms_table']['relay'][i]['data']['v'] = 1;
                }
                // 更改电压温度数据
                for (let j = 0; j < packSize; j++) {
                    for (let k = 0; k < coreSize; k++) {
                        const t = Math.random() * 5 + 30;
                        cfg_data['data']['bms_table']['voltage'][i][j][k]['data']['v'] = u;
                        cfg_data['data']['bms_table']['voltage'][i][j][k]['data']['t'] = time;
                        cfg_data['data']['bms_table']['temperature'][i][j][k]['data']['v'] = t;
                        cfg_data['data']['bms_table']['temperature'][i][j][k]['data']['t'] = time;
                    }
                }

            }
            if (u <= getStopDischargeU()) {
                sleep--;
                if (sleep === 0) {
                    run = 0;
                    count = 1;
                    updateChargeData();
                    sleep = 5;
                }
            }
            count++;
            // console.log(cfg_data['data']['bms_table']['current']);
            if (run === 1) setTimeout(updateDischargeData, 1000);
        }
    }

    updateChargeData();

    // console.log("cfg_data",JSON.stringify(cfg_data));
}


// 计算SOC
function computeSoc(cfg_data) {
    const iArray = cfg_data['data']['bms_table']['current'];
    const stopDischargeU = getStopDischargeU();
    const stopChargeU = getStopChargeU();
    const currentTime = Date.now();
    for(let i = 0; i < deviceSize; i++) {
        const iData = iArray[i]['data'];
        const socData = cfg_data['data']['bms_table']['soc'][i]['data'];
        if (socData['t'] === 0) { // 第一次计算
            socData['t'] = currentTime;
        } else {
            const I = Math.abs(iData['v']) > variableI ? iData['v'] : 0;
            const ah = I * (currentTime - socData['t']) / 3600000;
            let tempSoc = socData['v']
            if (socData['v'] > 90 && socData['v'] < 100 && I < 0) {
                const uDiff = cfg_data['data']['bms_table']['maxU'][i]['data']['v'] - cfg_data['data']['bms_table']['maxU'][i]['data']['hv']
                if (uDiff > 0) {
                    tempSoc = socData['v'] + (100-socData['v'])/(stopChargeU - cfg_data['data']['bms_table']['maxU'][i]['data']['v']) * (uDiff)
                }
            } else if (socData['v'] > 0 && socData['v'] < 10 && I > 0) {
                const uDiff = cfg_data['data']['bms_table']['minU'][i]['data']['hv'] - cfg_data['data']['bms_table']['minU'][i]['data']['v']
                if (uDiff > 0) {
                    tempSoc = socData['v'] - (socData['v'] - 0)/(cfg_data['data']['bms_table']['minU'][i]['data']['v'] - stopDischargeU) * (uDiff)
                }
            } else {
                tempSoc = socData['v'] - ah / capacity * 100;
            }
            if (tempSoc < 0 || cfg_data['data']['bms_table']['minU'][i] < stopDischargeU) {
                tempSoc = 0;
            } else if (tempSoc > 100 || cfg_data['data']['bms_table']['maxU'][i] < stopChargeU) { // 电池容量为280Ah，超出容量时，SOC为100
                tempSoc = 100;
            }
            socData['v'] = tempSoc;
            socData['t'] = currentTime;
            if (ah < 0) {
                cfg_data['data']['bms_table']['sumCharge'][i]['data']['v'] = cfg_data['data']['bms_table']['sumCharge'][i]['data']['v'] + Math.abs(ah);
                cfg_data['data']['bms_table']['sumCharge'][i]['data']['t'] = currentTime;
            } else {
                cfg_data['data']['bms_table']['sumDischarge'][i]['data']['v'] = cfg_data['data']['bms_table']['sumDischarge'][i]['data']['v'] + Math.abs(ah);
                cfg_data['data']['bms_table']['sumDischarge'][i]['data']['t'] = currentTime;
            }
        }
    }
    console.log("socData: ", JSON.stringify(cfg_data['data']['bms_table']['soc']))
}

// 计算soh
function computeSoh(cfg_data, temp_data) {
    const socArray = cfg_data['data']['bms_table']['soc'];
    const sohArray = cfg_data['data']['bms_table']['soh'];
    const sumChargeArray = cfg_data['data']['bms_table']['sumCharge'];
    const sumDischargeArray = cfg_data['data']['bms_table']['sumDischarge'];
    for (let i = 0; i < deviceSize; i++) {
        const I = cfg_data['data']['bms_table']['current'][i]['data']['v'];
        if (socArray[i]['data']['v'] === 100 && Math.abs(I) < variableI) {
            temp_data['soh'][i]['charge'] = sumChargeArray[i]['data']['v'];
            temp_data['soh'][i]['discharge'] = sumDischargeArray[i]['data']['v'];
            // console.log(`添加累计充电量=${temp_data['soh'][i]['charge']},添加累计放电量=${temp_data['soh'][i]['discharge']}`);
        } else if (socArray[i]['data']['v'] === 0 && Math.abs(I) < variableI) {
            const chargeEnergy = sumChargeArray[i]['data']['v'] - temp_data['soh'][i]['charge'];
            const dischargeEnergy = sumDischargeArray[i]['data']['v'] - temp_data['soh'][i]['discharge'];
            // console.log(`充电量=${chargeEnergy},放电量=${dischargeEnergy}`)
            // console.log(`添加累计充电量=${sumChargeArray[i]['data']['v']},添加累计放电量=${sumDischargeArray[i]['data']['v']}`);
            if (chargeEnergy < capacity * 0.05 && sumChargeArray[i]['data']['v'] > capacity * 0.05) {
                sohArray[i]['data']['v'] = (dischargeEnergy - chargeEnergy) > capacity ? 100 : (dischargeEnergy - chargeEnergy) / capacity * 100;
                sohArray[i]['data']['t'] = Date.now();
            }
        }
    }
    // console.log("sohData: ", JSON.stringify(cfg_data['data']['bms_table']['soh']));
}

// 计算充放电量
function computeChargeEnergy(cfg_data) {
    const vArray = cfg_data['data']['bms_table']['voltage'];
    const iArray = cfg_data['data']['bms_table']['current'];
    const currentTime = Date.now();
    let sumU = 0;
    for(let i = 0; i < deviceSize; i++) {
        const vData = vArray[i];
        const iData = iArray[i]['data'];
        const I = Math.abs(iData['v']) > variableI ? iData['v'] : 0;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const u = vData[j][k]['data']['v'];
                sumU += u;
            }
        }
        const interval = cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['t'] ===0 ? 0 : currentTime - cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['t'];
        const energy = sumU * Math.abs(I) * interval / 3600000
        I < 0 ? cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['v'] += energy : cfg_data['data']['bms_table']['sumDischargeEnergy'][i]['data']['v'] += energy;
        cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['t'] = currentTime;
        cfg_data['data']['bms_table']['sumDischargeEnergy'][i]['data']['t'] = currentTime;
    }
    //console.log("sumChargeEnergy: ", JSON.stringify(cfg_data['data']['bms_table']['sumChargeEnergy']));
    // console.log("sumDischargeEnergy: ", JSON.stringify(cfg_data['data']['bms_table']['sumDischargeEnergy']));
    // console.log("groupSumChargeEnergy: ", JSON.stringify(cfg_data['data']['bms_table']['groupSumChargeEnergy'][0]));
    // console.log("groupSumDischargeEnergy: ", JSON.stringify(cfg_data['data']['bms_table']['groupSumDischargeEnergy'][0]));

}

// 计算最大电压,最小电压，最高温低，最低温度
function computeMaxMin(cfg_data) {
    const vArray = cfg_data['data']['bms_table']['voltage'];
    const tArray = cfg_data['data']['bms_table']['temperature'];
    const maxUArray = cfg_data['data']['bms_table']['maxU'];
    const minUArray = cfg_data['data']['bms_table']['minU'];
    const maxTempArray = cfg_data['data']['bms_table']['maxTemp'];
    const minTempArray = cfg_data['data']['bms_table']['minTemp'];
    for(let i = 0; i < deviceSize; i++) {
        const vData = vArray[i];
        const tData = tArray[i];
        const maxUData = maxUArray[i]['data'];
        const minUData = minUArray[i]['data'];
        const maxTempData = maxTempArray[i]['data'];
        const minTempData = minTempArray[i]['data'];
        maxUData['hv'] = maxUData['v']
        minUData['hv'] = minUData['v']
        maxTempData['hv'] = maxTempData['v']
        minTempData['hv'] = minTempData['v']
        let maxU = 0;
        let minU = 10000;
        let maxTemp = 0;
        let minTemp = 10000;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const v = vData[j][k]['data']['v'];
                const t = tData[j][k]['data']['v'];
                if (v !== 0) {
                    if (v > maxU) {
                        maxU = v;
                    }
                    if (v < minU) {
                        minU = v;
                    }
                }
                if (t !== 0) {
                    if (t > maxTemp) {
                        maxTemp = t;
                    }
                    if (t < minTemp) {
                        minTemp = t;
                    }
                }
            }
        }
        maxUData['v'] = maxU;
        minUData['v'] = minU;
        maxTempData['v'] = maxTemp;
        minTempData['v'] = minTemp;
    }
    /*console.log("maxU: ", cfg_data['data']['bms_table']['maxU']);
    console.log("minU: ", cfg_data['data']['bms_table']['minU']);
    console.log("maxTemp: ", cfg_data['data']['bms_table']['maxTemp']);
    console.log("minTemp: ", cfg_data['data']['bms_table']['minTemp']);*/
}

// 获取停止充电电压阈值
function getStopChargeU() {
    return alertConfig.chargeOverU.threshold[0];
}

// 获取停止放电电压阈值
function getStopDischargeU() {
    return alertConfig.dischargeLowU.threshold[2];
}

// 获取簇继电器状态
function getRelayStatus(cfg_data,deviceIndex) {
    return (cfg_data['data']['bms_table']['relay'][deviceIndex]['data']['v'] === 1 || cfg_data['data']['bms_table']['preRelay'][deviceIndex]['data']['v'] === 1)
    && cfg_data['data']['bms_table']['negativeRelay'][deviceIndex]['data']['v'] === 1;
}

// 获取充放电状态0-停止，1-充电，2-放电
function getChargeStatus(cfg_data,deviceIndex) {
    const I = cfg_data['data']['bms_table']['current'][deviceIndex]['data']['v']
    let status = 0;
    if (I < -variableI) {
        status = 1
    } else if (I > variableI) {
        status = 2
    }
    return status;
}

// 告警计算-整组温度不均
function tempDiffCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['bms_table']['temperature'];

    for(let i = 0; i < deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMax = -65535;
        let tempMin = 65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMax = value > tempMax ? value : tempMax;
                tempMin = value < tempMin ? value : tempMin;
            }
        }
        const tempDiff = tempMax - tempMin;
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`tempDiff:${tempDiff}`);
        // 三级告警计算
        tempDiffComputeOne(i, tempDiff, status, relayStatus, 5000);
        tempDiffComputeTwo(i, tempDiff, status, relayStatus, 5000);
        tempDiffComputeThree(i, tempDiff, status, relayStatus, 5000);
    }

    //console.log("tempDiff: ", cfg_data['data']['bms_table']['alert'][0].slice(0,3));

    function tempDiffComputeOne(deviceIndex, tempDiff, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('tempDiffOne')) temp_data['alert'][deviceIndex]['tempDiffOne'] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && tempDiff > alertConfig.tempDiff.threshold[0]) {
            if (temp_data['alert'][deviceIndex]['tempDiffOne']['v'] === 0) {
                temp_data['alert'][deviceIndex]['tempDiffOne']['v'] = 1;
                temp_data['alert'][deviceIndex]['tempDiffOne']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['tempDiffOne']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['tempDiffOne']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[0]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[0]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[0]]['data']['t'] = temp_data['alert'][deviceIndex]['tempDiffOne']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['tempDiffOne']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempDiff < 17) {
            temp_data['alert'][deviceIndex]['tempDiffOne']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[0]]['data']['v'] = 0;
        }
    }
    function tempDiffComputeTwo(deviceIndex, tempDiff, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('tempDiffTwo')) temp_data['alert'][deviceIndex]['tempDiffTwo'] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && tempDiff > alertConfig.tempDiff.threshold[1]) {
            if (temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] === 0) {
                temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] = 1;
                temp_data['alert'][deviceIndex]['tempDiffTwo']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['tempDiffTwo']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[1]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[1]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[1]]['data']['t'] = temp_data['alert'][deviceIndex]['tempDiffTwo']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempDiff < 13) {
            temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[1]]['data']['v'] = 0;
        }
    }
    function tempDiffComputeThree(deviceIndex, tempDiff, status, relayStatus, interval) {
            if (!temp_data['alert'][deviceIndex].hasOwnProperty('tempDiffThree')) temp_data['alert'][deviceIndex]['tempDiffThree'] = {t:0,v:0};
            // 告警计算
            if (status !== 0 && tempDiff > alertConfig.tempDiff.threshold[2]) {
                if (temp_data['alert'][deviceIndex]['tempDiffThree']['v'] === 0) {
                    temp_data['alert'][deviceIndex]['tempDiffThree']['v'] = 1;
                    temp_data['alert'][deviceIndex]['tempDiffThree']['t'] = Date.now();

                } else if (temp_data['alert'][deviceIndex]['tempDiffThree']['v'] === 1) {
                    if (Date.now() - temp_data['alert'][deviceIndex]['tempDiffThree']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[2]]['data']['v'] !== 1) {
                        cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[2]]['data']['v'] = 1;
                        cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[2]]['data']['t'] = temp_data['alert'][deviceIndex]['tempDiffThree']['t'];
                    }
                }
            } else {
                temp_data['alert'][deviceIndex]['tempDiffThree']['v'] = 0;
            }
            // 告警清除
            if (relayStatus === 0 || tempDiff < 7) {
                temp_data['alert'][deviceIndex]['tempDiffThree']['v'] = 0;
                cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.tempDiff.index[2]]['data']['v'] = 0;
            }
        }



}

// 告警计算-充放电温度过高
function chargeOverTempCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['bms_table']['temperature'];

    for(let i = 0; i < deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMax = -65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMax = value > tempMax ? value : tempMax;
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`tempMax:${tempMax}`);
        // 三级告警计算
        chargeOverTempComputeOne(i, tempMax, status, relayStatus, 5000);
        chargeOverTempComputeTwo(i, tempMax, status, relayStatus, 5000);
        chargeOverTempComputeThree(i, tempMax, status, relayStatus, 5000);
    }

    // console.log("chargeOverTemp: ", cfg_data['data']['bms_table']['alert'][0].slice(3,6));

    function chargeOverTempComputeOne(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('chargeOverTempOne')) temp_data['alert'][deviceIndex]['chargeOverTempOne'] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && tempMax > alertConfig.chargeOverTemp.threshold[0]) {
            if (temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] === 0) {
                temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] = 1;
                temp_data['alert'][deviceIndex]['chargeOverTempOne']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['chargeOverTempOne']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[0]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[0]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[0]]['data']['t'] = temp_data['alert'][deviceIndex]['chargeOverTempOne']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 55) {
            temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[0]]['data']['v'] = 0;
        }
    }
    function chargeOverTempComputeTwo(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('chargeOverTempTwo')) temp_data['alert'][deviceIndex]['chargeOverTempTwo'] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && tempMax > alertConfig.chargeOverTemp.threshold[1]) {
            if (temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] === 0) {
                temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] = 1;
                temp_data['alert'][deviceIndex]['chargeOverTempTwo']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['chargeOverTempTwo']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[1]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[1]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[1]]['data']['t'] = temp_data['alert'][deviceIndex]['chargeOverTempTwo']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 50) {
            temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[1]]['data']['v'] = 0;
        }
    }
    function chargeOverTempComputeThree(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('chargeOverTempThree')) temp_data['alert'][deviceIndex]['chargeOverTempThree'] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && tempMax > alertConfig.chargeOverTemp.threshold[2]) {
            if (temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] === 0) {
                temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] = 1;
                temp_data['alert'][deviceIndex]['chargeOverTempThree']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['chargeOverTempThree']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[2]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[2]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[2]]['data']['t'] = temp_data['alert'][deviceIndex]['chargeOverTempThree']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 45) {
            temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.chargeOverTemp.index[2]]['data']['v'] = 0;
        }
    }



}

// 告警计算-静置温度过高
function stopOverTempCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['bms_table']['temperature'];

    for(let i = 0; i < deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMax = -65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMax = value > tempMax ? value : tempMax;
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`tempMax:${tempMax}`);
        // 三级告警计算
        stopOverTempComputeOne(i, tempMax, status, relayStatus, 4000);
    }

    // console.log("chargeOverTemp: ", cfg_data['data']['bms_table']['alert'][0].slice(6,9));

    function stopOverTempComputeOne(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('stopOverTempOne')) temp_data['alert'][deviceIndex]['stopOverTempOne'] = {t:0,v:0};
        // 告警计算
        if (status === 0 && tempMax > alertConfig.stopOverTemp.threshold[0]) {
            if (temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] === 0) {
                temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] = 1;
                temp_data['alert'][deviceIndex]['stopOverTempOne']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['stopOverTempOne']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.stopOverTemp.index[0]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.stopOverTemp.index[0]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.stopOverTemp.index[0]]['data']['t'] = temp_data['alert'][deviceIndex]['stopOverTempOne']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 55) {
            temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][alertConfig.stopOverTemp.index[0]]['data']['v'] = 0;
        }
    }


}

// 告警计算-充放电总压过高
function chargeOverSumUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        chargeOverSumUComputeOne(i, sumU, status, relayStatus, 1000);
        chargeOverSumUComputeTwo(i, sumU, status, relayStatus, 5000);
        chargeOverSumUComputeThree(i, sumU, status, relayStatus, 5000);
    }

    // console.log("chargeOverSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(9,12));

    function chargeOverSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeOverSumUOne';
        const index = alertConfig.chargeOverSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && sumU > alertConfig.chargeOverSumU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU < 318) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeOverSumUComputeTwo(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeOverSumUTwo';
        const index = alertConfig.chargeOverSumU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && sumU > alertConfig.chargeOverSumU.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU < 310) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeOverSumUComputeThree(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeOverSumUThree';
        const index = alertConfig.chargeOverSumU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && sumU > alertConfig.chargeOverSumU.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU < 300) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-静置总压过高
function stopOverSumUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        stopOverSumUComputeOne(i, sumU, status, relayStatus, 5000);

    }

    // console.log("stopOverSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(12,15));

    function stopOverSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'stopOverSumUOne';
        const index = alertConfig.stopOverSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 0 && sumU > alertConfig.stopOverSumU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU < 310) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }


}

// 告警计算-充放电总压过低
function chargeLowSumUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        chargeLowSumUComputeOne(i, sumU, status, relayStatus, 1000);
        chargeLowSumUComputeTwo(i, sumU, status, relayStatus, 5000);
        chargeLowSumUComputeThree(i, sumU, status, relayStatus, 5000);
    }

    // console.log("chargeLowSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(15,18));

    function chargeLowSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeLowSumUOne';
        const index = alertConfig.chargeLowSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && sumU < alertConfig.chargeLowSumU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU >= alertConfig.chargeLowSumU.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeLowSumUComputeTwo(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeLowSumUTwo';
        const index = alertConfig.chargeLowSumU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && sumU < alertConfig.chargeLowSumU.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU >= alertConfig.chargeLowSumU.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeLowSumUComputeThree(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeLowSumUThree';
        const index = alertConfig.chargeLowSumU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 0 && sumU < alertConfig.chargeLowSumU.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU >= alertConfig.chargeLowSumU.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-静置总压过低
function stopLowSumUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        stopLowSumUComputeOne(i, sumU, status, relayStatus, 5000);
    }

    // console.log("stopLowSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(18,21));

    function stopLowSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'stopLowSumUOne';
        const index = alertConfig.stopLowSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 0 && sumU < alertConfig.stopLowSumU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || sumU >= alertConfig.stopLowSumU.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }


}

// 告警计算-放电SOC过低
function dischargeLowSocCompute(cfg_data, temp_data) {
    const socArray = cfg_data['data']['bms_table']['soc'];

    for(let i = 0; i < deviceSize; i++) {
        const soc = socArray[i]['data']['v'];
        const status = getChargeStatus(cfg_data, i);
        // 三级告警计算
        dischargeLowSocComputeOne(i, soc, status, 3000);
        dischargeLowSocComputeTwo(i, soc, status, 3000);
        dischargeLowSocComputeThree(i, soc, status, 3000);
    }

    //console.log("dischargeLowSoc: ", cfg_data['data']['bms_table']['alert'][0].slice(21,24));

    function dischargeLowSocComputeOne(deviceIndex, soc, status, interval) {
        const key = 'dischargeLowSocOne';
        const index = alertConfig.dischargeLowSoc.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 2 && soc < alertConfig.dischargeLowSoc.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc > 10) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowSocComputeTwo(deviceIndex, soc, status, interval) {
        const key = 'dischargeLowSocTwo';
        const index = alertConfig.dischargeLowSoc.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 2 && soc < alertConfig.dischargeLowSoc.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc > 20) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowSocComputeThree(deviceIndex, soc, status, interval) {
        const key = 'dischargeLowSocThree';
        const index = alertConfig.dischargeLowSoc.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 2 && soc < alertConfig.dischargeLowSoc.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc > 25) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-充电SOC过低
function chargeLowSocCompute(cfg_data, temp_data) {
    const socArray = cfg_data['data']['bms_table']['soc'];

    for(let i = 0; i < deviceSize; i++) {
        const soc = socArray[i]['data']['v'];
        const status = getChargeStatus(cfg_data, i);
        // 三级告警计算
        chargeLowSocComputeThree(i, soc, status, 3000);
    }

    // console.log("chargeLowSoc: ", cfg_data['data']['bms_table']['alert'][0].slice(24,27));

    function chargeLowSocComputeThree(deviceIndex, soc, status, interval) {
        const key = 'chargeLowSocThree';
        const index = alertConfig.chargeLowSoc.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 1 && soc < alertConfig.chargeLowSoc.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc > 25) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-放电单体电压过高
function dischargeOverUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let uMax = -65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMax = value > uMax ? value : uMax;
            }
        }
        // console.log(`uMax:${uMax}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // 三级告警计算
        dischargeOverUComputeOne(i, uMax, status, relayStatus, 5000);
        dischargeOverUComputeTwo(i, uMax, status, relayStatus, 5000);
    }

    // console.log("dischargeOverU: ", cfg_data['data']['bms_table']['alert'][0].slice(27,30));

    function dischargeOverUComputeOne(deviceIndex, uMax, status, relayStatus, interval) {
        const key = 'dischargeOverUOne';
        const index = alertConfig.dischargeOverU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 1 && uMax > alertConfig.dischargeOverU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMax <= 3.6) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeOverUComputeTwo(deviceIndex, uMax, status, relayStatus, interval) {
        const key = 'dischargeOverUTwo';
        const index = alertConfig.dischargeOverU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 1 && uMax > alertConfig.dischargeOverU.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMax <= 3.55) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-充电单体电压过高
function chargeOverUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let uMax = -65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMax = value > uMax ? value : uMax;
            }
        }
        // console.log(`uMax:${uMax}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // 三级告警计算
        chargeOverUComputeOne(i, uMax, status, relayStatus, 1000);
    }

    // console.log("chargeOverU: ", cfg_data['data']['bms_table']['alert'][0].slice(30,33));

    function chargeOverUComputeOne(deviceIndex, uMax, status, relayStatus, interval) {
        const key = 'chargeOverUOne';
        const index = alertConfig.chargeOverU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 1 && uMax > alertConfig.chargeOverU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMax <= 3.6) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }

}

// 告警计算-放电单体电压过低
function dischargeLowUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let uMin = 65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMin = value < uMin ? value : uMin;
            }
        }
        // console.log(`uMin:${uMin}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // 三级告警计算
        dischargeLowUComputeOne(i, uMin, status, relayStatus, 10000);
        dischargeLowUComputeTwo(i, uMin, status, relayStatus, 10000);
        dischargeLowUComputeThree(i, uMin, status, relayStatus, 10000);
    }

    // console.log("dischargeLowU: ", cfg_data['data']['bms_table']['alert'][0].slice(33,36));

    function dischargeLowUComputeOne(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'dischargeLowUOne';
        const index = alertConfig.dischargeLowU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 1 && uMin <= alertConfig.dischargeLowU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMin > alertConfig.dischargeLowU.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowUComputeTwo(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'dischargeLowUTwo';
        const index = alertConfig.dischargeLowU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 1 && uMin <= alertConfig.dischargeLowU.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMin > alertConfig.dischargeLowU.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowUComputeThree(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'dischargeLowUThree';
        const index = alertConfig.dischargeLowU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status !== 1 && uMin <= alertConfig.dischargeLowU.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMin > alertConfig.dischargeLowU.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-充电单体电压过低
function chargeLowUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let uMin = 65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMin = value < uMin ? value : uMin;
            }
        }
        // console.log(`uMin:${uMin}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // 三级告警计算
        chargeLowUComputeOne(i, uMin, status, relayStatus, 5000);
        chargeLowUComputeThree(i, uMin, status, relayStatus, 10000);
    }

    // console.log("dischargeLowU: ", cfg_data['data']['bms_table']['alert'][0].slice(36,39));

    function chargeLowUComputeOne(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'chargeLowUOne';
        const index = alertConfig.chargeLowU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 1 && uMin < alertConfig.chargeLowU.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMin > 2.1) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeLowUComputeThree(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'chargeLowUThree';
        const index = alertConfig.chargeLowU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 1 && uMin < alertConfig.chargeLowU.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || uMin > 2.9) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-SOC过高
function overSocCompute(cfg_data, temp_data) {
    const socArray = cfg_data['data']['bms_table']['soc'];
    for(let i = 0; i < deviceSize; i++) {
        const soc = socArray[i]['data']['v'];
        const status = getChargeStatus(cfg_data, i);
        // 三级告警计算
        overSocComputeOne(i, soc, status, 3000);
        overSocComputeTwo(i, soc, status, 3000);
        overSocComputeThree(i, soc, status, 3000);
    }

    // console.log("overSoc: ", cfg_data['data']['bms_table']['alert'][0].slice(39,42));

    function overSocComputeOne(deviceIndex, soc, status, interval) {
        const key = 'overSocOne';
        const index = alertConfig.overSoc.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (soc >= alertConfig.overSoc.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc < alertConfig.overSoc.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overSocComputeTwo(deviceIndex, soc, status, interval) {
        const key = 'overSocTwo';
        const index = alertConfig.overSoc.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (soc >= alertConfig.overSoc.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc < alertConfig.overSoc.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overSocComputeThree(deviceIndex, soc, status, interval) {
        const key = 'overSocThree';
        const index = alertConfig.overSoc.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (soc >= alertConfig.overSoc.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (soc < alertConfig.overSoc.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-SOC跳变
function socJumpCompute(cfg_data, temp_data) {
    const socArray = cfg_data['data']['bms_table']['soc'];
    const cacheInterval = 10 * 1000;
    for(let i = 0; i < deviceSize; i++) {
        const soc = socArray[i]['data']['v'];
        temp_data['socJump'][i].push({t: Date.now(), v: soc});
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log('缓存长度=',temp_data['socJump'][i].length);
        // 三级告警计算
        socJumpComputeThree(i, soc, status, relayStatus, 5000);
        // 清除数据,只缓存cacheInterval时长的数据
        for (let k = 0; k < temp_data['socJump'][i].length; k++) {
            if (Date.now() - temp_data['socJump'][i][k]['t'] > cacheInterval) {
                temp_data['socJump'][i].splice(k, 1);
                k--;
            }
        }
    }

    // console.log("socJump: ", cfg_data['data']['bms_table']['alert'][0].slice(42,45));

    function socJumpComputeThree(deviceIndex, soc, status, relayStatus, interval) {
        if (status === 0) return;
        const index = alertConfig.socJump.index[2];
        // 告警计算
        for (let k = 0; k < temp_data['socJump'][deviceIndex].length; k++) {
            const data = temp_data['socJump'][deviceIndex][k];
            if (Date.now() - data['t'] <= interval && Math.abs(data['v'] - soc) >= alertConfig.socJump.threshold[2]) {
                cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = Date.now();
                break;
            }
        }
        // 告警清除
        if (relayStatus === 0) {
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-整组电压不均
function uDiffCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['bms_table']['voltage'];

    for(let i = 0; i < deviceSize; i++) {
        const uData = uArray[i];
        let uMax = -65535;
        let uMin = 65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMax = value > uMax ? value : uMax;
                uMin = value < uMin ? value : uMin;
            }
        }
        const uDiff = (uMax - uMin) * 1000;
        // console.log(`uDiff:${uDiff}`);
        // 三级告警计算
        uDiffComputeOne(i, uDiff, 5000);
        uDiffComputeTwo(i, uDiff, 5000);
        uDiffComputeThree(i, uDiff, 5000);
    }

    //console.log("uDiff: ", cfg_data['data']['bms_table']['alert'][0].slice(0,3));

    function uDiffComputeOne(deviceIndex, uDiff, interval) {
        const key = 'uDiffOne';
        const index = alertConfig.uDiff.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (uDiff > alertConfig.uDiff.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (uDiff < 680) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function uDiffComputeTwo(deviceIndex, uDiff, interval) {
        const key = 'uDiffTwo';
        const index = alertConfig.uDiff.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (uDiff > alertConfig.uDiff.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (uDiff < 480) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function uDiffComputeThree(deviceIndex, uDiff, interval) {
        const key = 'uDiffThree';
        const index = alertConfig.uDiff.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (uDiff > alertConfig.uDiff.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (uDiff < 280) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 充放电电流过高
function overICompute(cfg_data, temp_data) {
    const iArray = cfg_data['data']['bms_table']['current'];

    for(let i = 0; i < deviceSize; i++) {
        const iValue = Math.abs(iArray[i]['data']['v']);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`uDiff:${uDiff}`);
        // 三级告警计算
        overIComputeOne(i, iValue, relayStatus, 5000);
        overIComputeTwo(i, iValue, relayStatus, 10000);
        overIComputeThree(i, iValue, relayStatus, 10000);
    }

    //console.log("uDiff: ", cfg_data['data']['bms_table']['alert'][0].slice(0,3));

    function overIComputeOne(deviceIndex, iValue, relayStatus, interval) {
        const key = 'overIOne';
        const index = alertConfig.overI.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (iValue > iMax * alertConfig.overI.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overIComputeTwo(deviceIndex, iValue, relayStatus, interval) {
        const key = 'overITwo';
        const index = alertConfig.overI.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (iValue > iMax *alertConfig.overI.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || iValue < iMax * 1.1) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overIComputeThree(deviceIndex, iValue, relayStatus, interval) {
        const key = 'overIThree';
        const index = alertConfig.overI.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (iValue > iMax * alertConfig.overI.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || iValue < iMax * 1.05) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-充电和放电温度过低
function chargeLowTempCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['bms_table']['temperature'];

    for(let i = 0; i < deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMin = 65535;
        for (let j = 0; j < packSize; j++) {
            for (let k = 0; k < coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMin = value < tempMin ? value : tempMin;
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data,i);
        // console.log(`tempMin:${tempMin}`);
        // 三级告警计算
        chargeLowTempComputeOne(i, tempMin, status, relayStatus, 5000);
        dischargeLowTempComputeOne(i, tempMin, status, relayStatus, 5000);
        dischargeLowTempComputeTwo(i, tempMin, status, relayStatus, 5000);
        dischargeLowTempComputeThree(i, tempMin, status, relayStatus, 5000);
    }

    // console.log("chargeLowTemp: ", cfg_data['data']['bms_table']['alert'][0].slice(54,57));

    function chargeLowTempComputeOne(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'chargeLowTempOne';
        const index = alertConfig.chargeLowTemp.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 1 && tempMin < alertConfig.chargeLowTemp.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMin >= alertConfig.chargeLowTemp.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowTempComputeOne(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'dischargeLowTempOne';
        const index = alertConfig.dischargeLowTemp.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 2 && tempMin < alertConfig.dischargeLowTemp.threshold[0]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMin >= alertConfig.dischargeLowTemp.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowTempComputeTwo(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'dischargeLowTempTwo';
        const index = alertConfig.dischargeLowTemp.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 2 && tempMin < alertConfig.dischargeLowTemp.threshold[1]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMin >= alertConfig.dischargeLowTemp.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowTempComputeThree(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'dischargeLowTempThree';
        const index = alertConfig.dischargeLowTemp.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = {t:0,v:0};
        // 告警计算
        if (status === 2 && tempMin < alertConfig.dischargeLowTemp.threshold[2]) {
            if (temp_data['alert'][deviceIndex][key]['v'] === 0) {
                temp_data['alert'][deviceIndex][key]['v'] = 1;
                temp_data['alert'][deviceIndex][key]['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex][key]['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex][key]['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['t'] = temp_data['alert'][deviceIndex][key]['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMin >= alertConfig.dischargeLowTemp.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }

}

// ================================================================
// =====                     数据编码                         =====
// ================================================================

const columns = {
    device_no: "Int32",
    data_time: "DateTimeP(1)",
    voltage: "Array(Array(Float32,2),88)",
    temperature: "Array(Array(Float32,2),88)",
    i: "Float32",
    soc: "Float32",
    soh: "Float32",
    sum_charge: "Float32",
    sum_discharge: "Float32",
    sum_charge_energy: "Float32",
    sum_discharge_energy: "Float32",
    group_sum_charge_energy: "Array(Float32,88)",
    group_sum_discharge_energy: "Array(Float32,88)",
    max_u: "Float32",
    min_u: "Float32",
    max_temp: "Float32",
    min_temp: "Float32",
    relay: "Int8",
    pre_relay: "Int8",
    alert: "Array(Int8,60)",
    status: "Array(Array(Int8,2),88)"
}

const dataSize = {
    int8: 1,
    int16: 2,
    int32: 4,
    int64: 8,
    float32: 4,
    float64: 8,
    string: 128,
    fixedstring: 128,
    datetime: 4,
    datetimep: 8
}


const toHexString = bytes =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');


function getSourceData(cfg_data) {
    console.log("1111111");
    const sourceData = {};
    sourceData.device_no = 1;
    sourceData.data_time = Date.now();
    sourceData.i = cfg_data['data']['bms_table']['current'][0]['data']['v'];
    sourceData.soc = cfg_data['data']['bms_table']['soc'][0]['data']['v'];
    sourceData.soh = cfg_data['data']['bms_table']['soh'][0]['data']['v'];
    sourceData.sum_charge = cfg_data['data']['bms_table']['sumCharge'][0]['data']['v'];
    sourceData.sum_discharge = cfg_data['data']['bms_table']['sumDischarge'][0]['data']['v'];
    sourceData.sum_charge_energy = cfg_data['data']['bms_table']['sumChargeEnergy'][0]['data']['v'];
    sourceData.sum_discharge_energy = cfg_data['data']['bms_table']['sumDischargeEnergy'][0]['data']['v'];
    sourceData.max_u = cfg_data['data']['bms_table']['maxU'][0]['data']['v'];
    sourceData.min_u = cfg_data['data']['bms_table']['minU'][0]['data']['v'];
    sourceData.max_temp = cfg_data['data']['bms_table']['maxTemp'][0]['data']['v'];
    sourceData.min_temp = cfg_data['data']['bms_table']['minTemp'][0]['data']['v'];
    sourceData.relay = cfg_data['data']['bms_table']['relay'][0]['data']['v'];
    sourceData.pre_relay = cfg_data['data']['bms_table']['preRelay'][0]['data']['v'];
    sourceData.voltage = [];
    sourceData.temperature = [];
    sourceData.group_sum_charge_energy = [];
    sourceData.group_sum_discharge_energy = [];
    sourceData.alert = [];
    sourceData.status = [];

    console.log("1111111");

    for (let i = 0; i < packSize ; i++) {
        sourceData.voltage.push([]);
        sourceData.temperature.push([]);
        sourceData.status.push([]);
        sourceData.group_sum_charge_energy.push(cfg_data['data']['bms_table']['groupSumChargeEnergy'][0][i]['data']['v']);
        sourceData.group_sum_discharge_energy.push(cfg_data['data']['bms_table']['groupSumDischargeEnergy'][0][i]['data']['v']);
        for (let j = 0; j < coreSize ; j++) {
            sourceData.voltage[i].push(cfg_data['data']['bms_table']['voltage'][0][i][j]['data']['v']);
            sourceData.temperature[i].push(cfg_data['data']['bms_table']['temperature'][0][i][j]['data']['v']);
            sourceData.status[i].push(cfg_data['data']['bms_table']['status'][0][i][j]['data']['v']);
        }
    }

    console.log("2222222");

    for (let i = 0; i < cfg_data['data']['bms_table']['alert'][0].length ; i++) {
        sourceData.alert.push(cfg_data['data']['bms_table']['alert'][0][i]['data']['v']);
    }

    console.log("33333333");

    return sourceData;
}


function codeData(cfg_data) {
    // console.log(toHexString(code(getSourceData(cfg_data))))
    return code(getSourceData(cfg_data));
}


function code(sourceData) {
    const bytesList = [];
    // 定义数组大小
    let size = 0;
    for (let fieldName in columns) {
        if (columns[fieldName].toLowerCase().includes('array')) {
            const arr = columns[fieldName].toLowerCase().replaceAll('array', '').replaceAll('(', '').replaceAll(')', '').split(',');
            const elementType = arr[0];
            const byteSize = dataSize[elementType];
            const indexArr = new Array(arr.length - 1);
            let arraySize = 0; // 数组压平后的的元素个数
            const levelMap = {}; // 每一层的数量,最里面为第一层
            for (let i = 1; i < arr.length; i++) {
                const indexSize = parseInt(arr[i]);
                arraySize = arraySize === 0 ? indexSize : indexSize * arraySize;
                indexArr[i - 1] = indexSize;
                levelMap[i] = indexSize;
            }
            // 递归解析数组数据
            const data = [];
            getElementList(sourceData[fieldName], data, levelMap, arr.length - 1, fieldName);

            // 获取存放byte数组大小
            let storeSize = 0;
            for(let i = 0; i < data.length; i++) {
                storeSize += data[i]['isLen'] ? 1 : byteSize
            }

            // 转为byte数组
            const bytes = new Uint8Array(storeSize);
            let startIndex = 0;
            for(let i = 0; i < data.length; i++) {
                if (data[i]['isLen']) {
                    bytes[startIndex] = data[i]['data'];
                    startIndex += 1;
                } else {
                    if (elementType === "int8") {
                        bytes[startIndex] = data[i]['data'];
                        startIndex += 1;
                    } else if (elementType === "int16") {
                        const tempBytes = shortToByte(data[i]['data']);
                        fill(bytes, tempBytes, startIndex);
                        startIndex += tempBytes.length;
                    } else if (elementType === "int32") {
                        const tempBytes = intToByte(data[i]['data']);
                        fill(bytes, tempBytes, startIndex);
                        startIndex += tempBytes.length;
                    } else if (elementType === "int64") {
                        const tempBytes = longToByte(data[i]['data']);
                        fill(bytes, tempBytes, startIndex);
                        startIndex += tempBytes.length;
                    } else if (elementType === "float32") {
                        const tempBytes = floatToByte(data[i]['data']);
                        fill(bytes, tempBytes, startIndex);
                        startIndex += tempBytes.length;
                    } else if (elementType === "float64") {
                        const tempBytes = doubleToByte(data[i]['data']);
                        fill(bytes, tempBytes, startIndex);
                        startIndex += tempBytes.length;
                    } else if (elementType === "datetime") {
                        const tempBytes = intToByte(data[i]['data']);
                        fill(bytes, tempBytes, startIndex);
                        startIndex += tempBytes.length;
                    }
                }
            }
            bytesList.push(bytes);
        } else {
            const byteSize = dataSize[columns[fieldName].replaceAll('(128)','').toLowerCase()];
            let bytes = [];
            if (columns[fieldName].toLowerCase() === 'int8') {
                bytes = new Uint8Array(1);
                bytes[0] = sourceData[fieldName];
            } else if (columns[fieldName].toLowerCase() === 'int16') {
                bytes = shortToByte(sourceData[fieldName]);
            } else if (columns[fieldName].toLowerCase() === 'int32') {
                bytes = intToByte(sourceData[fieldName]);
            } else if (columns[fieldName].toLowerCase() === 'int64') {
                bytes = longToByte(sourceData[fieldName]);
            } else if (columns[fieldName].toLowerCase() === 'float32') {
                bytes = floatToByte(sourceData[fieldName]);
            } else if (columns[fieldName].toLowerCase() === 'float64') {
                bytes = doubleToByte(sourceData[fieldName]);
            } else if (columns[fieldName].toLowerCase().includes('fixedstring')) {
                const sizeStr = columns[fieldName].toLowerCase().replaceAll('fixedstring(', '').replaceAll(')', '');
                const charSize = parseInt(sizeStr);
                const encoder = new TextEncoder();
                const chars =  encoder.encode(sourceData[fieldName]);
                bytes = new Uint8Array(charSize);
                for (let i = 0; i < chars.length; i++) {
                    bytes[i] = chars[i];
                }
            } else if (columns[fieldName].toLowerCase().includes("string")) {
                const encoder = new TextEncoder();
                const chars =  encoder.encode(sourceData[fieldName]);
                bytes = new Uint8Array[chars.length + 1];
                bytes[0] = chars.length;
                for (let i = 0; i < chars.length; i++) {
                    bytes[i+1] = chars[i];
                }
            } else if (columns[fieldName].toLowerCase() === 'datetime') {
                bytes = intToByte(sourceData[fieldName]);
            } else if (columns[fieldName].toLowerCase().includes("datetimep")) {
                bytes = longToByte(sourceData[fieldName]);
            }
            bytesList.push(bytes);
        }
    }

    // 封装成byte数组
    for (let i = 0; i < bytesList.length; i++) {
        size += bytesList[i].length;
    }
    const result = new Uint8Array(size);
    let startIndex = 0;

    for (let i = 0; i < bytesList.length; i++) {
        fill(result,  bytesList[i], startIndex);
        startIndex += bytesList[i].length;
    }
    return result;

}


// 填充数据
function fill(bytes, tempBytes, startIndex) {
    for (let i = 0; i < tempBytes.length; i++) {
        bytes[startIndex + i] = tempBytes[i];
    }
}

function getElementList(node, data, levelMap, level, fieldName) {

    if (level === 0) {
        return;
    }
    data.push({data: node.length, isLen: 1});
    for (let i = 0; i < levelMap[level]; i++) {
        const jsonNode = node[i];
        if (jsonNode instanceof Array) {
            getElementList(jsonNode, data, levelMap,level - 1, fieldName);
        } else {
            data.push({data: jsonNode, isLen: 0});
        }
    }

}


// short 转字节数组
function shortToByte(value) {
    let bytes = new Uint8Array(2);
    bytes[0] = value & 0xff;
    bytes[1] = (value >> 8) & 0xff;
    return bytes;
}

// int 转字节数组
function intToByte(value) {
    let bytes = new Uint8Array(4);
    bytes[0] = value & 0xff;
    bytes[1] = (value >> 8) & 0xff;
    bytes[2] = (value >> 16) & 0xff;
    bytes[3] = (value >> 24) & 0xff;
    return bytes;
}

// long 转字节数组
function longToByte(value) {
    const val = BigInt(value);
    let bytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
        bytes[i] = Number((val >> BigInt(i * 8)) & BigInt(0xff));
    }
    return bytes;
}

// float 转字节数组
function floatToByte(value) {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);
    dataView.setFloat32(0, value);
    const intBits = dataView.getUint32(0);

    const bytes = [];
    for (let i = 0; i < 4; i++) {
        bytes.push((intBits >> (i * 8)) & 0xFF);
    }
    return bytes;
}

// double 转字节数组
function doubleToByte(value) {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);
    dataView.setFloat64(0, value);
    const intBits = dataView.getUint32(0, true) + (dataView.getUint32(4, true) << 32);

    const bytes = [];
    for (let i = 0; i < 8; i++) {
        bytes.push((intBits >> (i * 8)) & 0xFF);
    }
    return bytes;
}


// ================================================================
// =====                      控制相关                        =====
// ================================================================
// p的单位为kw,action1为充电，2为放电,0为停止，mode为1表示手动模式，2表示自动模式

const minSoc =  5;
const maxSoc = 98;
let lastChangePTime = new Date();
let lastCheckTime = new Date();
const pChangeInterval = 1000 * 10; // 10秒
const chargeStartPInterval = 5; // 5kw
const chargeStopPInterval = 10; // 10kw
const stopChargeAlertIndexArr = [1,2,3,4,5,6,7,8,9,10,11,16,17,31,32,33,34,35,36,37,38,39,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60
]; // 停止充放电的警报索引数组

const rackAlertConfig = {
    1: {name: '整组温度不均一级告警', level: 1},
    2: {name: '整组温度不均二级告警', level: 2},
    3: {name: '整组温度不均三级告警', level: 3},
    10: {name: '充放电总压过高一级告警', level: 1},
    11: {name: '充放电总压过高二级告警', level: 2},
    12: {name: '充放电总压过高三级告警', level: 3},
    13: {name: '静置总压过高一级告警', level: 1},
    14: {name: '静置总压过高二级告警', level: 2},
    15: {name: '静置总压过高三级告警', level: 3},
    16: {name: '充放电总压过低一级告警', level: 1},
    17: {name: '充放电总压过低二级告警', level: 2},
    18: {name: '充放电总压过低三级告警', level: 3},
    19: {name: '静置总压过低一级告警', level: 1},
    20: {name: '静置总压过低二级告警', level: 2},
    21: {name: '静置总压过低三级告警', level: 3},
    22: {name: '放电SOC过低一级告警', level: 1},
    23: {name: '放电SOC过低二级告警', level: 2},
    24: {name: '放电SOC过低三级告警', level: 3},
    25: {name: '充电SOC过低一级告警', level: 1},
    26: {name: '充电SOC过低二级告警', level: 2},
    27: {name: '充电SOC过低三级告警', level: 3},
    40: {name: 'SOC过高一级告警', level: 1},
    41: {name: 'SOC过高二级告警', level: 2},
    42: {name: 'SOC过高三级告警', level: 3},
    43: {name: 'SOC跳变一级告警', level: 1},
    44: {name: 'SOC跳变二级告警', level: 2},
    45: {name: 'SOC跳变三级告警', level: 3},
    46: {name: '整组电压不均一级告警', level: 1},
    47: {name: '整组电压不均二级告警', level: 2},
    48: {name: '整组电压不均三级告警', level: 3},
    49: {name: '放电电流过高一级告警', level: 1},
    50: {name: '放电电流过高二级告警', level: 2},
    51: {name: '放电电流过高三级告警', level: 3},
    58: {name: '充电电流过高一级告警', level: 1},
    59: {name: '充电电流过高二级告警', level: 2},
    60: {name: '充电电流过高三级告警', level: 3}
}

const cellAlertConfig = {
    4: {name: '充放电温度过高一级告警', level: 1},
    5: {name: '充放电温度过高二级告警', level: 2},
    6: {name: '充放电温度过高三级告警', level: 3},
    7: {name: '静置温度过高一级告警', level: 1},
    8: {name: '静置温度过高二级告警', level: 2},
    9: {name: '静置温度过高三级告警', level: 3},
    28: {name: '放电/静置单体电压过高一级告警', level: 1},
    29: {name: '放电/静置单体电压过高二级告警', level: 2},
    30: {name: '放电/静置单体电压过高三级告警', level: 3},
    31: {name: '充电单体电压过高一级告警', level: 1},
    32: {name: '充电单体电压过高二级告警', level: 2},
    33: {name: '充电单体电压过高三级告警', level: 3},
    34: {name: '放电/静置单体电压过低一级告警', level: 1},
    35: {name: '放电/静置单体电压过低二级告警', level: 2},
    36: {name: '放电/静置单体电压过低三级告警', level: 3},
    37: {name: '充电单体电压过低一级告警', level: 1},
    38: {name: '充电单体电压过低二级告警', level: 2},
    39: {name: '充电单体电压过低三级告警', level: 3},
    52: {name: '充电温度过低一级告警', level: 1},
    53: {name: '充电温度过低二级告警', level: 2},
    54: {name: '充电温度过低三级告警', level: 3},
    55: {name: '放电温度过低一级告警', level: 1},
    56: {name: '放电温度过低二级告警', level: 2},
    57: {name: '放电温度过低三级告警', level: 3}
}

const pcsAlertConfig = {
    1: {name: '母线电压异常', level: 1},
    2: {name: '自检异常', level: 1},
    3: {name: '锁相异常', level: 1},
    4: {name: '温度异常', level: 1},
    5: {name: '输出电流短路异常', level: 1},
    6: {name: '输出电流过流异常', level: 1},
    7: {name: '电网电压异常', level: 1},
    8: {name: '母线电压异常', level: 1},
    9: {name: '温度异常', level: 1},
    10: {name: '短路保护', level: 1},
    11: {name: '电流过流', level: 1},
    12: {name: '母线故障', level: 1},
    13: {name: '电池电压异常', level: 1},
    14: {name: '瞬时检测异常', level: 1},
    15: {name: 'C相电压异常', level: 1},
    16: {name: 'B相电压异常', level: 1},
    17: {name: 'A相电压异常', level: 1}
}

const airAlertConfig = {
    1: {name: '柜内温感故障', level: 1},
    2: {name: '柜内高温告警 ', level: 1},
    3: {name: '柜内低温告警', level: 1},
    4: {name: '柜外温感故障', level: 1},
    5: {name: '柜外高温告警', level: 1},
    6: {name: '柜外低温告警', level: 1},
    7: {name: '柜内湿感故障', level: 1},
    8: {name: '柜内高湿告警', level: 1},
    9: {name: '柜内低湿告警', level: 1},
    10: {name: '柜外湿感故障', level: 1},
    11: {name: '柜外高湿告警', level: 1},
    12: {name: '柜外低湿告警', level: 1},
    13: {name: '压缩机高压告警', level: 1},
    14: {name: '压缩机低压告警', level: 1},
    15: {name: '制冷失效告警', level: 1},
    16: {name: '制热失效告警', level: 1},
    17: {name: '内盘管温感故障', level: 1},
    18: {name: '内盘管低温告警', level: 1}
}

// 充放电参数初始化
function initChargeConfig(){
	const creatTableSql = 'create table if not exists chargeConfig(config TEXT)';
    db.query(creatTableSql);
    const configStr = db.query('select config from chargeConfig');
    if(!configStr){
        const insertSql = `insert into chargeConfig(config) values('${JSON.stringify(defaultChargeConfig)}')`;
        db.query(insertSql);
    }
    const querySql = 'select config from chargeConfig';
    const result =  db.query(querySql);
    chargeConfig = JSON.parse(result.split("\n")[1]);
}

// 保存充放电配置
function saveChargeConfig(){
	 const insertSql = `insert into chargeConfig(config) values('${JSON.stringify(chargeConfig)}')`;
     db.query(insertSql);
}

// 获取SOC值
function getSoc(cfg_data) {
    return cfg_data['data']['bms_table']['soc'][0]['data']['v'];
}

// 获取功率值
function getP(cfg_data) {
   return cfg_data['data']['pcs_table']['active_power'] / 1000;
}

// 获取pcs状态值,0-待机，1充电，2-放电，3-故障，4-停机
function getPcsStatus(cfg_data) {
    let status = 4;
    const p = getP(cfg_data);
    if (p > 0) {
        status = 1;
    } else if (p < 0) {
        status = 2;
    }
    if(cfg_data['data']['pcs_table']['running_status'] === 0) {
        status = 4;
    }
    if (cfg_data['data']['pcs_table']['running_status'] === 1) {
        status = 0;
    }
    return status;
}

// 获取bms状态值
function getBmsStatus(cfg_data) {
    const I = cfg_data['data']['bms_table']['current'][0]['data']['v']
    const relayStatus = getRelayStatus(cfg_data, 0);
    let status = 4;
    if (I < -variableI) {
        status = 1
    } else if (I > variableI) {
        status = 2
    } else if (relayStatus === 1) {
        status = 0;
    }
    if (relayStatus === 0) {
        status = 4;
    }
    return status;
}

// 打开pcs开关
function openPcs() {
    // 01-salveid 10-功能码 000F-寄存器地址 0001-寄存器数量 02-字节数 0001-寄存器值 67-L校验 6F-H校验
    //0x0110000F00010001
    console.log('openPcs');
    var str="0110000F0001020001676F";
    uart.write("/dev/ttyS4",str);
    uart.write("/dev/ttyS4","\n");
}

// 关闭pcs开关
function closePcs() {
    console.log('closePcs');
    var str="0110000F0001020002276E";
    uart.write("/dev/ttyS4",str);
    uart.write("/dev/ttyS4","\n");
}

// 打开pcs开关
function openBms() {
    console.log("openBms");
	//闭合继电器1
	socketcan.send("can0", "18A30127#8000000000000000");	
}

// 关闭pcs开关
function closeBms() {
	console.log("closeBms");
	//断开继电器1
    socketcan.send("can0", "18A30127#4000000000000000");
}

//整型转16精制串
function Int2Hex(intval)
{
    var str=Number(intval).toString(16);
    if(str.length == 1){
        return "000"+str;
    }else if(str.length == 2){
        return "00"+str;
    }else if(str.length == 3){
        return "0"+str;
    }
    
    return str;
}

function CRC16_MODBUS(buf,len)			//CRC16/modbus计算
{
	var crc = 0xffff;	//寄存器初始值	
	var i;
	var j;
	
	for(j=0;j<len;j++)
	{
		console.log('buf:',buf[j]);
		crc = crc ^ buf[j];
		
		for(i=0;i<8;i++)
		{
			if((crc & 0x0001) == 1)
			{
				crc >>= 1;
				crc ^= 0xa001;
			}
			else
			{
				crc >>= 1;
			}
		}
	}
/* 	 var bitLow= crc & 0x00ff;
	 var bitHight= (crc & 0xff00)>>8;
	 return [bitLow,bitHight]; */
	 
	 return crc;
}

// 设置pcs有功功率值
function setP(p) {
    const realP = Math.trunc(p) * 1000; // p的单位为kw, 转换为w
    // 01-salveid 10-功能码 0009-寄存器地址 0001-寄存器数量 02-字节数 Int2Hex-获取寄存器值16进制 6b-L校验 ac-H校验
    //console.log('setP:',relP);
	var realPHex=Int2Hex(realP);
	console.log('realPHex:',realPHex);
	var realPHexLow=realP & 0x00ff;
	var realPHexHigh=(realP & 0xff00)>>8;
	console.log('realPHexLow:',Int2Hex(realPHexLow)); 
	console.log('realPHexHigh:',Int2Hex(realPHexHigh)); 
	var str="01100009000102";
    var command_pre_array=[0x01,0x10,0x00,0x09,0x00,0x01,0x02];
	command_pre_array.splice(8,0,realPHexHigh);	
	command_pre_array.splice(9,0,realPHexLow);	
	
	var crc = CRC16_MODBUS(command_pre_array,9);
	console.log('crc:',crc);
/* 	console.log('crc_low:',crc[0]);
	console.log('crc_high:',crc[1]); */
	
    var command=str+Int2Hex(realP)+Int2Hex(crc);
	console.log('command:',command);
    uart.write("/dev/ttyS4",command);
    uart.write("/dev/ttyS4","\n");
}

// 停止充放电
function stopAction(cfg_data) {
    if (getP(cfg_data) !== 0) {
        setP(0);
    }
    if (getPcsStatus(cfg_data) !== 0 && getPcsStatus(cfg_data) !== 4) {
        closePcs();
    }
    if (getBmsStatus(cfg_data) !== 0) {
        closeBms();
    }

}

// 充电
function chargeAction(cfg_data, p) {
    if (getBmsStatus(cfg_data) === 0) {
        openBms();
    }
    if (getPcsStatus(cfg_data) === 0 || getPcsStatus(cfg_data) === 4) {
        openPcs();
    }
    if (getP(cfg_data) !== p) {
        setP(p)
    }

}

// 放电
function dischargeAction(cfg_data, p) {
    const realP = p * -1; // 实际放电功率为负值
    if (getBmsStatus(cfg_data) === 0) {
        openBms();
    }
    if (getPcsStatus(cfg_data) === 0 || getPcsStatus(cfg_data) === 4) {
        openPcs();
    }
    if (getP(cfg_data) !== realP){
        setP(realP);
    }
}


// 检测充放电状态
function checkChargeStatus(cfg_data) {
    let isAlert = 0;
    for (let i = 0; i < stopChargeAlertIndexArr.length; i++) {
        const index = stopChargeAlertIndexArr[i];
        const alert = cfg_data['data']['bms_table']['alert'][0][index - 1];
        if (alert['data']['v'] === 1) {
            stopAction(cfg_data);
            isAlert = 1;
            break;
        }
    }

    if (isAlert === 1) return;

    const enabled = chargeConfig['enabled'];
    const currentP = Math.abs(getP(cfg_data));
    const currentTime = new Date();
    if (enabled === 1) {
        const hour = currentTime.getHours();
        const actions = chargeConfig.actions;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const startHour = action['startHour'];
            const endHour = action['endHour'];
            if (hour >= startHour && hour < endHour) {
                const actionType = action['action'];
                const actionP = action['p'];
                if (actionType === 1 && getSoc(cfg_data) < maxSoc) {
                    let expectedP = currentP + chargeStartPInterval;
                    if (currentP < actionP && currentTime.getTime() - lastChangePTime.getTime() > pChangeInterval) {
                        expectedP = expectedP >= actionP ? actionP : expectedP;
                        chargeAction(cfg_data,expectedP);
                        lastChangePTime = currentTime;
                    }
                } else if (actionType === 2 && getSoc(cfg_data) > minSoc) {
                    dischargeAction(cfg_data,actionP);
                }
                break;
            } else if (lastCheckTime.getHours() < endHour && hour === endHour){
                stopAction(cfg_data);
            }
        }
    }

    if (getP(cfg_data) > 0 && getSoc(cfg_data) >= maxSoc - 3 && getSoc(cfg_data) < maxSoc &&  getSoc(cfg_data) < maxSoc && currentTime.getTime() - lastChangePTime.getTime() > pChangeInterval) {
        const expectedP = currentP - chargeStopPInterval;
        if (expectedP > 10){
            chargeAction(cfg_data,expectedP);
            lastChangePTime = currentTime;
        }
    }

    if ((getSoc(cfg_data) <= minSoc && getP(cfg_data) < 0) || (getSoc(cfg_data) >= maxSoc && getP(cfg_data) > 0)){
        stopAction(cfg_data);
    }

    lastCheckTime = currentTime;
}

// ================================================================
// =====                     	  接口                        =====
// ================================================================


// 获取控制配置
function getControlConfig(response) {
    response.data = chargeConfig;
}

// 手动执行充放电
function manualControl(config, response) {
    auth(config, response);
    if (response.code !== 200) return;
    const actionType = config['action'];
    if (actionType !== 0 && !config.hasOwnProperty('p')) {
        response.code = 500;
        response.msg = "p is required";
        return;
    }
    const currentP = Math.abs(getP(gdata["cfg"]));
    const currentTime =new Date();
    if (actionType === 1) {
        let expectedP = currentP + chargeStartPInterval;
        if (currentP < config['p'] && currentTime.getTime() - lastChangePTime.getTime() > pChangeInterval) {
            expectedP = expectedP >= config['p'] ? config['p'] : expectedP;
            chargeAction(gdata["cfg"],expectedP);
            lastChangePTime = currentTime;
        }
    } else if (actionType === 2) {
        dischargeAction(gdata["cfg"],config['p']);
    } else if (actionType === 0) {
        stopAction(gdata["cfg"]);
    }
}

// 改变充放电模式
function changeControlMode(config, response) {
    auth(config, response);
    if (response.code !== 200) return;
    if(!config.hasOwnProperty('enabled')) {
        response.code = 500;
        response.msg = "enabled is required";
        return;
    }
    if (Math.abs(getP(gdata["cfg"])) > 0 && getPcsStatus(gdata["cfg"]) === 1){
        response.code = 500;
        response.msg = "pcs is running, can not change config about auto, please stop pcs first";
    }
    if (config.hasOwnProperty('actions')){
        config.actions.sort(function(a, b) {
            return a.startHour - b.startHour;
        });
        for (let i = 0; i < config.actions.length - 1; i++) {
            const currentAction = config.actions[i];
            const nextAction = config.actions[i + 1];
            if (currentAction['endHour'] > 23 || nextAction['endHour'] > 23) {
                response.code = 500;
                response.msg = "auto action endHour should be 0 and 23, please check";
                return;
            }
            if (nextAction['startHour'] < currentAction['endHour']) {
                response.code = 500;
                response.msg = "auto mode actions time range has duplicate, please check";
                return;
            }
        }
        chargeConfig.enabled = config.enabled;
		chargeConfig.actions = config.actions;
        saveChargeConfig();
    } else {
        response.code = 500;
        response.msg = "actions is required";
    }
}

// 展示数据返回
function list(cfg_data, response) {
    const pcs = {};
    const rack = {};
    const pack = [];
    const commAlert = [];
    const pcsAlert = [];
    const rackAlert = [];
    const cellAlert = [];
    const airAlert = [];
    const fire = {};
    const alert = {commAlert: commAlert, pcsAlert: pcsAlert, rackAlert: rackAlert, cellAlert: cellAlert, airAlert: airAlert};
    response.data =  {pcs: pcs, rack: rack, pack: pack, alert: alert, fire: fire};

    // 簇级数据
    rack.u = 0;
    rack.i = Number(cfg_data['data']['bms_table']['current'][0]['data']['v'].toFixed(2));
    rack.soc = Number(getSoc(cfg_data).toFixed(2));
    rack.soh = Number(cfg_data['data']['bms_table']['soh'][0]['data']['v'].toFixed(2));
    rack.capacity = deviceSize * packSize * coreSize * capacity * 3.2 /1000;
    rack.canCharge = Number((rack.capacity - rack.soc * rack.capacity / 100).toFixed(2));
    rack.canDischarge = Number((rack.soc * rack.capacity / 100).toFixed(2));
    rack.sumCharge = Number((cfg_data['data']['bms_table']['sumChargeEnergy'][0]['data']['v'] / 1000 /1000).toFixed(3));
    rack.sumDischarge = Number((cfg_data['data']['bms_table']['sumDischargeEnergy'][0]['data']['v'] / 1000 /1000).toFixed(2));
    rack.runMode = getBmsStatus(cfg_data);
    rack.relay = getRelayStatus(cfg_data, 0);

    // 包级数据
    const voltage = cfg_data['data']['bms_table']['voltage'][0];
    const temperature = cfg_data['data']['bms_table']['temperature'][0];
    for (let j = 0; j < packSize; j++) {
        const packObj = {sumU: 0,maxU: 0,minU: 65535,maxT: 0, minT: 65535};
        for (let k = 0; k < coreSize; k++) {
            packObj.sumU += voltage[j][k]['data']['v'];
            packObj.maxU = Math.max(voltage[j][k]['data']['v'], packObj.maxU);
            packObj.minU = Math.min(voltage[j][k]['data']['v'], packObj.minU);
            packObj.maxT = Math.max(temperature[j][k]['data']['v'], packObj.maxT);
            packObj.minT = Math.min(temperature[j][k]['data']['v'], packObj.minT);
        }
		packObj.sumU = Number(packObj.sumU.toFixed(2));
        pack.push(packObj);
        rack.u += packObj.sumU;
    }
	rack.u = Number(rack.u.toFixed(2));

    // PCS数据
    pcs.runMode = getPcsStatus(cfg_data) !== 4 ? 1 : 0;
    // pcs.positiveResistance =  cfg_data['data']['pcs_table']['positive_resistance'];
    // pcs.negativeResistance =  cfg_data['data']['pcs_table']['negative_resistance'];
    pcs.positiveResistance =  cfg_data['data']['bms_table']['positive_resistance'][0]['data']['v'];
    pcs.negativeResistance =  cfg_data['data']['bms_table']['negative_resistance'][0]['data']['v'];
    pcs.i = cfg_data['data']['pcs_table']['battery_electricity'];
    pcs.p = getP(cfg_data);
    pcs.u = pcs.p ===0 || pcs.i === 0 ? 0 : Number((pcs.p * 1000 / pcs.i).toFixed(2));

    // 告警数据
    const pcsAlertTemp = [];
    const rackAlertTemp = [];
    const cellAlertTemp = [];
    const airAlertTemp = [];

    // 直流侧告警
    const bmsAlert = cfg_data['data']['bms_table']['alert'][0];
    for (let i = 0; i < bmsAlert.length; i++) {
        const orderNum = i + 1;
        if (bmsAlert[i]['data']['v'] === 1) {
            if (rackAlertConfig.hasOwnProperty(orderNum)) {
                rackAlertTemp.push(rackAlertConfig[orderNum]);
            }
            if (cellAlertConfig.hasOwnProperty(orderNum)) {
                cellAlertTemp.push(cellAlertConfig[orderNum]);
            }
        }
    }
    // rackAlertTemp根据level排序并取前四个,然后只取name放入rackAlert
    rackAlertTemp.sort(function(a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < rackAlertTemp.length; j++) {
        if (j >= 4) break;
        rackAlert.push(rackAlertTemp[j].name);
    }

    // cellAlertTemp根据level排序并取前四个,然后只取name放入cellAlert
    cellAlertTemp.sort(function(a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < cellAlertTemp.length; j++) {
        if (j >= 4) break;
        cellAlert.push(cellAlertTemp[j].name);
    }

    // 交流侧告警
    const pcsAlertData = cfg_data['data']['pcs_table']['alert'];
    for (let i = 0; i < pcsAlertData.length; i++) {
        const orderNum = i + 1;
        if (pcsAlertData[i] === 1) {
            if (pcsAlertConfig.hasOwnProperty(orderNum)) {
                pcsAlertTemp.push(pcsAlertConfig[orderNum]);
            }
        }
    }
    pcsAlertTemp.sort(function(a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < pcsAlertTemp.length; j++) {
        if (j >= 4) break;
        pcsAlert.push(pcsAlertTemp[j].name);
    }

    // 空调侧告警
    const airAlertData = cfg_data['data']['kongtiao']['alert'];
    for (let i = 0; i < airAlertData.length; i++) {
        const orderNum = i + 1;
        if (airAlertData[i] === 1) {
            if (airAlertConfig.hasOwnProperty(orderNum)) {
                airAlertTemp.push(airAlertConfig[orderNum]);
            }
        }
    }
    airAlertTemp.sort(function(a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < airAlertTemp.length; j++) {
        if (j >= 4) break;
        airAlert.push(airAlertTemp[j].name);
    }

    // 通讯告警
    if (cfg_data['data']['connection_status']['bms'] === 0) {
        commAlert.push('BMS');
    }
    if (cfg_data['data']['connection_status']['pcs'] === 0) {
        commAlert.push('PCS');
    }
    if (cfg_data['data']['connection_status']['kongtiao'] === 0) {
        commAlert.push('AIR');
    }
    if (cfg_data['data']['connection_status']['xiaofang'] === 0) {
        commAlert.push('FIRE');
    }

    // 消防状态
    fire.alertStatus = cfg_data['data']['fire']['alert'];

}


function auth(config, response){
    if (!config.hasOwnProperty('password')) {
        response.code = 500;
        response.msg = "password is required";
        return;
    }
    if(config['password'] !== password) {
        response.code = 401;
        response.msg = "auth failed password error";
    }
}



/*
电池继电器开关控制接口
bmsID BMS通讯ID
batteryID 面内编号
status 0-开 1-关
*/
function BatteryRelay(bmsID, batteryID, status)
{	
    console.log("control BatteryRelay");
	var order=batteryID%2;	
	if(order === 1){
		if (status === 0){
		//断开继电器1
		socketcan.send("can0", "18C0E4F4#FF01FFFF00003FFF");
		}else{
			//闭合继电器1
			socketcan.send("can0", "18C0E4F4#FF01FFFF00007FFF");	
		}
	}else{
		if (status === 0){
		//断开继电器2
		socketcan.send("can0", "18C0E4F4#FF01FFFF0000CFFF");
		}else{
			//闭合继电器2
			socketcan.send("can0", "18C0E4F4#FF01FFFF0000DFFF");	
		}
	}
    return;
}


/*
预充继电器或总继电器开关控制接口 
relayID 0-预充继电器 1-总继电器
status 0-开 1-关
*/
function PreTotalRelay(relayID , status)
{
    console.log("control PreTotalRelay");
	var str="FE010000000429C6";
	if(relayID === 1){
		if(status === 0){
			//第一路继电器断开
			str="FE050000FF009835";
		}else{
			//第一路继电器闭合
			str="FE0500000000D9C5";
		}
	}else if(relayID === 0){
		if(status === 0){
			//第二路继电器断开
			str="FE050001FF00C9F5";
		}else{
			//第二路继电器闭合
			str="FE05000100008805";
		}
	}
	
    uart.write("/dev/ttyS4",str);
    uart.write("/dev/ttyS4","\n");
    return;
}

function Send2Kafka(cfg_data)
{
    console.log('start send to kafka ...............');
    //console.log('json:',cfg_data);
    var cfg_obj = JSON.parse(cfg_data);
    kafka.produce("127.0.0.1:8913", "CABIN-01", codeData(cfg_obj));
    console.log('send to kafka over !!!!!!!!!!!!');
    return;
}

function LogTest()
{
    console.log('test js log ...............');
}

function IsCompute()
{
    return true; 
}


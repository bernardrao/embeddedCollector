var val=1;
setP(val);

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

// 设置pcs有功功率值(hlq)
function setP(p) {
    const realP = p * 1000; // p的单位为kw, 转换为w
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
	
	//var command_pre_array=[0x01,0x10,0x00,0x09,0x00,0x01,0x02,0x03,0xe8];
	var crc = CRC16_MODBUS(command_pre_array,9);
	console.log('crc:',crc);
/* 	console.log('crc_low:',crc[0]);
	console.log('crc_high:',crc[1]); */
	
    var command=str+Int2Hex(realP)+Int2Hex(crc);
	console.log('command:',command);
    cmd.uartWrite("/dev/ttyS4",command);
    cmd.uartWrite("/dev/ttyS4","\n");
}

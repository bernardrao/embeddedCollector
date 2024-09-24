
// ================================================================
// =====                       参数定义                       =====
// ================================================================

const sysConfig = [
    {
        sys: 'bms',
        port: 'can0',
        msgIds: ['1810207', '1810208'],
        addressId: '',
        reverse: 0
    },
    {
        sys: 'pcs',
        port: '/dev/ttyS1',
        msgIds: [],
        addressId: '0x1',// 地址码
        reverse: 0
    },
    {
        sys: 'air',
        port: '/dev/tty0',
        msgIds: [],
        addressId: '2',
        reverse: 0
    },
    {
        sys: 'fire',
        port: '/dev/tty0',
        msgIds: [],
        addressId: '3',
        reverse: 0
    }
]

const alertNameConfig = {
    tempDiff: { name: '整组温度不均(℃)' },
    chargeOverTemp: { name: '充放电温度过高(℃)' },
    stopOverTemp: { name: '待机(及静置)温度过高(℃)' },
    chargeOverSumU: { name: '充放电总电压过高(V)' },
    stopOverSumU: { name: '待机(及静置)总电压过高(V)' },
    chargeLowSumU: { name: '充放电总电压过低(V)' },
    stopLowSumU: { name: '待机(及静置)总电压过低(V)' },
    dischargeLowSoc: { name: '放电SOC过低(%)' },
    chargeLowSoc: { name: '充电SOC过低(%)' },
    dischargeOverU: { name: '放电/静置单体电压过高(V)' },
    chargeOverU: { name: '充电单体电压过高(V)' },
    dischargeLowU: { name: '放电/静置单体电压过低(V)' },
    chargeLowU: { name: '充电单体电压过低(V)' },
    overSoc: { name: 'SOC过高(%)' },
    socJump: { name: 'SOC跳变(%)' },
    uDiff: { name: '整组电压不均(mV)' },
    overI: { name: '充放电电流过高(A)' },
    chargeLowTemp: { name: '充电温度过低(℃)' },
    dischargeLowTemp: { name: '放电温度过低(℃)' },
};

let runConfig = {
    alertConfig: {
        tempDiff: { threshold: [20, 15, 10], index: [0, 1, 2], interval: [5, 5, 5] },
        chargeOverTemp: { threshold: [60, 55, 50], index: [3, 4, 5], interval: [5, 5, 5] },
        stopOverTemp: { threshold: [60, 0, 0], index: [6, 7, 8], interval: [5, 0, 0] },
        chargeOverSumU: { threshold: [876, 864, 840], index: [9, 10, 11], interval: [1, 5, 5] },
        stopOverSumU: { threshold: [864, 0, 0], index: [12, 13, 14], interval: [5, 0, 0] },
        chargeLowSumU: { threshold: [600, 624, 672], index: [15, 16, 17], interval: [1, 5, 5] },
        stopLowSumU: { threshold: [600, 0, 0], index: [18, 19, 20], interval: [5, 0, 0] },
        dischargeLowSoc: { threshold: [5, 15, 20], index: [21, 22, 23], interval: [3, 3, 3] },
        chargeLowSoc: { threshold: [0, 0, 20], index: [24, 25, 26], interval: [0, 0, 3] },
        dischargeOverU: { threshold: [3.65, 3.6, 0], index: [27, 28, 29], interval: [5, 5, 0] },
        chargeOverU: { threshold: [3.65, 0, 0], index: [30, 31, 32], interval: [1, 0, 0] },
        dischargeLowU: { threshold: [2.5, 2.6, 2.7], index: [33, 34, 35], interval: [10, 10, 10] },
        chargeLowU: { threshold: [2.0, 0, 2.8], index: [36, 37, 38], interval: [5, 0, 10] },
        overSoc: { threshold: [100, 95, 90], index: [39, 40, 41], interval: [3, 3, 3] },
        socJump: { threshold: [0, 0, 10], index: [42, 43, 44], interval: [0, 0, 5] },
        uDiff: { threshold: [700, 500, 300], index: [45, 46, 47], interval: [5, 5, 5] },
        overI: { threshold: [1.2, 1.15, 1.1], index: [48, 49, 50], interval: [5, 10, 10] },
        chargeLowTemp: { threshold: [0, 0, 0], index: [51, 52, 53], interval: [5, 0, 0] },
        dischargeLowTemp: { threshold: [-20, -10, 0], index: [54, 55, 56], interval: [5, 5, 5] }
    },
    chargeConfig: { // p的单位为kw,action1为充电，2为放电,0为停止，mode为1表示手动模式，2表示自动模式
        "enabled": 0,
        "actions": [
            { "startHour": 19, "endHour": 20, "action": 1, "p": 40 },
            { "startHour": 21, "endHour": 22, "action": 2, "p": 55 }
        ]
    },
    ocv: {
        "0": 3019,
        "5": 3201,
        "10": 3214,
        "15": 3238,
        "20": 3254,
        "25": 3269,
        "30": 3288,
        "35": 3290,
        "40": 3291,
        "45": 3292,
        "50": 3293,
        "55": 3295,
        "60": 3313,
        "65": 3329,
        "70": 3330,
        "75": 3330,
        "80": 3331,
        "85": 3331,
        "90": 3331,
        "95": 3332,
        "100": 3428
    },
    capacity: 280, // 电池容量，单位Ah
    variableI: 5, // 有效电流，单位A
    iMax: 280, // 最大允许电流，单位A
    uMax: 876, // 最大允许电压(总压)，单位v
    deviceSize: 1,
    packSize: 10,
    coreSize: 24,
    minSoc: 5,
    maxSoc: 98,
    password: 'Sk@001',
    enableAlert: 0 // 是否启用自己的告警
}

// 中间数据存储
const temp_data = {
    soh: [{ charge: 0, discharge: 0 }, { charge: 0, discharge: 0 }],
    socJump: [[{ t: 0, v: 0 }], [{ t: 0, v: 0 }]],
    alert: [{ tempDiffOne: { t: 0, v: 0 } }, { tempDiffOne: { t: 0, v: 0 } }]
}


// ================================================================
// =====                      逻辑部分                        =====
// ================================================================

// 日志处理(测试时可以写成打印，如果需要上传中心侧，可以改成发送mqtt)
function handleLog(msg) {
    console.log(`time: ${formatDateTime(new Date())}   msg: ${msg}`);
}

// 初始化配置
function initRunConfig() {
    const creatTableSql = 'create table if not exists config(config TEXT)';
    db.query(creatTableSql);
    const configStr = db.query('select config from config');
    if (!configStr) {
        const insertSql = `insert into config(config) values('${JSON.stringify(runConfig)}')`;
        db.query(insertSql);
    }
    const querySql = 'select config from config';
    const result = db.query(querySql);
    runConfig = JSON.parse(result.split("\n")[1]);
}

// 保存配置
function updateRunConfig() {
    const insertSql = `update config set config= '${JSON.stringify(runConfig)}'`;
    db.query(insertSql);
}

//json串转对象计算
function ComputeAndChecCharge(cfg_data) {
    handleLog('Compute!!!!');
    realCompute();
    checkChargeStatus();
}

// ================================================================
// =====                      计算部分                        =====
// ================================================================

// 所有计算
function realCompute() {
    // const start = Date.now();
    computeChargeEnergy(gdata['cfg']);
    computeMaxMin(gdata['cfg'])
    computeSoc(gdata['cfg']);
    computeSoh(gdata['cfg'], temp_data);
    tempDiffCompute(gdata['cfg'], temp_data);
    chargeOverTempCompute(gdata['cfg'], temp_data);
    stopOverTempCompute(gdata['cfg'], temp_data);
    chargeOverSumUCompute(gdata['cfg'], temp_data);
    stopOverSumUCompute(gdata['cfg'], temp_data);
    chargeLowSumUCompute(gdata['cfg'], temp_data);
    stopLowSumUCompute(gdata['cfg'], temp_data);
    dischargeLowSocCompute(gdata['cfg'], temp_data);
    chargeLowSocCompute(gdata['cfg'], temp_data);
    dischargeOverUCompute(gdata['cfg'], temp_data);
    chargeOverUCompute(gdata['cfg'], temp_data);
    dischargeLowUCompute(gdata['cfg'], temp_data);
    chargeLowUCompute(gdata['cfg'], temp_data);
    overSocCompute(gdata['cfg'], temp_data);
    socJumpCompute(gdata['cfg'], temp_data);
    uDiffCompute(gdata['cfg'], temp_data);
    overICompute(gdata['cfg'], temp_data);
    chargeLowTempCompute(gdata['cfg'], temp_data);
    // console.log("计算耗时：" + (Date.now() - start) + "ms")
}

// 获取簇指标
function getRackMetric(rackIndex, containTime, key) {
    return containTime ? { t: gdata['cfg']['data']['source_bms_table']['cluster_info'][rackIndex]['t'], v: gdata['cfg']['data']['source_bms_table']['cluster_info'][rackIndex][key] } : gdata['cfg']['data']['source_bms_table']['cluster_info'][rackIndex][key];
}

// 获取簇电流
function getRackI(rackIndex, containTime) {
    return getRackMetric(rackIndex, containTime, 'current');
}

// 获取停止充电电压阈值
function getStopChargeU() {
    return runConfig.alertConfig.chargeOverU.threshold[0];
}

// 获取停止放电电压阈值
function getStopDischargeU() {
    return runConfig.alertConfig.dischargeLowU.threshold[2];
}

// 获取簇继电器状态
function getRelayStatus(cfg_data, deviceIndex) {
    return (cfg_data['data']['source_bms_table']['cluster_info'][deviceIndex]['positive_relay_status'] === 1 || cfg_data['data']['source_bms_table']['cluster_info'][deviceIndex]['pre_relay_status'] === 1)
        && cfg_data['data']['source_bms_table']['cluster_info'][deviceIndex]['negative_relay_status'] === 1 ? 1 : 0;
}

// 获取充放电状态0-停止，1-充电，2-放电
function getChargeStatus(cfg_data, deviceIndex) {
    const I = getRackI(deviceIndex, false);
    let status = 0;
    if (I < -runConfig.variableI) {
        status = 1
    } else if (I > runConfig.variableI) {
        status = 2
    }
    return status;
}

// 获取簇SOC
function getRackSoc(rackIndex, containTime) {
    return getRackMetric(rackIndex, containTime, 'cluster_soc');
}

// 计算SOC
function computeSoc(cfg_data) {
    const stopDischargeU = getStopDischargeU();
    const stopChargeU = getStopChargeU();
    const currentTime = Date.now();
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const iValue = getRackI(i, false);
        const socData = cfg_data['data']['bms_table']['soc'][i]['data'];
        if (socData['t'] === 0) { // 第一次计算
            socData['t'] = currentTime;
        } else {
            const I = Math.abs(iValue) > runConfig.variableI ? iValue : 0;
            const ah = I * (currentTime - socData['t']) / 3600000;
            let tempSoc = socData['v']
            if (socData['v'] > 90 && socData['v'] < 100 && I < 0) {
                const uDiff = cfg_data['data']['bms_table']['maxU'][i]['data']['v'] - cfg_data['data']['bms_table']['maxU'][i]['data']['hv']
                if (uDiff > 0) {
                    tempSoc = socData['v'] + (100 - socData['v']) / (stopChargeU - cfg_data['data']['bms_table']['maxU'][i]['data']['v']) * (uDiff)
                }
            } else if (socData['v'] > 0 && socData['v'] < 10 && I > 0) {
                const uDiff = cfg_data['data']['bms_table']['minU'][i]['data']['hv'] - cfg_data['data']['bms_table']['minU'][i]['data']['v']
                if (uDiff > 0) {
                    tempSoc = socData['v'] - (socData['v'] - 0) / (cfg_data['data']['bms_table']['minU'][i]['data']['v'] - stopDischargeU) * (uDiff)
                }
            } else {
                tempSoc = socData['v'] - ah / runConfig.capacity * 100;
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
    // console.log("socData: ", JSON.stringify(cfg_data['data']['bms_table']['soc']))
}

// 计算soh
function computeSoh(cfg_data, temp_data) {
    const socArray = cfg_data['data']['bms_table']['soc'];
    const sohArray = cfg_data['data']['bms_table']['soh'];
    const sumChargeArray = cfg_data['data']['bms_table']['sumCharge'];
    const sumDischargeArray = cfg_data['data']['bms_table']['sumDischarge'];
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const I = cfg_data['data']['bms_table']['current'][i]['data']['v'];
        if (socArray[i]['data']['v'] === 100 && Math.abs(I) < runConfig.variableI) {
            temp_data['soh'][i]['charge'] = sumChargeArray[i]['data']['v'];
            temp_data['soh'][i]['discharge'] = sumDischargeArray[i]['data']['v'];
            // console.log(`添加累计充电量=${temp_data['soh'][i]['charge']},添加累计放电量=${temp_data['soh'][i]['discharge']}`);
        } else if (socArray[i]['data']['v'] === 0 && Math.abs(I) < runConfig.variableI) {
            const chargeEnergy = sumChargeArray[i]['data']['v'] - temp_data['soh'][i]['charge'];
            const dischargeEnergy = sumDischargeArray[i]['data']['v'] - temp_data['soh'][i]['discharge'];
            // console.log(`充电量=${chargeEnergy},放电量=${dischargeEnergy}`)
            // console.log(`添加累计充电量=${sumChargeArray[i]['data']['v']},添加累计放电量=${sumDischargeArray[i]['data']['v']}`);
            if (chargeEnergy < runConfig.capacity * 0.05 && sumChargeArray[i]['data']['v'] > runConfig.capacity * 0.05) {
                sohArray[i]['data']['v'] = (dischargeEnergy - chargeEnergy) > runConfig.capacity ? 100 : (dischargeEnergy - chargeEnergy) / runConfig.capacity * 100;
                sohArray[i]['data']['t'] = Date.now();
            }
        }
    }
    // console.log("sohData: ", JSON.stringify(cfg_data['data']['bms_table']['soh']));
}

// 计算充放电量
function computeChargeEnergy(cfg_data) {
    const vArray = cfg_data['data']['source_bms_table']['voltage'];
    const currentTime = Date.now();
    let sumU = 0;
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const vData = vArray[i];
        const iValue = getRackI(i, false);
        const I = Math.abs(iValue) > runConfig.variableI ? iValue : 0;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const u = vData[j][k]['data']['v'];
                sumU += u;
            }
        }
        const interval = cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['t'] === 0 ? 0 : currentTime - cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['t'];
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
    const vArray = cfg_data['data']['source_bms_table']['voltage'];
    const tArray = cfg_data['data']['source_bms_table']['temperature'];
    const maxUArray = cfg_data['data']['bms_table']['maxU'];
    const minUArray = cfg_data['data']['bms_table']['minU'];
    const maxTempArray = cfg_data['data']['bms_table']['maxTemp'];
    const minTempArray = cfg_data['data']['bms_table']['minTemp'];
    for (let i = 0; i < runConfig.deviceSize; i++) {
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
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
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

// 告警计算-整组温度不均
function tempDiffCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['source_bms_table']['temperature'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMax = -65535;
        let tempMin = 65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMax = value > tempMax ? value : tempMax;
                tempMin = value < tempMin ? value : tempMin;
            }
        }
        const tempDiff = tempMax - tempMin;
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`tempDiff:${tempDiff}`);
        // 三级告警计算
        tempDiffComputeOne(i, tempDiff, status, relayStatus, runConfig.alertConfig.tempDiff.interval[0] * 1000);
        tempDiffComputeTwo(i, tempDiff, status, relayStatus, runConfig.alertConfig.tempDiff.interval[1] * 1000);
        tempDiffComputeThree(i, tempDiff, status, relayStatus, runConfig.alertConfig.tempDiff.interval[2] * 1000);
    }

    //console.log("tempDiff: ", cfg_data['data']['bms_table']['alert'][0].slice(0,3));

    function tempDiffComputeOne(deviceIndex, tempDiff, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('tempDiffOne')) temp_data['alert'][deviceIndex]['tempDiffOne'] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && tempDiff > runConfig.alertConfig.tempDiff.threshold[0]) {
            if (temp_data['alert'][deviceIndex]['tempDiffOne']['v'] === 0) {
                temp_data['alert'][deviceIndex]['tempDiffOne']['v'] = 1;
                temp_data['alert'][deviceIndex]['tempDiffOne']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['tempDiffOne']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['tempDiffOne']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[0]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[0]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[0]]['data']['t'] = temp_data['alert'][deviceIndex]['tempDiffOne']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['tempDiffOne']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempDiff < 17) {
            temp_data['alert'][deviceIndex]['tempDiffOne']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[0]]['data']['v'] = 0;
        }
    }
    function tempDiffComputeTwo(deviceIndex, tempDiff, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('tempDiffTwo')) temp_data['alert'][deviceIndex]['tempDiffTwo'] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && tempDiff > runConfig.alertConfig.tempDiff.threshold[1]) {
            if (temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] === 0) {
                temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] = 1;
                temp_data['alert'][deviceIndex]['tempDiffTwo']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['tempDiffTwo']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[1]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[1]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[1]]['data']['t'] = temp_data['alert'][deviceIndex]['tempDiffTwo']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempDiff < 13) {
            temp_data['alert'][deviceIndex]['tempDiffTwo']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[1]]['data']['v'] = 0;
        }
    }
    function tempDiffComputeThree(deviceIndex, tempDiff, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('tempDiffThree')) temp_data['alert'][deviceIndex]['tempDiffThree'] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && tempDiff > runConfig.alertConfig.tempDiff.threshold[2]) {
            if (temp_data['alert'][deviceIndex]['tempDiffThree']['v'] === 0) {
                temp_data['alert'][deviceIndex]['tempDiffThree']['v'] = 1;
                temp_data['alert'][deviceIndex]['tempDiffThree']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['tempDiffThree']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['tempDiffThree']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[2]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[2]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[2]]['data']['t'] = temp_data['alert'][deviceIndex]['tempDiffThree']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['tempDiffThree']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempDiff < 7) {
            temp_data['alert'][deviceIndex]['tempDiffThree']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.tempDiff.index[2]]['data']['v'] = 0;
        }
    }



}

// 告警计算-充放电温度过高
function chargeOverTempCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['source_bms_table']['temperature'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMax = -65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMax = value > tempMax ? value : tempMax;
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`tempMax:${tempMax}`);
        // 三级告警计算
        chargeOverTempComputeOne(i, tempMax, status, relayStatus, runConfig.alertConfig.chargeOverTemp.interval[0] * 1000);
        chargeOverTempComputeTwo(i, tempMax, status, relayStatus, runConfig.alertConfig.chargeOverTemp.interval[1] * 1000);
        chargeOverTempComputeThree(i, tempMax, status, relayStatus, runConfig.alertConfig.chargeOverTemp.interval[2] * 1000);
    }

    // console.log("chargeOverTemp: ", cfg_data['data']['bms_table']['alert'][0].slice(3,6));

    function chargeOverTempComputeOne(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('chargeOverTempOne')) temp_data['alert'][deviceIndex]['chargeOverTempOne'] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && tempMax > runConfig.alertConfig.chargeOverTemp.threshold[0]) {
            if (temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] === 0) {
                temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] = 1;
                temp_data['alert'][deviceIndex]['chargeOverTempOne']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['chargeOverTempOne']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[0]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[0]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[0]]['data']['t'] = temp_data['alert'][deviceIndex]['chargeOverTempOne']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 55) {
            temp_data['alert'][deviceIndex]['chargeOverTempOne']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[0]]['data']['v'] = 0;
        }
    }
    function chargeOverTempComputeTwo(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('chargeOverTempTwo')) temp_data['alert'][deviceIndex]['chargeOverTempTwo'] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && tempMax > runConfig.alertConfig.chargeOverTemp.threshold[1]) {
            if (temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] === 0) {
                temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] = 1;
                temp_data['alert'][deviceIndex]['chargeOverTempTwo']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['chargeOverTempTwo']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[1]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[1]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[1]]['data']['t'] = temp_data['alert'][deviceIndex]['chargeOverTempTwo']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 50) {
            temp_data['alert'][deviceIndex]['chargeOverTempTwo']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[1]]['data']['v'] = 0;
        }
    }
    function chargeOverTempComputeThree(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('chargeOverTempThree')) temp_data['alert'][deviceIndex]['chargeOverTempThree'] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && tempMax > runConfig.alertConfig.chargeOverTemp.threshold[2]) {
            if (temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] === 0) {
                temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] = 1;
                temp_data['alert'][deviceIndex]['chargeOverTempThree']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['chargeOverTempThree']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[2]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[2]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[2]]['data']['t'] = temp_data['alert'][deviceIndex]['chargeOverTempThree']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 45) {
            temp_data['alert'][deviceIndex]['chargeOverTempThree']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.chargeOverTemp.index[2]]['data']['v'] = 0;
        }
    }



}

// 告警计算-静置温度过高
function stopOverTempCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['source_bms_table']['temperature'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMax = -65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMax = value > tempMax ? value : tempMax;
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`tempMax:${tempMax}`);
        // 三级告警计算
        stopOverTempComputeOne(i, tempMax, status, relayStatus, runConfig.alertConfig.stopOverTemp.interval[0] * 1000);
    }

    // console.log("chargeOverTemp: ", cfg_data['data']['bms_table']['alert'][0].slice(6,9));

    function stopOverTempComputeOne(deviceIndex, tempMax, status, relayStatus, interval) {
        if (!temp_data['alert'][deviceIndex].hasOwnProperty('stopOverTempOne')) temp_data['alert'][deviceIndex]['stopOverTempOne'] = { t: 0, v: 0 };
        // 告警计算
        if (status === 0 && tempMax > runConfig.alertConfig.stopOverTemp.threshold[0]) {
            if (temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] === 0) {
                temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] = 1;
                temp_data['alert'][deviceIndex]['stopOverTempOne']['t'] = Date.now();

            } else if (temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] === 1) {
                if (Date.now() - temp_data['alert'][deviceIndex]['stopOverTempOne']['t'] >= interval && cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.stopOverTemp.index[0]]['data']['v'] !== 1) {
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.stopOverTemp.index[0]]['data']['v'] = 1;
                    cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.stopOverTemp.index[0]]['data']['t'] = temp_data['alert'][deviceIndex]['stopOverTempOne']['t'];
                }
            }
        } else {
            temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] = 0;
        }
        // 告警清除
        if (relayStatus === 0 || tempMax < 55) {
            temp_data['alert'][deviceIndex]['stopOverTempOne']['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][runConfig.alertConfig.stopOverTemp.index[0]]['data']['v'] = 0;
        }
    }


}

// 告警计算-充放电总压过高
function chargeOverSumUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        chargeOverSumUComputeOne(i, sumU, status, relayStatus, runConfig.alertConfig.chargeOverSumU.interval[0] * 1000);
        chargeOverSumUComputeTwo(i, sumU, status, relayStatus, runConfig.alertConfig.chargeOverSumU.interval[1] * 1000);
        chargeOverSumUComputeThree(i, sumU, status, relayStatus, runConfig.alertConfig.chargeOverSumU.interval[2] * 1000);
    }

    // console.log("chargeOverSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(9,12));

    function chargeOverSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeOverSumUOne';
        const index = runConfig.alertConfig.chargeOverSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && sumU > runConfig.alertConfig.chargeOverSumU.threshold[0]) {
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
        const index = runConfig.alertConfig.chargeOverSumU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && sumU > runConfig.alertConfig.chargeOverSumU.threshold[1]) {
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
        const index = runConfig.alertConfig.chargeOverSumU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && sumU > runConfig.alertConfig.chargeOverSumU.threshold[2]) {
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
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        stopOverSumUComputeOne(i, sumU, status, relayStatus, runConfig.alertConfig.stopOverSumU.interval[0] * 1000);

    }

    // console.log("stopOverSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(12,15));

    function stopOverSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'stopOverSumUOne';
        const index = runConfig.alertConfig.stopOverSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 0 && sumU > runConfig.alertConfig.stopOverSumU.threshold[0]) {
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
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        chargeLowSumUComputeOne(i, sumU, status, relayStatus, runConfig.alertConfig.chargeLowSumU.interval[0] * 1000);
        chargeLowSumUComputeTwo(i, sumU, status, relayStatus, runConfig.alertConfig.chargeLowSumU.interval[1] * 1000);
        chargeLowSumUComputeThree(i, sumU, status, relayStatus, runConfig.alertConfig.chargeLowSumU.interval[2] * 1000);
    }

    // console.log("chargeLowSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(15,18));

    function chargeLowSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeLowSumUOne';
        const index = runConfig.alertConfig.chargeLowSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && sumU < runConfig.alertConfig.chargeLowSumU.threshold[0]) {
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
        if (relayStatus === 0 || sumU >= runConfig.alertConfig.chargeLowSumU.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeLowSumUComputeTwo(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeLowSumUTwo';
        const index = runConfig.alertConfig.chargeLowSumU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && sumU < runConfig.alertConfig.chargeLowSumU.threshold[1]) {
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
        if (relayStatus === 0 || sumU >= runConfig.alertConfig.chargeLowSumU.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function chargeLowSumUComputeThree(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'chargeLowSumUThree';
        const index = runConfig.alertConfig.chargeLowSumU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 0 && sumU < runConfig.alertConfig.chargeLowSumU.threshold[2]) {
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
        if (relayStatus === 0 || sumU >= runConfig.alertConfig.chargeLowSumU.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-静置总压过低
function stopLowSumUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let sumU = 0;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                sumU += uData[j][k]['data']['v'];
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`sumU:${sumU}`);
        // 三级告警计算
        stopLowSumUComputeOne(i, sumU, status, relayStatus, runConfig.alertConfig.stopLowSumU.interval[0] * 1000);
    }

    // console.log("stopLowSumU: ", cfg_data['data']['bms_table']['alert'][0].slice(18,21));

    function stopLowSumUComputeOne(deviceIndex, sumU, status, relayStatus, interval) {
        const key = 'stopLowSumUOne';
        const index = runConfig.alertConfig.stopLowSumU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 0 && sumU < runConfig.alertConfig.stopLowSumU.threshold[0]) {
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
        if (relayStatus === 0 || sumU >= runConfig.alertConfig.stopLowSumU.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }


}

// 告警计算-放电SOC过低
function dischargeLowSocCompute(cfg_data, temp_data) {
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const soc = getRackSoc(i, false);
        const status = getChargeStatus(cfg_data, i);
        // 三级告警计算
        dischargeLowSocComputeOne(i, soc, status, runConfig.alertConfig.dischargeLowSoc.interval[0] * 1000);
        dischargeLowSocComputeTwo(i, soc, status, runConfig.alertConfig.dischargeLowSoc.interval[1] * 1000);
        dischargeLowSocComputeThree(i, soc, status, runConfig.alertConfig.dischargeLowSoc.interval[2] * 1000);
    }

    //console.log("dischargeLowSoc: ", cfg_data['data']['bms_table']['alert'][0].slice(21,24));

    function dischargeLowSocComputeOne(deviceIndex, soc, status, interval) {
        const key = 'dischargeLowSocOne';
        const index = runConfig.alertConfig.dischargeLowSoc.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 2 && soc < runConfig.alertConfig.dischargeLowSoc.threshold[0]) {
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
        const index = runConfig.alertConfig.dischargeLowSoc.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 2 && soc < runConfig.alertConfig.dischargeLowSoc.threshold[1]) {
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
        const index = runConfig.alertConfig.dischargeLowSoc.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 2 && soc < runConfig.alertConfig.dischargeLowSoc.threshold[2]) {
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
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const soc = getRackSoc(i, false);
        const status = getChargeStatus(cfg_data, i);
        // 三级告警计算
        chargeLowSocComputeThree(i, soc, status, runConfig.alertConfig.chargeLowSoc.interval[2] * 1000);
    }

    // console.log("chargeLowSoc: ", cfg_data['data']['bms_table']['alert'][0].slice(24,27));

    function chargeLowSocComputeThree(deviceIndex, soc, status, interval) {
        const key = 'chargeLowSocThree';
        const index = runConfig.alertConfig.chargeLowSoc.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 1 && soc < runConfig.alertConfig.chargeLowSoc.threshold[2]) {
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
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let uMax = -65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMax = value > uMax ? value : uMax;
            }
        }
        // console.log(`uMax:${uMax}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // 三级告警计算
        dischargeOverUComputeOne(i, uMax, status, relayStatus, runConfig.alertConfig.dischargeOverU.interval[0] * 1000);
        dischargeOverUComputeTwo(i, uMax, status, relayStatus, runConfig.alertConfig.dischargeOverU.interval[1] * 1000);
    }

    // console.log("dischargeOverU: ", cfg_data['data']['bms_table']['alert'][0].slice(27,30));

    function dischargeOverUComputeOne(deviceIndex, uMax, status, relayStatus, interval) {
        const key = 'dischargeOverUOne';
        const index = runConfig.alertConfig.dischargeOverU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 1 && uMax > runConfig.alertConfig.dischargeOverU.threshold[0]) {
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
        const index = runConfig.alertConfig.dischargeOverU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 1 && uMax > runConfig.alertConfig.dischargeOverU.threshold[1]) {
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
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let uMax = -65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMax = value > uMax ? value : uMax;
            }
        }
        // console.log(`uMax:${uMax}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // 三级告警计算
        chargeOverUComputeOne(i, uMax, status, relayStatus, runConfig.alertConfig.chargeOverU.interval[0] * 1000);
    }

    // console.log("chargeOverU: ", cfg_data['data']['bms_table']['alert'][0].slice(30,33));

    function chargeOverUComputeOne(deviceIndex, uMax, status, relayStatus, interval) {
        const key = 'chargeOverUOne';
        const index = runConfig.alertConfig.chargeOverU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 1 && uMax > runConfig.alertConfig.chargeOverU.threshold[0]) {
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
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let uMin = 65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMin = value < uMin ? value : uMin;
            }
        }
        // console.log(`uMin:${uMin}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // 三级告警计算
        dischargeLowUComputeOne(i, uMin, status, relayStatus, runConfig.alertConfig.dischargeLowU.interval[0] * 1000);
        dischargeLowUComputeTwo(i, uMin, status, relayStatus, runConfig.alertConfig.dischargeLowU.interval[1] * 1000);
        dischargeLowUComputeThree(i, uMin, status, relayStatus, runConfig.alertConfig.dischargeLowU.interval[2] * 1000);
    }

    // console.log("dischargeLowU: ", cfg_data['data']['bms_table']['alert'][0].slice(33,36));

    function dischargeLowUComputeOne(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'dischargeLowUOne';
        const index = runConfig.alertConfig.dischargeLowU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 1 && uMin <= runConfig.alertConfig.dischargeLowU.threshold[0]) {
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
        if (relayStatus === 0 || uMin > runConfig.alertConfig.dischargeLowU.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowUComputeTwo(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'dischargeLowUTwo';
        const index = runConfig.alertConfig.dischargeLowU.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 1 && uMin <= runConfig.alertConfig.dischargeLowU.threshold[1]) {
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
        if (relayStatus === 0 || uMin > runConfig.alertConfig.dischargeLowU.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowUComputeThree(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'dischargeLowUThree';
        const index = runConfig.alertConfig.dischargeLowU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status !== 1 && uMin <= runConfig.alertConfig.dischargeLowU.threshold[2]) {
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
        if (relayStatus === 0 || uMin > runConfig.alertConfig.dischargeLowU.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-充电单体电压过低
function chargeLowUCompute(cfg_data, temp_data) {
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let uMin = 65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMin = value < uMin ? value : uMin;
            }
        }
        // console.log(`uMin:${uMin}`);
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // 三级告警计算
        chargeLowUComputeOne(i, uMin, status, relayStatus, runConfig.alertConfig.chargeLowU.interval[0] * 1000);
        chargeLowUComputeThree(i, uMin, status, relayStatus, runConfig.alertConfig.chargeLowU.interval[1] * 1000);
    }

    // console.log("dischargeLowU: ", cfg_data['data']['bms_table']['alert'][0].slice(36,39));

    function chargeLowUComputeOne(deviceIndex, uMin, status, relayStatus, interval) {
        const key = 'chargeLowUOne';
        const index = runConfig.alertConfig.chargeLowU.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 1 && uMin < runConfig.alertConfig.chargeLowU.threshold[0]) {
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
        const index = runConfig.alertConfig.chargeLowU.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 1 && uMin < runConfig.alertConfig.chargeLowU.threshold[2]) {
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
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const soc = getRackSoc(i, false);
        const status = getChargeStatus(cfg_data, i);
        // 三级告警计算
        overSocComputeOne(i, soc, status, runConfig.alertConfig.overSoc.interval[0] * 1000);
        overSocComputeTwo(i, soc, status, runConfig.alertConfig.overSoc.interval[1] * 1000);
        overSocComputeThree(i, soc, status, runConfig.alertConfig.overSoc.interval[2] * 1000);
    }

    // console.log("overSoc: ", cfg_data['data']['bms_table']['alert'][0].slice(39,42));

    function overSocComputeOne(deviceIndex, soc, status, interval) {
        const key = 'overSocOne';
        const index = runConfig.alertConfig.overSoc.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (soc >= runConfig.alertConfig.overSoc.threshold[0]) {
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
        if (soc < runConfig.alertConfig.overSoc.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overSocComputeTwo(deviceIndex, soc, status, interval) {
        const key = 'overSocTwo';
        const index = runConfig.alertConfig.overSoc.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (soc >= runConfig.alertConfig.overSoc.threshold[1]) {
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
        if (soc < runConfig.alertConfig.overSoc.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overSocComputeThree(deviceIndex, soc, status, interval) {
        const key = 'overSocThree';
        const index = runConfig.alertConfig.overSoc.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (soc >= runConfig.alertConfig.overSoc.threshold[2]) {
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
        if (soc < runConfig.alertConfig.overSoc.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-SOC跳变
function socJumpCompute(cfg_data, temp_data) {
    const cacheInterval = 10 * 1000;
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const soc = getRackSoc(i, false);
        temp_data['socJump'][i].push({ t: Date.now(), v: soc });
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log('缓存长度=',temp_data['socJump'][i].length);
        // 三级告警计算
        socJumpComputeThree(i, soc, status, relayStatus, runConfig.alertConfig.socJump.interval[2] * 1000);
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
        const index = runConfig.alertConfig.socJump.index[2];
        // 告警计算
        for (let k = 0; k < temp_data['socJump'][deviceIndex].length; k++) {
            const data = temp_data['socJump'][deviceIndex][k];
            if (Date.now() - data['t'] <= interval && Math.abs(data['v'] - soc) >= runConfig.alertConfig.socJump.threshold[2]) {
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
    const uArray = cfg_data['data']['source_bms_table']['voltage'];

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const uData = uArray[i];
        let uMax = -65535;
        let uMin = 65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = uData[j][k]['data']['v'];
                uMax = value > uMax ? value : uMax;
                uMin = value < uMin ? value : uMin;
            }
        }
        const uDiff = (uMax - uMin) * 1000;
        // console.log(`uDiff:${uDiff}`);
        // 三级告警计算
        uDiffComputeOne(i, uDiff, runConfig.alertConfig.uDiff.interval[0] * 1000);
        uDiffComputeTwo(i, uDiff, runConfig.alertConfig.uDiff.interval[1] * 1000);
        uDiffComputeThree(i, uDiff, runConfig.alertConfig.uDiff.interval[2] * 1000);
    }

    //console.log("uDiff: ", cfg_data['data']['bms_table']['alert'][0].slice(0,3));

    function uDiffComputeOne(deviceIndex, uDiff, interval) {
        const key = 'uDiffOne';
        const index = runConfig.alertConfig.uDiff.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (uDiff > runConfig.alertConfig.uDiff.threshold[0]) {
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
        const index = runConfig.alertConfig.uDiff.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (uDiff > runConfig.alertConfig.uDiff.threshold[1]) {
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
        const index = runConfig.alertConfig.uDiff.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (uDiff > runConfig.alertConfig.uDiff.threshold[2]) {
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

    for (let i = 0; i < runConfig.deviceSize; i++) {
        const iValue = Math.abs(getRackI(i, false));
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`uDiff:${uDiff}`);
        // 三级告警计算
        overIComputeOne(i, iValue, relayStatus, runConfig.alertConfig.overI.interval[0] * 1000);
        overIComputeTwo(i, iValue, relayStatus, runConfig.alertConfig.overI.interval[1] * 1000);
        overIComputeThree(i, iValue, relayStatus, runConfig.alertConfig.overI.interval[2] * 1000);
    }

    //console.log("uDiff: ", cfg_data['data']['bms_table']['alert'][0].slice(0,3));

    function overIComputeOne(deviceIndex, iValue, relayStatus, interval) {
        const key = 'overIOne';
        const index = runConfig.alertConfig.overI.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (iValue > runConfig.iMax * runConfig.alertConfig.overI.threshold[0]) {
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
        const index = runConfig.alertConfig.overI.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (iValue > runConfig.iMax * runConfig.alertConfig.overI.threshold[1]) {
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
        if (relayStatus === 0 || iValue < runConfig.iMax * 1.1) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function overIComputeThree(deviceIndex, iValue, relayStatus, interval) {
        const key = 'overIThree';
        const index = runConfig.alertConfig.overI.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (iValue > runConfig.iMax * runConfig.alertConfig.overI.threshold[2]) {
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
        if (relayStatus === 0 || iValue < runConfig.iMax * 1.05) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }



}

// 告警计算-充电和放电温度过低
function chargeLowTempCompute(cfg_data, temp_data) {
    const tempArray = cfg_data['data']['source_bms_table']['temperature'];
    for (let i = 0; i < runConfig.deviceSize; i++) {
        const tempData = tempArray[i];
        let tempMin = 65535;
        for (let j = 0; j < runConfig.packSize; j++) {
            for (let k = 0; k < runConfig.coreSize; k++) {
                const value = tempData[j][k]['data']['v'];
                tempMin = value < tempMin ? value : tempMin;
            }
        }
        const status = getChargeStatus(cfg_data, i);
        const relayStatus = getRelayStatus(cfg_data, i);
        // console.log(`tempMin:${tempMin}`);
        // 三级告警计算
        chargeLowTempComputeOne(i, tempMin, status, relayStatus, runConfig.alertConfig.chargeLowTemp.interval[0] * 1000);
        dischargeLowTempComputeOne(i, tempMin, status, relayStatus, runConfig.alertConfig.dischargeLowTemp.interval[0] * 1000);
        dischargeLowTempComputeTwo(i, tempMin, status, relayStatus, runConfig.alertConfig.dischargeLowTemp.interval[1] * 1000);
        dischargeLowTempComputeThree(i, tempMin, status, relayStatus, runConfig.alertConfig.dischargeLowTemp.interval[2] * 1000);
    }

    // console.log("chargeLowTemp: ", cfg_data['data']['bms_table']['alert'][0].slice(54,57));

    function chargeLowTempComputeOne(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'chargeLowTempOne';
        const index = runConfig.alertConfig.chargeLowTemp.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 1 && tempMin < runConfig.alertConfig.chargeLowTemp.threshold[0]) {
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
        if (relayStatus === 0 || tempMin >= runConfig.alertConfig.chargeLowTemp.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowTempComputeOne(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'dischargeLowTempOne';
        const index = runConfig.alertConfig.dischargeLowTemp.index[0];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 2 && tempMin < runConfig.alertConfig.dischargeLowTemp.threshold[0]) {
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
        if (relayStatus === 0 || tempMin >= runConfig.alertConfig.dischargeLowTemp.threshold[0]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowTempComputeTwo(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'dischargeLowTempTwo';
        const index = runConfig.alertConfig.dischargeLowTemp.index[1];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 2 && tempMin < runConfig.alertConfig.dischargeLowTemp.threshold[1]) {
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
        if (relayStatus === 0 || tempMin >= runConfig.alertConfig.dischargeLowTemp.threshold[1]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }
    function dischargeLowTempComputeThree(deviceIndex, tempMin, status, relayStatus, interval) {
        const key = 'dischargeLowTempThree';
        const index = runConfig.alertConfig.dischargeLowTemp.index[2];
        if (!temp_data['alert'][deviceIndex].hasOwnProperty(key)) temp_data['alert'][deviceIndex][key] = { t: 0, v: 0 };
        // 告警计算
        if (status === 2 && tempMin < runConfig.alertConfig.dischargeLowTemp.threshold[2]) {
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
        if (relayStatus === 0 || tempMin >= runConfig.alertConfig.dischargeLowTemp.threshold[2]) {
            temp_data['alert'][deviceIndex][key]['v'] = 0;
            cfg_data['data']['bms_table']['alert'][deviceIndex][index]['data']['v'] = 0;
        }
    }

}


// ================================================================
// =====                      控制相关                        =====
// ================================================================

let lastChangePTime = new Date();
let lastCheckTime = new Date();
const pChangeInterval = 1000 * 10; // 10秒
const chargeStartPInterval = 5; // 5kw
const chargeStopPInterval = 10; // 10kw

const myRackAlertConfig = {
    0: { name: '整组温度不均一级告警', level: 1, isStop: 1 },
    1: { name: '整组温度不均二级告警', level: 2, isStop: 1 },
    2: { name: '整组温度不均三级告警', level: 3, isStop: 1 },
    9: { name: '充放电总压过高一级告警', level: 1, isStop: 1 },
    10: { name: '充放电总压过高二级告警', level: 2, isStop: 1 },
    11: { name: '充放电总压过高三级告警', level: 3, isStop: 1 },
    12: { name: '静置总压过高一级告警', level: 1, isStop: 0 },
    13: { name: '静置总压过高二级告警', level: 2, isStop: 0 },
    14: { name: '静置总压过高三级告警', level: 3, isStop: 0 },
    15: { name: '充放电总压过低一级告警', level: 1, isStop: 0 },
    16: { name: '充放电总压过低二级告警', level: 2, isStop: 1 },
    17: { name: '充放电总压过低三级告警', level: 3, isStop: 1 },
    18: { name: '静置总压过低一级告警', level: 1, isStop: 0 },
    19: { name: '静置总压过低二级告警', level: 2, isStop: 0 },
    20: { name: '静置总压过低三级告警', level: 3, isStop: 0 },
    21: { name: '放电SOC过低一级告警', level: 1, isStop: 0 },
    22: { name: '放电SOC过低二级告警', level: 2, isStop: 0 },
    23: { name: '放电SOC过低三级告警', level: 3, isStop: 0 },
    24: { name: '充电SOC过低一级告警', level: 1, isStop: 0 },
    25: { name: '充电SOC过低二级告警', level: 2, isStop: 0 },
    26: { name: '充电SOC过低三级告警', level: 3, isStop: 0 },
    39: { name: 'SOC过高一级告警', level: 1, isStop: 0 },
    40: { name: 'SOC过高二级告警', level: 2, isStop: 0 },
    41: { name: 'SOC过高三级告警', level: 3, isStop: 0 },
    42: { name: 'SOC跳变一级告警', level: 1, isStop: 0 },
    43: { name: 'SOC跳变二级告警', level: 2, isStop: 0 },
    44: { name: 'SOC跳变三级告警', level: 3, isStop: 0 },
    45: { name: '整组电压不均一级告警', level: 1, isStop: 0 },
    46: { name: '整组电压不均二级告警', level: 2, isStop: 1 },
    47: { name: '整组电压不均三级告警', level: 3, isStop: 1 },
    48: { name: '充放电电流过高一级告警', level: 1, isStop: 1 },
    49: { name: '充放电电流过高二级告警', level: 2, isStop: 1 },
    50: { name: '充放电电流过高三级告警', level: 3, isStop: 1 },
}

const myCellAlertConfig = {
    3: { name: '充放电温度过高一级告警', level: 1, isStop: 1 },
    4: { name: '充放电温度过高二级告警', level: 2, isStop: 1 },
    5: { name: '充放电温度过高三级告警', level: 3, isStop: 1 },
    6: { name: '静置温度过高一级告警', level: 1, isStop: 1 },
    7: { name: '静置温度过高二级告警', level: 2, isStop: 1 },
    8: { name: '静置温度过高三级告警', level: 3, isStop: 1 },
    27: { name: '放电/静置单体电压过高一级告警', level: 1, isStop: 0 },
    28: { name: '放电/静置单体电压过高二级告警', level: 2, isStop: 0 },
    29: { name: '放电/静置单体电压过高三级告警', level: 3, isStop: 0 },
    30: { name: '充电单体电压过高一级告警', level: 1, isStop: 0 },
    31: { name: '充电单体电压过高二级告警', level: 2, isStop: 1 },
    32: { name: '充电单体电压过高三级告警', level: 3, isStop: 1 },
    33: { name: '放电/静置单体电压过低一级告警', level: 1, isStop: 1 },
    34: { name: '放电/静置单体电压过低二级告警', level: 2, isStop: 1 },
    35: { name: '放电/静置单体电压过低三级告警', level: 3, isStop: 1 },
    36: { name: '充电单体电压过低一级告警', level: 1, isStop: 1 },
    37: { name: '充电单体电压过低二级告警', level: 2, isStop: 1 },
    38: { name: '充电单体电压过低三级告警', level: 3, isStop: 1 },
    51: { name: '充电温度过低一级告警', level: 1, isStop: 1 },
    52: { name: '充电温度过低二级告警', level: 2, isStop: 1 },
    53: { name: '充电温度过低三级告警', level: 3, isStop: 1 },
    54: { name: '放电温度过低一级告警', level: 1, isStop: 1 },
    55: { name: '放电温度过低二级告警', level: 2, isStop: 1 },
    56: { name: '放电温度过低三级告警', level: 3, isStop: 1 }
}

// 获取SOC值
function getSoc() {
    return gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['cluster_soc'];
}

// 获取SOH值
function getSoh() {
    const soh = gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['soh'];
    return soh === 0 ? 100 : soh;
}

// 获取电流值
function getBmsI() {
    return gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['current'];
}

// 获取直流侧累计充电量kwh
function getBmsSumCharge() {
    return gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['total_charge_capacity'];
}

// 获取直流侧累计放电量kwh
function getBmsSumDischarge() {
    return gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['total_discharge_capacity'];
}

// 获取正极绝缘电阻值(kΩ)
function getBmsPositiveResistance() {
    return gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['positive_resistance'];
}

// 获取负极绝缘电阻值(kΩ)
function getBmsNegativeResistance() {
    return gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['negative_resistance'];
}

// 获取pcs的电流
function getPcsI() {
    return gdata['cfg']['data']['pcs_table']['battery_electricity'];
}



// 获取bms状态值
function getBmsStatus() {
    const I = gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['current'];
    const relayStatus = getRelayStatus(gdata['cfg'], 0);
    let status = 4;
    if (I < -runConfig.variableI) {
        status = 1
    } else if (I > runConfig.variableI) {
        status = 2
    } else if (relayStatus === 1) {
        status = 0;
    }
    if (relayStatus === 0) {
        status = 4;
    }
    return status;
}

// 停止充放电
function stopAction() {
    if (getP() !== 0) {
        setP(0);
    }
    if (getPcsStatus() !== 0 && getPcsStatus() !== 4) {
        closePcs();
    }
    if (getBmsStatus() !== 0) {
        closeBms();
    }

}

// 充电
function chargeAction(p) {
    if (getBmsStatus() === 0) {
        openBms();
    }
    if (getPcsStatus() === 0 || getPcsStatus() === 4) {
        openPcs();
    }
    if (getP() !== p) {
        setP(p)
    }

}

// 放电
function dischargeAction(p) {
    const realP = p * -1; // 实际放电功率为负值
    if (getBmsStatus() === 0) {
        openBms();
    }
    if (getPcsStatus() === 0 || getPcsStatus() === 4) {
        openPcs();
    }
    if (getP() !== realP) {
        setP(realP);
    }
}

// 检测充放电状态
function checkChargeStatus() {
    // 检测是否有停止充电的相关告警
    let isAlert = 0;
    // 检测bms告警
    if (runConfig.enableAlert === 1) { // 遍历自己计算BMS告警
        const alertArr = gdata['cfg']['data']['bms_table']['alert'][0];
        for (let i = 0; i < alertArr.length; i++) {
            if (alertArr[i]['data']['v'] === 1) {
                if ((myRackAlertConfig.hasOwnProperty(i) && myRackAlertConfig[i]['isStop'] === 1) || (myCellAlertConfig.hasOwnProperty(i) && myCellAlertConfig[i]['isStop'] === 1)) {
                    isAlert = 1;
                    break;
                }
            }
        }
    } else { // 遍历系统的BMS告警
        const alertArr = gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['alert'];
        for (let i = 0; i < alertArr.length; i++) {
            if (alertArr[i] === 1) {
                if ((rackAlertConfig.hasOwnProperty(i) && rackAlertConfig[i]['isStop'] === 1) || (cellAlertConfig.hasOwnProperty(i) && cellAlertConfig[i]['isStop'] === 1)) {
                    isAlert = 1;
                    break;
                }
            }
        }
    }

    // 检测pcs告警
    const pcsAlertArr = gdata['cfg']['data']['pcs_table']['alert'];
    for (let i = 0; i < pcsAlertArr.length; i++) {
        if (pcsAlertArr[i] === 1 && pcsAlertConfig.hasOwnProperty(i) && pcsAlertConfig[i]['isStop'] === 1) {
            isAlert = 1;
            break;
        }
    }

    if (isAlert === 1) {
        stopAction();
        return;
    }

    // 自动充放电检测
    const enabled = runConfig.chargeConfig['enabled'];
    const currentP = Math.abs(getP());
    const currentTime = new Date();
    if (enabled === 1) {
        const hour = currentTime.getHours();
        const actions = runConfig.chargeConfig.actions;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const startHour = action['startHour'];
            const endHour = action['endHour'];
            if (hour >= startHour && hour < endHour) {
                const actionType = action['action'];
                const actionP = action['p'];
                if (actionType === 1 && getSoc() < runConfig.maxSoc) {
                    let expectedP = currentP + chargeStartPInterval;
                    if (currentP < actionP && currentTime.getTime() - lastChangePTime.getTime() > pChangeInterval) {
                        expectedP = expectedP >= actionP ? actionP : expectedP;
                        chargeAction(expectedP);
                        lastChangePTime = currentTime;
                    }
                } else if (actionType === 2 && getSoc() > runConfig.minSoc) {
                    dischargeAction(actionP);
                }
                break;
            } else if (lastCheckTime.getHours() < endHour && hour === endHour) {
                stopAction();
            }
        }
    }

    if (getP() > 0 && getSoc() >= runConfig.maxSoc - 3 && getSoc() < runConfig.maxSoc && getSoc() < runConfig.maxSoc && currentTime.getTime() - lastChangePTime.getTime() > pChangeInterval) {
        const expectedP = currentP - chargeStopPInterval;
        if (expectedP > 10) {
            chargeAction(expectedP);
            lastChangePTime = currentTime;
        }
    }

    if ((getSoc() <= runConfig.minSoc && getP() < 0) || (getSoc() >= runConfig.maxSoc && getP() > 0)) {
        stopAction();
    }

    lastCheckTime = currentTime;
}


// ================================================================
// =====                     	  接口                        =====
// ================================================================

// 认证
function auth(config, response) {
    if (!config.hasOwnProperty('password')) {
        response.code = 500;
        response.msg = "password is required";
        return;
    }
    if (config['password'] !== runConfig.password) {
        response.code = 401;
        response.msg = "auth failed password error";
    }
}

// 获取控制配置
function getControlConfig(response) {
    response.data = runConfig.chargeConfig;
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
    const currentP = Math.abs(getP());
    const currentTime = new Date();
    if (actionType === 1) {
        let expectedP = currentP + chargeStartPInterval;
        if (currentP < config['p'] && currentTime.getTime() - lastChangePTime.getTime() > pChangeInterval) {
            expectedP = expectedP >= config['p'] ? config['p'] : expectedP;
            chargeAction(expectedP);
            lastChangePTime = currentTime;
        }
    } else if (actionType === 2) {
        dischargeAction(config['p']);
    } else if (actionType === 0) {
        stopAction();
    } else {
        response.code = 500;
        response.msg = "action type error, action type should be 0, 1 or 2, 0 is stop, 1 is charge, 2 is discharge";
    }
}

// 改变充放电模式
function changeControlMode(config, response) {
    auth(config, response);
    if (response.code !== 200) return;
    if (!config.hasOwnProperty('enabled')) {
        response.code = 500;
        response.msg = "enabled is required";
        return;
    }
    if (Math.abs(getP()) > 0 && getPcsStatus() === 1) {
        response.code = 500;
        response.msg = "pcs is running, can not change config about auto, please stop pcs first";
    }
    if (config.hasOwnProperty('actions')) {
        config.actions.sort(function (a, b) {
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
        runConfig.chargeConfig.enabled = config.enabled;
        runConfig.chargeConfig.actions = config.actions;
        updateRunConfig();
    } else {
        response.code = 500;
        response.msg = "actions is required";
    }
}

// 展示数据返回
function list(response) {
    const pcs = {};
    const rack = {};
    const pack = [];
    const commAlert = [];
    const pcsAlert = [];
    const rackAlert = [];
    const cellAlert = [];
    const airAlert = [];
    const fire = {};
    const alert = { commAlert: commAlert, pcsAlert: pcsAlert, rackAlert: rackAlert, cellAlert: cellAlert, airAlert: airAlert };
    response.data = { pcs: pcs, rack: rack, pack: pack, alert: alert, fire: fire };

    // 簇级数据
    rack.u = 0;
    rack.i = Number(getBmsI().toFixed(2));
    rack.soc = Number(getSoc().toFixed(2));
    rack.soh = Number(getSoh().toFixed(2));
    rack.capacity = runConfig.deviceSize * runConfig.packSize * runConfig.coreSize * runConfig.capacity * 3.2 / 1000;
    rack.canCharge = Number((rack.capacity - rack.soc * rack.capacity / 100).toFixed(2));
    rack.canDischarge = Number((rack.soc * rack.capacity / 100).toFixed(2));
    rack.sumCharge = Number((getBmsSumCharge() / 1000).toFixed(3));
    rack.sumDischarge = Number((getBmsSumDischarge() / 1000).toFixed(2));
    rack.runMode = getBmsStatus();
    rack.relay = getRelayStatus(gdata['cfg'], 0);

    // 包级数据
    const voltage = gdata['cfg']['data']['source_bms_table']['voltage'][0];
    const temperature = gdata['cfg']['data']['source_bms_table']['temperature'][0];
    for (let j = 0; j < runConfig.packSize; j++) {
        const packObj = { sumU: 0, maxU: 0, minU: 65535, maxT: 0, minT: 65535 };
        for (let k = 0; k < runConfig.coreSize; k++) {
            packObj.sumU += voltage[j][k]['data']['v'];
            packObj.maxU = Math.max(voltage[j][k]['data']['v'], packObj.maxU);
            packObj.minU = Math.min(voltage[j][k]['data']['v'], packObj.minU);
            packObj.maxT = Math.max(temperature[j][k]['data']['v'], packObj.maxT);
            packObj.minT = Math.min(temperature[j][k]['data']['v'], packObj.minT);
        }
        packObj.sumU = Number(packObj.sumU.toFixed(2));
        packObj.maxU = Number(packObj.maxU.toFixed(2));
        packObj.minU = Number(packObj.minU.toFixed(2));
        packObj.maxT = Number(packObj.maxT.toFixed(1));
        packObj.minT = Number(packObj.minT.toFixed(1));
        pack.push(packObj);
        rack.u += packObj.sumU;
    }
    rack.u = Number(rack.u.toFixed(2));

    // PCS数据
    pcs.runMode = getPcsStatus() !== 4 ? 1 : 0;
    // pcs.positiveResistance =  cfg_data['data']['pcs_table']['positive_resistance'];
    // pcs.negativeResistance =  cfg_data['data']['pcs_table']['negative_resistance'];
    pcs.positiveResistance = getBmsPositiveResistance();
    pcs.negativeResistance = getBmsNegativeResistance();
    pcs.i = getPcsI();
    pcs.p = getP();
    pcs.u = pcs.p === 0 || pcs.i === 0 ? 0 : Number((pcs.p * 1000 / pcs.i).toFixed(2));

    // 告警数据
    const pcsAlertTemp = [];
    const rackAlertTemp = [];
    const cellAlertTemp = [];
    const airAlertTemp = [];

    // 直流侧告警
    if (runConfig.enableAlert === 1) {
        const bmsAlert = gdata['cfg']['data']['bms_table']['alert'][0];
        for (let i = 0; i < bmsAlert.length; i++) {
            if (bmsAlert[i]['data']['v'] === 1) {
                if (myRackAlertConfig.hasOwnProperty(i)) {
                    rackAlertTemp.push(rackAlertConfig[i]);
                }
                if (myCellAlertConfig.hasOwnProperty(i)) {
                    cellAlertTemp.push(cellAlertConfig[i]);
                }
            }
        }
    } else {
        const bmsAlert = gdata['cfg']['data']['source_bms_table']['cluster_info'][0]['alert'];
        for (let i = 0; i < bmsAlert.length; i++) {
            if (bmsAlert[i] === 1) {
                if (rackAlertConfig.hasOwnProperty(i)) {
                    rackAlertTemp.push(rackAlertConfig[i]);
                }
                if (cellAlertConfig.hasOwnProperty(i)) {
                    cellAlertTemp.push(cellAlertConfig[i]);
                }
            }
        }
    }

    // rackAlertTemp根据level排序并取前四个,然后只取name放入rackAlert
    rackAlertTemp.sort(function (a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < rackAlertTemp.length; j++) {
        if (j >= 4) break;
        rackAlert.push(rackAlertTemp[j].name);
    }

    // cellAlertTemp根据level排序并取前四个,然后只取name放入cellAlert
    cellAlertTemp.sort(function (a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < cellAlertTemp.length; j++) {
        if (j >= 4) break;
        cellAlert.push(cellAlertTemp[j].name);
    }

    // 交流侧告警
    const pcsAlertData = gdata['cfg']['data']['pcs_table']['alert'];
    for (let i = 0; i < pcsAlertData.length; i++) {
        if (pcsAlertData[i] === 1) {
            if (pcsAlertConfig.hasOwnProperty(i)) {
                pcsAlertTemp.push(pcsAlertConfig[i]);
            }
        }
    }
    pcsAlertTemp.sort(function (a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < pcsAlertTemp.length; j++) {
        if (j >= 4) break;
        pcsAlert.push(pcsAlertTemp[j].name);
    }

    // 空调侧告警
    const airAlertData = gdata['cfg']['data']['kongtiao']['alert'];
    for (let i = 0; i < airAlertData.length; i++) {
        if (airAlertData[i] === 1) {
            if (airAlertConfig.hasOwnProperty(i)) {
                airAlertTemp.push(airAlertConfig[i]);
            }
        }
    }
    airAlertTemp.sort(function (a, b) {
        return a.level - b.level;
    });
    for (let j = 0; j < airAlertTemp.length; j++) {
        if (j >= 4) break;
        airAlert.push(airAlertTemp[j].name);
    }

    // 通讯告警
    if (gdata['cfg']['data']['connection_status']['bms'] === 0) {
        commAlert.push('BMS');
    }
    if (gdata['cfg']['data']['connection_status']['pcs'] === 0) {
        commAlert.push('PCS');
    }
    if (gdata['cfg']['data']['connection_status']['kongtiao'] === 0) {
        commAlert.push('AIR');
    }
    if (gdata['cfg']['data']['connection_status']['xiaofang'] === 0) {
        commAlert.push('FIRE');
    }

    // 消防状态
    fire.alert = getFireAlertCode();

}

// 获取基础参数
function getBaseParamConfig(response) {
    response.data = {
        uMax: runConfig.uMax,  // 最高充电电压限值
        iMax: runConfig.iMax,  // 最大充电电流限值
        minSoc: runConfig.minSoc,  // soc下限
        maxSoc: runConfig.maxSoc, // soc上限
        variableI: runConfig.variableI, // 有效电流
        rackSize: runConfig.deviceSize,  // 簇个数
        packSize: runConfig.packSize, // pack个数
        coreSize: runConfig.coreSize, // 单体个数
        capacity: runConfig.capacity, // 单体容量
        enableAlert: runConfig.enableAlert // 使用ems计算的告警
    }
}

// 更新基础参数
function updateBaseParamConfig(config, response) {
    auth(config, response);
    runConfig.uMax = config['uMax'];
    runConfig.iMax = config['iMax'];
    runConfig.minSoc = config['minSoc'];
    runConfig.maxSoc = config['maxSoc'];
    runConfig.variableI = config['variableI'];
    runConfig.deviceSize = config['rackSize'];
    runConfig.packSize = config['packSize'];
    runConfig.coreSize = config['coreSize'];
    runConfig.capacity = config['capacity'];
    runConfig.enableAlert = config['enableAlert'];
    updateRunConfig();
}

// 获取开路电压
function getOcvConfig(response) {
    response.data = runConfig.ocv;
}

// 更新开路电压
function updateOcvConfig(config, response) {
    auth(config, response);
    runConfig.ocv['0'] = config['0'];
    runConfig.ocv['5'] = config['5'];
    runConfig.ocv['10'] = config['10'];
    runConfig.ocv['15'] = config['15'];
    runConfig.ocv['20'] = config['20'];
    runConfig.ocv['25'] = config['25'];
    runConfig.ocv['30'] = config['30'];
    runConfig.ocv['35'] = config['35'];
    runConfig.ocv['40'] = config['40'];
    runConfig.ocv['45'] = config['45'];
    runConfig.ocv['50'] = config['50'];
    runConfig.ocv['55'] = config['55'];
    runConfig.ocv['60'] = config['60'];
    runConfig.ocv['65'] = config['65'];
    runConfig.ocv['70'] = config['70'];
    runConfig.ocv['75'] = config['75'];
    runConfig.ocv['80'] = config['80'];
    runConfig.ocv['85'] = config['85'];
    runConfig.ocv['90'] = config['90'];
    runConfig.ocv['95'] = config['95'];
    runConfig.ocv['100'] = config['100'];
    updateRunConfig();
}

// 获取告警保护参数
function getAlertConfig(response) {
    const alertConfig = {};
    // 取runConfig中的alertConfig,去除每个key下对象的index属性
    for (let key in runConfig.alertConfig) {
        const obj = runConfig.alertConfig[key];
        const newObj = {};
        for (let k in obj) {
            if (k !== 'index') {
                newObj[k] = obj[k];
            }
        }
        newObj['name'] = alertNameConfig[key]['name'];
        alertConfig[key] = newObj;
    }
    response.data = alertConfig;
}

// 更新告警保护参数
function updateAlertConfig(config, response) {
    auth(config, response);
    for (let key in runConfig.alertConfig) {
        runConfig.alertConfig[key]['threshold'] = config[key]['threshold'];
        runConfig.alertConfig[key]['interval'] = config[key]['interval'];
    }
    updateRunConfig();
}

// 获取单体数据(温度电压)
function getCellData(config, response) {
    if (!config.hasOwnProperty('packNo')) {
        response.code = 500;
        response.msg = "packNo is required";
        return;
    }
    const packIndex = config['packNo'] - 1;
    if (packIndex < 0 || packIndex >= runConfig.packSize) {
        response.code = 500;
        response.msg = `packNo is out of range packNo should be 1-${runConfig.packSize}`;
        return;
    }
    response.data = [];
    const cellUArr = gdata['cfg']['data']['source_bms_table']['voltage'][0][packIndex];
    const cellTArr = gdata['cfg']['data']['source_bms_table']['temperature'][0][packIndex];
    for (let i = 0; i < runConfig.coreSize; i++) {
        response.data.push({ u: Number(cellUArr[i]['data']['v'].toFixed(3)) * 1000, t: Number(cellTArr[i]['data']['v'].toFixed(1)) });
    }
}

// ================================================================
// =====                      框架部分                        =====
// ================================================================
const needParamFunctionArr = [
    'updateAutoConfig',
    'controlCharge',
    'updateBaseParamConfig',
    'updateOcvConfig',
    'updateAlertConfig',
    'getCellData'
];

function initConfig() {
	console.log("initConfig");

	// 启动 mqtt 连接
	let host = "192.168.2.54:1883";				// mqtt 服务器
	let data_topic = "can/192.168.2.55/can0";	// 数据主题
	let qos = 1;								// mqtt qos 
	let fn_onConn = "onMqttConn";				// 连接通过时的js回调函数
	let fn_onMsg = "onMqttMessage"; 			// 收到消息时的js回调函数
	mqtt.conn(host, data_topic, qos, fn_onConn, fn_onMsg); 	 
	
    let root = { "data": {} };
    root['data']['note'] = 'data这种映射方式便于计算';

    let data = { "data": { "t": 0, "v": 0 } };
    let data_hv = { "data": { "t": 0, "v": 0, "hv": 0 } };

    //bms计算结果
    let bms_table = {};
    bms_table['soc'] = [data];
    bms_table['soh'] = [data];
    bms_table['sumCharge'] = [data];
    bms_table['sumDischarge'] = [data];
    bms_table['sumChargeEnergy'] = [data];
    bms_table['sumDischargeEnergy'] = [data];
    let groupSumChargeEnergy = [];
    for (let i = 0; i < 88; i++) {
        groupSumChargeEnergy.push(data);
    }
    bms_table['groupSumChargeEnergy'] = groupSumChargeEnergy;

    let groupSumDischargeEnergy = [];
    for (let i = 0; i < 88; i++) {
        groupSumDischargeEnergy.push(data);
    }
    bms_table['groupSumDischargeEnergy'] = groupSumDischargeEnergy;

    bms_table['maxU'] = [data_hv];
    bms_table['minU'] = [data_hv];
    bms_table['maxTemp'] = [data_hv];
    bms_table['minTemp'] = [data_hv];

    let alert = [];
    for (let i = 0; i < 60; i++) {
        alert.push(data);
    }
    bms_table['alert'] = alert;
    root['data']['bms_table'] = bms_table;

    //pcs    
    let pcs_table = {};
    pcs_table['device_name'] = "pcs";
    pcs_table['data_time'] = 0;
    pcs_table['protocol'] = "modbus_rtu";
    pcs_table['active_power'] = 0;
    pcs_table['reactive_power'] = 0;
    pcs_table['positive_resistance'] = 0;
    pcs_table['negative_resistance'] = 0;
    pcs_table['battery_electricity'] = 0;
    pcs_table['running_status'] = 0;
    let pcs_alert = [];
    for (let i = 0; i < 17; i++) {
        pcs_alert.push(0);
    }
    pcs_table['alert'] = pcs_alert;
    root['data']['pcs_table'] = pcs_table;

    //空调
    let kongtiao = {};
    kongtiao['device_name'] = "kongtiao";
    kongtiao['data_time'] = 0;
    kongtiao['protocol'] = "modbus_rtu";
    kongtiao['temp_in_cabinet'] = 0;
    kongtiao['temp_out_cabinet'] = 0;
    kongtiao['hum_in_cabinet'] = 0;
    kongtiao['hum_out_cabinet'] = 0;
    kongtiao['temp_pipe'] = 0;
    let kongtiao_alert = [];
    for (let i = 0; i < 18; i++) {
        kongtiao_alert.push(0);
    }
    kongtiao['alert'] = kongtiao_alert;
    root['data']['kongtiao'] = kongtiao;

    //消防
    let fire = {};
    fire['device_name'] = "fire";
    fire['data_time'] = 0;
    fire['protocol'] = "can";
    fire['alert'] = 0;
    root['data']['fire'] = fire;

    //采集状态
    let connection_status = {};
    connection_status['bms'] = 1;
    connection_status['pcs'] = 1;
    connection_status['kongtiao'] = 1;
    connection_status['xiaofang'] = 1;
    root['data']['connection_status'] = connection_status;

    //bms源数据
    let source_bms_table = {};
    let device = {};
    let device_array = [];
    device['protocol'] = "can";
    device['addr'] = "can0";
    device['note'] = "引用";
    let name = "";
    for (let i = 0; i < 1; i++) {
        name = "簇" + i;
        device['name'] = name;
        device_array.push(device);
    }
    source_bms_table['device'] = device_array;

    let voltage = [];
    let voltage_array = [];
    let voltage_pack = [];
    for (let i = 0; i < runConfig.coreSize; i++) {
        voltage_pack.push(data);
    }
    for (let i = 0; i < runConfig.packSize; i++) {
        voltage_array.push(voltage_pack);
    }
    for (let i = 0; i < 1; i++) {
        voltage.push(voltage_array);
    }
    source_bms_table['voltage'] = voltage;

    let temperature = [];
    let temperature_array = [];
    let temperature_pack = [];
    for (let i = 0; i < runConfig.coreSize; i++) {
        temperature_pack.push(data);
    }
    for (let i = 0; i < runConfig.packSize; i++) {
        temperature_array.push(temperature_pack);
    }
    for (let i = 0; i < 1; i++) {
        temperature.push(temperature_array);
    }
    source_bms_table['temperature'] = temperature;

    let cluster_info_array = [];
    let cluster_info = {};
    cluster_info['t'] = 0;
    cluster_info['cluster_soc'] = 0;
    cluster_info['max_soc_num'] = 0;
    cluster_info['max_soc'] = 0;
    cluster_info['min_soc_num'] = 0;
    cluster_info['min_soc'] = 0;
    cluster_info['charge_capacity'] = 0;
    cluster_info['discharge_capacity'] = 0;
    cluster_info['once_charge_capacity'] = 0;
    cluster_info['once_discharge_capacity'] = 0;
    cluster_info['total_charge_capacity'] = 0;
    cluster_info['total_discharge_capacity'] = 0;
    cluster_info['charge_count'] = 0;
    cluster_info['discharge_count'] = 0;
    cluster_info['soh'] = 0;
    cluster_info['current_discharge_ele_limit'] = 0;
    cluster_info['current_charge_ele_limit'] = 0;
    cluster_info['config_discharge_ele_limit'] = 0;
    cluster_info['config_charge_ele_limit'] = 0;
    cluster_info['charge_max_vol_limit'] = 0;
    cluster_info['discharge_min_vol_limit'] = 0;
    cluster_info['charge_max_p_limit'] = 0;
    cluster_info['discharge_max_p_limit'] = 0;
    cluster_info['bcmu_status'] = 0;
    cluster_info['fault_level_bs'] = 0;
    cluster_info['balance_status'] = 0;
    cluster_info['bcmu_running_day'] = 0;
    cluster_info['bcmu_running_hour'] = 0;
    cluster_info['bcmu_running_minute'] = 0;
    cluster_info['bcmu_running_second'] = 0;
    cluster_info['bcmu_pcs_protocol'] = "";
    cluster_info['balance_model'] = 0;
    cluster_info['balance_ele'] = 0;
    cluster_info['upper_vol_permit_balance'] = 0;
    cluster_info['lower_vol_permit_balance'] = 0;
    cluster_info['active_balance_model'] = 0;
    cluster_info['negative_relay_status'] = 0;
    cluster_info['positive_relay_status'] = 0;
    cluster_info['pre_relay_status'] = 0;
    cluster_info['pcs_shutdown_relay_status'] = 0;
    cluster_info['pcs_jumpdown_relay_status'] = 0;
    cluster_info['fan_relay_status'] = 0;
    cluster_info['switch_1'] = 0;
    cluster_info['switch_2'] = 0;
    cluster_info['positive_resistance'] = 0;
    cluster_info['negative_resistance'] = 0;
    cluster_info['high_temp_cabinet_1'] = 0;
    cluster_info['high_temp_cabinet_2'] = 0;
    cluster_info['sumU'] = 0;
    cluster_info['current'] = 0;
    cluster_info['p'] = 0;
    cluster_info['max_vol_model'] = 0;
    cluster_info['max_vol_model_num'] = 0;
    cluster_info['min_vol_model'] = 0;
    cluster_info['min_vol_model_num'] = 0;
    cluster_info['avg_vol_model'] = 0;
    cluster_info['max_vol'] = 0;
    cluster_info['max_vol_num'] = 0;
    cluster_info['min_vol'] = 0;
    cluster_info['min_vol_num'] = 0;
    cluster_info['avg_vol'] = 0;
    cluster_info['max_temp'] = 0;
    cluster_info['max_temp_num'] = 0;
    cluster_info['min_temp'] = 0;
    cluster_info['min_temp_num'] = 0;
    cluster_info['avg_temp'] = 0;
    cluster_info['battery_pack_count'] = 0;
    cluster_info['bsu_count_in_pack'] = 0;
    cluster_info['battery_count_in_bsu'] = 0;
    cluster_info['point_temp_in_bsu'] = 0;
    cluster_info['battery_vol_standard'] = 0;
    cluster_info['bs_pcs_ele_standard'] = 0;
    cluster_info['capcity_standard'] = 0;
    cluster_info['battery_type'] = 0;
    cluster_info['battery_capcity_available'] = 0;
    cluster_info['vol_standard'] = 0;
    cluster_info['battery_capcity_standard'] = 0;
    cluster_info['precharge_max_time'] = 0;
    let cluster_alert = [];
    for (let i = 0; i < 61; i++) {
        cluster_alert.push(0);
    }
    cluster_info['alert'] = cluster_alert;
    cluster_info['fault_system_source_vol'] = 0;
    cluster_info['fault_total_vol'] = 0;
    cluster_info['fault_total_current'] = 0;
    cluster_info['fault_max_vol'] = 0;
    cluster_info['fault_max_vol_num'] = 0;
    cluster_info['fault_min_vol'] = 0;
    cluster_info['fault_min_vol_num'] = 0;
    cluster_info['fault_max_temp'] = 0;
    cluster_info['fault_max_temp_num'] = 0;
    cluster_info['fault_min_temp'] = 0;
    cluster_info['fault_min_temp_num'] = 0;
    cluster_info['fault_system_soc'] = 0;
    cluster_info['fault_system_soh'] = 0;
    cluster_info['fault_bcmu_status'] = 0;
    cluster_info['fault_bs_level'] = 0;

    for (let i = 0; i < 1; i++) {
        cluster_info_array.push(cluster_info);
    }
    source_bms_table['cluster_info'] = cluster_info_array;
    root['data']['source_bms_table'] = source_bms_table;

    //初始化全局数据对象
    root['data']['init'] = true;
    gdata["cfg"] = root;
    // console.log('js:(initConfig)  json:', JSON.stringify(root));

    initRunConfig();
    uartInit();
}

function onCANMessage(port, msg) {
    let array = new Uint8Array(msg);
    if (16 !== array.length) {
        return;
    }
    let containPort = false;
    let reverse = 0;
    for (let i = 0; i < sysConfig.length; ++i) {
        if (sysConfig[i]['port'] === port) {
            containPort = true;
            reverse = sysConfig[i]['reverse'];
            break;
        }
    }
    if (!containPort) return;
    //messageID 取前29位，字节序需要反转
    let messageIdArr = new Uint8Array(4);
    if (reverse === 1) {
        messageIdArr[0] = array[3] & 0x1F;
        messageIdArr[1] = array[2];
        messageIdArr[2] = array[1];
        messageIdArr[3] = array[0];
    } else {
        messageIdArr[0] = array[0] & 0x1F;
        messageIdArr[1] = array[1];
        messageIdArr[2] = array[2];
        messageIdArr[3] = array[3];
    }
    let msgId = '';
    for (let i = 0; i < messageIdArr.length; ++i) {
        msgId += (messageIdArr[i] > 15 ? "" : "0") + messageIdArr[i].toString(16);
    }
    // 获取系统名
    let sys = '';
    for (let i = 0; i < sysConfig.length; i++) {
        if (port === sysConfig[i].port && sysConfig[i].msgIds.includes(msgId)) {
            sys = sysConfig[i].sys;
            break;
        }
    }
    if ('bms' === sys) {
        bmsHandle(port, msg);
    } else if ('pcs' === sys) {
        pcsHandle(port, msg);
    } else if ('air' === sys) {
        airHandle(port, msg);
    } else if ('fire' === sys) {
        fireHandle(port, msg);
    } else {
        handleLog('unknown system with receive can message')
    }


}

function onMqttConn(conn_id){
	console.log("onMqttConn",conn_id);
	// 打开时增加订阅 
	mqtt.sub(conn_id, "can/#");	// sub topic 
	
	console.log("mqtt sub ");
	// 打开时发送通知， Publish topic s_pub_topic
	// mqtt.pub("can/192.168.2.55/can0","tttt"); // pub: topic,message
} 

function onMqttMessage(conn_id, topic, payload) {
	
	console.log("onMqttMessage: ", conn_id, topic);
	
	let arr_payload = new Uint8Array(payload);
	
	
	// 两种读取方式：
	// 1、二进制数组 
	// for( const v of arr_payload)
		// console.log(v);
	
	// 2、字串
	let str =String.fromCharCode.apply(null, arr_payload); 
	console.log("onMqttMessage [", topic, "] payload:[",str,"] length", str.length);


	// 测试 发布 功能 
	let new_payload = "Echo:" + str;
	// 字串转数组，charCode 是我 自己写的函数 ，需要更新 quickjs.c  
	let buf = Uint8Array.charCode(new_payload).buffer;
	if(new_payload.length<20 && new_payload.length>8)
		mqtt.pub(topic, buf);
}

function onUartMessage(port, msg) {
	// mqtt.pub("can/192.168.2.55/can0", new Uint8Array("Echo:"));
	
	
    let array = new Uint8Array(msg);
	console.log("onUartMessage: ", port, array.length);
    const addressId = String(array[0]);
    // 获取系统名
    let sys = '';
    for (let i = 0; i < sysConfig.length; i++) {
        if (port === sysConfig[i].port && addressId === sysConfig[i].addressId) {
            sys = sysConfig[i].sys;
            break;
        }
    }
    if ('bms' === sys) {
        bmsHandle(port, msg);
    } else if ('pcs' === sys) {
        pcsHandle(port, msg);
    } else if ('air' === sys) {
        airHandle(port, msg);
    } else if ('fire' === sys) {
        fireHandle(port, msg);
    } else {
        handleLog('unknown sys with receive uart message')
    }

}

function jsapi_router(apidata) {
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
        if (needParamFunctionArr.includes(data.type) && !data.hasOwnProperty('param')) {
            response.code = 500;
            response.msg = "param is required, request body is: " + apidata;
            return response;
        }
        switch (data.type) {
            case "list":
                list(response);
                break;
            case "updateAutoConfig":
                changeControlMode(data.param, response);
                break;
            case "controlCharge":
                manualControl(data.param, response);
                break;
            case "getAutoConfig":
                getControlConfig(response);
                break;
            case "getBaseParamConfig":
                getBaseParamConfig(response);
                break;
            case "updateBaseParamConfig":
                updateBaseParamConfig(data.param, response);
                break;
            case "getOcvConfig":
                getOcvConfig(response);
                break;
            case "updateOcvConfig":
                updateOcvConfig(data.param, response);
                break;
            case "getAlertConfig":
                getAlertConfig(response);
                break;
            case "updateAlertConfig":
                updateAlertConfig(data.param, response);
                break;
            case "getCellData":
                getCellData(data.param, response);
                break;
            default:
                response.code = 500;
                response.msg = `not support type '${data.type}'`;
                break;
        }
    } catch (err) {
        response.code = 500;
        response.msg = err.message;
    } finally {
        return JSON.stringify(response);
    }



}

// 自定义计算函数
function calculate(ttt, bbb) {
    return ttt + 2000 + bbb;
}

// timer 定时器
function timerTest() {
    console.log('js:', "Timer testing");

    os.setTimeout(() => { std.printf('js: Timer after 2000ms: AABC============\n') }, 2000);
}

// 修改 json 实例
function testJson(json) {

    console.log('js:(testJson)', JSON.stringify(json));

    json["parsers"]["canid_0"]["myfield_1"]["value"] = 9.1;
    console.log('js:(testJson new)', JSON.stringify(json));

    // return ttt+2000+bbb;
}


function printTest() {
    console.log('js:', "std printf testing");
    std.printf('AAB============\n');
    //console.log('js:',calculate(1,2));

    // console.log('js:',core.writeVersion("0.0.1"));
    // console.log('js:',core.readVersion());
    // console.log('js:',"ver:" + core.version);


    const objaaa = { "a": 1, "b": 2, "c": 3 };
    for (let key in objaaa) {
        console.log('js:', "-->" + key + ":" + objaaa[key]);
    }
    // console.log('js:========');
    // var props = Object.keys(objaaa);
    // console.log('js:(props)',props);

    const obj_new = { "t1": objaaa, "t2": { "d": 4 } };
    objaaa["a"] = 5;
    console.log('js:', JSON.stringify(obj_new));


    return "aaaa";
    // return props;
}

// 调用系统指令
function osTest() {
    console.log('js:', "OS testing");
    console.log('js:', os.getcwd());

    return os.getcwd();
}

function LogTest() {
    console.log('test js log ...............');
}

function IsCompute() {
    return true;
}




// ================================================================
// =====                      工具方法                        =====
// ================================================================

// 格式化时间
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function CRC16_MODBUS(buf, len)			//CRC16/modbus计算
{
    var crc = 0xffff;	//寄存器初始值	
    var i;
    var j;

    for (j = 0; j < len; j++) {
        crc = crc ^ buf[j];

        for (i = 0; i < 8; i++) {
            if ((crc & 0x0001) == 1) {
                crc >>= 1;
                crc ^= 0xa001;
            }
            else {
                crc >>= 1;
            }
        }
    }
    return crc;
}

// 串口初始化
function uartInit() {
    // 打开串口，设置波特率，数据位，停止位，校验位，读取读取回调函数等参数
    uart.listen(sysConfig[1].port, 9600, 8, "1", 'N', "onUartData");
    // 设置间隔执行任务函数回调，间隔时间(ms)
    uart.setInterval("uart_setInterval", 2000);
}

function onUartData(msg) {
    let array = new Uint8Array(msg);
    // console.log("onUartData len:", array.length, array[0]);
}

function uart_setInterval() {
    // console.log("uart_setInterval");
    uart_dskl_modbus_send();
}

// modbus RTU 读取寄存器地址 -- 帝森克罗德通讯协议
// 通过显示屏读写PCS模块数据，寄存器地址为本表寄存器地址加上模块号*1000：
// 例如：本表地址为3，显示屏上模块号为1，则寄存器地址为3+1*1000=1003
// 地址码	1字节	系统地址
// 功能码	1字节	0x03
// 起始地址	2字节	寄存器地址
// 寄存器数量	2字节	1-125
// CRC校验	2字节	低8位在前，高8位在后
function uart_dskl_modbus_send() {
    let array = new Uint8Array(8);
    let readCount = 90;// 读取寄存器个数
    let startAddress = 0;// 本表起始寄存器地址
    let screenId = 1;// 显示屏上模块号,这个需要现场配置
    startAddress = startAddress + screenId * 1000;
    array[0] = sysConfig[1].addressId;// 地址码,从站地址
    array[1] = 0x03;// 功能码
    array[2] = (startAddress >> 8) & 0xff;// 起始寄存器的高地址
    array[3] = startAddress & 0xff;// 起始寄存器的低地址
    array[4] = (readCount >> 8) & 0xff;// 寄存器个数高地址
    array[5] = readCount & 0xff;// 寄存器个数低地址
    let crc16 = CRC16_MODBUS(array, 6);
    array[6] = crc16 & 0xff;// crc 低地址
    array[7] = (crc16 >> 8) & 0xff;// crc 高地址
    let ret = uart.write(array.buffer);
    if (ret != 'success') {
        // 发送失败
        handleLog(ret);
    }
}
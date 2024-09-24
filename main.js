// 告警阈值
const alertConfig = {
    tempDiff: {threshold : [20, 15, 10], index: [0, 1, 2]},
    chargeOverTemp: {threshold : [60, 55, 50], index: [3, 4, 5]},
    stopOverTemp: {threshold : [60, 0, 0], index: [6, 7, 8]},
    chargeOverSumU: {threshold : [321, 316, 308], index: [9, 10, 11]},
    stopOverSumU: {threshold : [316, 0, 0], index: [12, 13, 14]},
    chargeLowSumU: {threshold : [220, 228, 246], index: [15, 16, 17]},
    stopLowSumU: {threshold : [220, 0, 0], index: [18, 19, 20]},
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

// 中间数据存储
const temp_data = {
    soh: [{charge: 0, discharge: 0},{charge: 0, discharge: 0}],
    socJump: [[{t:0,v:0}],[{t:0,v:0}]],
    alert: [{tempDiffOne: {t:0,v:0}},{tempDiffOne: {t:0,v:0}}]
}

const cfg_data = {
"data":
    {
        "note":"data这种映射方式便于计算",
        "bms_table":{
            "device": [
                {"protocol":"canfd", "addr":"can0", "name":"簇1", "note":"引用"},
            ]
            ,
            "voltage":[
                [
                    [
                        {"data":{"t":12312,"v":12.3}},
                        {"data":{"t":12312,"v":12.3}}
                    ]
                ]
            ],
            "temperature":[
                [
                    [
                        {"data":{"t":12312,"v":12.3}},
                        {"data":{"t":12312,"v":12.3}}
                    ]
                ]
            ],
            "current":[
                {"data":{"t":12312,"v":12.3}}
            ],
            "soc":[
                {"data":{"t":0,"v":0}}
            ],
            "soh":[
                {"data":{"t":0,"v":0}}
            ],
            "sumCharge":[
                {"data":{"t":0,"v":0}}
            ],
            "sumDischarge":[
                {"data":{"t":0,"v":0}}
            ],
            "sumChargeEnergy":[
                {"data":{"t":0,"v":0}}
            ],
            "sumDischargeEnergy":[
                {"data":{"t":0,"v":0}}
            ],
            "groupSumChargeEnergy":[
                [
                    {"data":{"t":0,"v":0}},
                    {"data":{"t":0,"v":0}}
                ]
            ],
            "groupSumDischargeEnergy":[
                [
                    {"data":{"t":0,"v":0}},
                    {"data":{"t":0,"v":0}}
                ]
            ],
            "maxU":[
                {"data":{"t":0,"v":0}}
            ],
            "minU":[
                {"data":{"t":0,"v":0}}
            ],
            "maxTemp":[
                {"data":{"t":0,"v":0}},
                {"data":{"t":0,"v":0}}
            ],
            "minTemp":[
                {"data":{"t":0,"v":0}}
            ],
            "relay": [
                {"data":{"t":0,"v":0}}
            ],
            "preRelay": [
                {"data":{"t":0,"v":0}}
            ],
            "alert":[
                [
                    {"data":{"t":0,"v":0}}
                ]
            ],
            "status": [
                [
                    [
                        {"data":{"t":0,"v":0}},
                        {"data":{"t":0,"v":0}}
                    ]
                ]
            ]
        }
    }
}

const deviceSize = 1;
const packSize = 88;
const coreSize = 2;

let count = 1;
let sleep = 5;
let init_flag = 0;
let charge_type =  1;

/*genDataLocal(cfg_data);

for (let i = 0; i < 1000; i++) {
    setTimeout(() => {
        realCompute(cfg_data);
        // console.log(JSON.stringify(cfg_data))
    }, 1000 * i)
}*/



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
    chargeLowTempCompute(cfg_data, temp_data);
    // console.log("计算耗时：" + (Date.now() - start) + "ms")
    codeData(cfg_data);
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
            if (run === 1) setTimeout(updateChargeData, 1000);
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

function genData(cfg_data){
    // 初始化告警状态
    if (init_flag === 0) {
        /*for (let deviceIndex = 0; deviceIndex < deviceSize; deviceIndex++) {
            for (let i = 0; i < 100; i++) {
                cfg_data['data']['bms_table']['alert'][deviceIndex][i] = {"data":{"t":0,"v":0}};
            }
        }*/
        init_flag = 1;
    }

    function updateChargeData() {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
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
                    charge_type = 2;
                    count = 1;
                    sleep = 5;
                }
            }
            count++;
            // console.log(cfg_data['data']['bms_table']['current']);
        }
    };

    function updateDischargeData() {
        console.log("----------------------------------------------------------")
        if (1 === 1) {
            const time = Date.now();
            const u = 3.3 - 0.01 * count;
            for (let i = 0; i < deviceSize; i++) {
                // 更改电流数据
                cfg_data['data']['bms_table']['current'][i]['data']['v'] = u <= getStopDischargeU() ? 0 : Math.random() * (30) + (140 * 200);
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
                    charge_type = 1;
                    count = 1;
                    updateChargeData();
                    sleep = 5;
                }
            }
            count++;
            // console.log(cfg_data['data']['bms_table']['current']);
        }
    }

    if (charge_type === 1) {
        updateChargeData()
    } else if (charge_type === 2) {
        updateDischargeData();
    }

    // console.log("cfg_data",JSON.stringify(cfg_data));
}

// 计算SOC
function computeSoc(cfg_data) {
    const iArray = cfg_data['data']['bms_table']['current'];
    const stopDischargeU = getStopDischargeU();
    const stopChargeU = getStopChargeU();
    for(let i = 0; i < deviceSize; i++) {
        const iData = iArray[i]['data'];
        const socData = cfg_data['data']['bms_table']['soc'][i]['data'];
        if (socData['t'] === 0) { // 第一次计算
            socData['t'] = iData['t'];
        } else {
            const I = Math.abs(iData['v']) > variableI ? iData['v'] : 0;
            const ah = I * (iData['t'] - socData['t']) / 3600000;
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
            socData['t'] = iData['t'];
            if (ah < 0) {
                cfg_data['data']['bms_table']['sumCharge'][i]['data']['v'] = cfg_data['data']['bms_table']['sumCharge'][i]['data']['v'] + Math.abs(ah);
                cfg_data['data']['bms_table']['sumCharge'][i]['data']['t'] = iData['t'];
            } else {
                cfg_data['data']['bms_table']['sumDischarge'][i]['data']['v'] = cfg_data['data']['bms_table']['sumDischarge'][i]['data']['v'] + Math.abs(ah);
                cfg_data['data']['bms_table']['sumDischarge'][i]['data']['t'] = iData['t'];
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
    for (let i = 0; i < deviceSize; i++) {
        const I = cfg_data['data']['bms_table']['current'][i]['data']['v'];
        if (socArray[i]['data']['v'] === 100 && Math.abs(I) < variableI) {
            temp_data['soh'][i]['charge'] = sumChargeArray[i]['data']['v'];
            temp_data['soh'][i]['discharge'] = sumDischargeArray[i]['data']['v'];
            console.log(`添加累计充电量=${temp_data['soh'][i]['charge']},添加累计放电量=${temp_data['soh'][i]['discharge']}`);
        } else if (socArray[i]['data']['v'] === 0 && Math.abs(I) < variableI) {
            const chargeEnergy = sumChargeArray[i]['data']['v'] - temp_data['soh'][i]['charge'];
            const dischargeEnergy = sumDischargeArray[i]['data']['v'] - temp_data['soh'][i]['discharge'];
            console.log(`充电量=${chargeEnergy},放电量=${dischargeEnergy}`)
            console.log(`添加累计充电量=${sumChargeArray[i]['data']['v']},添加累计放电量=${sumDischargeArray[i]['data']['v']}`);
            if (chargeEnergy < capacity * 0.05) {
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
    let sumU = 0;
    for(let i = 0; i < deviceSize; i++) {
        const vData = vArray[i];
        const iData = iArray[i]['data'];
        const interval  = Date.now() - iData['t'];
        const now = Date.now();
        const I = Math.abs(iData['v']) > variableI ? iData['v'] : 0;
        for (let j = 0; j < packSize; j++) {
            const u = vData[j][0]['data']['v'];
            sumU += u;
            const groupEnergy = u * Math.abs(I) * interval / 3600000
            I < 0 ? cfg_data['data']['bms_table']['groupSumChargeEnergy'][i][j]['data']['v'] += groupEnergy : cfg_data['data']['bms_table']['groupSumDischargeEnergy'][i][j]['data']['v'] += groupEnergy;
            cfg_data['data']['bms_table']['groupSumChargeEnergy'][i][j]['data']['t'] = now;
            cfg_data['data']['bms_table']['groupSumDischargeEnergy'][i][j]['data']['t'] = now;
        }
        const energy = sumU * Math.abs(I) * interval / 3600000
        I < 0 ? cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['v'] += energy : cfg_data['data']['bms_table']['sumDischargeEnergy'][i]['data']['v'] += energy;
        cfg_data['data']['bms_table']['sumChargeEnergy'][i]['data']['t'] = now;
        cfg_data['data']['bms_table']['sumDischargeEnergy'][i]['data']['t'] = now;
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
                if (v > maxU) {
                    maxU = v;
                }
                if (v < minU) {
                    minU = v;
                }
                if (t > maxTemp) {
                    maxTemp = t;
                }
                if (t < minTemp) {
                    minTemp = t;
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
    return cfg_data['data']['bms_table']['relay'][deviceIndex]['data']['v'];
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
    alert: "Array(Int8,176)",
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

    for (let i = 0; i < cfg_data['data']['bms_table']['alert'][0].length ; i++) {
        sourceData.alert.push(cfg_data['data']['bms_table']['alert'][0][i]['data']['v']);
    }

    return sourceData;
}




function codeData(cfg_data) {
    console.log(toHexString(code(getSourceData(cfg_data))))
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



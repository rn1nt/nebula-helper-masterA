<template>
    <el-container>
        <el-aside style="padding-right: 120px;">
            <el-form :label-position="labelPosition" label-width="80px">
                <el-form-item label="COM Port">
                    <el-select v-model="com" :disabled="isOpen" placeholder="Please select">
                        <el-option v-for="port in ports" :label="port.label" :value="port.value"
                                   :key="port.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Baud rate">
                    <el-select v-model="options.baudRate" :disabled="isOpen" placeholder="Please select">
                        <el-option v-for="baudRate in baudRateList" :label="baudRate.label" :value="baudRate.value"
                                   :key="baudRate.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Parity bit">
                    <el-select v-model="options.parity" :disabled="isOpen" placeholder="Please select">
                        <el-option v-for="parity in parityList" :label="parity.label" :value="parity.value"
                                   :key="parity.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Data bit">
                    <el-select v-model="options.dataBits" :disabled="isOpen" placeholder="Please select">
                        <el-option v-for="dataBit in dataBitList" :label="dataBit.label" :value="dataBit.value"
                                   :key="dataBit.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Stop bit">
                    <el-select v-model="options.stopBits" :disabled="isOpen" placeholder="Please select">
                        <el-option v-for="stopBit in stopBitList" :label="stopBit.label" :value="stopBit.value"
                                   :key="stopBit.value"></el-option>
                    </el-select>
                </el-form-item>
                
   
                
                <el-form-item v-if="state == 0">
                    <el-col :span="5">
                        <el-button :size="buttonSize" type="info" circle icon="el-icon-switch-button"></el-button>
                    </el-col>
                  <el-col :span="10">
                        <el-button :size="buttonSize" @click="rescanPorts">Rescan</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button :size="buttonSize" @click="openCom">Open</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item v-else>
                    <el-col :span="5">
                        <el-button :size="buttonSize" type="success" circle icon="el-icon-switch-button"></el-button>
                    </el-col>         
                    <el-col :span="10">
                        <el-button :size="buttonSize" @click="rescanPorts">Rescan</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button :size="buttonSize" @click="closeCom">Close</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form>
                <el-form-item>
                    <el-col :span="8">
                        <el-button :size="buttonSize" @click="resetPullData">Empty the receiving area</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button :size="buttonSize" v-if="isShowPullDate" @click="updateShowPullDate">Stop display</el-button>
                        <el-button :size="buttonSize" v-else @click="updateShowPullDate">Resume display</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button :size="buttonSize" @click="writeFile">Save received data</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="12">
                        <el-checkbox v-model="autoClean">Auto-empty</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <el-checkbox v-model="hexDisplay">Hex display</el-checkbox>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-form style="align-items: center;">
                <el-form-item>
                    <span style="margin-right: 1rem;"><span style="color: red;">{{stateText}}</span></span>
                </el-form-item>
            </el-form>
        </el-aside>
        <el-main style="padding: 0 20px 0 0;">
            <el-form v-model="com">
                <el-form-item>
                    <el-input id="pullDta" type="textarea" resize="none" placeholder="Display area" v-model="pullData" :rows="10" readonly></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="textarea" resize="none" placeholder="Input Area" v-model="pushData" :rows="4" @input="hexRegExp"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-col :span="24" style="margin-top: 1rem;">
                        <el-input type="number" v-model="autoSendRate">
                            <template slot="prepend">Auto send cycle</template>
                            <template slot="append">ms</template>
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-checkbox v-model="autoSend" @change="autoSendData" style="margin-top: 1rem;">Auto Send</el-checkbox>
                        <el-checkbox v-model="hexSend" style="margin-top: 1rem;">Hexadecimal send</el-checkbox>
                    </el-col>
                    <el-col :span="6" style="padding-top: 1rem;">
                        <span :size="buttonSize" type="text" style="margin-right: 1rem;">
                            Tx: {{pushBit}}
                        </span>
                    </el-col>
                    <el-col :span="6" style="padding-top: 1rem;">
                        <span :size="buttonSize" type="text" style="margin-right: 1rem;">
                            Rx: {{pullBit}}
                        </span>
                    </el-col>
                </el-form-item>
                <el-form-item style="text-align: right;">
                    <el-button :size="buttonSize" @click="readFile">Read file</el-button>
                    <el-button :size="buttonSize" @click="resetPushData">Empty and refill</el-button>
                    <el-button :size="buttonSize" @click="resetCountBit">Counting Clear</el-button>
                    <el-button :size="buttonSize" @click="portWrite">Send manually</el-button>
                  <el-button :size="buttonSize" @click="QueryCommand">Query command</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'Main',
        watch: {
            autoSendRate(val) {
                let _ts = this;
                if (val > 0) {
                    _ts.autoSendData(_ts.autoSend);
                }
            }
        },
        data() {
            return {
                buttonSize: 'small',
                timer: null,    // ?????????
                port: null, // ????????????
                isOpen: false,  // ??????????????????
                isShowPullDate: true,   // ????????????
                labelPosition: 'right', // ????????????
                state: 0,   // ???????????? 0: ?????????, 1: ??????
                com: '',    // ???????????? COM1
                pullData: '',   // ??????????????????
                pushData: '',   // ???????????????
                stateText: '????????????',  // ????????????
                pushBit: 0, // ???????????????
                pullBit: 0, // ???????????????
                autoSendRate: 1000, // ?????????????????? ms
                autoClean: false,   // ????????????
                hexDisplay: false,  // 16 ????????????
                autoSend: false,    // ??????????????????
                hexSend: false, // 16 ????????????
                sendState: false, // 16 ????????????
                options: {  // ??????????????????
                    baudRate: 9600,
                    parity: 'none',
                    dataBits: 8,
                    stopBits: 1,
                    autoOpen: false
                },
                ports: [],  // ??????????????????
                baudRateList: [
                    {
                        label: '300',
                        value: 300
                    },
                    {
                        label: '600',
                        value: 600
                    },
                    {
                        label: '1200',
                        value: 1200
                    },
                    {
                        label: '2400',
                        value: 2400
                    },
                    {
                        label: '4800',
                        value: 4800
                    },
                    {
                        label: '9600',
                        value: 9600
                    },
                    {
                        label: '19200',
                        value: 19200
                    },
                    {
                        label: '38400',
                        value: 38400
                    },
                    {
                        label: '43000',
                        value: 43000
                    },
                    {
                        label: '56000',
                        value: 56000
                    },
                    {
                        label: '57600',
                        value: 57600
                    },
                    {
                        label: '115200',
                        value: 115200
                    },
                    {
                        label: '128000',
                        value: 128000
                    },
                    {
                        label: '230400',
                        value: 230400
                    },
                    {
                        label: '256000',
                        value: 256000
                    },
                    {
                        label: '460800',
                        value: 460800
                    }
                ],
                parityList: [
                    {
                        label: 'None',
                        value: 'none'
                    },
                    {
                        label: 'Odd',
                        value: 'odd'
                    },
                    {
                        label: 'Even',
                        value: 'even'
                    },
                    {
                        label: 'Mark',
                        value: 'mark'
                    },
                    {
                        label: 'Space',
                        value: 'space'
                    }
                ],
                dataBitList: [
                    {
                        label: '5',
                        value: 5
                    },
                    {
                        label: '6',
                        value: 6
                    },
                    {
                        label: '7',
                        value: 7
                    },
                    {
                        label: '8',
                        value: 8
                    }
                ],
                stopBitList: [
                    {
                        label: '1',
                        value: 1
                    },
                    {
                        label: '1.5',
                        value: 1.5
                    },
                    {
                        label: '2',
                        value: 2
                    }
                ]
            }
        },
        methods: {
            // rescan function 
            rescanPorts() {
                let _ts = this
                _ts.genPorts();
            },

            handlerHex(data) {
                let _ts = this;
                let dataStr = '';
                if (data.trim().indexOf(' ') > -1) {
                    let hexArr = data.trim().split(' ');
                    for(let i in hexArr) {
                        if (hexArr[i].length == 1) {
                            dataStr += '0';
                        }
                        dataStr += hexArr[i];
                    }
                } else {
                    dataStr = _ts.handlerHexDisplay(data.trim());
                }
                return dataStr.replace(/\s+/g,'');
            },

            // convert string to hex
            String2Hex(tmp) {
            var str = '';
            for(var i = 0; i < tmp.length; i++) {
                str += tmp[i].charCodeAt(0).toString(16);
            }
            return str;
            },

            // sending the command to query for Hardware version/Firmware version/Sensor status/MAC address/Hardware Serial Number
            // It checks if the serial port is open, sends a query command via the port, and then parses the returned data to collect device information 
            // (e.g., hardware version, firmware version, sensor status, MAC address and HW serial number).
            QueryCommand() {            
                let _ts = this 
                let myPort = _ts.port; 
                let data = [];
                if(typeof data !== 'undefined') {
                
                    // after connect to the serial port 
                if (myPort && myPort.isOpen){
                
                // Send command through serial port - BB00220000227E
                // change to byte 
                // \xBB\x00, \xBB\x22, \xBB\x00, \xBB\x00, \xBB\x22, \xBB\x7E
                // myPort.write('\xBB\x00, \xBB\x22, \xBB\x00, \xBB\x00, \xBB\x22, \xBB\x7E', function(err){
                myPort.write('BB 00 22 00 00 22 7E', function(err){
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                   
                    // parser returned data once receive data and parse out the info you want 
                    myPort.on('data', function (data)
                    {   
                        console.log('Received Data: ' + data);
                    })
                    

                    // store individual info variables into their corresponding values 
                    let parsedInfo = parseDeviceData(data);
                    let hardwareVersion = parsedInfo[0];
                    let firmwareVersion = parsedInfo[1];
                    let sensorStatus = parsedInfo[2];
                    let macAddress = parsedInfo[3];
                    let hwSerialNumber = parsedInfo[4];

                    // print out the collected device info on console  
                    console.log('Hardware Version :' + hardwareVersion + 
                                'Firmware Version :' + firmwareVersion + 
                                'Sensor Status :' + sensorStatus + 
                                'MAC Address :' + macAddress+ 
                                'Hardware Serial Number :' + hwSerialNumber )

                })


                // Function to parse out specific device info from returned string 
                const parseDeviceData=(dataString)=>{  
                let resultArray;
                if (typeof dataString !== 'undefined'){
                // 'hardware version','firmware version','sensor status','mac address', 'hw serial number'  
                // ---------------------------------------------------------------------------------------
                // "HWVERSION",        "FWVERSION",      "SENSORSTATUS",  "MACADDRESS",  "SERIALNUMBER"
                let splitArr=dataString.split("|");  
                for(let i=0;i<splitArr.length; i++){ 
                    if(splitArr[i].includes("HWVERSION")) resultArray[0]=splitArr[i].replace("HWVERSION","").replace("=","").trim(); 
                    else if (splitArr[i].includes("FWVERSION")) resultArray[1]=splitArr[i].replace("FWVERSION","").replace("=","").trim(); 
                    else if (splitArr[i].includes("SENSORSTATUS")) resultArray[2]=splitArr[i].replace("SENSORSTATUS","").replace("=","").trim(); 
                    else if (splitArr[i].includes("MACADDRESS")) resultArray[3]=splitArr[i].replace("MACADDRESS","").replace("=","").trim(); 
                    else if (splitArr[i].includes("SERIALNUMBER")) resultArray [4]= splitArr [i].replace ("SERIALNUMBER", "").replace ("=", "").trim();
                }  
                
                // checking return a valid resultArray 
                for (let i = 0; i < resultArray.length; i++)
                {
                    if (typeof resultArray[i] == 'undefined')
                    {   
                        break;
                    }
                }
                return resultArray; 
                }

                }
                }
                }
                
            },
        

            openCom() {
                let _ts = this
                let port = _ts.port;
                if (port) {
                    _ts.closeCom();
                }
                port = new Vue.SerialPort(_ts.com, _ts.options);

                port.open(function (err) {
                    if (err) {
                        _ts.$set(_ts, 'stateText', err);
                        new Notification('Nebula Helper', {
                            body: err
                        })
                        return console.log('Error opening port: ', err)
                    }
                    // Because there's no callback to write, write errors will be emitted on the port:
                    _ts.$set(_ts, 'state', 1);
                    _ts.$set(_ts, 'stateText', '???????????????');
                    _ts.$set(_ts, 'isOpen', true);
                    _ts.$set(_ts, 'port', port);
                })

                // The open event is always emitted
                port.on('open', function () {
                    // open logic
                    console.log('?????????...');
                    console.log('??????????????????', port.isOpen);
                })

                port.on('error', (error) => {
                    //????????????
                    new Notification('Nebula Helper', {
                        body: error
                    })
                    _ts.$set(_ts, 'stateText', error);
                    console.log('Error: ', error);
                })
                // ??????????????????????????? ???buffer????????????toString????????????
                port.on('data', function (data) {
                    // ?????????????????????????????????
                    if (_ts.isShowPullDate) {
                        let pullData;
                        if (_ts.hexDisplay) {
                            pullData = _ts.handlerHexDisplay(data.toString('hex').toLocaleUpperCase());
                        } else {
                            if (_ts.isGBK(data)) {
                                let encoding = 'GB2312';
                                pullData = window.iconv.decode(data, encoding);
                            } else {
                                pullData = data.toString();
                            }
                        }

                        _ts.$set(_ts, 'pullData', _ts.pullData + pullData);
                        // ???????????????
                        _ts.$set(_ts, 'pullBit', _ts.pullBit + pullData.length);
                        setTimeout(function () {
                            let pullDataElement = document.getElementById('pullDta');
                            pullDataElement.scrollTop = pullDataElement.scrollHeight;
                        }, 400);
                    }
                })
            },
            closeCom() {
                let _ts = this
                let port = _ts.port;
                if (port) {
                    try {
                        if (port.isOpen) {
                            port.close();
                        } else {
                            _ts.genPorts();
                        }
                        _ts.$set(_ts, 'state', 0);
                        _ts.$set(_ts, 'isOpen', false);
                        _ts.$set(_ts, 'stateText', '???????????????');
                        console.log('?????????...');
                        console.log('??????????????????', port.isOpen);
                    } catch (e) {
                        _ts.$set(_ts, 'stateText', e);
                        console.log(e);
                    }
                }
            },
            portWrite() {
                let _ts = this
                let port = _ts.port;
                if (port && port.isOpen && _ts.pushData) {
                    let encoding = 'utf-8';
                    let pushData;
                    if (_ts.hexSend) {
                        if (!_ts.sendState) {
                            return;
                        }
                        encoding = 'hex';
                        pushData = _ts.handlerHex(_ts.pushData);
                    } else {
                        pushData = window.iconv.encode(_ts.pushData, 'GB2312');
                    }
                    port.write(pushData, encoding, function (err, result) {
                        if (err) {
                            console.log('Error while sending message : ' + err);
                        }
                        if (result) {
                            console.log('Response received after sending message : ' + result);
                        }
                        // ???????????????
                        _ts.$set(_ts, 'pushBit', _ts.pushBit + _ts.pushData.length);
                        console.log('message written');
                    })
                    port.drain(error => {
                        if (error) {
                            console.log(error)
                        }
                    })
                }
            },

            genPorts() {
                let _ts = this;
                Vue.SerialPort.list().then(
                    ports => {
                        let portList = new Array();
                        for (let i in ports) {
                            let port = {
                                label: ports[i].path,
                                value: ports[i].path
                            }
                            portList.push(port)
                        }
                        if (portList.length > 0) {
                            portList.sort(function (port1, port2) {
                                let s1 = _ts.strToBinary(port1.value, 10);
                                let s2 = _ts.strToBinary(port2.value, 10);
                                return s1 - s2
                            });
                            _ts.$set(_ts, 'stateText', '???????????????');
                            if (!_ts.com) {
                                _ts.$set(_ts, 'com', portList[0].value);
                            }
                        } else {
                            _ts.$set(_ts, 'stateText', '????????????????????????');
                            _ts.$set(_ts, 'com', '');
                        }
                        _ts.$set(_ts, 'ports', portList)
                    },
                    err => console.error(err)
                )
            },
            genRenderer() {
                let _ts = this;
                let ipcRenderer = window.electron.ipcRenderer;
                ipcRenderer.on('saveOptions', (event) => {
                    if (event) {
                        _ts.saveOptions();
                    }
                });
                ipcRenderer.on('loadOptions', (event) => {
                    if (event) {
                        _ts.loadOptions();
                    }
                });
                ipcRenderer.on('reloadPorts', (event) => {
                    if (event) {
                        _ts.genPorts();
                    }
                });
                ipcRenderer.on('writeFile', (event) => {
                    if (event) {
                        _ts.writeFile();
                    }
                });
                ipcRenderer.on('readFile', (event) => {
                    if (event) {
                        _ts.readFile();
                    }
                });
                let remote = window.electron.remote;
                const SerialPort = remote.getGlobal('SerialPort');
                window.iconv = remote.getGlobal('iconv');
                window.fs = remote.getGlobal('fs');
                console.log = remote.getGlobal('log');
                Vue.SerialPort = Vue.prototype.$SerialPort = SerialPort;
                _ts.genPorts();
            },
            resetPushData() {
                this.$set(this, 'pushData', '');
            },
            resetPullData() {
                this.$set(this, 'pullData', '');
            },
            updateShowPullDate() {
                this.$set(this, 'isShowPullDate', !this.isShowPullDate)
            },
            autoSendData(val) {
                let _ts = this;
                if (_ts.timer) {
                    window.clearInterval(_ts.timer);
                }
                if (val) {
                    _ts.timer = setInterval(function () {
                        _ts.portWrite();
                    }, _ts.autoSendRate);
                }
            },
            strToBinary(str, binary) {
                let result = [];
                let list = str.split("");
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    let data = item.charCodeAt(0).toString(binary);
                    result.push(data);
                }
                return result.join("");
            },
            resetCountBit() {
                this.$set(this, 'pushBit', 0);
                this.$set(this, 'pullBit', 0);
            },
            isGBK(data) {
                if (data[0] == 0xff && data[1] == 0xfe) {
                    console.log('unicode');
                    return false;
                } else if (data[0] == 0xfe && data[1] == 0xff) {
                    console.log('unicode');
                    return false;
                } else if (data[0] == 0xef && data[1] == 0xbb) {
                    console.log('utf8');
                    return false;
                } else {
                    return true;
                }
            },
            readFile() {
                let _ts = this;
                let filters = [
                    {name: 'txt', extensions: ['txt']}
                ]
                _ts.read('????????????', 'loadPushData', filters)
            },
            writeFile() {
                let _ts = this;
                let filters = [
                    {name: 'txt', extensions: ['txt']}
                ];
                _ts.write('??????????????????', _ts.pullData, filters);
            },
            saveOptions() {
                let _ts = this;
                let filters = [{
                    name: 'json', extensions: ['json']
                }];
                let option = {
                    port: _ts.com,
                    options: _ts.options
                }
                _ts.write('??????????????????', JSON.stringify(option), filters);
            },
            loadOptions() {
                let _ts = this;
                let filters = [{
                    name: 'json', extensions: ['json']
                }];
                _ts.read('??????????????????', 'loadOptions', filters);
            },
            read(title, method, filters) {
                let _ts = this;
                const {dialog} = window.electron.remote;
                const win = window.electron.remote.getCurrentWindow();
                dialog.showOpenDialog(win, {
                    title: title,
                    multiSelections: false,
                    filters: filters
                }).then(result => {
                    if (result.canceled) {
                        return;
                    }
                    // ???????????????
                    let readStream = window.fs.createReadStream(result.filePaths[0], {
                        flags: 'r',       // ????????????????????????????????????
                        encoding: 'utf8'  // ????????????????????????????????????
                    });

                    // ???????????????????????????
                    readStream.on('open', fd => {
                        console.log('????????????????????????????????????%s', fd);
                    });

                    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
                    readStream.on('data', data => {
                        if (method === 'loadOptions') {
                            if (data) {
                                let option = JSON.parse(data.toString());
                                _ts.$set(_ts, 'com', option.port);
                                _ts.$set(_ts, 'options', option.options);
                            }
                        } else {
                            _ts.$set(_ts, 'pushData', data.toString());
                        }
                    });

                    readStream.on('close', () => {
                        console.log('????????????????????????');
                    });
                }).catch(err => {
                    console.log(err)
                })
            },
            write(title, data, filters) {
                const {dialog} = window.electron.remote;
                const win = window.electron.remote.getCurrentWindow();
                dialog.showSaveDialog(win, {
                    title: title,
                    filters: filters
                }).then(result => {
                    if (result.canceled) {
                        return;
                    }
                    // ???????????????????????????????????????????????? output.txt ???
                    const writerStream = window.fs.createWriteStream(result.filePath);
                    // ?????? utf8 ??????????????????
                    writerStream.write(data);
                    // ??????????????????
                    writerStream.end();
                    // ??????????????? --> data, end, and error
                    writerStream.on('finish', function () {
                        console.log("???????????????");
                    });
                    writerStream.on('error', function (err) {
                        console.log(err.stack);
                    });
                }).catch(err => {
                    console.log(err)
                })
            },
           
            handlerHexDisplay(data) {
                let dataStr = '';
                let isOdd = true;
                if (data.length % 2 == 0) {
                    isOdd = false;
                }
                for (let i = 0, len = data.length; i < len; i++) {
                    // ????????????
                    if (isOdd && len - i == 1) {
                        dataStr += '0';
                    }
                    // ????????????
                    dataStr += data.charAt(i);
                    // ??????????????????????????????
                    if (i % 2 > 0 || len - i == 1) {
                        dataStr += ' ';
                    }
                }
                return dataStr;
            },
            hexRegExp(value) {
                if (!this.hexSend) {
                    return;
                }
                let _ts = this;
                let reg = /^[0-9a-fA-F]*$/
                if (value.indexOf(' ') > -1) {
                    const hexArr = value.split(' ');
                    for (let i in hexArr) {
                        if (hexArr[i].length > 2) {
                            _ts.$set(_ts, 'sendState', false);
                            _ts.$set(_ts, 'stateText', '?????? 16 ?????????');
                            return;
                        } else {
                            if (!reg.test(hexArr[i])) {
                                _ts.$set(_ts, 'sendState', false);
                                _ts.$set(_ts, 'pushData', value.substring(0, value.length - 1));
                                _ts.$set(_ts, 'stateText', '?????? 16 ?????????');
                                return;
                            }
                        }
                    }
                } else {
                    if (!reg.test(value)) {
                        _ts.$set(_ts, 'sendState', false);
                        _ts.$set(_ts, 'pushData', value.substring(0, value.length - 1));
                        _ts.$set(_ts, 'stateText', '?????? 16 ?????????');
                        return;
                    }
                }

                _ts.$set(_ts, 'pushData', value.toLocaleUpperCase());
                _ts.$set(_ts, 'stateText', '');
                _ts.$set(_ts, 'sendState', true);
            }
        },
        mounted() {
            this.genRenderer();
        }
    }
</script>

<style scoped>
</style>

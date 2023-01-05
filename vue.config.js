module.exports = {
    pluginOptions: {
        electronBuilder: {
            // nodeIntegration: true,
            externals: ['serialport'],
            builderOptions: {
                "appId": "com.rymcu.nebula-helper",
                "productName": "Weshare Tech Limited",
                "copyright": "Copyright © rymcu.com",
                "win": {
                    "icon": "./favicon.ico",
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "x64",
                                "ia32"
                            ]
                        }
                    ]
                },
                "linux": {
                    "icon": "./favicon.ico",
                    "target": [
                        "snap"
                    ]
                }
            }
        }
    }
}
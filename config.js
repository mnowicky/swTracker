const config = {
    app: {
        port: 1337,
        name: 'swWallboard'
    }, 
    db: {
        host: 'localhost',
        port: 27017,
        name: 'db'
    },
    api: {
        uri: 'https://dashcam.newgatesecurity.com/api/getDeviceStatus',
        method: 'GET', 
        key: 'TmlGd0lMU2NMdUFXZGJjYjhNM3djUT09',
        ct: 'text/plain'
    }
};

module.exports = config;
//npm imports
const express = require('express');
const path = require('path');
const cron = require('node-cron');

//module imports
const config = require('./config');
var reqs = require('./reqs.js');
var logger = require('./logger.js');
var mp = require('./mailParser.js');


const app = express();

//CORS - same origin stuff
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//mp.run();

//cron job, every 60 seconds retrieve and cache response data from newgate api.  
//add to cron job to: determine devices offline longer than 5 days reqs.cacheOfflineDevices - cache to deviceIssues.json
//add to cron job to: determine devices with media write errors by parsing it@wnybusco.com mailbox for bus numbers with media write errors, cahe to deviceIssues.json
cron.schedule("*/20 * * * * *", function(){
    logger.printWriteLine("Cron job successful; device statuses re-cached to getDeviceStatusAll.json.", 1);
    //mp.connectMailbox();
    mp.run();
    reqs.cacheDeviceStatusAll();
});

//Make assets available to requesting web clients
app.use(express.static(__dirname + '/assets'));

//-------------------App views & pages -----------------------------

//present the home/landing page at site root / 
app.get('/', function(req, res){
    logger.printWriteLine('All cams tracker (re)loaded.', 0);
    res.sendFile(path.join(__dirname, '/views/wallboard.html'));
})

app.get('/issues', function(req, res){
    logger.printWriteLine('Issues tracker (re)loaded.', 0);
    res.sendFile(path.join(__dirname, '/views/issues.html'));
});

app.get('/maintenance', function(req, res){
    logger.printWriteLine('Maintenance tracker (re)loaded', 0);
    res.sendFile(path.join(__dirname, '/views/maintenance.html'));
})

app.get('/maintenanceAdmin', function(req, res){
    logger.printWriteLine('Maintenance admin/modifucation page accessed', 1);
    res.sendFile(path.join(__dirname, '/views/maintenanceAdmin.html'));
})

app.get('/maintenanceUser', function(req, res){
    logger.printWriteLine('Maintenance user/mechanic page accessed', 0);
    res.sendFile(path.join(__dirname, '/views/maintenanceUser.html'));
})

//----------------- App Functions --------------------------------------

app.get('/getDeviceStatusAllCached', (req, res) => {
    //logger.printWriteLine('Front-end AJAX retrieving cached data from getDeviceStatusAll.json.', 0);
    reqs.retrieveCachedDeviceStatusAll(obj => res.send(obj));
});

app.get('/getDeviceIssuesCached', (req, res) => {
    logger.printWriteLine('Front-end AJAX retrieving cached data from deviceIssues.json', 0);
    reqs.retrieveCachedDeviceIssues(obj => res.send(obj));
});

app.listen(config.app.port, () => {
    logger.printWriteLine('WNYBUS co. Cam Status Page', 9);
    logger.printWriteLine('Application started, listening on port 1337.', 0);
})

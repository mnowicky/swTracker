var request = require('request');
const config = require('./config.js');
const fs = require('fs');
const { bindCallback } = require('rxjs');

var ds_options = {
    'method': config.api.method,
    'url': config.api.uri,
    'headers': {
        'apikey': config.api.key,
        'Content-Type': config.api.ct
    },
    'body': '{\r\n"devices" : "*"\r\n}'
};
/*

var method = 'GET';
var ds_URL = 'config.api.uri';
var APIKEY = 'TmlGd0lMU2NMdUFXZGJjYjhNM3djUT09';

//options to be used with GET request to facilitate data acquisition from newgate API. 
var ds_options = {
    'method': 'GET',
    'url': 'https://dashcam.newgatesecurity.com/api/getDeviceStatus', 
    'headers': {
        'apikey': 'TmlGd0lMU2NMdUFXZGJjYjhNM3djUT09',
        'Content-Type': 'text/plain'
    }, 
    body: '{\r\n"devices" : "*"\r\n}'
};
*/

var reqs = {

    getDeviceStatusAll: function(callback){
        //this function, the OG, is the basic function for retrieveing data from newgate API via GET request. It renames some of the object keys and deletes some key/value pairs. 
        request(ds_options, function (error, response){
            if(error) throw new Error(error);
            var body = JSON.parse(response.body);
            var data = body["Data"];
            dataArr = [];
            for(obj of data){
                if(obj["isOnline"] == "1"){
                    obj["isOnline"] = 'Yes';
                }
                else if(obj["isOnline"] == "0"){
                    obj["isOnline"] = 'No';
                }
                
                obj["Bus"] = obj["Name"];
                delete obj["Name"];

                obj["Online"] = obj["isOnline"];
                delete obj["isOnline"];

                obj["DRID"] = obj["RecorderID"];
                delete obj["RecorderID"];

                obj["State"] = obj["Status"];
                delete obj["Status"];

                obj["LastOnline"] = obj["LastContact"];
                delete obj["LastContact"];
                
                delete obj["Heading"];
                delete obj["Longitude"];
                delete obj["Latitude"];
                delete obj["Speed"];

                if(obj["LastOnline"] == null){
                    delete obj;
                }
                else{
                    dataArr.push(obj);
                }
            }
            console.log(dataArr);
            //fs.writeFileSync('./data/getDeviceStatusAll.txt', dataArr);
            callback(dataArr);

        })
    },

    cacheDeviceStatusAll: function(){
        //this function, similar to the above, requests data from newgate API and instead writes it to a local file as a cache to minimize number of outgoing requests. 
        request(ds_options, function(error, response){
            if(error) throw new Error(error);
            var body = JSON.parse(response.body);
            var data = body["Data"];
            dataArr = [];
            for(obj of data){
                if(obj["isOnline"] == "1"){
                    obj["isOnline"] = 'Yes';
                }
                else if(obj["isOnline"] == "0"){
                    obj["isOnline"] = 'No';
                }
                
                obj["Bus"] = obj["Name"];
                delete obj["Name"];

                obj["Online"] = obj["isOnline"];
                delete obj["isOnline"];

                obj["DRID"] = obj["RecorderID"];
                delete obj["RecorderID"];

                obj["State"] = obj["Status"];
                delete obj["Status"];

                obj["LastOnline"] = obj["LastContact"];
                delete obj["LastContact"];
                
                delete obj["Heading"];
                delete obj["Longitude"];
                delete obj["Latitude"];
                delete obj["Speed"];

                if(obj["LastOnline"] == null){
                    delete obj;
                }
                else{
                    dataArr.push(obj);
                }
            }
            let dataString = JSON.stringify(dataArr);
            //fs.writeFileSync('./data/getDeviceStatusAll.txt', dataString);
            fs.writeFileSync('./data/getDeviceStatusAll.json', dataString);
        });
    },

    cacheOfflineDevices: function (){
        //this function needs to request data from Newgate API and filter down to only devices (and pertinent columns) which have been offline for longer than 5 days. write entries to deviceIssues.json. 
        request(ds_options, function(error, response){
            if(error) throw new Error(error);
            var body = JSON.parse(response.body);
            var data = body["Data"];
            dataArr = [];
            for(obj of data){
                /*pseudocode; if device online, delete it. 
                if device last contact is > today() -4, delete it, 
                else delete/reformat the dictionary and write it to a json file
                for devices offline longer than 4 days. 
                */
                if(obj["isOnline"] == "1"){
                    obj["isOnline"] = 'Yes';
                }
                else if(obj["isOnline"] == "0"){
                    obj["isOnline"] = 'No';
                }
                
                obj["Bus"] = obj["Name"];
                delete obj["Name"];

                obj["Online"] = obj["isOnline"];
                delete obj["isOnline"];

                obj["DRID"] = obj["RecorderID"];
                delete obj["RecorderID"];

                obj["State"] = obj["Status"];
                delete obj["Status"];

                obj["LastOnline"] = obj["LastContact"];
                delete obj["LastContact"];
                
                delete obj["Heading"];
                delete obj["Longitude"];
                delete obj["Latitude"];
                delete obj["Speed"];

                if(obj["LastOnline"] == null){
                    delete obj;
                }
                else{
                    dataArr.push(obj);
                }
            }
            let dataString = JSON.stringify(dataArr);
            //fs.writeFileSync('./data/getDeviceStatusAll.txt', dataString);
            fs.writeFileSync('./data/getDeviceStatusAll.json', dataString);
        });
    },

    cacheMediaWriteErrors: function () {
        //this function needs to connect to- and parse mailbox it@wnybusco.com to find new entries from buses that have media write errors... and write entries to /data/deviceIssues.json.
        console.log('hold for code to pull buses with media errors');
    },

    retrieveCachedDeviceStatusAll: function (callback) {
        //this function reads the data stored in local .json file getDeviceStatusAll.json and presents it to the front end via ajax call. 
        fs.readFile('./data/getDeviceStatusAll.json', 'utf-8', function(err,data){
            if(err) throw err;
            obj = JSON.parse(data);
            //console.log(JSON.stringify(data)); 
            callback(obj);
        });
    },

    retrieveCachedDeviceIssues: function (callback) {
        //this function reads the data stored in local .json file deviceIssues.json and presents it to the front-end via ajax call. 
        /*fs.readFile('./data/deviceIssues.json', 'utf-8', function(err,data){
            if(err) throw err;
            obj = JSON.parse(data);
            console.log(JSON.stringify(data));
            callback(obj);
        });*/
        console.log('Retrieve cached device issues function under construction');
    }, 

    cacheOfflineLongerThan: function (callback) {
        /* This function needs to send request to newgate API for buses that have been offline 
        longer than x amount of days.  */
        console.log('hold');
    }
}

module.exports = reqs;
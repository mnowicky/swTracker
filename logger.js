var colors = require('colors');
const fs = require('fs');
//https://www.npmjs.com/package/colors
//console.log('hello'.green);
//console.log('hey'.underline.red);
//.inverse .rainbow .trap

var date_ob = new Date();
var date = ("0"+date_ob.getDate()).slice(-2);
var month = ("0"+(date_ob.getMonth()+1)).slice(-2);
var year = date_ob.getFullYear();
var hours = date_ob.getHours();
var minutes = date_ob.getMinutes();
var seconds = date_ob.getSeconds();
var YYMMDD = year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;

module.exports = {
    printWriteLine: function(mes, type){

        if(type == 9){
            console.log(mes.trap.bold.red);
        }
        else if(type == 0){
            console.log(YYMMDD.bold.underline.bgCyan.yellow +' - [INFO]:' .bold.underline.bgCyan.yellow + ' ' +mes);
            fs.appendFileSync('./logFile.txt', YYMMDD+' :: [INFO]: '+mes+'\n');
        }
        else if(type == 1){
            console.log(YYMMDD.bold.underline.bgCyan.yellow +' - [INFO]:' .bold.underline.bgBrightYellow.red + ' ' +mes);
            fs.appendFileSync('./logFile.txt', YYMMDD+' :: [INFO]: '+mes+'\n');
        }
        else if(type == 2){
            console.log(YYMMDD.bold.underline.bgCyan.yellow +' - [ERR]:' .bold.underline.bgBrightRed.black + ' ' +mes);
            fs.appendFileSync('./logFile.txt', YYMMDD+' :: [ERR]: '+mes+'\n');
        }
        else{
            console.log(mes);
        }
    },

    printTime: function(mes){
        console.log(YYMMDD.bold.underline.bgCyan.yellow + ' ' + mes);
    },
    
    writeLine: function(mes){
        fs.appendFileSync('./logFile.txt', YYMMDD + ' :: ' + mes +'\n');
    }, 

    print: function(mes){
        console.log(mes);
    }
}
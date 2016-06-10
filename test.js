/*

var mongoose = require('mongoose');
var Model = require('./models/');
var Item = require('./items/');
var Parser = require('./parser');
var gcm = require('node-gcm');
*/

/*Parser.getRouteDetailInfo('3000306000').then( route => {
    console.log(route);
}).catch( err => {
    console.log(err);
});*/

// Parser.getBusPosInfosByBusId('3000937000', '대구70자 3112').then(console.log).catch(console.log);
//Parser.getBusPosInfos('3000937000', true).then(console.log).catch(console.log);
/*

function setTimeoutPromise() {
    return new Promise( (resolve, reject) => {
        console.log('promise');
        reject(resolve1(1));
        resolve(resolve1(2));
    });
}

function resolve1(n) {
    return new Promise( (resolve, reject) => {
        console.log(n);
        resolve(n);
    });
}
setTimeoutPromise().then(a => {
});*/

/*
var sender = new gcm.Sender('AIzaSyCsvxM-PpvTV1lzwp409f_pIkHqP4y2z28');
var regTokens = 'fGtIQrGrcpI:APA91bEXAnqWGR51TdxbL6Fwx990u79QhC1YWFza-DyOwilNCxOi0YYHtoDqBa47ls1JNYJ3lItoNufibNilxEmpi0ih3iFDCiIqQ-7MfXrM_ERs1Wd9tT_MFWXdpHNkuzN25Wi68Afi';

var message = new gcm.Message({
    collapse_key : 'busarrnoti',
    priority : 'high',
    time_to_live : 10,/!*
    notification : {
        "body" : "great match!",
        "title" : "Portugal vs. Denmark",
        "icon" : "myicon"
    },*!/
    data: { key1: "bbbb" }
});

sender.send(message, regTokens, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
});*/


var testarr = [];
testarr[2] = "aa";
console.log(testarr);
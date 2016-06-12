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
/*

var request = require('request');
var iconv = require('iconv-lite');
var a = [ {a : 33} ];

function test() {
    var url = "http://m.businfo.go.kr/bp/m/realTime.do?act=posInfo&roId=1000001000&roNo="
    var requestOptions = {
        method: "GET",
        uri: url,
        encoding: null
    };

    request(requestOptions, function (err, res, body) {

        // response 처리
        var strContents = iconv.decode(body, 'EUC-KR').toString();
        try {
            console.log(strContents);
        } catch (e) {
            console.log(e.message);
            console.log(body);
        }
        /!*var $ = cheerio.load(strContents);
        var topElems = $('ol.bl');

        topElems.find('li.bloc_b').each(function (i, elem) {
            var plainText = $(elem).text();
            var endOffset = plainText.indexOf('(');
            var index = $(elem).index() - i - 1;

            var busId = plainText.substr(0, endOffset).trim();
            if (busId == searchBusId)
                resolve(index);
        });*!/

        // 버스번호에 해당되는 버스위치를 못 찾았을 때
    });
}

setInterval(test, 1000);
*/

var obj = {};
var token = "aaaa";
if( !obj[token] )
    obj[token] = [];
console.log(obj[token]);
var inner = { name : "john"};
obj[token].push(inner);
if( !obj[token] )
    obj[token] = [];
obj[token].push({ name : "john2"});
console.log(obj);
inner.name = "bob";
console.log(obj[token][obj[token].length - 1]);
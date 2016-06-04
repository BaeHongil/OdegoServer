var express = require('express');;
var logger = require('morgan');
var bodyParser = require('body-parser')
var gcm = require('node-gcm');

var routes = require('./routes/');

app = express();
app.use(logger("combined"));
app.use(bodyParser.json());

app.use('/beacons', routes.beacons);
app.use('/busstops', routes.busstops);
app.use('/routes', routes.routes);
app.use('/notifications', routes.notifications);

/*// Error stacktraces가 Client에게 전송되지 않도록 설정
app.use( (err, req, res, next) => {
    res.status(err.status || 500).end();
});*/

app.listen(1313, () => {
    console.log('Test Server Start on port 1313');
});


/*app.get('/bus', function (req, res) {
    var uuid = req.query.uuid;
    var major = req.query.major;
    var minor = req.query.minor;
    var beacon = findBeacon(uuid, major, minor);

    var callback = function (foundIndex, busPosInfos, isForward) {
        var response = {
            UUID : beacon.UUID,
            major : beacon.major,
            minor : beacon.minor,
            routeId : beacon.routeId,
            busId : beacon.busId,
            busIdIndex : foundIndex,
            isForword : isForward,
            busPosInfos : busPosInfos
        };
        res.send(response);
    };
    getBusPosInfos(beacon.routeId, true, beacon.busId, callback);
    getBusPosInfos(beacon.routeId, false, beacon.busId, callback);
});

// 버스도착알림요구
app.post('/notifyarrival', function (req, res) {
    var notifyRequest = req.body;
//    console.log(notifyRequest);

    setInterval(function () {
        getBusPosInfos(notifyRequest.routeId, notifyRequest.isForword, notifyRequest.busId, function (foundIndex, busPosInfos, isForward) {
            console.log(foundIndex);
        });
    }, 3*1000);

    res.send("good");
})*/


/* 서버단 끝 */


/*
 function getBusPosInfos(routeId, isForward, searchBusId, callback) {
 var requestOptions  = { method: "GET"
 ,uri: 'http://m.businfo.go.kr/bp/m/realTime.do?act=posInfo&roNo=&roId=' + routeId + '&moveDir=' + (isForward ? 1:0)
 ,encoding: null
 };

 request(requestOptions, function(error, response, body) {
 var foundIndex = -1;
 var strContents = iconv.decode(body, 'EUC-KR').toString();
 var $ = cheerio.load(strContents);
 var topElems = $('ol.bl');
 var busPosInfos = [];
 topElems.find('span.pl39').each(function (i, elem) {
 var plainText = $(elem).text();
 var startOffset = plainText.indexOf('. ');
 var busPosInfo = {};

 busPosInfo.busStopName = plainText.substr(startOffset + 2);
 busPosInfos.push(busPosInfo);
 });
 topElems.find('li.bloc_b').each(function (i, elem) {
 var plainText = $(elem).text();
 var endOffset = plainText.indexOf('(');
 var index = $(this).index() - i -1;

 busPosInfos[index].busId = plainText.substr(0, endOffset).trim();
 if( foundIndex == -1 && busPosInfos[index].busId == searchBusId )
 foundIndex = index;
 if( $(this).hasClass('nsbus') )
 busPosInfos[index].isNonStepBus = true;
 });
 //   console.log(busPosInfos);
 if( foundIndex != -1)
 callback(foundIndex, busPosInfos, isForward);
 });
 }


var sender = new gcm.Sender('AIzaSyCsvxM-PpvTV1lzwp409f_pIkHqP4y2z28');
var regTokens = ['fGtIQrGrcpI:APA91bEXAnqWGR51TdxbL6Fwx990u79QhC1YWFza-DyOwilNCxOi0YYHtoDqBa47ls1JNYJ3lItoNufibNilxEmpi0ih3iFDCiIqQ-7MfXrM_ERs1Wd9tT_MFWXdpHNkuzN25Wi68Afi'];

var message = new gcm.Message({
    data: { key1: "aa" }
});

// request 모듈을 이용하여 html 요청
request(requestOptions, function(error, response, body) {
    var strContents = iconv.decode(body, 'EUC-KR').toString();
    var $ = cheerio.load(strContents);

    var strFirst = $('.pl39').first().text();
    console.log( strFirst );
    var message = new gcm.Message({
        data: { key1: strFirst }
    });

    sender.sendNoRetry(message, regTokens, function (err, response) {
        if(err) console.error(err);
        else    console.log(response);
    });
});

 // 비콘 데이터 파일에서 읽기
 var beacons;
 fs.readFile('beacons.json', 'utf8', function (err, data) {
 if (err) throw err;
 beacons = JSON.parse(data);
 });



 function findBeacon(UUID, major, minor) {
 for(var i in beacons) {
 if( beacons[i].UUID == UUID && beacons[i].major == major && beacons[i].minor == minor )
 return beacons[i];
 }
 }
*/


/**
 * Created by BHI on 2016-06-04.
 */
var DB = require('../db');
var Parser = require('../parser');
var express = require('express');
var gcm = require('node-gcm');
var router = express.Router();

var test = 1;
// GET 노선 DB
router.post('/busarr', (req, res) => {
    var notiReqMsg = req.body;

    isNearReqBusStop(notiReqMsg).then(() => {
        console.log('in loopPromise');
        notifyToClient(notiReqMsg);
    });
    res.status(202).end();
});

function isNearReqBusStop(notiReqMsg, timeout) {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            Parser.getBusPosByBusId(notiReqMsg.routeId, notiReqMsg.isForward, notiReqMsg.busId).then( foundIndex => {
                var remainCount = notiReqMsg.requestIndex - foundIndex;
                var requestGap = remainCount - notiReqMsg.requestRemainCount; // 알림을 요청한 Count와 남은 Count의 차이
                console.log('isNearReqBusStop remainCount :' + remainCount);
                if( requestGap <= 2 ) // 뒤에 더하는 숫자는 혹시나 하는 텀을 주는 거 딱 맞게하면 틀릴 수도 있으니
                    resolve(foundIndex);
                else {
                    var timeout = 10 * 1000; // requestGap당 30초 timeout   requestGap * 30 * 1000
                    resolve( isNearReqBusStop(notiReqMsg, timeout) );
                }
            }).catch(reject);
        }, timeout);
    });
}

function notifyToClient(notiReqMsg, timeout) {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            Parser.getBusPosByBusId(notiReqMsg.routeId, notiReqMsg.isForward, notiReqMsg.busId).then(foundIndex => {
                var remainCount = notiReqMsg.requestIndex - foundIndex;
                if (remainCount < 0) { // 지나감
                    console.log('지나감요');
                    resolve('end');
                } else if (remainCount <= notiReqMsg.requestRemainCount) {
                    console.log(remainCount + '개소 정류장 남았습니다.');
                    resolve( notifyToClient(notiReqMsg, 10 * 1000) );
                } else {// 아직 버스가 requestRemainCount보다 멀리 존재
                    console.log('notifyToClient');
                    resolve(notifyToClient(notiReqMsg, 20 * 1000));
                }
            }).catch(reject);
        }, timeout);
    });
}

module.exports = router;
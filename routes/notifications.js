/**
 * Created by BHI on 2016-06-04.
 */
var DB = require('../db');
var Parser = require('../parser');
var express = require('express');
var gcm = require('node-gcm');
var Constants = require('../constants');
var Items = require('../items/');
var router = express.Router();

var sender = new gcm.Sender(Constants.FCM_SERVER_KEY);
var clients = {};

// GET 노선 DB
router.post('/busarr', (req, res) => {
    var notiReqMsg = req.body;
    var mBusArr = new Items.BusArr(notiReqMsg, notiReqMsg.destIndex);
    newNotification(notiReqMsg.fcmToken, mBusArr);

    res.status(202).end();
});

router.put('/busarr/:fcm_token', (req, res) => {
    var fcmToken = req.params.fcm_token;

    if (!clients[fcmToken])
        res.status(404).end();
    else {
        var reqBody = req.body;
        // 기존 BusArr 데이터
        var lastBusArr = clients[fcmToken][ clients[fcmToken] - 1];
        lastBusArr.isValid = false; // 기존 BusArr Notification 취소
        
        // 새로운 BusArr 데이터
        var mBusArr = new Items.BusArr(lastBusArr, reqBody.destIndex);
        newNotification(fcmToken, mBusArr);
        
        res.status(200).end();
    }
});

router.delete('/busarr/:fcm_token', (req, res) => {
    if (!clients[req.params.fcm_token])
        res.status(404).end();
    else {
        clients[req.params.fcm_token].isValid = false;
        res.status(200).end();
    }
});

function newNotification(fcmToken, mBusArr) {
    if( !clients[fcmToken] )
        clients[fcmToken] = [];
    clients[fcmToken].push(mBusArr);

    console.log("new mBusArr : " + mBusArr);

    notifyToClient(fcmToken, mBusArr).then(isValid => {
        if( isValid )
            console.log("notify 끝");
    }).catch( err => {
        console.error(err);
    });
}

function notifyToClient(fcmToken, mBusArr, timeout) {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            if( mBusArr.isValid ) {
                Parser.getBusPosByBusId(mBusArr.routeId, mBusArr.isForward, mBusArr.busId).then(foundIndex => {
                    var remainCount = mBusArr.destIndex - foundIndex;
                    var requestGap = remainCount - mBusArr.requestRemainCount; // 알림을 요청한 Count와 남은 Count의 차이
                    console.log('notifyToClient remainCount :' + remainCount);

                    if (requestGap > 2) { // 뒤에 더하는 숫자는 혹시나 하는 텀을 주는 거 딱 맞게하면 틀릴 수도 있으니
                        var timeout = requestGap * 40 * 1000; // requestGap당 30초 timeout   requestGap * 30 * 1000
                        resolve( notifyToClient(fcmToken, mBusArr, timeout) );
                    } else if (remainCount < 0) { // 지나감
                        console.log('지나감요');
                        resolve(true);
                    } else if (remainCount <= mBusArr.requestRemainCount) { // 원하는 거리 안에 들어옴
                        if( mBusArr.curIndex != foundIndex ) {
                            // FCM 사용해서 푸시메시지 보내기
                            var message = new gcm.Message({
                                collapse_key: 'busarrnoti',
                                priority: 'high',
                                time_to_live: 600,
                                data: {remainCount: remainCount}
                            });
                            sender.send(message, fcmToken, (err, res) => {
                                if (err) console.error(err);
                            });

                            mBusArr.curIndex = foundIndex;
                            console.log(remainCount + '개소 정류장 남은 메시지 전송.');
                        }

                        if( remainCount == 0 ) resolve(false);
                        else resolve( notifyToClient(fcmToken, mBusArr, 20 * 1000) );
                    } else {// 아직 버스가 requestRemainCount보다 멀리 존재
                        resolve( notifyToClient(fcmToken, mBusArr, 30 * 1000) );
                    }
                }).catch(reject);
            } else
                resolve(false)
        }, timeout);
    });
}

module.exports = router;
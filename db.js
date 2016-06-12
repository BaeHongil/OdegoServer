/**
 * Created by BHI on 2016-06-04.
 */
var mongoose = require('mongoose');
var Model = require('./models/');

mongoose.connect('mongodb://localhost/test');
var conn = mongoose.connection;
var connPromise = new Promise( (resolve, reject) => {
    conn.once('open', () => {
        console.log('db open');
        resolve('db open');
    });
    conn.on('error', reject);
});

exports.conn = conn;
exports.connPromise = connPromise;

/**
 * 특정 Collection을 Drop합니다.
 *
 * @param collectionName  Drop할 Collection(Table)
 * @returns {Promise.<TResult>} Promise객체(성공하면 true, 아니면 err를 reject)
 */
exports.dropCollection = function (collectionName) {
    var promise = connPromise.then(() => {
        return new Promise( (resolve, reject) => {
            conn.db.listCollections({name: collectionName}).next( (err, collinfo) => {
                if(collinfo) {
                    conn.db.dropCollection(collectionName, (err, result) => {
                        if(err) reject(err);
                        resolve(result);
                    });
                }
            });
        });
    });

    return promise;
};

/**
 *  정류장 이름으로 정류장ID를 획득해서 busPosInfo에 넣습니다.
 *
 * @param name  정류장 이름
 * @param busPosInfo  정류장Id를 넣을 busPosInfo 객체
 * @returns {Promise}  Promise객체(busPosInfo 객체를 리턴)
 */
exports.getBusStopByName = function (name, busPosInfo) {
    return new Promise( (resolve, reject) => {
        Model.BusStop.findOne(
            {name : name},
            {id : 1},(err, busStop) => {
                if(err) reject(err);
                busPosInfo.busStopId = busStop.id;
                resolve(busPosInfo);
        });
    });
};

/**
 *  정류장 이름으로 정류장ID를 획득해서 busStopIds의 index에 넣습니다.
 *
 * @param name  정류장 이름
 * @param busStopIds 버스정류장 ID 배열
 * @param i busStopIds에 넣을 인덱스
 * @returns {Promise}  Promise객체(busStopId 객체를 리턴)
 */
exports.getBusStopIdByName = function (name, busStopIds, i) {
    return new Promise( (resolve, reject) => {
        Model.BusStop.findOne(
            {name : name},
            {id : 1},(err, busStop) => {
                if(err) reject(err);
                busStopIds[i] = busStop.id;
                resolve(busStopIds[i]);
            });
    });
};

/**
 * 비콘을 찾습니다.
 * 
 * @param UUID
 * @param major
 * @param minor
 * @returns {Promise}  Promise객체(beacon 객체를 리턴)
 */
exports.getBeacon = function (UUID, major, minor) {
    return new Promise( (resolve, reject) => {
        Model.Beacon.findOne({
            UUID: UUID,
            major: major,
            minor: minor
        }, {_id: 0, __v: 0}, (err, docs) => {
            if(err) reject(err);
            resolve(docs);
        });
    });
};

/**
 * 버스정류장 DB를 얻습니다.
 *
 * @returns {Promise}  Promise객체(BusStop 객체 배열을 리턴)
 */
exports.getBusStopDb = function () {
    return new Promise( (resolve, reject) => {
        Model.BusStop.find()
            .select( {_id: 0, __v:0} )
            .exec((err, docs) => {
                if(err) reject(err);
                resolve(docs);
            });
    });
};

/**
 * 노선 DB를 얻습니다.
 *
 * @returns {Promise}  Promise객체(BusStop 객체 배열을 리턴)
 */
exports.getRouteDb = function () {
    return new Promise( (resolve, reject) => {
        Model.Route.find()
            .select( {_id: 0, __v:0} )
            .exec((err, docs) => {
                if(err) reject(err);
                resolve(docs);
            });
    });
};
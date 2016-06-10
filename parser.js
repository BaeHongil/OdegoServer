/**
 * Created by BHI on 2016-06-01.
 */
var Constants = require('./constants');
var request = require("request");
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');
var DB = require('./db');
var Model = require('./models/');
var Item = require('./items/');

// 대구도시코드 획득
var daeguCityCode = null;
var cityCodePromise = new Promise( (resolve, reject) => {
    var url = Constants.OPENAPI_DOMAIN + Constants.CITY_CODE_PATH
        + '?ServiceKey=' + Constants.API_SERVICE_KEY
        + '&numOfRows=9999';

    var requestOptions = {
        method : 'GET',
        url : url
    };

    request(requestOptions, (err, res, body) => {
        // error 처리
        if (err) reject(err);
        else if (res.statusCode != 200) reject('getDaeguCityCode statusCode : ' + res.statusCode);

        // response 처리
        var $ = cheerio.load(body);
        $('item').each(function (i, elem) {
            var cityName = $(elem).find('sname').text();
            if (cityName.match('대구')) {
                cityCode = $(elem).find('code').text();
                daeguCityCode = cityCode;
                resolve('Success finding daeguCityCode');
            }
        });

        if( daeguCityCode == null )
            reject(new Error('Fail finding daeguCityCode'));
    });

});


/* 함수 시작 */
/**
 * Date가 오늘과 같은지 확인
 * 
 * @param preDate  비교할 Date 객체
 * @returns {boolean}  Date객체가 오늘이면 true, 아니면 false
 */
function isToday(preDate) {
    var nowDate = new Date();
    return !( nowDate.getYear() > preDate.getYear()
        || nowDate.getMonth() > preDate.getMonth()
        || nowDate.getDate() > preDate.getDate() );
}

/**
 * 버스정류장 DB 생성
 *
 * @param isDropCollection  기존의 Collection(Table)을 Drop할거면 true, 아니면 false
 * @returns {Promise.<TResult>}  Promise객체(특별한 정보 없음)
 */
exports.createBusStopDB = function (isDropCollection) {
    return cityCodePromise.then( () => {
        if( isDropCollection )
            return DB.dropCollection('busstops');
        return isDropCollection;
    }).then(requestBusStopList)
    .then(requestBusStopNoList);
};

/**
 *  버스정류장 리스트를 OPEN API에서 획득
 *
 * @returns {Promise}  Promise객체(특별한 정보 없음)
 */
function requestBusStopList() {
    return new Promise(function (resolve, reject) {
        var url = Constants.OPENAPI_DOMAIN + Constants.BUS_LIST_PATH
            + '?ServiceKey=' + Constants.API_SERVICE_KEY
            + '&numOfRows=9999'
            + '&pageNo=1'
            + '&cityCode=' + daeguCityCode;

        request(url, (err, res, body) => {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('requestBusStopList statusCode : ' + res.statusCode);

            // response 처리
            var $ = cheerio.load(body);
            $('item').each( (i, elem) => {
                var busStop = new Model.BusStop();
                busStop.id = $(elem).find('nodeid').text().substring(3);
                busStop.name = $(elem).find('nodenm').text();
                busStop.gpsLati = $(elem).find('gpslati').text();
                busStop.gpsLong = $(elem).find('gpslong').text();
                busStop.save( (err, busStop) => {if(err) reject(err)} );
            });

            resolve('Success requestBusStopList');
        });
    });
}

/**
 *  버스정류장 번호리스트를 대구버스홈페이지에서 획득
 *
 * @returns {Promise} Promise객체(특별한 정보 없음)
 */
function requestBusStopNoList() {
    return new Promise( (resolve, reject) => {
        var url = Constants.BUSSTOPNO_LIST_URL;
        var requestOption = {
            method: 'GET',
            url: url,
            encoding: null,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0)'
            }
        };
        request(requestOption, (err, res, body) => {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('requestBusStopList statusCode : ' + res.statusCode);

            // response 처리
            var strContenst = iconv.decode(body, 'EUC-KR').toString();
            var $ = cheerio.load(strContenst);
            $('tbody tr').each( (i, elem) => {
                var children = $(elem).children();
                var no = children.eq(1).text(); // 정류장 번호
                if( no != 0 ) { // 정류장번호가 0이면 이상한 것이므로 제외
                    var name = children.eq(0).text(); // 정류장 이름
                    Model.BusStop.findOne({name: name}, (err, busStop) => { // 이름으로 정류장 찾아 정류장 번호 modify
                        if(err)
                            reject(err);
                        busStop.no = no;
                        busStop.save( err => { if (err) reject(err) } );
                    });
                }
            });

            resolve('Success requestBusStopNoList');
        });
    })
}

/**
 *  노선 DB 생성
 *
 * @param isDropCollection 기존의 Collection(Table)을 Drop할거면 true, 아니면 false
 * @returns {Promise.<TResult>} Promise객체(특별한 정보 없음)
 */
exports.createRouteDB = function (isDropCollection) {
    return cityCodePromise.then(() => {
        if(isDropCollection)
            return DB.dropCollection('routes');
        return isDropCollection;
    }).then(requestRouteList);
};

/**
 * 노선 리스트를 OPEN API에서 획득
 *
 * @returns {Promise} Promise객체(특별한 정보 없음)
 */
function requestRouteList() {
    return new Promise( (resolve, reject) => {
        var url = Constants.OPENAPI_DOMAIN + Constants.ROUTE_LIST_PATH
            + '?ServiceKey=' + Constants.API_SERVICE_KEY
            + '&numOfRows=9999'
            + '&pageNo=1'
            + '&cityCode=' + daeguCityCode;

        request(url, (err, res, body) => {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('requestRouteList statusCode : ' + res.statusCode);

            // response 처리
            var $ = cheerio.load(body);
            $('item').each(function (i, elem) {
                var route = new Model.Route();
                route.id = $(elem).find('routeid').text().substring(3);

                var rawNo = $(elem).find('routeno').text();
                var noOffset = rawNo.indexOf('[');
                if( noOffset != -1 ) {
                    route.no = rawNo.substring(0, noOffset);
                    route.direction = rawNo.substring(noOffset+1, rawNo.length-1); // 대괄호를 빼기 위해 +1, -1을 함
                } else
                    route.no = rawNo;

                route.type = $(elem).find('routetp').text();
                route.save( (err, route) => { if(err) reject(err) } );
            });

            resolve('success createRouteDB');
        });
    });
}


/* get 함수들 시작*/

/**
 * 특정 버스정류장의 노선별 도착정보를 얻습니다.
 *
 * @param busStopId  버스정류장ID
 * @returns {Promise.<TResult>}  Promise객체(routeArrInfos 리턴)
 */
exports.getBusStopArrInfos = function (busStopId) {
    var routeArrInfosPromise = isTodayUpdatedRoutes(busStopId).then( arrInfos => {
        if(arrInfos)
            return updateBusStopArrInfos(busStopId, arrInfos);
        else
            return requestBusStopArrInfos(busStopId);
    });

    return routeArrInfosPromise;
};

/**
 * 오늘 받은 버스정류장의 노선정보가 있는지 확인
 *
 * @param busStopId 버스정류장ID
 * @returns {Promise} Promise객체(오늘께 있으면 routeInfos객체 리턴, 그렇지 않으면, null 리턴)
 */
function isTodayUpdatedRoutes(busStopId) {
    return new Promise( (resolve, reject) => {
        Model.BusStop.findOne({id: busStopId}, (err, busStop) => {
            if(err) reject(err);
            if(busStop.updatedRouteInfos && isToday(busStop.updatedRouteInfos))
                resolve(busStop.routeInfos);
            resolve(null);
        });
    })
}

//
/**
 * 기존 버스정류장 노선정보가 하루 지나 만료됬거나 처음 요청할 때
 * 해당 버스정류장의 노선별 도착정보 획득
 *
 * @param busStopId  버스정류장ID
 * @returns {Promise}  Promise객체(routeArrInfos를 리턴)
 */
function requestBusStopArrInfos(busStopId) {
    return new Promise( (resolve, reject) => {
        var url = Constants.DAUGU_DOMAIN + Constants.BUSSTOP_ARRINFOS_PATH + busStopId;
        var requestOption = {
            method: 'GET',
            url: url,
            encoding: null
        };
        request(requestOption, (err, res, body) => {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('requestBusStopArrInfos statusCode : ' + res.statusCode);

            // response 처리
            var strBody = iconv.decode(body, 'EUC-KR').toString();
            var $ = cheerio.load(strBody);
            var routeInfos = [];
            var routeArrInfos = [];
            var arrInfosPromises = [];
            $('li.nx a').each( (i, elem) => {
                var href = $(elem).attr('href');
                var startOffset = href.indexOf('roId=');
                var endOffset = href.indexOf('&roNo=');
                if ( startOffset + 5 != endOffset && startOffset != -1 && endOffset != -1 ) {
                    var routeId = href.substring(startOffset + 5, endOffset);
                    var isForward = href.substring( href.indexOf('moveDir=') + 8 ) == 1;
                    routeInfos.push( new Item.RouteInfo(routeId, isForward) );
                    routeArrInfos.push( new Item.RouteArrInfo(routeId, isForward) );
                    arrInfosPromises.push( getArrInfos(busStopId, routeId, isForward) );
                }
            });

            Model.BusStop.findOne({id: busStopId}, function (err, busStop) {
                if(err)
                    reject(err);
                busStop.routeInfos = routeInfos;
                busStop.updatedRouteInfos = new Date();
                busStop.save( (err) => {if(err) reject(err)} );
            });

            Promise.all(arrInfosPromises).then( arrInfosArray => {
                arrInfosArray.forEach( (arrInfos, i) => { routeArrInfos[i].arrInfos = arrInfos } );
                resolve(routeArrInfos);
            });
        })
    });
}

/**
 * 오늘 버스정류장 노선정보를 가지고 있을 때, routeid, isForward 2개로 이루어진 객체들을 받아서 업데이트
 *
 * @param 버스정류장ID
 * @param routeArrInfos  노선ID
 * @returns {Promise}   Promise객체(routeArrInfos를 리턴)
 */
function updateBusStopArrInfos(busStopId, routeArrInfos) {
    return new Promise( (resolve, reject) => {
        var arrInfosPromises = [];
        routeArrInfos.forEach( (routeArrInfo, i) => {
            arrInfosPromises.push( getArrInfos(busStopId, routeArrInfo.routeId, routeArrInfo.isForward ));
        });

        resolve( Promise.all(arrInfosPromises).then( arrInfosArray => {
            arrInfosArray.forEach( (arrInfos, i) => { routeArrInfos[i].arrInfos = arrInfos } );
            return routeArrInfos;
        }) );
    })
};

/**
 * 특정 버스정류장 노선하나의 도착정보 획득
 *
 * @param busStopId  버스정류장ID
 * @param routeId  노선ID
 * @param isForward  정방향이면 true, 역방향이면 false
 * @returns {Promise}  Promise객체(arrInfos를 리턴)
 */
function getArrInfos(busStopId, routeId, isForward) {
    return new Promise( (resolve, reject) => {
        var url = Constants.DAUGU_DOMAIN + Constants.BUSSTOP_ROUTEARRINFOS_PATH + busStopId
            + '&roId=' + routeId
            + '&moveDir=' + (isForward ? 1 : 0);
        var requestOption = {
            method: 'GET',
            url: url,
            encoding: null
        };
        request(requestOption, (err, res, body) => {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('getArrInfos statusCode : ' + res.statusCode);

            // response 처리
            var strBody = iconv.decode(body, 'EUC-KR').toString();
            var $ = cheerio.load(strBody);
            var elems = $('table.air tbody');
            var arrInfos = [];
            if( elems.length > 0 ) {
                elems.each((i, elem) => {
                    var arrInfo = new Item.ArrInfo();
                    arrInfo.remainMin = parseInt( $(elem).find('.st').text() );
                    $(elem).find('tr').each( (i, elem) => {
                        var th = $(elem).find('th').text().trim();
                        if( th === '현재정류소' )
                            arrInfo.curBusStopName = $(elem).find('td').text();
                        else if( th === '종료정류소' )
                            arrInfo.endBusStopName = $(elem).find('td').text();
                        else if( th === '남은정류소' ) {
                            rawRemainBusStopCount = $(elem).find('td').text();
                            arrInfo.remainBusStopCount = parseInt( rawRemainBusStopCount.substring(0, rawRemainBusStopCount.indexOf('개소')) );
                        }
                    });
                    arrInfos.push(arrInfo);
                })
            } else { // 도착 정보가 없을 때 -> "기점에서 버스가 출발 대기중이거나 운행 정보가 없습니다.", "기점에서 22시 26분에 출발예정입니다. "
                var arrInfo = new Item.ArrInfo();
                arrInfo.message = $('p.gd').text();
                arrInfos.push(arrInfo);
            }

            resolve(arrInfos);
        })
    });
}

/**
 * 노선의 상세정보(기점, 종점, 배차간격 등)를 얻습니다.
 *
 * @param routeId
 * @returns {Promise.<TResult>} Promise객체(route 리턴)
 */
exports.getRouteDetailInfo = function (routeId) {
    var routePromise = isTodayUpdatedRouteDetail(routeId).then( route => {
        if(route)
            return route;
        else
            return requestRouteDetailInfo(routeId);
    });

    return routePromise;
};

/**
 * 오늘 받은 노선상세정보 있는지 확인 및 노선획득
 *
 * @param routeId 노선ID
 * @returns {Promise} Promise객체(오늘께 있으면 route객체 리턴, 그렇지 않으면, null 리턴)
 */
function isTodayUpdatedRouteDetail (routeId) {
    return new Promise( (resolve, reject) => {
        Model.Route.findOne({id: routeId}, {_id: 0, __v: 0}, (err, route) => {
            if(err) reject(err);
            if(route && route.updatedDetail && isToday(route.updatedDetail))
                resolve(route);
            resolve(null);
        });
    })
}

/**
 * 노선정보가 DB에 없을 때 routeId를 통해 획득
 * @param routeId
 * @returns {Promise} Promise객체(Route 객체)
 */
function getRouteById (routeId) {
    return isTodayUpdatedRouteDetail(routeId).then( route => {
        if (route)
            return route;

        return new Promise((resolve, reject) => {
            var url = Constants.DAEGU_ROUTE_INFO_URL + routeId;
            var requestOption = {
                method: 'GET',
                url: url,
                encoding: null,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0)'
                }
            };
            request(requestOption, (err, res, body) => {
                // error 처리
                if (err) reject(err);
                else if (res.statusCode != 200) reject('requestBusStopArrInfos statusCode : ' + res.statusCode);

                // response 처리
                var strBody = iconv.decode(body, 'EUC-KR').toString();
                var $ = cheerio.load(strBody);

                var mRoute = Model.Route();
                var idElem = $('#resultRed3');
                mRoute.no = idElem.text().trim();

                var children = $('.route_detail .align_left');
                mRoute.id = routeId;
                mRoute.direction = children.eq(0).text();
                mRoute.startBusStopName = children.eq(1).text();
                mRoute.endBusStopName = children.eq(2).text();
                var interval = children.eq(3).text();
                if( interval )
                    mRoute.interval = parseInt( children.eq(3).text() );
                mRoute.updatedDetail = new Date();
                mRoute.save((err, route) => { if (err) reject(err) });
                resolve(mRoute);
            });
        });

    });
}
exports.getRouteById = getRouteById;


/**
 * 노선상세정보을 대구버스홈페이지에 요청
 *
 * @param routeId  노선ID
 * @returns {Promise.<TResult>} Promise객체(route 객체 리턴)
 */
function requestRouteDetailInfo(routeId) {
    var promise = cityCodePromise.then( () => {
        return new Promise( (resolve, reject) => {
            var url = Constants.OPENAPI_DOMAIN + Constants.ROUTE_INFO_PATH
                + '?ServiceKey=' + Constants.API_SERVICE_KEY
                + '&numOfRows=9999'
                + '&pageNo=1'
                + '&cityCode=' + daeguCityCode
                + '&routeId=DGB' + routeId;

            request(url, (err, res, body) => {
                // error 처리
                if (err) reject(err);
                else if (res.statusCode != 200) reject('requestRouteDetailInfo statusCode : ' + res.statusCode);

                // response 처리
                var $ = cheerio.load(body);
                var elem = $('item');
                if( elem.length == 0 )
                    getRouteById(routeId).then(resolve).catch(reject);
                else {
                    Model.Route.findOne({id: routeId}, {__v: 0}, (err, route) => { // 이름으로 정류장 찾아 정류장 번호 modify
                        if (err) reject(err);
                        route.startBusStopName = elem.find('startnodenm').text();
                        route.endBusStopName = elem.find('endnodenm').text();
                        var strStartTime = elem.find('startvehicletime').text();
                        if( strStartTime ) {
                            route.startHour = parseInt( strStartTime.substring(0, 2) );
                            route.startMin = parseInt( strStartTime.substring(2) );
                        }
                        var strEndTime = elem.find('endvehicletime').text();
                        if( strEndTime ) {
                            route.endHour = parseInt( strEndTime.substring(0, 2) );
                            route.endMin = parseInt( strEndTime.substring(2) );
                        }
                        var interval = elem.find('intervalTime').text();
                        var intervalSat = elem.find('intervalsattime').text();
                        var intervalSun = elem.find('intervalsuntime').text();
                        if (interval)
                            route.interval = parseInt( interval );
                        if (intervalSat)
                            route.intervalSat = parseInt( elem.find('intervalsattime').text() );
                        if (intervalSun)
                            route.intervalSun = parseInt( elem.find('intervalsuntime').text() );
                        route.updatedDetail = new Date();
                        route.save( (err) => {
                            if(err) reject(err);
                        } );

                        resolve(route);
                    });
                }
            });
        });
    });

    return promise;
}




/**
 * 노선ID를 가지고 경류정류장 및 버스위치를 획득합니다.
 *
 * @param routeId  노선ID
 * @param isForward 정방향이면 true, 역방향이면 false
 * @returns {Promise}  Promise객체(busPosInfos를 리턴)
 */
exports.getBusPosInfos = function (routeId, isForward) {
    return new Promise( (resolve, reject) => {
        var url = Constants.DAUGU_DOMAIN + Constants.BUS_POSINFOS_PATH + routeId
            + '&moveDir=' + (isForward ? 1:0);
        var requestOptions  = {
            method: "GET",
            uri: url,
            encoding: null
        };

        request(requestOptions, function(err, res, body) {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('getBusPosInfos statusCode : ' + res.statusCode);

            // response 처리
            var strContents = iconv.decode(body, 'EUC-KR').toString();
            var $ = cheerio.load(strContents);
            var topElems = $('ol.bl');

            var busIdPromises = [];
            var busPosInfos = [];
            topElems.find('span.pl39').each(function (i, elem) { // 버스 정류장 목록 파싱
                var plainText = $(elem).text();
                var startOffset = plainText.indexOf('. ');
                var busPosInfo = new Item.BusPosInfo();

                var busStopName = plainText.substr(startOffset + 2);
                busIdPromises.push(DB.getBusStopByName(busStopName, busPosInfo));
                busPosInfos.push(busPosInfo);
            });

            topElems.find('li.bloc_b').each(function (i, elem) { // 버스위치 정보 및 버스ID 획득
                var plainText = $(elem).text();
                var endOffset = plainText.indexOf('(');
                var index = $(elem).index() - i -1;

                busPosInfos[index].busId = plainText.substr(0, endOffset).trim();
                if( $(this).hasClass('nsbus') )
                    busPosInfos[index].isNonStepBus = true;
            });

            Promise.all(busIdPromises).then( () => {
                resolve(busPosInfos);
            }).catch(reject);
        });
    });
};

/**
 * 노선ID와 버스ID를 가지고 경류정류장, 방향(정방향, 역방향), 버스위치, 찾는 버스의 Index를 획득합니다.
 * 비콘을 이용해 정보를 획득할 때 사용
 *
 * @param routeId  노선ID
 * @param searchBusId  찾을 버스ID
 * @returns {Promise}  Promise객체(beaconArrInfos를 리턴)
 */
exports.getBusPosInfosByBusId = function (routeId, searchBusId) {
    return new Promise( (resolve, reject) => {
        var baseUrl = Constants.DAUGU_DOMAIN + Constants.BUS_POSINFOS_PATH + routeId
            + '&moveDir=';
        var forwardRequestOptions  = {
            method: "GET",
            uri: baseUrl + 1,
            encoding: null
        };
        var backwardRequestOptions  = {
            method: "GET",
            uri: baseUrl + 0,
            encoding: null
        };

        var forwardPromise = requestSearchBusId(forwardRequestOptions, searchBusId);
        var backwardPromise = requestSearchBusId(backwardRequestOptions, searchBusId);
        Promise.all([forwardPromise, backwardPromise]).then( (values) => {
            var beaconArrInfos = values[0] || values[1];
            beaconArrInfos.routeId = routeId;
            beaconArrInfos.isForward = true;
            
            resolve(beaconArrInfos);
        }).catch( reject );
    });
};

function requestSearchBusId(requestOptions, searchBusId) {
    return new Promise( (resolve, reject) => {
        request(requestOptions, function(err, res, body) {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('getBusPosInfos statusCode : ' + res.statusCode);

            // response 처리
            var strContents = iconv.decode(body, 'EUC-KR').toString();
            var $ = cheerio.load(strContents);
            var topElems = $('ol.bl');

            var foundIndex = -1;
            var busStops = topElems.find('span.pl39');

            topElems.find('li.bloc_b').each(function (i, elem) { // 버스위치 정보 및 버스ID 획득
                var plainText = $(elem).text();
                var endOffset = plainText.indexOf('(');
                var index = $(elem).index() - i -1;

                var busId = plainText.substr(0, endOffset).trim();
                if( busId == searchBusId ) {
                    foundIndex = index;
                    return false;
                }
            });

            if (foundIndex == -1)
                resolve(null);

            var busStopIds = [];
            var busStopIdPromises = [];
            busStops.each(function (i, elem) { // 버스 정류장 목록 파싱
                var plainText = $(elem).text();
                var startOffset = plainText.indexOf('. ');
                
                var busStopName = plainText.substr(startOffset + 2);
                busStopIdPromises.push(DB.getBusStopIdByName(busStopName, busStopIds[i]));
            });
            
            Promise.all(busStopIdPromises).then(() => {
                resolve(new Item.BeaconArrInfos(searchBusId, foundIndex, busStopIds));
            }).catch(reject);
        });
    });
}

/**
 * 노선ID와 버스차량번호(busId)를 가지고 현재 버스의 위치(index)만 알아냅니다.
 *
 * @param routeId  노선ID
 * @param isForward  정방향이면 true, 역방향이면 false
 * @param searchBusId  버스차량번호
 * @returns {Promise}  Promise객체(index을 리턴)
 */
exports.getBusPosByBusId = function (routeId, isForward, searchBusId) {
    return new Promise( (resolve, reject) => {
        var url = Constants.DAUGU_DOMAIN + Constants.BUS_POSINFOS_PATH + routeId
            + '&moveDir=' + (isForward ? 1:0);
        var requestOptions  = {
            method: "GET",
            uri: url,
            encoding: null
        };

        request(requestOptions, function(err, res, body) {
            // error 처리
            if (err) reject(err);
            else if (res.statusCode != 200) reject('getBusPosInfos statusCode : ' + res.statusCode);

            // response 처리
            var foundIndex = -1;
            var strContents = iconv.decode(body, 'EUC-KR').toString();
            var $ = cheerio.load(strContents);
            var topElems = $('ol.bl');

            topElems.find('li.bloc_b').each(function (i, elem) {
                var plainText = $(elem).text();
                var endOffset = plainText.indexOf('(');
                var index = $(elem).index() - i -1;

                var busId = plainText.substr(0, endOffset).trim();
                if( busId == searchBusId )
                    resolve(index);
            });

            // 버스번호에 해당되는 버스위치를 못 찾았을 때
            resolve(null);
        });
    });
};
/**
 * Created by BHI on 2016-06-01.
 */
var Constants = {
    OPENAPI_DOMAIN : 'http://openapi.tago.go.kr/openapi/service/',
    API_SERVICE_KEY : '%2FINPAsm7NTY0H7pQwDLNdW5dFd%2FhZxqvngMPEUKPW2de5TVRU2fhgI6x6CsUpkhjJYmH5tG4vYCahsntFWxJ%2Bg%3D%3D',
    CITY_CODE_PATH: 'BusSttnInfoInqireService/getCtyCodeList',
    BUS_LIST_PATH : 'BusSttnInfoInqireService/getSttnNoList',
    ROUTE_LIST_PATH : 'BusRouteInfoInqireService/getRouteNoList',
    ROUTE_INFO_PATH : 'BusRouteInfoInqireService/getRouteInfoIem',
    BUSSTOPNO_LIST_URL : 'http://businfo.daegu.go.kr/ba/arrbus/arrbus.do?act=findByBusStopNo&bsNm=',
    DAUGU_DOMAIN : 'http://m.businfo.go.kr/bp/m/',
    BUSSTOP_ARRINFOS_PATH : 'realTime.do?act=arrInfoRouteList&bsNm=&bsId=',
    BUSSTOP_ROUTEARRINFOS_PATH : 'realTime.do?act=arrInfoRoute&bsNm=&roNo=&bsId=',
    BUS_POSINFOS_PATH : 'realTime.do?act=posInfo&roNo=&roId=',
    DAEGU_ROUTE_INFO_URL : 'http://businfo.daegu.go.kr/ba/route/route.do?act=findByService&routeId=',
    FCM_SERVER_KEY : 'AIzaSyDMlBccXfPK6e_e-rPdIdkGQiUxTcRr7z4'
};

module.exports = Constants;

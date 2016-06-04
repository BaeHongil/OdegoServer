/**
 * Created by BHI on 2016-06-03.
 */
var RouteInfo = require('./routeinfo');

module.exports = class RouteArrInfo extends RouteInfo {
    constructor(routeId, isForward, arrInfos) {
        super(routeId, isForward);
        this.arrInfos = arrInfos;
    }
};
/**
 * Created by BHI on 2016-06-03.
 */
module.exports = class ArrInfo {
    constructor(remainMin, curBusStopName, endBusStopName, remainBusStop) {
        this.remainMin = remainMin;
        this.curBusStopName = curBusStopName;
        this.endBusStopName = endBusStopName;
        this.remainBusStopCount = remainBusStop;
        this.message = null;
    }
}
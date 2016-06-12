/**
 * Created by BHI on 2016-06-04.
 */
module.exports = class BeaconArrInfo {
    constructor(busId, foundIndex, busStopIds) {
        this.routeId = null;
        this.isForward = null;
        this.busId = busId;
        this.foundIndex = foundIndex;
        this.busStopIds = busStopIds;
    }
}
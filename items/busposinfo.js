/**
 * Created by BHI on 2016-06-04.
 */
module.exports = class BusPosInfo {
    constructor(busStopId, busId, isNonStepBus) {
        this.busStopId = busStopId;
        this.busId = busId;
        this.isNonStepBus = isNonStepBus;
    }
};
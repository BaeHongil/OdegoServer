/**
 * Created by BHI on 2016-06-11.
 */
module.exports = class BusArr {
    constructor(notiReqMsg, destIndex) {
        this.routeId = notiReqMsg.routeId;
        this.isForward = notiReqMsg.isForward;
        this.busId = notiReqMsg.busId;
        this.requestRemainCount = notiReqMsg.requestRemainCount;
        this.curIndex = -1;
        this.destIndex = destIndex;
        this.isValid = true;
    }
}
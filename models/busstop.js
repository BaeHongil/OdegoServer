/**
 * Created by BHI on 2016-06-02.
 */
var mongoose = require('mongoose');

var busStopSchema =new mongoose.Schema({
    id: {type: String, unique: true},
    name: {type: String, index: true},
    no: String,
    gpsLati: Number,
    gpsLong: Number,
    routeInfos: [mongoose.Schema.Types.Mixed],
    updatedRouteInfos: Date
});

var BusStop = mongoose.model('BusStop', busStopSchema);
module.exports = BusStop;
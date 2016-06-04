/**
 * Created by BHI on 2016-06-02.
 */
var mongoose = require('mongoose');

var routeSchema =new mongoose.Schema({
    id: {type: String, unique: true}, // 노선고유ID
    no: String, // 버스번호
    direction: String, // 방면
    type: String, // 노선유형
    startBusStopName: String,
    endBusStopName: String,
    startHour: Number,
    startMin: Number,
    endHour: Number,
    endMin: Number,
    interval: Number,
    intervalSat: Number,
    intervalSun: Number,
    updatedDetail: Date
});

routeSchema.path('type').set(function (type) {
    if( type === '시외버스')
        type = '순환버스';
    return type;
});

var Route = mongoose.model('Route', routeSchema);
module.exports = Route;
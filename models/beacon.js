/**
 * Created by BHI on 2016-06-04.
 */
/**
 * Created by BHI on 2016-06-02.
 */
var mongoose = require('mongoose');

var beaconSchema =new mongoose.Schema({
    UUID: {type: String, index: true},
    major: {type: Number, index: true},
    minor: {type: Number, index: true},
    routeId : String,
    busId: String
});

var Beacon = mongoose.model('Beacon', beaconSchema);
module.exports = Beacon;
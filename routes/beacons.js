/**
 * Created by BHI on 2016-06-04.
 */
var DB = require('../db');
var Parser = require('../parser');
var express = require('express');
var router = express.Router();

router.get('/:uuid/:major/:minor/busposinfos', (req, res) => {
    var uuid = req.params.uuid;
    var major = req.params.major;
    var minor = req.params.minor;
    DB.getBeacon(uuid, major, minor).then( beacon => {
        return Parser.getBusPosInfosByBusId(beacon.routeId, beacon.busId);
    }).then( beaconArrInfos => {
        if( !beaconArrInfos )
            res.status(404).end();
        else
            res.json(beaconArrInfos);
    } ).catch( err => {
        console.error(err);
        res.status(500).end();
    });
});

module.exports = router;
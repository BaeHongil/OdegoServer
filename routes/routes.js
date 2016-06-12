/**
 * Created by BHI on 2016-06-04.
 */
var DB = require('../db');
var Parser = require('../parser');
var express = require('express');
var router = express.Router();

// GET 노선 DB
router.get('/', (req, res) => {
    DB.getRouteDb().then( docs => {
        res.json(docs);
    }).catch( err => {
        console.error(err);
        res.status(500).end();
    });
});

router.get('/:id/detailinfo', (req, res) => {
    Parser.getRouteDetailInfo(req.params.id).then( route => {
        res.json(route);
    }).catch( err => {
        console.error(err);
        res.status(500).end();
    });
});

router.get('/:id', (req, res) => {
    Parser.getRouteById(req.params.id).then( route => {
        res.json(route);
    }).catch( err => {
        console.error(err);
        res.status(500).end();
    });
});

router.get('/:id/busposinfos', (req, res) => {
    if( !req.query.isforward ) res.status(400).end();
    var isForward = (req.query.isforward == 'true');
    Parser.getBusPosInfos(req.params.id, isForward).then( busPosInfos => {
        res.json(busPosInfos);
    }).catch( err => {
        console.error(err);
        res.status(500).end();
    });
});

router.get('/:id/buspos', (req, res) => {
    if( !req.query.isforward || !req.query.busid ) res.status(400).end();
    var isForward = (req.query.isforward == 'true');
    var busId = req.query.busid;
    console.log(busId);
    Parser.getBusPosByBusId(req.params.id, isForward, busId).then( index => {
        if( index === null)
            res.status(404).end();
        else
            res.json(index);
    }).catch( err => {
        console.error(err);
        res.status(500).end();
    });
});

module.exports = router;
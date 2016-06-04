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
        res.status(500).end();
    });
});

router.get('/:id/detailinfo', (req, res) => {
    console.log(req);
    Parser.getRouteDetailInfo(req.params.id).then( route => {
        res.json(route);
    }).catch( err => {
        res.status(500).end();
    });
});

router.get('/:id/busposinfos', (req, res) => {
    if( !req.query.isforward ) res.status(400).end();
    var isForward = (req.query.isforward == 'true') ? true : false;
    Parser.getBusPosInfos(req.params.id, isForward).then( busPosInfos => {
        res.json(busPosInfos);
    }).catch( err => {
        res.status(500).end();
    });
});

module.exports = router;
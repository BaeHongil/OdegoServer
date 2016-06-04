/**
 * Created by BHI on 2016-06-04.
 */
var DB = require('../db');
var Parser = require('../parser');
var express = require('express');
var router = express.Router();

// GET 버스정류장 DB
router.get('/', (req, res) => {
    DB.getBusStopDb().then( docs => {
        res.json(docs);
    }).catch( err => {
        res.status(500).end();
    });
});

router.get('/:id/arrinfos', (req, res) => {
    Parser.getBusStopArrInfos(req.params.id).then( routeArrInfos => {
        res.json(routeArrInfos);
    }).catch( err => {
        res.status(500).end();
    });
});

module.exports = router;
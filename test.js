
var mongoose = require('mongoose');
var Model = require('./models/');
var Item = require('./items/');
var Parser = require('./parser');

/*Parser.getRouteDetailInfo('3000306000').then( route => {
    console.log(route);
}).catch( err => {
    console.log(err);
});*/

// Parser.getBusPosInfosByBusId('3000937000', '대구70자 3112').then(console.log).catch(console.log);
//Parser.getBusPosInfos('3000937000', true).then(console.log).catch(console.log);


var a;
if(a)
    console.log(a);
//setTimeoutPromise(1000).then(console.log);


function setTimeoutPromise() {
    return new Promise( (resolve, reject) => {
        console.log('promise');
        resolve(resolve1(1));
        resolve(resolve1(2));
    });
}

function resolve1(n) {
    return new Promise( (resolve, reject) => {
        console.log(n);
        resolve(n);
    });
}
setTimeoutPromise().then(a => {
});
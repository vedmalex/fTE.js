var Factory = require('../').Factory;


// F.ensure('QuickLinks.nhtml', 'qlinks');
// var s = F.run({
// 	title:"Quick Links",
// 	items:[
// 		{url:"#", title:"one"},
// 		{url:"#", title:"two"},
// 		{url:"#", title:"tree"},
// 	]
// }, 'qlinks');
// console.log(s);

// F.ensure('Container.nhtml', 'qlinks');
// var s = F.run('TEXT', 'Container1.nhtml');
// console.log(s);

var microtime = require('microtime');

var s;


var raw = new Factory({
    root: 'raw'
});
var startRaw = microtime.now();
s = raw.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
var endRaw = microtime.now();

var startRaw2 = microtime.now();
s = raw.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
var endRaw2 = microtime.now();

var comp = new Factory({
    root: 'compiled'
});

var startComp = microtime.now();
s = comp.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
var endComp = microtime.now();

console.log("raw", endRaw - startRaw);
console.log("raw2", endRaw2 - startRaw2);
console.log("comp", endComp - startComp);
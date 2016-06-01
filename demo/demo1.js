var Factory = require('../').Factory;
var s;
var raw = new Factory({
    root: 'raw',
    debug:true,
});

console.time('raw');
s = raw.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('raw');

console.time('raw-cached');
s = raw.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('raw-cached');

var comp = new Factory({
    root: 'compiled',
    debug:true,
});

console.time('compiled');
s = comp.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('compiled');

console.time('compiled-cached');
s = comp.run({content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('compiled-cached');

console.log(s);
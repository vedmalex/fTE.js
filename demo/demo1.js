var Factory = require('../').Factory;
var fs = require('fs-extra');
var s;
var raw = new Factory({
    root: 'raw',
    debug:true,
});

console.time('raw');
s = raw.run({title:'Happy Santa', content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('raw');

console.time('raw-cached');
s = raw.run({title:'Happy Santa', content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('raw-cached');

var comp = new Factory({
    root: 'compiled',
    debug:true,
});

console.time('compiled');
s = comp.run({title:'Happy Santa', content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('compiled');

console.time('compiled-cached');
s = comp.run({title:'Happy Santa', content:'TEXT', header:'this is the header', greetings:'Santa'}, 'Container2.nhtml');
console.timeEnd('compiled-cached');

fs.writeFileSync('demo1.html', s);

var Factory = require('../').Factory;
var fs = require('fs-extra');
var s;
var raw = new Factory({
    root: 'raw',
    debug:true,
});

s = raw.run({content:'TEXT', title: 'Some Title', head: { header:'this is the header'}, greetings:'Santa'}, 'Container2.nhtml');

fs.writeFileSync('demo1.html', s);
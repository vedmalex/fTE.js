var fs = require('fs-extra');
var path = require('path');
var compileFull = require('./../').compileFull;
var compileLight = require('./../').compileLight;
var glob = require('glob');

var root = ['raw', '/home/vedanta-krit/Work/merchantz/Merchantz/web/views/']
var ext = ['js','nhtml'];

var files = [];
for( var i = 0, rLen = root.length; i < rLen; i++ ) {
	for(var j = 0, eLen = ext.length; j < eLen; j++){
		files = files.concat(glob.sync('*.'+ext[j], {
			root:root[i],
			cwd: root[i],
			matchBase: true,
		}));
	}
}

console.log(files);
console.log(files.length);
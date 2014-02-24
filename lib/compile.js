var raw = require('./raw.pegjs.js');
var fs = require('fs');
var path = require('path');

var Gte = require('./fTE.js');
var F = new Gte.Factory({
	root: path.join(__dirname, '..', 'templates')
});

function compileLight(content) {
	var compiled = raw.parse(content.toString());
	return F.run(compiled, 'raw.njs');
}

exports.compileLight = compileLight;
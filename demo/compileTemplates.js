var fs = require('fs');
var path = require('path');
var compile = require('./../').compileLight;

function load(fileName, folder) {
	var fn = path.resolve(fileName);
	if (fs.existsSync(fn)) {
		var content = fs.readFileSync(fn);
		var result = compile(content);
		fs.writeFileSync(path.join(folder, path.basename(fileName) + '.js'), result);
	}
}

var files = fs.readdirSync('raw');
var stat;
if (files.length > 0) {
	var rec, stat, ext;
	for (var i = 0, len = files.length; i < len; i++) {
		rec = path.join('raw',files[i]);
		stat = fs.statSync(rec);
		if (stat.isFile()) {
			ext = path.extname(rec);
			if (ext === '.nhtml' || ext === '.njs') {
				load(rec, './compiled');
			}
		}
	}
}
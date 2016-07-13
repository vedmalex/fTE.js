var fs = require('fs-extra');
var path = require('path');
var compileFull = require('./../').compileFull;
var compileLight = require('./../').compileLight;

function load(fileName, folder, compile, optimize) {
  fs.ensureDirSync(folder);
  var fn = path.resolve(fileName);
  if (fs.existsSync(fn)) {
    var content = fs.readFileSync(fn);
    var result = compile(content, optimize);
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
        load(rec, './raw', compileFull, true);
        load(rec, './compiled', compileFull);
        load(rec, './compiledLight', compileLight);
      }
    }
  }
}

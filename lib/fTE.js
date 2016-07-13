var fs = require('fs');
var path = require('path');
var glob = require('glob');

var Template = require("./template.js");
var TemplateFactory = require("./templateFactory.js");
var esprima = require('esprima');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

function safeEval(src) {
  var hasError = false;
  var ast;
  try {
    ast = esprima.parse(src,{
        sourceType:"module",
        ecmaVersion: 6,
        comment:true,
      });
  } catch (err) {
    fs.writeFileSync('failed.js', src);
    console.log("\t \x1b[34m" + err.message + "\x1b[0m");
    console.log("for mode debug information see 'failed.js' ");
    hasError = err;
  } finally {
    if (!hasError) {
      var optimized = esmangle.optimize(ast, [
        [esmangle.pass.Registry.pass['remove-empty-statement']]
      ]);
      var output = escodegen.generate(optimized);
      var result;
      try{
        result = eval(output);
      } catch(err) {
        fs.writeFileSync('failed.js', output);
        console.log("\t \x1b[34m" + err.message + "\x1b[0m");
        console.log("for mode debug information see 'failed.js' ");
        hasError = err;
      }
      return result;
    } else {
      throw hasError;
    }
  }
}

function makeFunction(fnDef, name) {
  var result;
  try {
    var fname = name.replace(/[\s,\\\/\.\-]/g, '_');
    result = safeEval('result = function ' + fname + ' (' + fnDef.parameters + '){\n' + fnDef.body + '\n}');
  } catch (error) {
    result = {
      err: error,
      code: fnDef.body
    };
  } finally {
    return result;
  }
}

TemplateFactory.prototype.load = function(fileName, absPath) {
  var root;
  for (var i = 0, len = this.root.length; i < len; i++) {
    root = this.root[i];
    var fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
    if (fs.existsSync(fn + '.js')) {
      var result;
      // if (this.debug) {
      // 	result = require(fn + '.js');
      // } else {
      var storedScript = fs.readFileSync(fn + '.js');
      result = safeEval(storedScript);
      // }
      if (result instanceof Function) {
        result = {script: result, compile: new Function()};
      }
      result.absPath = fn;
      result.name = fileName;
      result.factory = this;
      var templ = new Template(result);
      this.register(templ, fileName);
      templ.compile();
      return templ;
    } else if (fs.existsSync(fn)) {
      var content = fs.readFileSync(fn);
      var tpl = new Template({
        source: content.toString(),
        name: fileName,
        absPath: fn,
        factory: this
      });
      var hasException = true;
      try {
        tpl.compile();
        hasException = false;
      } finally {
        if (!hasException)
          return this.register(new Template(tpl), fileName);
      }
    }
  }
  throw new Error('template ' + fileName + ' not found (absPath= ' + absPath + ')');
};

TemplateFactory.prototype.preload = function() {
  var files = [];
  for( var i = 0, rLen = this.root.length; i < rLen; i++ ) {
    for(var j = 0, eLen = this.ext.length; j < eLen; j++){
      files = files.concat(glob.sync('*.'+this.ext[j], {
        root: this.root[i],
        cwd: this.root[i],
        matchBase: true,
      }));
    }
  }
  for (var i = 0, len = files.length; i < len; i++){
    this.load(files[i]);
  }
}

// создает шаблон из текста
TemplateFactory.prototype.create = function(source, name) {
  if (!name) name = 'freegenerated' + Math.random().toString() + '.js';
  var tpl = new Template({
    source: source,
    name: name,
    absPath: name,
    factory: this
  });
  tpl.compile();
  this.register(tpl);
  return name;
};

function makeTemplate(src) {
  var compileTemplate = require('./compile').compileLight;
  var result;
  var compiled = compileTemplate(src);
  try {
    result = safeEval('result = ' + compiled);
  } catch (error) {
    result = {
      error: error,
      code: src
    };
  } finally {
    return result;
  }
}

Template.prototype.compile = function() {
  if (this.srcCode) {
    var result = makeTemplate(this.srcCode);
    if(!result.error) {
      this.script = result.script;
      this.blocks = result.blocks;
      this.compile = result.compile;
      this.dependency = result.dependency;
      if(result.alias){
        this.alias = result.alias;
      }
      this.compile();
    } else {
      throw result.error;
    }
  }
  return this;
};

TemplateFactory.prototype.run = function(context, name, absPath) {
  var templ = this.ensure(name, absPath);
  var bc = this.blockContent(templ);
  return bc.run(context, bc.content, bc.partial);
};

TemplateFactory.prototype.express = function(){
  var self = this;
  return function(fileName, context, callback) {
    var templ = self.ensure(fileName, true);
    var bc = self.blockContent(templ);
    var result;
    try {
      result = bc.run(context, bc.content, bc.partial);
    } catch(e){
      callback(e);
    }
    callback(null, result);
  }
};

TemplateFactory.prototype.clearCache = function(fn, list) {
  for(var i = 0, keys = Object.keys(list) ,len = keys.length; i < len; i++) {
    delete this.cache[list[keys[i]].name];
    delete this.cache[list[keys[i]].absPath];
  }
}

TemplateFactory.prototype.checkChanges = function(template, fileName, absPath){
  var root;
  for (var i = 0, len = this.root.length; i < len; i++) {
    root = this.root[i];
    var fn = absPath ? path.resolve(fileName) : path.resolve(path.join(root, fileName));
    var fw = undefined;
    if (fs.existsSync(fn + '.js')) {
      fw = fn + '.js';
    } else if (fs.existsSync(fn)) {
      fw = fn;
    }
    if (fw) {
      if (!this.watchTree[fw]) {
        var templates = {};
        templates[template.absPath] = template;
        templates[template.name] = template;
        this.watchTree[fw] = {
          watcher: fs.watch(fw, { persistent: false }, (event, filename)=> {
            if(event == 'change'){
              var list = this.watchTree[fw].templates;
              this.clearCache(fw, list);
            } else {
              this.watchTree[fw].close();
              delete this.watchTree[fw];
            }
          }),
          templates: templates,
        }
      }
      break;
    }
  }
}

exports.Template = Template;
exports.Factory = TemplateFactory;

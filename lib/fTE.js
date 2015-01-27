var fs = require('fs');
var path = require('path');

var gte2 = require('./fte.pegjs.js');

var Template = require("./template.js");
var TemplateFactory = require("./templateFactory.js");
var acorn = require('acorn');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

function safeEval(src) {
	var hasError = false;
	var ast;
	try {
		ast = acorn.parse(src);
	} catch (err) {
		console.log('\x1b[31m ERROR \x1b[0m while parsing the file : [\x1b[31m' + filename + "\x1b[0m]");
		console.log("\t \x1b[34m" + err.message + "\x1b[0m");
		hasError = err;
	} finally {
		if (!hasError) {
			var optimized = esmangle.optimize(ast, [
				[esmangle.pass.Registry.pass['remove-empty-statement']]
			]);
			var output = escodegen.generate(optimized);
			var result = eval(output);
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
		var fn = absPath ? path.resolve(fileName) : path.join(root, fileName);
		if (fs.existsSync(fn + '.js')) {
			var result;
			if (this.debug) {
				result = require(fn + '.js');
			} else {
				var storedScript = fs.readFileSync(fn + '.js');
				result = safeEval(storedScript);
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

// компиляция шаблона доступна только в серверной версии
Template.prototype.compile = function() {
	if (this.srcCode) {
		var result = gte2.parse(this.srcCode);
		this.parent = result.extend ? result.extend.trim() : undefined;
		var fn;
		if (result.block) {
			for (var bname in result.block) {
				fn = makeFunction(result.block[bname], this.name + bname);
				if ('function' === typeof fn) {
					if (!this.blocks)
						this.blocks = {};
					this.blocks[bname] = fn;
				} else {
					// console.log('Error while compile block ', bname);
					throw fn.err;
				}
			}
		}

		if (result.requireList.length > 0) {
			var req, fList = [],
				rTempl;
			var reqList = result.requireList;
			for (var i = 0, len = reqList.length; i < len; i++) {
				req = reqList[i].split(',');
				fList.length = 0;
				var item;
				for (var j = 0, rLen = req.length; j < rLen; j++) {
					item = req[j];
					if (item) fList.push(item.trim());
				}

				if (fList.length === 1)
					rTempl = {
						file: fList[0],
						alias: fList[0],
						absPath: false
					};
				else if (fList.length === 2)
					rTempl = {
						file: fList[0],
						alias: fList[1],
						absPath: false
					};
				else if (fList.length === 3)
					rTempl = {
						file: fList[0],
						alias: fList[1],
						absPath: true
					};

				if (rTempl) {
					var tpl = this.factory.ensure(rTempl.file, rTempl.absPath);
					this.aliases[rTempl.alias] = tpl.absPath;
				}
			}
		}
		if (result.main) {
			fn = makeFunction(result.main, this.name);
			if ('function' == typeof fn) {
				this.script = fn;
			} else {
				// console.log('Error while compile main template ');
				throw fn.err;
			}
		}
	}
	if (this.parent) {
		this.mergeParent(this.factory.ensure(this.parent));
	}
	return this;
};


TemplateFactory.prototype.run = function(context, name, absPath) {
	var templ = this.ensure(name, absPath);
	var bc = this.blockContent(templ);
	return bc.run(context, bc.content, bc.partial);
};

exports.Template = Template;
exports.Factory = TemplateFactory;
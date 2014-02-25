var fs = require('fs');
var vm = require('vm');
var path = require('path');
var gte2 = require('./fte.pegjs.js');

function Template(config) {
	if (!(this instanceof Template)) throw new Error('constructor is not a function');
	this.srcCode = config.source ? config.source.toString() : undefined;
	this.name = config.name;
	this.script = config.script;
	this.blocks = config.blocks;
	this.parent = config.parent ? config.parent.trim() : undefined;
	this.requires = config.requires || {};
}

function makeFunction(fnDef) {
	var result;
	try {
		result = new Function(fnDef.parameters, fnDef.body);
	} catch (error) {
		return {
			err: error,
			code: fnDef.body
		};
	}
	return result;
}

Template.prototype.compile = function() {
	if (this.srcCode) {
		var result = gte2.parse(this.srcCode);
		this.parent = result.extend ? result.extend.trim() : undefined;
		var fn;
		if (result.block) {
			for (var bname in result.block) {
				fn = makeFunction(result.block[bname]);
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
			var req, fList = [];
			var reqList = result.requireList;
			for (var i = 0, len = reqList.length; i < len; i++) {
				req = reqList[i].split(',');
				var item;
				fList.length = 0;
				for (var j = 0, rLen = req.length; j < rLen; j++) {
					item = req[j];
					if (item) fList.push(item);
				}
				if (fList.length === 1) this.requires[fList[0]] = {
					alias: fList[0],
					absPath: false
				};
				if (fList.length === 2) this.requires[fList[0]] = {
					alias: fList[1],
					absPath: false
				};
				if (fList.length === 3) this.requires[fList[0]] = {
					alias: fList[1],
					absPath: true
				};
			}
		}
		if (result.main) {
			fn = makeFunction(result.main);
			if ('function' === typeof fn) {
				this.script = fn;
			} else {
				// console.log('Error while compile main template ');
				throw fn.err;
			}
		}
	}
	return this;
};

Template.prototype.parent = false;
Template.prototype.blocks = false;
Template.prototype.requires = false;
Template.prototype.name = false;
Template.prototype.srcCode = false;
Template.prototype.script = false;

function TemplateFactory(config) {
	if (!(this instanceof TemplateFactory)) throw new Error('constructor is not a function');
	this.root = config.root ? config.root : process.cwd();
}

TemplateFactory.prototype.cache = {};
TemplateFactory.prototype.aliases = {};

TemplateFactory.prototype.register = function(tpl, alias) {
	if (!(tpl.name in this.cache)) {
		this.cache[tpl.name] = tpl;
	}
	// register alias
	if (alias) this.aliases[alias] = tpl.name;
	return tpl;
};

TemplateFactory.prototype.enforce = function(fileName, alias, absPath) {
	if (typeof alias === 'boolean') {
		absPath = alias;
		alias = undefined;
	}
	var actualName = (typeof alias === 'undefined' ? fileName : alias);
	// make possible to override alias with another one
	if (!(actualName in this.aliases) || this.aliases[actualName] != fileName) {
		var tpl;
		if (!(fileName in this.cache))
			tpl = this.load(fileName, absPath);
		else
			tpl = this.cache[fileName];
		return this.register(tpl, alias);
	} else {
		return this.cache[this.aliases[actualName]];
	}
};

TemplateFactory.prototype.ensure = function(fileName, alias, absPath) {
	if (typeof alias === 'boolean') {
		absPath = alias;
		alias = undefined;
	}
	var actualName = (typeof alias === 'undefined' ? fileName : alias);
	// make possible to override alias with another one
	if (!(actualName in this.aliases)) {
		var tpl;
		if (!(fileName in this.cache)) {
			tpl = this.load(fileName, absPath);
			debugger
			this.makeRequireList(tpl.requires, false);
			return this.register(tpl, actualName);
		}
	}
	return this.cache[this.aliases[actualName]];
};

// загружать скомпилированные модули или нескомпилированые шаблоны.
TemplateFactory.prototype.load = function(fileName, absPath) {
	var fn = absPath ? path.resolve(fileName) : path.join(this.root, fileName);
	if (fs.existsSync(fn + '.js')) {
		var storedScript = fs.readFileSync(fn + '.js');
		var result = vm.runInThisContext(storedScript, this.name);
		result.name = fn;
		return new Template(result);
	} else if (fs.existsSync(fn)) {
		var content = fs.readFileSync(fn);
		var tpl = new Template({
			source: content.toString(),
			name: fileName
		});
		var hasException = true;
		try {
			tpl.compile();
			hasException = false;
		} finally {
			if (!hasException)
				return tpl;
		}
	} else {
		throw new Error('tempalte ' + fileName + ' not found (absPath=)' + absPath);
	}
};

TemplateFactory.prototype.requireAs = function() {
	var self = this;
	return function(fileName, alias, absPath) {
		return self.ensure(fileName, alias, absPath);
	};
};

TemplateFactory.prototype.partial = function() {
	var self = this;
	return function(obj, name, absPath) {
		return self.run(obj, name, absPath);
	};
};

function makeBlock(src, dst, override) {
	if (!src) return;
	var blck;
	var blockList = Object.keys(src);
	for (var i = 0, blLen = blockList.length; i < blLen; i++) {
		blck = blockList[i];
		if (override || !(!override && dst[blck]))
			dst[blck] = src[blck];
	}
}

TemplateFactory.prototype.makeRequireList = function(src, override) {
	if (!src) return;
	var reqList = Object.keys(src);
	var req;
	for (var i = 0, blLen = reqList.length; i < blLen; i++) {
		req = src[reqList[i]];
		if (override)
			this.enforce(reqList[i], req.alias, req.absPath);
		else
			this.ensure(reqList[i], req.alias, req.absPath);
	}
};


TemplateFactory.prototype.blockContent = function(tpl) {
	var self = this;
	var blocks = {};
	makeBlock(tpl.blocks, blocks, true);
	this.makeRequireList(tpl.requires, true);
	var scripts = [];
	return {
		content: function(name, context, content, partial) {
			if (name) {
				return blocks[name](context, content, partial);
			} else {
				var fn = scripts.pop();
				if (typeof fn === 'function')
					return fn(context, content, partial);
				else return '';
			}
		},
		run: function(context, content, partial) {
			function go(context, content, partial) {
				if (this.parent) {
					var parent = self.ensure(this.parent);
					makeBlock(parent.blocks, blocks, false);
					scripts.push(this.script);
					return go.call(parent, context, content, partial);
				} else {

					return this.script(context, content, partial);
				}
			}
			return go.call(tpl, context, content, partial);
		}
	};
};

TemplateFactory.prototype.run = function(context, name, absPath) {
	var templ = this.ensure(name, absPath);
	var bc = this.blockContent(templ);
	return bc.run(context, bc.content, this.partial());
};

exports.Factory = TemplateFactory;
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var gte2 = require('./fte.pegjs.js');

function Template(config) {
	if (!(this instanceof Template)) throw new Error('constructor is not a function');
	this.srcCode = config.source ? config.source.toString() : undefined;
	this.name = config.name;
	this.absPath = config.absPath;
	this.script = config.script;
	this.blocks = config.blocks;
	this.parent = config.parent ? config.parent.trim() : undefined;
	this.aliases = config.aliases || {};
	this.factory = config.factory;
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
			var req, fList = [],
				rTempl;
			var reqList = result.requireList;
			for (var i = 0, len = reqList.length; i < len; i++) {
				req = reqList[i].split(',');
				fList.length = 0;
				var item;
				for (var j = 0, rLen = req.length; j < rLen; j++) {
					item = req[j];
					if (item) fList.push(item);
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
			fn = makeFunction(result.main);
			if ('function' == typeof fn) {
				this.script = fn;
			} else {
				// console.log('Error while compile main template ');
				throw fn.err;
			}
		}
	}
	return this;
};

function merge(a, b, property) {
	var prop;
	var aProp = a[property];
	if (aProp) {
		var bProp = b[property];
		if (!bProp) bProp = b[property] = {};
		var propList = Object.keys(aProp);
		for (var i = 0, pLen = propList.length; i < pLen; i++) {
			prop = propList[i];
			if (!(prop in bProp))
				bProp[prop] = aProp[prop];
		}
	}
}

Template.prototype.mergeParent = function(src) {
	if (!src) return;
	merge(src, this, "blocks");
	merge(src, this, "aliases");
};

Template.prototype.parent = false;
Template.prototype.blocks = false;
Template.prototype.aliases = undefined;
Template.prototype.absPath = false;
Template.prototype.name = false;
Template.prototype.srcCode = false;
Template.prototype.script = false;

function TemplateFactory(config) {
	if (!(this instanceof TemplateFactory)) throw new Error('constructor is not a function');
	this.root = config.root ? (Array.isArray(config.root) ? config.root : [config.root]) : [process.cwd()];
	this.cache = {};
}

TemplateFactory.prototype.cache = undefined;

TemplateFactory.prototype.register = function(tpl) {
	if (!(tpl.name in this.cache)) {
		this.cache[tpl.name] = tpl;
	}
	return tpl;
};

TemplateFactory.prototype.ensure = function(fileName, absPath) {
	if (!(fileName in this.cache)) {
		var tpl = this.load(fileName, absPath);
		return this.register(tpl, fileName);
	}
	return this.cache[fileName];
};



TemplateFactory.prototype.load = function(fileName, absPath) {
	var root;
	for (var i = 0, len = this.root.length; i < len; i++) {
		root = this.root[i];
		var fn = absPath ? path.resolve(fileName) : path.join(root, fileName);
		if (fs.existsSync(fn + '.js')) {
			var storedScript = fs.readFileSync(fn + '.js');
			var result = vm.runInThisContext(storedScript, fn);
			result.absPath = fn;
			result.name = fileName;
			result.factory = this;
			return new Template(result);
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
					return tpl;
			}
		}
	}
	throw new Error('template ' + fileName + ' not found (absPath= ' + absPath + ')');
};

TemplateFactory.prototype.blockContent = function(tpl) {
	var self = this;
	var scripts = [];
	return {
		partial: function(obj, name, absPath) {
			var fn = absPath ? name : tpl.aliases[name];
			return self.run(obj, fn ? fn : name, true);
		},
		content: function(name, context, content, partial) {
			if (name) {
				return tpl.blocks[name](context, content, partial);
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
					tpl.mergeParent(parent);
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
	return bc.run(context, bc.content, bc.partial);
};

exports.Factory = TemplateFactory;
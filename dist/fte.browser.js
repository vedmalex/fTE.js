(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fte = require("./index.browser.js");
module.exports = fte;
},{"./index.browser.js":2}],2:[function(require,module,exports){
var c2 = require('./lib/fte.browser.js');

exports.Factory = c2.Factory;
exports.Template = c2.Template;
},{"./lib/fte.browser.js":3}],3:[function(require,module,exports){
var Template = require("./template.js");
var TemplateFactory = require("./templateFactory.js");

//тут надо придумать как сделать так чтобы он загружал файлы правильно!!! для браузера с использованием
//require
// для браузера весь под должен быть только js.... 
// в первой версии... по крайней мере.
TemplateFactory.prototype.load = function(fileName, absPath) {
	var result = require(fileName);
	result.absPath = fileName;
	result.name = fileName;
	result.factory = this;
	return this.register(new Template(result), fileName);
};

// создает шаблон из текста
TemplateFactory.prototype.create = function(source, name) {
	throw new Error("TemplateFactory.create is unsupported yet");
};

Template.prototype.compile = function() {
	throw new Error("Template.compile is unsupported yet");
};

exports.Template = Template;
exports.Factory = TemplateFactory;
},{"./template.js":4,"./templateFactory.js":5}],4:[function(require,module,exports){
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

module.exports = Template;
},{}],5:[function(require,module,exports){
(function (process){
function TemplateFactory(config) {
	if (!(this instanceof TemplateFactory)) throw new Error('constructor is not a function');
	if (!process.browser) {
		// this only need in serverside code with server load code
		this.root = config ? (config.root ? (Array.isArray(config.root) ? config.root : [config.root]) : [process.cwd()]) : [process.cwd()];
	}
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
		return this.load(fileName, absPath);
	}
	return this.cache[fileName];
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
					// tpl.mergeParent(parent); moved to compile.
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

module.exports = TemplateFactory;
}).call(this,require('_process'))
},{"_process":6}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);

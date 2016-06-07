function TemplateFactory(config) {
	if (!(this instanceof TemplateFactory)) throw new Error('constructor is not a function');
	if (!process.browser) {
		// this only need in serverside code with server load code
		this.root = config ? (config.root ? (Array.isArray(config.root) ? config.root : [config.root]) : [process.cwd()]) : [process.cwd()];
		this.debug = (config && config.debug) || false;
		this.watch = (config && config.watch);
		this.watchTree = {};
	}
	this.cache = {};
}

TemplateFactory.prototype.cache = undefined;
TemplateFactory.prototype.debug = false;
TemplateFactory.prototype.watch = false;
// подумать нужно ли делать один общий для все список watchTree
TemplateFactory.prototype.watchTree = undefined;

TemplateFactory.prototype.register = function(tpl) {
	if (!(tpl.name in this.cache)) {
		this.cache[tpl.name] = tpl;
		this.cache[tpl.absPath] = tpl;
	}
	return tpl;
};

// TemplateFactory.prototype.checkChanges = function(fileName){

// };

TemplateFactory.prototype.ensure = function(fileName, absPath) {
	if (!(fileName in this.cache)) {
		var template = this.load(fileName, absPath);
		if (this.watch) {
			this.checkChanges(template, fileName, absPath);
			var depList = Object.keys(template.dependency);
			for (var i = 0, len = depList.length; i < len; i++) {
				this.watchTree[this.cache[depList[i]].absPath].list.push(template.absPath);
			}
		}
		return template;
	}
	return this.cache[fileName];
};

TemplateFactory.prototype.blockContent = function(tpl) {
	var self = this;
	var scripts = [];
	return {
		partial: function(obj, name) {
			if (tpl.aliases.hasOwnProperty(name)) {
				return self.run(obj, tpl.aliases[name], true);
			} else {
				return self.run(obj, name);
			}
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

module.exports = TemplateFactory;
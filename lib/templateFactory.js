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
			return self.run(obj, fn ? fn : name, absPath);
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
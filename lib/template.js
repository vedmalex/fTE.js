function Template(config) {
	if (!(this instanceof Template)) throw new Error('constructor is not a function');
	this.srcCode = config.source ? config.source.toString() : undefined;
	this.name = config.name;
	this.absPath = config.absPath;
	this.script = config.script;
	this.blocks = config.blocks;
	this.dependency = config.dependency;
	this.parent = config.parent ? config.parent.trim() : undefined;
	this.aliases = config.aliases || {};
	this.factory = config.factory;
	if(config.compile){
		this.compile = config.compile;
	}
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
Template.prototype.dependency = undefined;
Template.prototype.absPath = false;
Template.prototype.name = false;
Template.prototype.srcCode = false;
Template.prototype.script = false;

module.exports = Template;
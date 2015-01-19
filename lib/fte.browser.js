var Template = require("./template.js");
var TemplateFactory = require("./templateFactory.js");

//тут надо придумать как сделать так чтобы он загружал файлы правильно!!! для браузера с использованием
//require
// для браузера весь под должен быть только js.... 
// в первой версии... по крайней мере.
TemplateFactory.prototype.load = function(result, fileName) {
	result.absPath = fileName;
	result.name = fileName;
	result.factory = this;
	var templ = new Template(result);
	this.register(templ, fileName);
	templ.compile();
	return templ;
};

// создает шаблон из текста
TemplateFactory.prototype.create = function(source, name) {
	throw new Error("TemplateFactory.create is unsupported yet");
};

Template.prototype.compile = function() {
	if (this.parent) {
		this.mergeParent(this.factory.ensure(this.parent));
	}
};

var Context = require("./context.js").Context;

TemplateFactory.prototype.run = function(ctx, name, absPath) {
	var context = (ctx instanceof Context) ? ctx : new Context(ctx);
	var templ = this.ensure(name, absPath);
	var bc = this.blockContent(templ);
	return bc.run(context, bc.content, bc.partial);
};

exports.Template = Template;
exports.Factory = TemplateFactory;
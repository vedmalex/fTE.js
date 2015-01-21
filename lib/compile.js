var raw = require('./raw.pegjs.js');
var fs = require('fs');
var path = require('path');
var acorn = require('acorn');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

var Gte = require('./fTE.js');
var F = new Gte.Factory({
	root: path.join(__dirname, '..', 'templates')
});

function compileLight(content) {
	var compiled = raw.parse(content.toString());
	return F.run(compiled, 'raw.njs');
}

// var remove = ["concatenate-variable-definition"];
// var add = ["remove-empty-statement"];

exports.compileLight = compileLight;

function prepareCode(src) {
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
			debugger;
			var optimized = esmangle.optimize(ast, [[esmangle.pass.Registry.pass['remove-empty-statement']]]);
			var output = escodegen.generate(optimized);
			return output;
		} else {
			throw hasError;
		}
	}
}

function compileFull(content) {
	var compiled = raw.parse(content.toString());
	return {
		ast: compiled,
		text: prepareCode(F.run(compiled, 'compiled.njs'))
	};
}

exports.compileFull = compileFull;
var raw = require('./raw.pegjs.js');
var fs = require('fs');
var path = require('path');
var acorn = require('acorn');
var esmangle = require('esmangle');
var escodegen = require('escodegen');
var esvalid = require('esvalid');

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
		hasError = err;
	} finally {
		if (!hasError) {
			if (esvalid.isValid(ast)) {
				var optimized = esmangle.optimize(ast, [
					[esmangle.pass.Registry.pass['remove-empty-statement']]
				]);
				var output = escodegen.generate(optimized);
				return output;
			} else {
				var error = esvalid.errors(ast);
				console.log(esvalid.errors(ast));
				return error;
			}
		} else {
			return hasError;
		}
	}
}

function validate(content) {
	var src = F.run(raw.parse(content.toString()), 'compiled.njs');
	var hasError = false;
	var ast;
	try {
		ast = acorn.parse(src);
	} catch (err) {
		hasError = err;
	} finally {
		if (!hasError) {
			return true;
		} else {
			return hasError;
		}
	}
}

exports.validate = validate;

function compileFull(content) {
	var compiled = raw.parse(content.toString());
	return  prepareCode(F.run(compiled, 'compiled.njs'));
}

exports.compileFull = compileFull;
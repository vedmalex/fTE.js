var raw = require('./raw.pegjs.js');
var fs = require('fs-extra');
var path = require('path');
var esprima = require('esprima');
var esmangle = require('esmangle');
var escodegen = require('escodegen');

var Gte = require('./fTE.js');
var F = new Gte.Factory({
	root: path.join(__dirname, '..', 'templates')
});

function prepareCode(src, optimize) {
	var hasError = false;
	var ast;
	try {
		ast = esprima.parse(src ,{
        sourceType:"module",
        ecmaVersion: 6,
        comment:true,
      });
	} catch (err) {
		hasError = F.run({
			error:err,
			compiledFile: src,
		}, 'compilationError.njs');
	} finally {
		if (!hasError) {
			if(optimize){
				var optimized = esmangle.optimize(ast, [
					[esmangle.pass.Registry.pass['remove-empty-statement']
					,esmangle.pass.Registry.pass['remove-unreachable-branch']]
				]);
				var output = escodegen.generate(optimized, {
				    format: {
				    	indent: {
				    		style:'  ',
				    		base : 0,
				    	},
			        renumber: true,
			        hexadecimal: true,
			        escapeless: true,
			        compact: false,
			        semicolons: false,
			        parentheses: false
				    }
				  }
				);
				return output;
			} else {
				return src;
			}
		} else {
			return hasError;
		}
	}
}


function compileLight(content, optimize) {
	var compiled = raw.parse(content.toString());
	return prepareCode(F.run(compiled, 'raw.njs'), optimize);
}

// var remove = ["concatenate-variable-definition"];
// var add = ["remove-empty-statement"];

exports.compileLight = compileLight;

function validate(content) {
	var src = F.run(raw.parse(content.toString()), 'compiled.njs');
	var hasError = false;
	var ast;
	try {
		ast = esprima.parse(src,{
        sourceType:"module",
        ecmaVersion: 6,
        comment:true,
      });
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

function compileFull(content, optimize) {
	var compiled = raw.parse(content.toString());
	return prepareCode(F.run(compiled, 'compiled.njs'), optimize);
}

exports.compileFull = compileFull;
module.exports = {
  script: function (renderOptions, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = renderOptions;
      return _content(blockName, ctx, content, partial)
    }
    var out = '';
    var escapeExp = /[&<>"]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g;
    function escapeIt(text) {
      if (text == null) {
        return ''
      }
      var result = text.toString();
      if (!escapeExp.test(result)) {
        return result
      }
      return result.replace(escapeAmpExp, '&amp;').replace(escapeLtExp, '&lt;').replace(escapeGtExp, '&gt;').replace(escapeQuotExp, '&quot;')
    }
    var blockList = renderOptions.blocks;
    var noIndent = renderOptions.noIndent;
    var needToIndent = false;
    if (!noIndent) {
      for (var i = 0, len = blockList.length; i < len; i++) {
        if (blockList[i].indent) {
          needToIndent = true;
          break
        }
      }
    } else {
      needToIndent = !noIndent
    }
    out += 'var escapeExp = /[&<>"]/,\n    escapeAmpExp = /&/g,\n    escapeLtExp = /</g,\n    escapeGtExp = />/g,\n    escapeQuotExp = /"/g;\n\nfunction escapeIt (text) {\n  if (text == null) {\n    return \'\';\n  }\n\n  var result = text.toString();\n  if (!escapeExp.test(result)) {\n    return result;\n  }\n\n  return result.replace(escapeAmpExp, \'&amp;\')\n  .replace(escapeLtExp, \'&lt;\')\n  .replace(escapeGtExp, \'&gt;\')\n  .replace(escapeQuotExp, \'&quot;\');\n};\n';
    if (needToIndent) {
      out += 'function applyIndent(_str, _indent) {\n  var str = String(_str);\n  var indent = \'\';\n  if (typeof _indent == \'number\' && _indent > 0) {\n    var res = \'\';\n    for (var i = 0; i < _indent; i++) {\n      res += \' \';\n    }\n    indent = res;\n  }\n  if (typeof _indent == \'string\' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split(\'\\n\').map(function (s) {\n        return indent + s;\n    }).join(\'\\n\');\n  } else {\n    return str;\n  }\n}\n'
    }
    function applyIndent(_str, _indent) {
      var str = String(_str);
      var indent = '';
      if (typeof _indent == 'number' && _indent > 0) {
        var res = '';
        for (var i = 0; i < _indent; i++) {
          res += ' '
        }
        indent = res
      }
      if (typeof _indent == 'string' && _indent.length > 0) {
        indent = _indent
      }
      if (indent && str) {
        return str.split('\n').map(function (s) {
          return indent + s
        }).join('\n')
      } else {
        return str
      }
    }
    for (var i = 0, len = blockList.length; i < len; i++) {
      var block = blockList[i];
      var content = block.content;
      var blockIndent = block.indent && !noIndent;
      var indent = '';
      if (block.indent) {
        indent = JSON.stringify(block.indent)
      }
      out += '\n/*';
      out += block.line;
      out += ':';
      out += block.column;
      out += '*/\n';
      switch (block.type) {
      case 'text':
        out += ' out +=';
        if (block.indent && !noIndent) {
          out += JSON.stringify(applyIndent(content, block.indent));
          out += ';'
        } else if (indent) {
          out += indent;
          out += ' +';
          out += ' ' + JSON.stringify(content);
          out += ';'
        } else {
          out += JSON.stringify(content);
          out += ';'
        }
        break;
      case 'uexpression':
        out += ' out +=';
        if (indent && !noIndent) {
          out += 'applyIndent(escapeIt(';
          out += content;
          out += '),';
          out += ' ' + indent;
          out += ');'
        } else if (indent) {
          out += indent;
          out += ' + escapeIt(';
          out += content;
          out += ');'
        } else {
          out += 'escapeIt(';
          out += content;
          out += ');'
        }
        break;
      case 'expression':
        out += ' out +=';
        if (indent && !noIndent) {
          out += 'applyIndent(';
          out += content;
          out += ',';
          out += ' ' + indent;
          out += ');'
        } else if (indent) {
          out += indent;
          out += ' +';
          out += ' ' + content;
          out += ';'
        } else {
          out += content;
          out += ';\n'
        }
        break;
      case 'codeblock':
        out += ' ';
        if (blockIndent) {
          out += applyIndent(content, block.indent)
        } else if (block.indent) {
          out += block.indent;
          out += content
        } else {
          out += content
        }
        break
      }
    }
    return out
  },
  compile: function () {
  },
  dependency: {}
}
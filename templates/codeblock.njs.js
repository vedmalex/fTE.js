module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        function applyIndent(str, _indent) {
            var indent = '';
            if (typeof _indent == 'number' && _indent > 0) {
                var res = '';
                for (var i = 0; i < _indent; i++) {
                    res += ' ';
                }
                indent = res;
            }
            if (typeof _indent == 'string' && _indent.length > 0) {
                indent = _indent;
            }
            if (indent && str) {
                return str.split('\n').map(function (s) {
                    return indent + s;
                }).join('\n');
            } else {
                return str;
            }
        }
        out += 'function applyIndent(str, _indent) {\n  var indent = \'\';\n  if (typeof _indent == \'number\' && _indent > 0) {\n    var res = \'\';\n    for (var i = 0; i < _indent; i++) {\n      res += \' \';\n    }\n    indent = res;\n  }\n  if (typeof _indent == \'string\' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split(\'\\n\').map(function (s) {\n        return indent + s;\n    }).join(\'\\n\');\n  } else {\n    return str;\n  }\n}\n';
        var block;
        function applyIndent(str, _indent) {
            var indent = '';
            if (typeof _indent == 'number' && _indent > 0) {
                var res = '';
                for (var i = 0; i < _indent; i++) {
                    res += ' ';
                }
                indent = res;
            }
            if (typeof _indent == 'string' && _indent.length > 0) {
                indent = _indent;
            }
            if (indent && str) {
                return str.split('\n').map(function (s) {
                    return indent + s;
                }).join('\n');
            } else {
                return str;
            }
        }
        for (var i = 0, len = context.length; i < len; i++) {
            block = context[i];
            var content = block.content;
            var indent = '';
            if (block.indent) {
                content = applyIndent(content, block.indent);
                indent = JSON.stringify(block.indent);
            }
            out += '/*';
            out += block.line;
            out += ':';
            out += block.column;
            out += '*/ \n';
            switch (block.type) {
            case 'text':
                out += ' out +=';
                if (indent) {
                    out += ' applyIndent(';
                    out += JSON.stringify(content);
                    out += ',';
                    out += applyIndent(indent, ' ');
                    out += '); \n';
                } else {
                    out += applyIndent(JSON.stringify(content), ' ');
                    out += '; \n';
                }
                break;
            case 'uexpression':
                out += ' out +=';
                if (indent) {
                    out += ' applyIndent(escape(';
                    out += content;
                    out += '),';
                    out += applyIndent(indent, ' ');
                    out += ');\n';
                } else {
                    out += ' escape(';
                    out += content;
                    out += ')\n';
                }
                break;
            case 'expression':
                out += ' out +=';
                if (indent) {
                    out += ' applyIndent(';
                    out += content;
                    out += ',';
                    out += applyIndent(indent, ' ');
                    out += ');\n';
                } else {
                    out += applyIndent(content, ' ');
                    out += '\n';
                }
                break;
            case 'codeblock':
                out += applyIndent(content, ' ');
                break;
            }
        }
        return out;
    },
    compile: function () {
    }
};
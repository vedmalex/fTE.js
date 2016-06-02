module.exports = {
    script: function (renderOptions, _content, partial) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = renderOptions;
            return _content(blockName, ctx, content, partial);
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
        out += '\n';
        var blockList = renderOptions.blocks;
        var noIndent = renderOptions.noIndent;
        var needToIndent = false;
        if (!noIndent) {
            for (var i = 0, len = blockList.length; i < len; i++) {
                if (blockList[i].indent) {
                    needToIndent = true;
                    break;
                }
            }
        } else {
            needToIndent = noIndent;
        }
        if (needToIndent) {
            out += 'function applyIndent(str, _indent) {\n  var indent = \'\';\n  if (typeof _indent == \'number\' && _indent > 0) {\n    var res = \'\';\n    for (var i = 0; i < _indent; i++) {\n      res += \' \';\n    }\n    indent = res;\n  }\n  if (typeof _indent == \'string\' && _indent.length > 0) {\n    indent = _indent;\n  }\n  if (indent && str) {\n    return str.split(\'\\n\').map(function (s) {\n        return indent + s;\n    }).join(\'\\n\');\n  } else {\n    return str;\n  }\n}\n';
        }
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
        for (var i = 0, len = blockList.length; i < len; i++) {
            var block = blockList[i];
            var content = block.content;
            var blockIndent = block.indent && !noIndent;
            var indent = '';
            if (block.indent && !noIndent) {
                indent = JSON.stringify(block.indent);
            }
            out += '\n/*';
            out += block.line;
            out += ':';
            out += block.column;
            out += '*/\n';
            switch (block.type) {
            case 'text':
                out += ' out +=';
                if (blockIndent) {
                    out += JSON.stringify(applyIndent(content, block.indent));
                    out += ';';
                } else {
                    out += JSON.stringify(content);
                    out += ';';
                }
                break;
            case 'uexpression':
                out += ' out +=';
                if (indent) {
                    out += ' applyIndent(escape(';
                    out += content;
                    out += '),';
                    out += applyIndent(indent, ' ');
                    out += ');';
                } else {
                    out += ' escape(';
                    out += content;
                    out += ');';
                }
                break;
            case 'expression':
                out += ' out +=';
                if (indent) {
                    out += ' applyIndent(';
                    out += content;
                    out += ',';
                    out += applyIndent(indent, ' ');
                    out += ');';
                } else {
                    out += applyIndent(content, ' ');
                    out += ';\n';
                }
                break;
            case 'codeblock':
                if (blockIndent) {
                    out += applyIndent(content, block.indent);
                } else {
                    out += content;
                }
                break;
            }
        }
        return out;
    },
    compile: function () {
    }
};
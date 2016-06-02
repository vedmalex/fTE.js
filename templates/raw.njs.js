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
        out += '(function(){\n  return';
        out += applyIndent(partial(context, 'core'), ' ');
        out += ';\n})();';
        return out;
    },
    compile: function () {
        this.aliases = {};
        this.aliases['core'] = 'MainTemplate.njs';
        this.factory.ensure('MainTemplate.njs', false);
    }
};
module.exports = {
    script: function (context, _content, partial) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = context;
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
        function processRequire(item) {
            var requires = item.name.split(',').map(function (i) {
                return i.trim();
            });
            return {
                name: requires[0],
                alias: requires[1],
                absPath: Boolean(requires[2])
            };
        }
        function processContextName(item) {
            return item.name.split(',')[0].trim();
        }
        var reqList = [];
        var contextName = 'context';
        var item, directives = context.directives, extend = '';
        for (var i = 0, len = directives.length; i < len; i++) {
            item = directives[i];
            if (item.content === 'extend') {
                extend = item.name.trim();
            }
            if (item.content === 'requireAs') {
                reqList.push(processRequire(item));
            }
            if (item.content === 'context') {
                contextName = processContextName(item);
            }
        }
        out += '{\n  script: function (';
        out += contextName;
        out += ', _content, partial){\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx =';
        out += applyIndent(contextName, ' ');
        out += ';\n      return _content(blockName, ctx, content, partial);\n    }\n    var out = \'\';\n';
        out += applyIndent(partial(context.main, 'codeblock'), '    ');
        out += '\n    return out;\n  },\n';
        var cb = context.block;
        if (cb) {
            out += '  blocks : {\n';
            for (var cbn in cb) {
                var blockConetxtName = contextName;
                var bdirvs = cb[cbn].directives;
                var item = bdirvs[i];
                for (var i = 0, len = bdirvs.length; i < len; i++) {
                    item = bdirvs[i];
                    if (item.content === 'context') {
                        blockConetxtName = processContextName(item);
                    }
                }
                out += '    "';
                out += cbn;
                out += '": function(';
                out += blockConetxtName;
                out += ',  _content, partial){\n      var out = \'\';\n';
                out += applyIndent(partial(cb[cbn].main, 'codeblock'), '      ');
                out += '\n      return out;\n    },\n';
            }
            out += '  },';
        }
        out += '  compile: function() {';
        if (reqList.length > 0) {
            out += '  this.aliases={};\n';
            var rq;
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                out += '  this.aliases["';
                out += rq.alias;
                out += '"] = "';
                out += rq.name;
                out += '";\n  this.factory.ensure("';
                out += rq.name;
                out += '",';
                out += applyIndent(rq.absPath, ' ');
                out += ');\n';
            }
        }
        if (extend) {
            out += '  this.parent =';
            out += applyIndent(JSON.stringify(extend), ' ');
            out += ';\n';
        }
        if (extend) {
            out += '  this.mergeParent(this.factory.ensure(this.parent))\n';
        }
        out += '  },\n}\n';
        return out;
    },
    compile: function () {
        this.aliases = {};
        this.aliases['codeblock'] = 'codeblock.njs';
        this.factory.ensure('codeblock.njs', false);
    }
};
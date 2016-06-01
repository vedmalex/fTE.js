module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += '\tvar tpl = {};\n';
        var cb = context.block;
        if (cb) {
            out += '\t  tpl.blocks = {};\n';
            for (var cbn in cb) {
                out += '\ttpl.blocks["';
                out += cbn;
                out += '"] = function(context,  _content, partial){\n\t\tvar out = \'\';\n';
                out += '\t\t';
                out += partial(cb[cbn].main, 'codeblock');
                out += '\n\t\treturn out;\n\t};\n';
            }
        }
        out += '\n\ttpl.script = function (context, _content, partial){\n\t\tfunction content(blockName) {\n\t\t\treturn _content(blockName, context, content, partial);\n\t\t}\n\t\tvar out = \'\';\n';
        out += '\t\t';
        out += partial(context.main, 'codeblock');
        out += '\n\t\treturn out;\n\t};\n\ntpl.compile = function() {\n';
        var reqList = [];
        var item, directives = context.directives, extend = '';
        for (var i = 0, len = directives.length; i < len; i++) {
            item = directives[i];
            if (item.content === 'extend') {
                extend = item.name.trim();
            }
            if (item.content === 'requireAs') {
                var requires = item.name.split(',');
                reqList.push({
                    name: requires[0],
                    alias: requires[1],
                    absPath: Boolean(requires[2])
                });
            }
        }
        if (reqList.length > 0) {
            out += '\t\n\tthis.aliases={};\n';
            out += '\t';
            var rq;
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                out += ' \n\tthis.aliases["';
                out += rq.alias;
                out += '"] = "';
                out += rq.name;
                out += '";\n\tthis.factory.ensure("';
                out += rq.name;
                out += '",';
                out += ' ';
                out += rq.absPath;
                out += ');\n';
            }
        }
        out += '\n\n';
        out += '\t';
        if (extend) {
            out += 'this.parent =';
            out += ' ';
            out += JSON.stringify(extend);
            out += ';';
        }
        out += '\n';
        out += '    ';
        if (extend) {
            out += 'this.mergeParent(this.factory.ensure(this.parent))';
        }
        out += '\n};\n\nexport default {\n\n};';
        return out;
    },
    compile: function () {
        this.aliases = {};
        this.aliases['codeblock'] = 'codeblock.njs';
        this.factory.ensure('codeblock.njs', false);
    }
};
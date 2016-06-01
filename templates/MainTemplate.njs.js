module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += '{\n\tscript: function (context, _content, partial){\n\t\tfunction content(blockName) {\n\t\t\treturn _content(blockName, context, content, partial);\n\t\t}\n\t\tvar out = \'\';\n';
        out += '\t\t';
        out += partial(context.main, 'codeblock');
        out += '\n\t\treturn out;\n\t},\n\n';
        var cb = context.block;
        if (cb) {
            out += '\tblocks : {\n';
            for (var cbn in cb) {
                out += '\t\t"';
                out += cbn;
                out += '": function(context,  _content, partial){\n\t\t\tvar out = \'\';\n';
                out += '\t\t\t';
                out += partial(cb[cbn].main, 'codeblock');
                out += '\n\t\t\treturn out;\n\t\t},\n';
            }
            out += '\t},\n';
        }
        out += '\n\tcompile: function() {\n';
        var reqList = [];
        var item, directives = context.directives, extend = '';
        for (var i = 0, len = directives.length; i < len; i++) {
            item = directives[i];
            if (item.content === 'extend') {
                extend = item.name.trim();
            }
            if (item.content === 'requireAs') {
                var requires = item.name.split(',').map(function (i) {
                    return i.trim();
                });
                reqList.push({
                    name: requires[0],
                    alias: requires[1],
                    absPath: Boolean(requires[2])
                });
            }
        }
        if (reqList.length > 0) {
            out += '\tthis.aliases={};\n';
            var rq;
            for (var i = 0, len = reqList.length; i < len; i++) {
                rq = reqList[i];
                out += '\tthis.aliases["';
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
        if (extend) {
            out += '  this.parent =';
            out += ' ';
            out += JSON.stringify(extend);
            out += ';\n';
        }
        if (extend) {
            out += '  this.mergeParent(this.factory.ensure(this.parent))\n';
        }
        out += '\t},\n}\n';
        return out;
    },
    compile: function () {
        this.aliases = {};
        this.aliases['codeblock'] = 'codeblock.njs';
        this.factory.ensure('codeblock.njs', false);
    }
};
module.exports = {
    script: function (context, _content, partial) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null)
                ctx = context;
            return _content(blockName, ctx, content, partial);
        }
        var out = '';
        var escapeExp = /[&<>"'`]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g, escapeSingleQuteExp = /'/g, escapeApostropheExp = /`/g, escapeQuotExp = /"/g;
        function escapeIt(text) {
            if (text == null) {
                return '';
            }
            var result = text.toString();
            if (!escapeExp.test(result)) {
                return result;
            }
            return result.replace(escapeAmpExp, '&#38;').replace(escapeLtExp, '&#60;').replace(escapeGtExp, '&#62;').replace(escapeQuotExp, '&#34;').replace(escapeSingleQuteExp, '&#39;').replace(escapeApostropheExp, '&#96;');
        }
        out += context.error.message;
        out += ';\n';
        out += context.compiledFile;
        out += ';';
        return out;
    },
    compile: function () {
    }
};
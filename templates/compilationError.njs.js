module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += context.error.message;
        out += ';\n';
        out += context.compiledFile;
        out += ';';
        return out;
    },
    compile: function () {
    }
};
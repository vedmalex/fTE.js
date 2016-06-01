module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += 'hello';
        out += ' ';
        out += context;
        out += '!';
        return out;
    },
    compile: function () {
    }
};
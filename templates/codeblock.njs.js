module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        var block;
        for (var i = 0, len = context.length; i < len; i++) {
            block = context[i];
            var indent;
            if (block.indent) {
                indent = JSON.stringify(block.indent);
                out += ' out +=';
                out += ' ';
                out += indent;
                out += ';\n';
            }
            out += '/*';
            out += block.line;
            out += ':';
            out += block.column;
            out += '*/ \n';
            switch (block.type) {
            case 'text':
                out += ' out +=';
                out += JSON.stringify(block.content);
                out += ';';
                break;
            case 'escaped expression':
                out += ' out += escape(';
                out += block.content;
                out += ');';
                break;
            case 'expression':
                out += ' out +=';
                out += block.content;
                out += ';';
                break;
            case 'codeblock':
                out += ' ';
                out += block.content;
                out += ';';
                break;
            }
            out += '\n';
        }
        return out;
    },
    compile: function () {
    }
};
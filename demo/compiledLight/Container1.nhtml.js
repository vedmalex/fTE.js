(function () {
    var tpl = {};
    tpl.blocks = {};
    tpl.blocks['header'] = function (context, _content, partial) {
        var out = '';
        out += '\n<div>';
        out += context.header;
        out += '</div>\n';
        return out;
    };
    tpl.aliases = {};
    tpl.aliases['head'] = 'Container3.nhtml';
    tpl.script = function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += '\n';
        out += content();
        return out;
    };
    tpl.parent = 'Container.nhtml';
    return tpl;
}());
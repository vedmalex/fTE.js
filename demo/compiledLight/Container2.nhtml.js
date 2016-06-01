(function () {
    var tpl = {};
    tpl.script = function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += '<div> yet another header title <p>';
        out += context.header;
        out += '</p></div>\n';
        out += partial(context.greetings, 'head');
        out += '\n\nне работает... если partial определен в базовом шаблоне...!!!';
        return out;
    };
    tpl.parent = 'Container1.nhtml';
    return tpl;
}());
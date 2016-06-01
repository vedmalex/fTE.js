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
tpl.compile = function () {
    this.parent = 'Container1.nhtml';
    this.mergeParent(this.factory.ensure(this.parent));
};
module.exports = tpl;
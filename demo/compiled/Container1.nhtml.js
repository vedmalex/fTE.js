var tpl = {};
tpl.blocks = {};
tpl.blocks['header'] = function (context, _content, partial) {
    var out = '';
    out += '\n<div>';
    out += context.header;
    out += '</div>\n';
    return out;
};
tpl.script = function (context, _content, partial) {
    function content(blockName) {
        return _content(blockName, context, content, partial);
    }
    var out = '';
    out += '\n';
    out += content();
    return out;
};
tpl.compile = function () {
    this.aliases = {};
    this.aliases['head'] = 'Container3.nhtml';
    this.factory.ensure('Container3.nhtml', false);
    this.parent = 'Container.nhtml';
    this.mergeParent(this.factory.ensure(this.parent));
};
module.exports = tpl;
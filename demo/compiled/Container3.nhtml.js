var tpl = {};
tpl.script = function (context, _content, partial) {
    function content(blockName) {
        return _content(blockName, context, content, partial);
    }
    var out = '';
    out += 'hello ';
    out += context;
    out += '!';
    return out;
};
tpl.compile = function () {
};
module.exports = tpl;
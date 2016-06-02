module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += '\nexport default';
        out += ' ';
        out += partial(context, 'core');
        out += ';';
        return out;
    },
    compile: function () {
        this.aliases = {};
        this.aliases['core'] = 'MainTemplate.njs';
        this.factory.ensure('MainTemplate.njs', false);
    }
};
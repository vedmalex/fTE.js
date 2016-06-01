module.exports = {
    script: function (context, _content, partial) {
        function content(blockName) {
            return _content(blockName, context, content, partial);
        }
        var out = '';
        out += '<div class="panel-heading">\n\t<h3 class="panel-title">';
        out += context;
        out += '</h3> \n</div>';
        return out;
    },
    compile: function () {
    }
};
(function () {
    return {
        script: function (context, _content, partial) {
            function content(blockName) {
                return _content(blockName, context, content, partial);
            }
            var out = '';
            out += '<div>';
            out += content('header');
            out += '</div>\n<div>';
            out += content();
            out += '</div>';
            return out;
        },
        compile: function () {
        }
    };
}());
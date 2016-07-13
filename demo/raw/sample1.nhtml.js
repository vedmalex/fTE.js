module.exports = {
  script: function (context, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = context;
      return _content(blockName, ctx, content, partial)
    }
    var out = '';
    var escapeExp = /[&<>"]/, escapeAmpExp = /&/g, escapeLtExp = /</g, escapeGtExp = />/g, escapeQuotExp = /"/g;
    function escapeIt(text) {
      if (text == null) {
        return ''
      }
      var result = text.toString();
      if (!escapeExp.test(result)) {
        return result
      }
      return result.replace(escapeAmpExp, '&amp;').replace(escapeLtExp, '&lt;').replace(escapeGtExp, '&gt;').replace(escapeQuotExp, '&quot;')
    }
    if (!some) {
      out += 'else '
    }
    out += 'if(filters.hasOwnProperty(\'';
    out += allNonEmbedded[i].to;
    out += '\')){\n        filter = filters[\'';
    out += allNonEmbedded[i].to;
    out += '\'];\n';
    return out
  },
  compile: function () {
  },
  dependency: {}
}
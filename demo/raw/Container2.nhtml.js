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
    out += '<div>\n  <h3>yet another header title</h3>\n  <p>';
    out += escapeIt('<' + context.header);
    out += '</p>\n</div>\n';
    out += partial(context.greetings, 'head');
    out += '\n\n!!! работает... даже если partial определен в базовом шаблоне... !!!\n';
    return out
  },
  compile: function () {
    this.parent = 'Container1.nhtml';
    this.mergeParent(this.factory.ensure(this.parent))
  },
  dependency: { 'Container1.nhtml': 1 }
}
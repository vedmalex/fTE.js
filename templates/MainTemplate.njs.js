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
    function applyIndent(_str, _indent) {
      var str = String(_str);
      var indent = '';
      if (typeof _indent == 'number' && _indent > 0) {
        var res = '';
        for (var i = 0; i < _indent; i++) {
          res += ' '
        }
        indent = res
      }
      if (typeof _indent == 'string' && _indent.length > 0) {
        indent = _indent
      }
      if (indent && str) {
        return str.split('\n').map(function (s) {
          return indent + s
        }).join('\n')
      } else {
        return str
      }
    }
    function processRequire(item) {
      var requires = item.name.split(',').map(function (i) {
        return i.trim()
      });
      return {
        name: requires[0],
        alias: requires[1]
      }
    }
    function processContextName(item) {
      return item.name.split(',')[0].trim()
    }
    function processAsync(item) {
      return item.name.split(',')[0].trim()
    }
    function processnoIndent(item) {
      return !!item
    }
    var templateAlias = '';
    var reqList = [];
    var contextName = 'context';
    var noIndent = false;
    var alias = '';
    var asyncType = '';
    var item, directives = context.directives, extend = '';
    for (var i = 0, len = directives.length; i < len; i++) {
      item = directives[i];
      if (item.content === 'extend') {
        extend = item.name.trim()
      }
      if (item.content === 'requireAs') {
        reqList.push(processRequire(item))
      }
      if (item.content === 'context') {
        contextName = processContextName(item)
      }
      if (item.content === 'noIndent') {
        noIndent = processnoIndent(item)
      }
      if (item.content === 'alias') {
        alias = JSON.stringify(item.name.trim())
      }
      if (item.content === 'async') {
        asyncType = processAsync(item)
      }
    }
    out += '{ ';
    if (alias) {
      out += ' alias:';
      out += applyIndent(alias, ' ');
      out += ','
    }
    out += '  script: function (';
    out += contextName;
    out += ', _content, partial){\n    function content(blockName, ctx) {\n      if(ctx === undefined || ctx === null) ctx =';
    out += applyIndent(contextName, ' ');
    out += ';\n      return _content(blockName, ctx, content, partial);\n    }\n    var out = \'\';';
    var blocks = {
      blocks: context.main,
      noIndent: noIndent
    };
    out += applyIndent(partial(blocks, 'codeblock'), '    ');
    out += '\n    return out;\n  },\n';
    var cb = context.block;
    if (cb) {
      out += '  blocks : {\n';
      for (var cbn in cb) {
        var blockConetxtName = contextName;
        var bdirvs = cb[cbn].directives;
        var item = bdirvs[i];
        var blkNoIndent = false;
        var blAsyncType = '';
        for (var i = 0, len = bdirvs.length; i < len; i++) {
          item = bdirvs[i];
          if (item.content === 'context') {
            blockConetxtName = processContextName(item)
          }
          if (item.content === 'noIndent') {
            blkNoIndent = processnoIndent(item)
          }
          if (item.content === 'async') {
            blAsyncType = processAsync(item)
          }
        }
        out += '    "';
        out += cbn;
        out += '": function(';
        out += blockConetxtName;
        out += ',  _content, partial){\n      function content(blockName, ctx) {\n        if(ctx === undefined || ctx === null) ctx =';
        out += applyIndent(contextName, ' ');
        out += ';\n        return _content(blockName, ctx, content, partial);\n      }\n      var out = \'\';';
        var blocks = {
          blocks: cb[cbn].main,
          noIndent: blkNoIndent
        };
        out += applyIndent(partial(blocks, 'codeblock'), '      ');
        out += '\n      return out;\n    },\n'
      }
      out += '  },'
    }
    out += '  compile: function() {';
    if (alias) {
      out += '\n    this.alias =';
      out += applyIndent(alias, ' ');
      out += ';'
    }
    if (reqList.length > 0) {
      out += '    this.aliases={};\n';
      var rq;
      for (var i = 0, len = reqList.length; i < len; i++) {
        rq = reqList[i];
        out += '    this.aliases["';
        out += rq.alias;
        out += '"] = "';
        out += rq.name;
        out += '";\n    this.factory.ensure("';
        out += rq.name;
        out += '");\n'
      }
    }
    if (extend) {
      out += '\n    this.parent =';
      out += applyIndent(JSON.stringify(extend), ' ');
      out += ';\n    this.mergeParent(this.factory.ensure(this.parent))\n'
    }
    out += '  },\n  dependency: {\n  ';
    if (extend) {
      out += applyIndent(JSON.stringify(extend), '    ');
      out += ': 1,\n  '
    }
    if (reqList.length > 0) {
      for (var i = 0, len = reqList.length; i < len; i++) {
        rq = reqList[i];
        out += '    "';
        out += rq.name;
        out += '": 1,\n'
      }
    }
    out += '  }\n}\n';
    return out
  },
  compile: function () {
    this.aliases = {};
    this.aliases['codeblock'] = 'codeblock.njs';
    this.factory.ensure('codeblock.njs')
  },
  dependency: { 'codeblock.njs': 1 }
}
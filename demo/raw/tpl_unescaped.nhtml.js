module.exports = {
  script: function (data, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = data;
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
    function applyIndent(str, _indent) {
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
    out += '<html>\n	<head>\n		<title>';
    out += data.title;
    out += '</title>\n	</head>\n	<body>\n		<p>';
    out += data.text;
    out += '</p>\n';
    if (data.projects.length) {
      out += '\n';
      for (var i = 0; i < data.projects.length; i++) {
        out += '\n				<a href="';
        out += data.projects[i].url;
        out += '">';
        out += data.projects[i].name;
        out += '</a>\n				<p>';
        out += data.projects[i].description;
        out += '</p>\n'
      }
      out += '\n'
    } else {
      out += '\n			No projects\n'
    }
    out += '\n	</body>\n</html>';
    return out
  },
  compile: function () {
  },
  dependency: {}
}
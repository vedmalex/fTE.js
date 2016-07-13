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
    out += '<html>\n	<head>\n		<title>';
    out += escapeIt(data.title);
    out += '</title>\n	</head>\n	<body>\n		<p>';
    out += escapeIt(data.text);
    out += '</p>';
    if (data.projects.length) {
      out += '			';
      for (var i = 0; i < data.projects.length; i++) {
        out += '				<a href="';
        out += escapeIt(data.projects[i].url);
        out += '">';
        out += escapeIt(data.projects[i].name);
        out += '</a>\n				<p>';
        out += escapeIt(data.projects[i].description);
        out += '</p>'
      }
      out += '		'
    } else {
      out += '			No projects'
    }
    out += '	</body>\n</html>';
    return out
  },
  compile: function () {
  },
  dependency: {}
}
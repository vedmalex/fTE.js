(function() {
	var tpl = {};
	tpl.blocks = {};
	tpl.blocks["header"] = function(context, _content, partial) {
		var out = '';
		out += "<div>";
		out += context.header;
		out += "</div>";

		return out;
	};

	tpl.requires = {};
	tpl.requires["Container3.nhtml"] = {
		alias: " head",
		absPath: false
	};

	tpl.script = function(context, _content, partial) {
		function content(blockName) {
			return _content(blockName, context, content, partial);
		}
		var out = '';
		out += "\n";
		out += "\n";

		return out;
	};
	tpl.parent = "Container.nhtml";
	return tpl;
})();
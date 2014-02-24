(function(){
	var tpl = {};
	
	tpl.script = function (context, _content, partial){
		function content(blockName) {
			return _content(blockName, context, content, partial);
		}
		var out = '';
		out +="\n<div><p>";
out +=context.header;
out +="</p></div>\n";
out +=partial(context.greetings, 'head');

		return out;
	};
	tpl.parent = "Container1.nhtml";
	return tpl;
})();
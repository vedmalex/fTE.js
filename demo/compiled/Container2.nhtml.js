(function(){
	var tpl = {};

	tpl.script = function (context, _content, partial){
		function content(blockName) {
			return _content(blockName, context, content, partial);
		}
		var out = '';
		 out +="<div><p>";
 out +=context.header;
 out +="</p></div>\n";
 out +=partial(context.greetings, 'head');
 out +="\n\nне работает... если блок определено в паренте!!!";

		return out;
	};
	tpl.parent = "Container1.nhtml";
	return tpl;
})();
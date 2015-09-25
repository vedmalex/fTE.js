(function(){
	var tpl = {};
	  tpl.blocks = {};
	tpl.blocks["header"] = function(context,  _content, partial){
		var out = '';
		 out +="<div>";
 out +=context.header;
 out +="</div>";

		return out;
	};
	
	tpl.aliases={};
	 tpl.aliases[" head"] = "Container3.nhtml";

	tpl.script = function (context, _content, partial){
		function content(blockName) {
			return _content(blockName, context, content, partial);
		}
		var out = '';
		
		return out;
	};
	tpl.parent = "Container.nhtml";
	return tpl;
})();
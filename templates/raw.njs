<#@ requireAs ('codeblock.njs','codeblock') #>(function(){
	var tpl = {};
<#
		var cb = context.block;
		if(cb){

#>	  tpl.blocks = {};
<#			for(var cbn in cb){
#>	tpl.blocks["#{cbn}"] = function(context,  _content, partial){
		var out = '';
		#{partial(cb[cbn].main, 'codeblock')}
		return out;
	};
<#			}
		}
	var reqList = [];
	var item, directives = context.directives, extend = '';
	for (var i = 0, len = directives.length; i < len; i++) {

		item = directives[i];
		if(item.content === 'extend'){
			extend = item.name.trim();
		}
		if(item.content === 'requireAs'){
			var requires = item.name.split(',');
			reqList.push({name:requires[0], alias:requires[1], absPath:requires[2]});
		}
	}
	if(reqList.length > 0){
#>	
	tpl.aliases={};
	<# var rq;
	for (var i = 0, len = reqList.length; i < len; i++) {
		rq = reqList[i];
#> tpl.aliases["#{rq.alias}"] = "#{rq.name}";
<#
	}
}#>
	tpl.script = function (context, _content, partial){
		function content(blockName) {
			return _content(blockName, context, content, partial);
		}
		var out = '';
		#{partial(context.main,'codeblock')}
		return out;
	};
	<#if(extend) {#>tpl.parent = #{JSON.stringify(extend)};<#}#>
	return tpl;
})();
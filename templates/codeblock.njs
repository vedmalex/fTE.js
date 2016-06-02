<#var block;
for (var i = 0, len = context.length; i < len; i++) {
	block = context[i];
-#>
<#
  var indent;
  if(block.indent){
    indent = JSON.stringify(block.indent);
-#>
 out += #{indent};
<#}-#>
/*#{block.line}:#{block.column}*/ 
<#
	switch(block.type){
		case 'text':
#> out +=#{JSON.stringify(block.content)};<#
		break;
    case 'escaped expression':
#> out += escape(#{block.content});<#  
    break;
		case 'expression':
#> out +=#{block.content};<#	
		break;
		case 'codeblock':
#> #{block.content};<#
		break;
	}
#>
<#}#>
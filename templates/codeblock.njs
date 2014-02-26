<#var block;
for (var i = 0, len = context.length; i < len; i++) {
	block = context[i];
	switch(block.type){
		case 'text':
#>out +=#{JSON.stringify(block.content)};<#
		break;
		case 'expression':
#>out +=#{block.content};<#	
		break;
		case 'codeblock':
#>#{block.content}<#
		break;
	}
#>
<#}#>
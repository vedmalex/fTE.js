<#@ context 'renderOptions' #>
<#@ noIndent #>
<#
var blockList = renderOptions.blocks;
var noIndent = renderOptions.noIndent;
var needToIndent = false;
if(!noIndent){
  for (var i = 0, len = blockList.length; i < len; i++) {
    if(blockList[i].indent){
      needToIndent = true;
      break; 
    }
  }
} else {
  needToIndent = !noIndent;
}
-#>
<#if(needToIndent){ -#>
function applyIndent(str, _indent) {
  var indent = '';
  if (typeof _indent == 'number' && _indent > 0) {
    var res = '';
    for (var i = 0; i < _indent; i++) {
      res += ' ';
    }
    indent = res;
  }
  if (typeof _indent == 'string' && _indent.length > 0) {
    indent = _indent;
  }
  if (indent && str) {
    return str.split('\n').map(function (s) {
        return indent + s;
    }).join('\n');
  } else {
    return str;
  }
}
<#}-#>
<#-
function applyIndent(str, _indent){
  var indent='';
  if (typeof _indent == 'number' && _indent > 0){
    var res = '';
    for (var i=0;i < _indent; i++) {
      res += ' ';
    }
    indent = res;
  }
  if (typeof _indent == 'string' && _indent.length > 0){
    indent = _indent 
  }
  if (indent && str) {
    return str.split('\n').map(function(s){
      return indent + s;
    }).join('\n');
  } else {
    return str;
  }
}
for (var i = 0, len = blockList.length; i < len; i++) {
  var block = blockList[i];
  var content = block.content;
  var blockIndent = block.indent && !noIndent;
  var indent = '';
  if(block.indent){
    indent = JSON.stringify(block.indent);
}#>
/*#{block.line}:#{block.column}*/
<#
  switch(block.type){
    case 'text':
#> out +=<#if (block.indent && !noIndent) { -#>
#{JSON.stringify(applyIndent(content, block.indent))};
 <#- } else if(indent) { -#>
#{indent} + #{JSON.stringify(content)};
<#- } else { -#>
#{JSON.stringify(content)};
<#- }-#>
<#
    break;
    case 'uexpression':
#> out +=<#if (indent && !noIndent) { -#>
applyIndent(escape(#{content}), #{indent});
<#- } else if(indent){ -#>
#{indent} + escape(#{content});
<#- } else { -#>
escape(#{content});
<#- } -#>
<#  
    break;
    case 'expression':
#> out +=<#if (indent && !noIndent) { -#>
applyIndent(#{content}, #{indent});
<#- } else if(indent) { -#>
#{indent} + #{content};
<#- } else { -#>
#{content};
<#}-#>
<#  
    break;
    case 'codeblock':
#> <#if (blockIndent) { -#>
#{applyIndent(content, block.indent)}
<#- } else if(block.indent) { -#>
#{block.indent}#{content}
<#- } else { -#>
#{content}
<#- } -#>
<#
    break;
  }
-#>
<#}-#>
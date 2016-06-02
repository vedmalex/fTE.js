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
<#- var block;
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
for (var i = 0, len = context.length; i < len; i++) {
  block = context[i];
-#>
<#
  var content = block.content;
  var indent = '';
  if(block.indent){
    indent = JSON.stringify(block.indent);
-#>
<#}#>
/*#{block.line}:#{block.column}*/ 
<#
  switch(block.type){
    case 'text':
#> out +=<#if (block.indent) { -#>
#{JSON.stringify(applyIndent(content, block.indent))};
 <#- } else { -#>
#{JSON.stringify(content)};
<#- }-#>
<#
    break;
    case 'uexpression':
#> out +=<#if (indent) { -#>
 applyIndent(escape(#{content}), #{indent});
<#- } else { -#>
 escape(#{content});
<#- } -#>
<#  
    break;
    case 'expression':
#> out +=<#if (indent) { -#>
 applyIndent(#{content}, #{indent});
 <#- } else { -#>
 #{content};
<#}-#>
<#  
    break;
    case 'codeblock':
#> <#if (block.indent) { -#>
#{applyIndent(content, block.indent)}
<#- } else { -#>
#{content}
<#- } -#>
<#
    break;
  }
-#>
<#}-#>
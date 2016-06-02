<#@ requireAs ('codeblock.njs','codeblock') #>
<#-    
  var reqList = [];
  var contextName = 'context';
  var item, directives = context.directives, extend = '';
  for (var i = 0, len = directives.length; i < len; i++) {

    item = directives[i];
    if(item.content === 'extend'){
      extend = item.name.trim();
    }
    if(item.content === 'requireAs'){
      var requires = item.name.split(',').map(function(i){return i.trim()});
      reqList.push({name:requires[0], alias:requires[1], absPath:Boolean(requires[2])});
    }
    if(item.content === 'context'){
      contextName = item.name.split(',')[0].trim();
    }
  }
-#>
{
  script: function (#{contextName}, _content, partial){
    function content(blockName) {
      return _content(blockName, #{contextName}, content, partial);
    }
    var out = '';
    #{partial(context.main,'codeblock')}
    return out;
  },
<#
    var cb = context.block;
    if(cb) {-#>
  blocks : {
<#    for(var cbn in cb){ -#>
    "#{cbn}": function(#{contextName},  _content, partial){
      var out = '';
      #{partial(cb[cbn].main, 'codeblock')}
      return out;
    },
<#      }-#>
  },
<#-  } -#>
  compile: function() {
<#-  if(reqList.length > 0) { -#> 
  this.aliases={};
<# var rq;
  for (var i = 0, len = reqList.length; i < len; i++) {
    rq = reqList[i]; 
-#> 
  this.aliases["#{rq.alias}"] = "#{rq.name}";
  this.factory.ensure("#{rq.name}", #{rq.absPath});
<#
  }
}-#>

<#-if(extend) {-#>
  this.parent = #{JSON.stringify(extend)};
<#}-#>
<#if(extend) {-#>
  this.mergeParent(this.factory.ensure(this.parent))
<#}-#>
  },
}

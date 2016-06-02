<#@ requireAs ('codeblock.njs','codeblock') #>
<#-
  function processRequire(item){
    var requires = item.name.split(',').map(function(i){return i.trim()});
    return {name:requires[0], alias:requires[1], absPath:Boolean(requires[2])};
  }

  function processContextName(item){
    return item.name.split(',')[0].trim();
  }

  var reqList = [];
  var contextName = 'context';
  var item, directives = context.directives, extend = '';
  for (var i = 0, len = directives.length; i < len; i++) {

    item = directives[i];
    if(item.content === 'extend'){
      extend = item.name.trim();
    }
    if(item.content === 'requireAs'){
      reqList.push(processRequire(item));
    }
    if(item.content === 'context'){
      contextName = processContextName(item)
    }
  }
-#>
{
  script: function (#{contextName}, _content, partial){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = #{contextName};
      return _content(blockName, ctx, content, partial);
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
<#- var blockConetxtName = contextName;
    var bdirvs = cb[cbn].directives;
    var item = bdirvs[i];
    for(var i = 0, len = bdirvs.length; i < len; i++){
      item = bdirvs[i];
      if(item.content === 'context'){
        blockConetxtName = processContextName(item)
      }
    }
-#>
    "#{cbn}": function(#{blockConetxtName},  _content, partial){
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

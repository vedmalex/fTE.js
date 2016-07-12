<#@ requireAs ('codeblock.njs','codeblock') #>
<#-
  function processRequire(item){
    var requires = item.name.split(',').map(function(i){return i.trim()});
    return {name:requires[0], alias:requires[1]};
  }

  function processContextName(item){
    return item.name.split(',')[0].trim();
  }

  function processAsync(item){
    return item.name.split(',')[0].trim();
  }

  function processnoIndent(item){
    return !!item;
  }

  var templateAlias = '';
  var reqList = [];
  var contextName = 'context';
  var noIndent = false;
  var alias = '';
  var asyncType = '';
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
    if(item.content === 'noIndent'){
      noIndent = processnoIndent(item)
    }
    if(item.content === 'alias'){
      alias = JSON.stringify(item.name.trim());
    }
    if(item.content === 'async'){
      asyncType = processAsync(item);
    }
  }
-#>
{ 
<#- if(alias){
#> alias: #{alias},
<#- }-#>
  script: function (#{contextName}, _content, partial){
    function content(blockName, ctx) {
      if(ctx === undefined || ctx === null) ctx = #{contextName};
      return _content(blockName, ctx, content, partial);
    }
    var out = '';
    <#- var blocks = {blocks:context.main, noIndent:noIndent} -#>
    #{partial(blocks,'codeblock')}
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
    var blkNoIndent = false;
    var blAsyncType = '';
    for(var i = 0, len = bdirvs.length; i < len; i++){
      item = bdirvs[i];
      if(item.content === 'context'){
        blockConetxtName = processContextName(item)
      }
      if(item.content === 'noIndent'){
        blkNoIndent = processnoIndent(item)
      }
      if(item.content === 'async'){
        blAsyncType = processAsync(item);
      }
    }
-#>
    "#{cbn}": function(#{blockConetxtName},  _content, partial){
      function content(blockName, ctx) {
        if(ctx === undefined || ctx === null) ctx = #{contextName};
        return _content(blockName, ctx, content, partial);
      }
      var out = '';
      <#- var blocks = {blocks :cb[cbn].main, noIndent:blkNoIndent} -#>
      #{partial(blocks, 'codeblock')}
      return out;
    },
<#      }-#>
  },
<#-  } -#>
  compile: function() {
<#- if(alias){#>
    this.alias = #{alias};
<#- }-#>
<#-  if(reqList.length > 0) { -#> 
    this.aliases={};
<# var rq;
  for (var i = 0, len = reqList.length; i < len; i++) {
    rq = reqList[i]; 
-#> 
    this.aliases["#{rq.alias}"] = "#{rq.name}";
    this.factory.ensure("#{rq.name}");
<#
  }
}-#>

<#-if(extend) {#>
    this.parent = #{JSON.stringify(extend)};
    this.mergeParent(this.factory.ensure(this.parent))
<#}-#>
  },
  dependency: {
  <# if(extend) {-#>
    #{JSON.stringify(extend)}: 1,
  <# }-#>
<#- if(reqList.length > 0) {
  for (var i = 0, len = reqList.length; i < len; i++) {
    rq = reqList[i]; 
-#> 
    "#{rq.name}": 1,
<#
  }
}-#>
  }
}

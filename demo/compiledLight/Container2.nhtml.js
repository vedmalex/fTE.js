(function(){
  return {   script: function (context, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = context;
       return _content(blockName, ctx, content, partial);
     }
     var out = '';    var escapeExp = /[&<>"]/,
         escapeAmpExp = /&/g,
         escapeLtExp = /</g,
         escapeGtExp = />/g,
         escapeQuotExp = /"/g;
     
     function escapeIt (text) {
       if (text == null) {
         return '';
       }
     
       var result = text.toString();
       if (!escapeExp.test(result)) {
         return result;
       }
     
       return result.replace(escapeAmpExp, '&amp;')
       .replace(escapeLtExp, '&lt;')
       .replace(escapeGtExp, '&gt;')
       .replace(escapeQuotExp, '&quot;');
     };
     
     /*2:1*/
      out +="<div>\n  <h3>yet another header title</h3>\n  <p>";
     /*4:6*/
      out +=escapeIt("<"+context.header);
     /*4:27*/
      out +="</p>\n</div>\n";
     /*6:1*/
      out +=partial(context.greetings, 'head');
     
     /*6:38*/
      out +="\n\n!!! работает... даже если partial определен в базовом шаблоне... !!!\n";
     return out;
   },
   compile: function() {
     this.parent = "Container1.nhtml";
     this.mergeParent(this.factory.ensure(this.parent))
   },
   dependency: {
       "Container1.nhtml": 1,
     }
 }
 ;
})();
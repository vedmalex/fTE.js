(function(){
  return {
   script: function (context, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = context;
       return _content(blockName, ctx, content, partial);
     }
     var out = '';
     
     /*2:1*/
      out +="<div> \n  <h3>yet another header title</h3> \n  <p>";
     /*4:6*/
      out += escape(context.head.header);
     /*4:28*/
      out +="</p>\n</div>\n";
     /*6:1*/
      out += partial(context.greetings, 'head');
     
     /*6:38*/
      out +="\n\n!!! работает... даже если partial определен в базовом шаблоне... !!!";
     return out;
   },
   compile: function() {  this.parent = "Container1.nhtml";
   this.mergeParent(this.factory.ensure(this.parent))
   },
 }
 ;
})();
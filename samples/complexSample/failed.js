result = Line 57: Unexpected token );
(function(){
  return {
   script: function (context, _content, partial){
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
     
     /*3:1*/
      out +="<section>\n";
     /*4:1*/
      out +=applyIndent(partial(context, 'panel'), "  ");
     /*4:31*/
      out +="\n</section>\n<section>\n";
     /*7:1*/
      out +=applyIndent(partial({ title: 'Another panel', body:'extra content', "  ");
     /*7:60*/
      out +=", 'panel')}\n</section>\n";
     return out;
   },
   compile: function() {  this.aliases={};
   this.aliases["panel"] = "panel.nhtml";
   this.factory.ensure("panel.nhtml");
   this.parent = "template.nhtml";
   this.mergeParent(this.factory.ensure(this.parent))
   },
   dependency:{    "template.nhtml":1,
   "panel.nhtml":1,
   }
 }
 ;
})();;
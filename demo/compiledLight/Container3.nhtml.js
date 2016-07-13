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
      out +="<div>\n  <p>\n  ";
     /*4:3*/
       if(context == 'Santa'){
     /*5:1*/
      out +="    Hello Dear";
     /*5:15*/
      out +=" " + context;
     /*5:26*/
      out +="!";
     /*5:27*/
      } else {
     /*7:1*/
      out +="    Hello";
     /*7:10*/
      out +=" " + context;
     /*7:21*/
      out +="!";
     /*7:22*/
      }
     /*8:9*/
      out +="\n  </p>\n</div>\n";
     return out;
   },
   compile: function() {  },
   dependency: {
     }
 }
 ;
})();
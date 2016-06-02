module.exports = {
   script: function (context, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = context;
       return _content(blockName, ctx, content, partial);
     }
     var out = '';
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
     
     /*1:1*/
      out +="<p>";
     /*1:4*/
      if(context == 'Santa'){
     /*3:1*/
      out +="  Hello Dear";
     /*3:13*/
      out += applyIndent(context, " ");
     /*3:24*/
      out +="!";
     /*3:25*/
     } else {
     /*5:1*/
      out +="  Hello";
     /*5:8*/
      out += applyIndent(context, " ");
     /*5:19*/
      out +="!";
     /*5:20*/
     }
     /*7:1*/
      out +="</p>";
     return out;
   },
   compile: function() {  },
 }
 ;

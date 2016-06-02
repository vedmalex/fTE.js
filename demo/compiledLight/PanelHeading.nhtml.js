Line 4: Unexpected token (;
(function(){
  return 
 {
   script: function (context, _content, partial){
     function content(blockName) {
       return _content(blockName, context, content, partial);
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
      out +="<div class=\"panel-heading\">\n  <h3 class=\"panel-title\">\n";
     /*3:1*/
      out += applyIndent(content(), "    ");
     /*3:17*/
      out +="\n  </h3> \n</div>";
     return out;
   },
   compile: function() {  },
 }
 ;
})();;
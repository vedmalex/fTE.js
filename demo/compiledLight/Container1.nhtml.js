(function(){
  return {
   script: function (obj, _content, partial){
     function content(blockName) {
       return _content(blockName, obj, content, partial);
     }
     var out = '';
     
     /*9:1*/
      out += content();
     
     return out;
   },
   blocks : {
     "header": function(obj,  _content, partial){
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
       
       /*5:1*/
        out +="<div>\n";
       /*6:1*/
        out += applyIndent(obj.header, "  ");
       /*6:16*/
        out +="\n</div>";
       return out;
     },
   },  compile: function() {  this.aliases={};
   this.aliases["head"] = "Container3.nhtml";
   this.factory.ensure("Container3.nhtml",false);
   this.parent = "Container.nhtml";
   this.mergeParent(this.factory.ensure(this.parent))
   },
 }
 ;
})();
module.exports = {
   script: function (context, _content, partial){
     function content(blockName) {
       return _content(blockName, context, content, partial);
     }
     var out = '';
     
     
     /*8:1*/ 
      out += content();
     
     return out;
   },
   blocks : {
     "header": function(context,  _content, partial){
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
       
       /*4:1*/ 
        out +="<div>\n";
       /*5:1*/ 
        out += applyIndent(context.header, "  ");
       /*5:20*/ 
        out +="\n</div>";
       return out;
     },
   },  compile: function() {
   this.aliases={};
   this.aliases["head"] = "Container3.nhtml";
   this.factory.ensure("Container3.nhtml",false);
   this.parent = "Container.nhtml";
   this.mergeParent(this.factory.ensure(this.parent))
   },
 }
 ;
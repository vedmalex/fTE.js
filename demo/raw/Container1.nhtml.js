module.exports = {
   script: function (obj, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = obj;
       return _content(blockName, ctx, content, partial);
     }
     var out = '';
     
     /*10:1*/
      out += content();
     
     return out;
   },
   blocks : {
     "header": function(head,  _content, partial){
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
       
       /*6:1*/
        out +="<div>\n";
       /*7:1*/
        out += applyIndent(head.header, "  ");
       /*7:17*/
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

module.exports = 
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
     
     /*2:1*/
      out +="<div>\n";
     /*3:1*/
      out += applyIndent(content('header'), "  ");
     /*3:23*/
      out +="\n</div>\n<div>\n";
     /*6:1*/
      out += applyIndent(content(), "  ");
     /*6:15*/
      out +="\n</div>";
     return out;
   },
   compile: function() {  this.parent = "PanelHeading.nhtml";
   this.mergeParent(this.factory.ensure(this.parent))
   },
 }
 ;

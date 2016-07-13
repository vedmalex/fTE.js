module.exports = {   script: function (context, _content, partial){
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
     function applyIndent(_str, _indent) {
       var str = String(_str);
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
      out +=applyIndent(content('header', context.head), "  ");
     /*3:37*/
      out +="\n</div>\n<div>\n";
     /*6:1*/
      out +=applyIndent(content(), "  ");
     /*6:15*/
      out +="\n</div>";
     return out;
   },
   compile: function() {
     this.parent = "PanelHeading.nhtml";
     this.mergeParent(this.factory.ensure(this.parent))
   },
   dependency: {
       "PanelHeading.nhtml": 1,
     }
 }
 ;

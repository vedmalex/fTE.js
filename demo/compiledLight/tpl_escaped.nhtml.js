(function(){
  return {   script: function (data, _content, partial){
     function content(blockName, ctx) {
       if(ctx === undefined || ctx === null) ctx = data;
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
      out +="<html>\n\t<head>\n\t\t<title>";
     /*4:10*/
      out +=escapeIt(data.title);
     /*4:23*/
      out +="</title>\n\t</head>\n\t<body>\n\t\t<p>";
     /*7:6*/
      out +=escapeIt(data.text);
     /*7:18*/
      out +="</p>";
     /*7:22*/
       if (data.projects.length) { 
     /*9:1*/
      out +="\t\t\t";
     /*9:4*/
       for (var i = 0; i < data.projects.length; i++) { 
     /*10:1*/
      out +="\t\t\t\t<a href=\"";
     /*10:14*/
      out +=escapeIt(data.projects[i].url);
     /*10:37*/
      out +="\">";
     /*10:39*/
      out +=escapeIt(data.projects[i].name);
     /*10:63*/
      out +="</a>\n\t\t\t\t<p>";
     /*11:8*/
      out +=escapeIt(data.projects[i].description);
     /*11:39*/
      out +="</p>";
     /*11:43*/
       } 
     /*13:1*/
      out +="\t\t";
     /*13:3*/
       } else { 
     /*14:1*/
      out +="\t\t\tNo projects";
     /*14:15*/
       } 
     /*16:1*/
      out +="\t</body>\n</html>";
     return out;
   },
   compile: function() {  },
   dependency: {
     }
 }
 ;
})();
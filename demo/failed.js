result = function compiled_njs (context, _content, partial){
var out="";
function content(blockName) {
return _content(blockName, context, content, partial);
};;/*line2*/ out +="\tvar tpl = {};\n";
;/*line3*/

		var cb = context.block;
		if(cb){

;
;/*line7*/ out +="\t  tpl.blocks = {};\n";
;/*line8*/
			for(var cbn in cb){
;
;/*line9*/ out +="\ttpl.blocks[\"";
;/*line9*/
 out += cbn;
;/*line9*/ out +="\"] = function(context,  _content, partial){\n\t\tvar out = '';\n\t\t";
;/*line11*/
 out += partial(cb[cbn].main, 'codeblock');
;/*line11*/ out +="\n\t\treturn out;\n\t};\n";
;/*line14*/
			}
		};
;/*line15*/ out +="\n\ttpl.script = function (context, _content, partial){\n\t\tfunction content(blockName) {\n\t\t\treturn _content(blockName, context, content, partial);\n\t\t}\n\t\tvar out = '';\n\t\t";
;/*line21*/
 out += partial(context.main,'codeblock');
;/*line21*/ out +="\n\t\treturn out;\n\t};\n\ntpl.compile = function() {\n";
;/*line26*/
		
	var reqList = [];
	var item, directives = context.directives, extend = '';
	for (var i = 0, len = directives.length; i < len; i++) {

		item = directives[i];
		if(item.content === 'extend'){
			extend = item.name.trim();
		}
		if(item.content === 'requireAs'){
			var requires = item.name.split(',').map(funtion(i){return i.trim()});
			reqList.push({name:requires[0], alias:requires[1], absPath:Boolean(requires[2])});
		}
	}
	if(reqList.length > 0){
;
;/*line41*/ out +="\t\n\tthis.aliases={};\n";
;/*line43*/
 var rq;
	for (var i = 0, len = reqList.length; i < len; i++) {
		rq = reqList[i];
;
;/*line46*/ out +=" \n\tthis.aliases[\"";
;/*line47*/
 out += rq.alias;
;/*line47*/ out +="\"] = \"";
;/*line47*/
 out += rq.name;
;/*line47*/ out +="\";\n\tthis.factory.ensure(\"";
;/*line48*/
 out += rq.name;
;/*line48*/ out +="\", ";
;/*line48*/
 out += rq.absPath;
;/*line48*/ out +=");\n";
;/*line49*/

	}
};
;/*line51*/ out +="\n\n";
;/*line53*/
if(extend) {;
;/*line53*/ out +="this.parent = ";
;/*line53*/
 out += JSON.stringify(extend);
;/*line53*/ out +=";";
;/*line53*/
};
;/*line53*/ out +="\n";
;/*line54*/
if(extend) {;
;/*line54*/ out +="this.mergeParent(this.factory.ensure(this.parent))";
;/*line54*/
};
;/*line54*/ out +="\n};\n\n\tmodule.exports = tpl;";

 return out;

}
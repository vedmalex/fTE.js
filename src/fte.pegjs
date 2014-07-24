{ 
//http://pegjs.majda.cz/online
//http://peg.arcanis.fr/
function wrapCode(code) {
  var result = {};
  result.parameters = 'context, _content, partial';
  var header = 'var out="";\n';
  header += 'function content(blockName) {\nreturn _content(blockName, context, content, partial);\n};';
  var footer = '\n return out;\n';
  result.body = header + code + footer;
  return result;
}

function wrapBlock(code) {
  var result = {};
  result.parameters = 'context, content, partial';
  var header = '{ var out=""; \n';
  var footer = '\n return out; \n}';
  result.body = header + code + footer;
  return result;
}

function parseIt(input) {
  var result = {main:"",requireList:[]};
  var i, block;
  var len = input.length;
  for (i = 0; i < len; i++) {
    block = input[i];
    switch (block.type) {
      case "text":
        if(block.content)
          result.main += "; out +="+JSON.stringify(block.content)+";\n";
        break;
      case "directive":
          switch(block.content){
            case "extend":
             result.extend = block.name;
            break;
            case "requireAs":
             result.requireList.push(block.name);
            break;
          }
        break;
      case "expression":
        result.main += ";\n out += "+ block.content+";\n";
        break;

      case "codeblock":
        result.main += ";\n" +block.content + ";\n";
        break;
      case "block":
        var lr = parseIt(block.content);
        if(!result.block) result.block = {};
        result.block[block.name] = wrapBlock(lr.main);
        break;
    }
  }
  return result;
}

  // join an array
  function node(content, type, name){
    this.type = type;
    if(name) this.name = name;
    this.content = content;
  }
  
  function j(arr) {
    return arr.join("");
  }
  
  // flatten an array and join it
  function f(arr) {
   if(arr){
    var merged = [];
     return merged.concat.apply(merged, arr).join("");
    }
  }
}

start = head:text tail:(codeBlocks text?)* {
  var result = [head];
  for(var i=0, len = tail.length; i< len; i++){
    result.push.apply(result, tail[i]);
  }

  result = parseIt(result);
  result.main = wrapCode(result.main)
  return result;
}

blockContent = head:text tail:(canBeInBlock text?)* {
  var result = [head];
  for(var i=0, len = tail.length; i< len; i++){
    result.push.apply(result, tail[i]);
  }
  return result;
}

text = text:(
   onlyText
 / midText
 / firstText
 / lastText){
   return new node(f(text), "text")
}

onlyText = text:(!notText.)* 

midText = &codeBlocks onlyText &codeBlocks

firstText = onlyText &codeBlocks

lastText = &codeBlocks onlyText

codeBlocks = 
  canBeInBlock
 / block
 / directive
 
 canBeInBlock = 
  expression
 / codeBlock
 
expression "expression" = eStart content:(!( eEnd ) .)* eEnd 
{ return new node(f(content), "expression");}

codeBlock "code block" = cbStart content:(!(cbEnd / (blockStartDif / "end #>")) .)* cbEnd 
{ return new node(f(content), "codeblock");}

directive "directive" = dStart _ content:directives _ "("? _? name:( stringType _? ","? _? )* ")"? _? cbEnd 
{ return new node(content, "directive", f(name)); }

notText = directive / cbStart / cbEnd / expression / blockEnd / blockStart

reservedEnd = eEnd / cbEnd / blockEnd

block = name:blockStart content: blockContent blockEnd 
 { return new node(content,"block",name);}

stringType = name:(quotedString / dQuotedString){return name;}
  
quotedString "single quoted name"= 
"'" name:(!"'".)* "'" {return f(name)}

dQuotedString "double quoted name"= 
'"' name:(!'"'.)* '"' {return f(name)}

blockStart = "<#" name:blockStartDif "#>" {return name;}

blockStartDif = " block " name: stringType " : "{return name;}

blockEnd = "<# end #>"

cbStart "code block start sequence" = 
"<#"!"@"!(blockStartDif / " end #>")

cbEnd "codeblock end sequense" = 
"#>"

dStart "directive start" = 
"<#@"

eStart "expression start" = 
"#{"

eEnd "expression end" = 
"}"

directives = 
  "extend"
/ "fileName"
/ "requireAs"

_ = WhiteSpace* 
__ = (WhiteSpace / LineTerminatorSequence)*


LineTerminatorSequence "end of line" = "\n" / "\r\n" / "\r" / "\u2028" // line separator
/ "\u2029" // paragraph separator

WhiteSpace "whitespace" = [\t\v\f\u00A0\uFEFF ] / Zs

LineTerminator = [\n\r\u2028\u2029 ]

// Separator, Space
Zs = [\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]
{
//http://pegjs.majda.cz/online
//http://peg.arcanis.fr/

var eol = ['\n','\r\n','\r','\u2028','\u2029'];

function parseIt(input) {
  var result = {main:[],directives:[]};
  var i, block;
  var len = input.length;
  for (i = 0; i < len; i++) {
    block = input[i];
    switch (block.type) {
      case "text":
        if(block.content)
          result.main.push(block);
        break;
      case "directive":
          result.directives.push(block);
        break;
      case "expression":
        result.main.push(block);
        break;

      case "uexpression":
        result.main.push(block);
        break;

      case "codeblock":
        result.main.push(block);
        break;
      case "block":
        var lr = parseIt(block.content);
        if(!result.block) result.block = {};
        result.block[block.name] = lr;
        break;
    }
  }
  return result;
}

  // join an array
  function node(content, type, name, indent){
    this.type = type;
    if(name) this.name = name;
    this.content = content;
    if(indent) {
      this.indent = indent;// to use same indentation as source code
      if(~eol.indexOf(indent[0])){
        delete this.indent;
      }
    }
    var loc = location();
    var bol = loc.start.column == 1;
    if(bol) this.bol = true;
    this.line = loc.start.line;
    this.column = loc.start.column;
  }

  function j(arr) {
    return arr.join("");
  }

  // flatten an array and join it
  function f(arr) {
   if(arr){
    var merged = [];
    return merged.concat.apply(merged, arr).join("")
    }
  }
}

start = head:text tail:(codeBlocks text?)* {
  var result = [head];
  for(var i=0, len = tail.length; i< len; i++){
    result.push.apply(result, tail[i]);
  }

  result = parseIt(result);
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
   return new node(f(text), "text");
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
 / uexpression
 / codeBlock
 / directive

expression "expression" = indent:_ eStart content:(!( eEnd / ueStart) .)* eEnd
{ return new node(f(content), "expression", undefined, f(indent));}

uexpression "escaped expression" = indent:_ ueStart content:(!( eEnd / eStart ) .)* eEnd
{ return new node(f(content), "uexpression", undefined, f(indent));}

codeBlock "code block" = indent:(eol? _) cbStart content:(!(cbEnd / (blockStartDif / blockEndEdn)) .)* cbEnd
{ return new node(f(content), "codeblock", undefined, f(indent));}

directive "directive" = _ dStart _ content:directives _ "("? _? name:( stringType _? ","? _? )* ")"? _? cbEnd (_ eol)?
{ return new node(content, "directive", f(name)); }

notText = directive / cbStart / cbEnd / expression / uexpression / blockEnd / blockStart

reservedEnd = eEnd / cbEnd / blockEnd

block = name:blockStart content: blockContent blockEnd
 { return new node(content,"block",name);}

stringType = name:(quotedString / dQuotedString){return name;}

quotedString "single quoted name"=
"'" name:(!"'".)* "'" {return f(name)}

dQuotedString "double quoted name"=
'"' name:(!'"'.)* '"' {return f(name)}

cStart =  ((eol _)? "<#-") / "<#"

cEnd = ("-#>" (_ eol)?) / "#>"

dStart "directive start" = _ "<#@"

blockStart = cStart name:blockStartDif cEnd {return name}

blockStartDif = _ "block" _ name: stringType " : "{return name;}

blockEnd = cStart blockEndEdn

blockEndEdn = _ "end" _ cEnd

cbStart "code block start sequence" = cStart !"@"!(blockStartDif / blockEndEdn)

cbEnd "codeblock end sequense" = cEnd

ueStart "escaped expression start" = "!{"

eStart "expression start" = "#{"

eEnd "expression end" = "}"

directives = valiableName

valiableName = name:([a-z0-9_]i)* {return f(name)}

_ = WhiteSpace*
__eol = _ eol
eol__ = eol _

eol "end of line" = "\n" / "\r\n" / "\r" / "\u2028" // line separator
/ "\u2029" // paragraph separator

WhiteSpace "whitespace" = [\t\v\f\u00A0\uFEFF ] / Zs

// Separator, Space
Zs = [\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]

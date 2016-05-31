function Template Engine for javascript node.js inspired by [nJSt][https://github.com/unclechu/node-njst] and [ect][https://github.com/baryshev/ect]

It little bit modular, with little bit extensible `PEG.js`, little bit... unusual... without comparising it with any other template engine.

I use if for as code-generator.
it can generete your template into pure javascript for you to optimize. 

It is from the groud using [PEG.js][https://github.com/dmajda/pegjs]

It comes with Sublime-Text-2 syntax hightlight see `./sublime-text/` folder.

list of TODO:

- manual
- examples


### Links

[PEG.js project][http://pegjs.majda.cz/online]
[PEG.js online editor][http://peg.arcanis.fr/]

using esprima instead of acorn.

TODO:
 - изменять context переменную...
 - асинхронные вызовы, 
  - на промисах
  - на callback
  !{} escape --> done
  !!!indentation!!!
 unescape // стандартные функции
 - добавить комментарии, с параметрами для однострочных и блочных комментариев.
 - stream-support??? что это...
 -

в блок надо передавать переменные... хотя функции справляются и без блока

зачин для резки файлов есть directive fileName


<#- УБРАЛ!!! это тег.


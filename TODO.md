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

в блок надо передавать переменные... хотя функции справляются и без блока

зачин для резки файлов есть directive fileName

-#> убирает все пробелы включая ближайший перенос строки.

<#- убирает все пробелы перед собой до следующей строки

все директивы по умолчанию убирают за собой строки..

все requireAs действуют только в рамках одного текущего шаблона, вне зависимости от наследования

1. Шаблонизатор должен использовать уже скомпилированные шаблоны для своей работы, чтобы не использовать fte.peg.js, а вместо него использовать только raw.peg.js поскольку его кодогенерацию можно легко кастомизировать.

2. специальный режим компиляции шаблонов сервисных шаблонов...
когда одни генеряться с нуля? нужен или нет? если будет стартовый шаблон, то не нужен...

NODE!: to be able debug template, that is generated pass to Factory debug:true, this will inculde the tempalte using general require function, otherwise it will load throught saveEval function.

выдавать ошибку если в стеке скриптов остальня один... значит один из шаблонов не знает что от него будут наследовать, и не содержит конструкции content

минифицировать шаблоны.... через gulp

directives:

@ context obj

трасировка ошибок в консоль ... 
- защита шаблона...
- скомпилировать шаблоны и вырезать стандартный метод для fte загрузки шаблона так чтобы не поддерживать две схемы... и забыть оставить


blocks теперь принимают параметры.!!!!
blocks могут использовать директивы,
 <#@ context 'name' #>


нужны ли блоку директивы ... например context name?

noIndent - macro директива убирает Код отвечающий за Indentation
и по умолчанию не обрабатывает код на Indent

добавить в подсветку синтаксиса код для
Принимать функцию в качестве шаблона, а не просто модуль....

доделать.

параметры: мониторить директорию...
убрать require на debug... сейчас все работает нормально.


код


посмотреть как можно использовать immutable js для всего что нам нужно, в частности можно использовать memoization... как я и подумал... Кришна!!!
Immutable js

alias для теплейта
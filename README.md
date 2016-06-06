# fTE.js - featured Template Engine for node.js inspired by [nJSt](https://github.com/unclechu/node-njst) and [ect](https://github.com/baryshev/ect)

it is build using [pegjs](https://github.com/pegjs/pegjs)

## Features

  - inheritancce
  - codeblocks
  - partials
  - multiple root folders
  - pure javascript code
  - smart templates
  - nice code generation for templates
  - posible to load js function as tempaltes.
  - template caching by default
  - one of the fastest tempalte code geneation

````
## Speed Test 

64-bit Ubuntu 16.04 LTS
Intel core i7-3632QM CPU @ 2.20GHz x 8, SSD 250G
Nodejs v6.21


Rendering 100000 templates:

Gaikan
  Escaped   : 1514ms
  Unescaped : 60ms
  Total     : 1574ms

ECT
  Escaped   : 1437ms
  Unescaped : 96ms
  Total     : 1533ms

fTE.js
  Escaped   : 1414ms
  Unescaped : 79ms
  Total     : 1493ms

doT
  Escaped   : 2001ms
  Unescaped : 47ms
  Total     : 2048ms

Dust
  Escaped   : 1834ms
  Unescaped : 412ms
  Total     : 2246ms

Hogan.js
  Escaped   : 1746ms
  Unescaped : 328ms
  Total     : 2074ms

Fest
  Escaped   : 1641ms
  Unescaped : 249ms
  Total     : 1890ms

EJS without `with`
  Escaped   : 3764ms
  Unescaped : 644ms
  Total     : 4408ms

Swig
  Escaped   : 3767ms
  Unescaped : 282ms
  Total     : 4049ms

Underscore
  Escaped   : 2179ms
  Unescaped : 1270ms
  Total     : 3449ms

EJS
  Escaped   : 5825ms
  Unescaped : 2116ms
  Total     : 7941ms

Eco
  Escaped   : 4249ms
  Unescaped : 1123ms
  Total     : 5372ms

Handlebars.js
  Escaped   : 4485ms
  Unescaped : 2398ms
  Total     : 6883ms

Jade without `with`
  Escaped   : 6521ms
  Unescaped : 2594ms
  Total     : 9115ms

CoffeeKup
  Escaped   : 3147ms
  Unescaped : 6280ms
  Total     : 9427ms

Jade
  Escaped   : 15158ms
  Unescaped : 11153ms
  Total     : 26311ms

````

##Syntax
<>
/* 0 '' null  undefined e NaN  gerar falsy  */

'use strict';

var objeto = {};
let numero = 1;

if (objeto)
    document.writeln('objeto existe');
else
    document.writeln('objeto nao existe');

if (objeto === true)
    document.writeln('objeto e tipo estao de acordo');

if (numero === '1')
    document.writeln('Valor nao convertido para numero');

if (numero == '1')
    document.writeln('Valor convertido automaticamente para numero');

/* tratamento de nulos  */

let tiponulo = null; 
let tipoundefined;
let tipovazio = '';


let recebertiponulo = tiponulo || 2;
let recebertipoundefined = tipoundefined || 3;
let recebertipovazio = tipovazio || 4; 

document.writeln('tipo nulo:' + recebertiponulo);
document.writeln('tipo undefined:' + recebertipoundefined);
document.writeln('tipo vazio:' + recebertipovazio);
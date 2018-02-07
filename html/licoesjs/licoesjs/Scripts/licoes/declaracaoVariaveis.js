/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
Declaracao de variavies 
Tipo
Let = declares a block scope local variable , let, unlike var, does not create a property on the global object.
PENDENTE VER O EXEMPLO EM ORIENTACAO OBJETO
Const = Constants are block-scoped, much like variables defined using the let statement
Var = var keyword, which defines a variable globally,
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var

Nao e fortemente tipada se usar o mesmo tipo ele Otimiza a performace 
*/
'use strict';

let letx = 1;
//Aqui ele passa ser propriedade do objeto root - window
var varx = 1;

const constx = 2;
const constob = ObjetoUm;

function ExecucaoVariavelEx01LetVersusVar() {
    if (letx === 1) {
        let letx = 2;
        var varx = 2;
        document.writeln('<br/>escopo dentro let variavel:' + letx);
        document.writeln('<br/>escopo dentro var variavel:' + varx);
    }
    document.writeln('<br/>escopo fora let variavel:' + letx);
    document.writeln('<br/>escopo fora var variavel:' + varx);
    document.writeln('<br/>propriedade dentro do objeto global');
}
function ExecucaoVariavelConst() {
    try {
        constob.prop = 'B';
        document.write('Alteracao nas informacoes internas ok');
        constx = 99;
    }
    catch (err) {
        document.write('<br/>Erro ao alterar o proprio conteudo' + err);
    }
}

function ObjetoUm() {

    var prop = 'A';

}
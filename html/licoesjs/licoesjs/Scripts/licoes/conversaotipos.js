/*
 * Tipos ao converter diretamente como false 
 * '' string vazia  0  null undefined false NaN o restante convertido para true (tratados com falsy)
 * Outro conceito como verificar se a variavel e null ou undefined atraves do operador || or Logico e possivel 
 * Observar e que se for falsy entendera como null 
 */

'use strict';
function VerificarObjetoComoVerdadeiro() {
    var objeto = {};
    if ((objeto) && objeto !== false && objeto !== null
        && objeto !== undefined && objeto !== NaN && objeto !== '' && objeto !== 0) {
        document.writeln('<br/>Objeto e tratado com verdadeiro');
    }
}

function VerificarTipoNulo() {
    var stringVazia = ''
    stringVazia = stringVazia || 'Valor01';
    document.writeln('<br>stringVazia1avez:' + stringVazia);
    stringVazia = stringVazia || 'Valor02';
    document.writeln('<br>stringVazia2avez:' + stringVazia);
}
'use strict';
//Aplicando o conceito de Closure e Module Pattern 
// https://nandovieira.com.br/design-patterns-no-javascript-module
// http://www.tutorialsteacher.com/javascript/closure-in-javascript

//Exemplo de Conceito de Closure 
function Contador() {
    let contador = 0; 

    function AumentarContador() {
        contador = contador + 1;
        return 'contador:' + contador;
    }
    return AumentarContador;
}


//Comparacao de exemplo de Closure e Melhoria do Exemplo implemento o Module Pattern para Esconder a Propriedade 
var NovoContador =
    {
        Ponteiro: 0,
        Incrementar: function () { this.Ponteiro = this.Ponteiro + 1; return 'NovoContador:' + this.Ponteiro; }
    };


var ModuloContador = (function () {
    var privateCounter = 0;
    return {
        Ponteiro: function () {
            return privateCounter;
        },
        Incrementar: function () {
            privateCounter = privateCounter + 1;
            return 'ModuloContador:' + privateCounter;
        }
    };
})();

function bindbtnClosureContador()
{
    var closureContador = Contador(); //expression function
    alert(closureContador());
    alert(closureContador());
}

function bindbtnClosureNovoContador() {
    alert(NovoContador.Incrementar());
    alert(NovoContador.Ponteiro);
    alert(NovoContador.Incrementar());
    NovoContador.Ponteiro = NovoContador.Ponteiro + 1;
    alert(NovoContador.Ponteiro);
}

function bindbtnModuloContador() {
    alert(ModuloContador.Incrementar());
    alert(ModuloContador.Ponteiro());
    alert(ModuloContador.Incrementar());
    alert(ModuloContador.Ponteiro());
}

'use strict';
/*
Como declarar objetos Se vc já achou as variáveis confusas...
Object
Objetos antigos
Os muitos laços for
Ado, a ado, cada um no seu quadrado
Escopo das variáveis
Variable Hoisting
Módulos simples
Closures
Colocando coisas dentro do escopo e type aliasing
Resolvendo var e corrigindo closures
Tirando coisas de dentro do escopo
*/
function ExibirSaudacao() {
    alert("Ola Mundo");
}

function ExibirSaudacaoPorObjetoWindow() {
    var largura = window.innerWidth;
    var titulo = window.document.title;
    console.log('Largura do Documento:' + largura);
    console.log('Titulo do Documento:' + titulo);
    window.alert("Ola Mundo pelo objeto window");
}
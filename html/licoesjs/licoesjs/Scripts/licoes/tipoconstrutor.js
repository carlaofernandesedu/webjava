'use strict';

const idselobjeto = '#idselobjeto';
const idmensagem = '#idmensagem';
//Criacao do objeto sem Conceito de Construtor
function ProdutoSemConstrutor(nome, preco) {
    return {
        Nome: nome,
        Preco: preco,
        CalcularDesconto: function() {
            return this.Preco * 0.1;
        }
    }; 
}

//Criacao de Objeto Construtor por Funcao foi alterado para namespace 
/*
function ProdutoConstrutorFuncao(nome, preco) {
    this.Nome = nome;
    this.Preco = preco; 
    this.CalcularDesconto = function () {
        return this.Preco * 0.1; 
    }
}
*/
//Criacao de Objeto Construtor por ECMA 2015 ES2015 foi alterado para namespace 
/*
class ProdutoConstrutor {
    constructor(nome, preco) {
        this.Nome = nome;
        this.Preco = preco; 
    }
    CalcularDesconto() {
        return this.Preco * 0.1;
    }
}
*/
function ExecutarAcao() {
    var produto = null;
    var tipoObjeto = $(idselobjeto).val();
    const PRODUTO_SEM_CONSTRUTOR = '1'; 
    const PRODUTO_CONSTRUTOR_FUNCAO = '2';
    const PRODUTO_CONSTRUTOR = '3';
    switch (tipoObjeto) {
        case PRODUTO_SEM_CONSTRUTOR:
            produto = ProdutoSemConstrutor("produtoconstrutorsemfuncao", 10); 
            break;
        case PRODUTO_CONSTRUTOR_FUNCAO:
            //produto = new ProdutoConstrutorFuncao("produtoconstrutorfuncao", 10);
            produto = new tiposprodutos.construtores.ProdutoConstrutorPorFuncao("produtoconstrutorfuncao",10);
            break;
        case PRODUTO_CONSTRUTOR:
            //produto = new ProdutoConstrutor("produtoconstrutor", 10);
            produto = new tiposprodutos.construtores.ProdutoConstrutor("produtoconstrutor", 10);
            break;
    }
    let objmensagem = $(idmensagem);
    let mensagem = '';
    if (produto) {
        mensagem += '<br>tipo objeto:' + tipoObjeto;
        mensagem += '<br>Nome:' + produto.Nome;
        mensagem += '<br>Preco:' + produto.Preco;
        mensagem += '<br>ValorFinal:' + produto.CalcularDesconto();
    }
    objmensagem.html('<span>' + mensagem + '</span>');
}

$(document).ready(function () { $(idselobjeto).change(ExecutarAcao); });
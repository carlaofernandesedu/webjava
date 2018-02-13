'use strict';
var tiposprodutos = tiposprodutos || {};
tiposprodutos.construtores = tiposprodutos.construtores || {};

tiposprodutos.construtores.ProdutoConstrutorPorFuncao = function (nome, preco )
{
    this.Nome = nome; 
    this.Preco = preco; 
    this.CalcularDesconto = function ()
    {
        return this.Preco * 0.1;
    }
};
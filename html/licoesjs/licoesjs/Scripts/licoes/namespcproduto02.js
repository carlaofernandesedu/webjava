'use strict';
var tiposprodutos = tiposprodutos || {};
tiposprodutos.construtores = tiposprodutos.construtores || {};

tiposprodutos.construtores.ProdutoConstrutor = class ProdutoConstrutor {
    constructor(nome, preco) {
        this.Nome = nome;
        this.Preco = preco;
    }
    CalcularDesconto() {
        return this.Preco * 0.1;
    }

};
   
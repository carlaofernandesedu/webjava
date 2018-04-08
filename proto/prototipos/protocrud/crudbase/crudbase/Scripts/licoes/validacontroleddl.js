'use strict';
var VALIDACONTROLEDDL = (function () {

    const ctDdlSimples = '#form-detalhe #ddlsimples';
    const ctController = 'Home';
    const ctAction = 'ObterListaSimples';


    function init () {
        bindAll();
    }

    function bindAll () {
        bindDropDownSimples();
    }

 
    function bindDropDownSimples() {
        var incluirTextoSelecionePrimeiroItem = true;
        CONTROLES.DropDown.PreencherSimples(ctDdlSimples, ctController, ctAction, incluirTextoSelecionePrimeiroItem, null);
    }

    return {
        Init: init
    } 


}());

$(function () {
    VALIDACONTROLEDDL.Init();
});
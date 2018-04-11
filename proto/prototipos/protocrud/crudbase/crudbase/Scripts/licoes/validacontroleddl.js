'use strict';
var VALIDACONTROLEDDL = (function () {

    const ctFormDetalhe = "#form-detalhe"; 
    const ctDdlpai = ' #ddlpai';
    const ctDdlfilho = '#ddlfilho';
    const ctController = 'Home';
    const ctActionPai = 'ObterListaPai';
    const ctActionFilho = 'ObterListaFilho'; 

    function init () {
        bindAll();
    }

    function bindAll () {
        bindDropDownPai_Filho();
    }

 
    function bindDropDownPai_Filho() {
        var incluirTextoSelecionePrimeiroItem = true;
        let bind = false;
        let data = false;
        let idPai = null;
        let bloquear = false;
        let textoInicial = 'Selecione um item do combo filho';
        let seletor = ctFormDetalhe + ' ' + ctDdlpai;
        let seletorfilho = ctFormDetalhe + ' ' + ctDdlfilho;
        var callbackfilho = function (idPai) {
            if (idPai) {
                CONTROLES.DropDown.Preencher(seletorfilho, ctController, ctActionFilho, idPai, true);
            }
        };
        var callback = function () {
            CONTROLES.DropDown.DefinirChain(ctFormDetalhe, ctDdlpai, ctDdlfilho, bloquear, textoInicial, callbackfilho);
        };
        CONTROLES.DropDown.Preencher(seletor, ctController, ctActionPai, idPai, incluirTextoSelecionePrimeiroItem,bind,data,callback);
    }

    function DropDownPai_Selecionado(idPai) {
        var incluirTextoSelecionePrimeiroItem = true;
        let bind = false;
        let data = false;
        let callback = null;
        let seletor = ctFormDetalhe + ' ' + ctDdlfilho;
        CONTROLES.DropDown.Preencher(seletor, ctController, ctActionFilho, idPai, incluirTextoSelecionePrimeiroItem, bind, data, callback);
    }

    return {
        Init: init
    } 


}());

$(function () {
    VALIDACONTROLEDDL.Init();
});
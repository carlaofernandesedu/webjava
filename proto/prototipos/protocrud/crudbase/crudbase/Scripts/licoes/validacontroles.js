'use strict';
var VALIDACONTROLES = (function () {

    const ctPeriodoInicio = '#form-detalhe #PeriodoInicio';
    const ctPeriodoFim = '#form-detalhe #PeriodoFim';

    function init() {
        bindAll();
    }

    function bindAll() {
        bindDataInicial();
        bindDataFinal();
    }

    function bindDataInicial() {
        CONTROLES.Configurar.DatePicker(ctPeriodoInicio);
    }
    function bindDataFinal() {
        CONTROLES.Configurar.DatePicker(ctPeriodoFim);
    }

    return {
        Init : init
    }

}());

$(function () {
    VALIDACONTROLES.Init();
});
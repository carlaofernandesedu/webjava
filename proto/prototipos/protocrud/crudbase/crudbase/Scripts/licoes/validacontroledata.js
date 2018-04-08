'use strict';
var VALIDACONTROLEDATA = (function () {

    const ctPeriodoInicio = '#form-detalhe #PeriodoInicio';
    const ctPeriodoFim = '#form-detalhe #PeriodoFim';

    const ctMascaraCampoData = '00/00/0000';

    function init() {
        bindAll();
    }

    function bindAll() {
        bindControlesDatas();
      }

    //TRATAMENTO DE MASCARA DE ELEMENTOS 
    //https://plugins.jquery.com/mask/
    function formatarMascaraControlesDatas() {
        $(ctPeriodoInicio).mask(ctMascaraCampoData);
        $(ctPeriodoFim).mask(ctMascaraCampoData);
    }

    function bindControlesDatas() {
        CONTROLES.Configurar.DatePicker(ctPeriodoInicio);
        CONTROLES.Configurar.DatePicker(ctPeriodoFim);
        CONTROLES.Configurar.ConfigurarIntervaloData();
        formatarMascaraControlesDatas();
    }
    return {
        Init : init
    }

}());

$(function () {
    VALIDACONTROLEDATA.Init();
});
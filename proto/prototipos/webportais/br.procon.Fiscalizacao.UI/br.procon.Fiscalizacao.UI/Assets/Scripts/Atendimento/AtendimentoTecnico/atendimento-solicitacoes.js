var ATENDIMENTOSOLICITACOES = (function () {

    function init() {
        bindAll();
    }
    function bindAll() {
        desabilitarIniciar();
        desabilitarProximo();
        bindDesabilitarAoClick();       
    } 

    function desabilitarProximo() {
        if ($('#hdnSemAtendimento').val() === 0) {
            $("#solicitarConsulta").addClass('disabled');
            $("#solicitarConsulta").click(function () { return false; });
        }
    }

    function bindDesabilitarAoClick() {
        $('#solicitarConsulta').off('click');
        $('#solicitarConsulta').on('click', function () {
            $("#solicitarConsulta").addClass('disabled');
            $("#solicitarConsulta").click(function () { return false; });
        });
    }

    function desabilitarIniciar() {
        $("#filaAtendimento").addClass('disabled');
        $("#filaAtendimento").click(function () { return false; });        
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    ATENDIMENTOSOLICITACOES.Init();
});


var ATENDIMENTOTECNICO = (function () {

    function init() {
        bindAll();
    }
    function bindAll() {       
        definirUrlRetorno();
    }

    function definirUrlRetorno() {
        ATENDIMENTOBASE.Redirect.Definir('/AtendimentoTecnico/AtendimentoSolicitacoes');

    };   

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    ATENDIMENTOTECNICO.Init();
});


PERFIL = (function () {
    function init() {
        bindSalvar();
    }

    function bindSalvar() {
        console.log('bindSalvar');
        $(".acoes").off('click', '#btnSalvar')
        $(".acoes").on('click', '#btnSalvar', function () {
            $('#btnSubmitSalvar').click();
        });        
    }

    return {
        Init: init
    }
}());

$(function () {
    PERFIL.Init();
});
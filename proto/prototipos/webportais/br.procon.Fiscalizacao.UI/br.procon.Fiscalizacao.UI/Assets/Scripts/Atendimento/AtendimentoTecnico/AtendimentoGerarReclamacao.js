ATENDIMENTOGERARRECLAMACAO = (function () {


    function init() {
        bindAll();
        ATENDIMENTOGERARRECLAMACAO.PosCarregar = posCarregar;
    }

    function bindAll() {
        EditarReclamacao();
    }


    function EditarReclamacao() {
        $("#btnGerarReclamacao").off('click');
        $("#btnGerarReclamacao").on('click', function () {
            $.ajax({

            });
            window.location = "/Reclamacao/CriarReclamacao?idFicha=" + $('#IdFichaAtendimento').val();

            });
    }

    return {
        Init: function () {
            init();
        },
        PosCarregar: function () { return false }
    };

}());

$(function () {
    ATENDIMENTOGERARRECLAMACAO.Init();
});

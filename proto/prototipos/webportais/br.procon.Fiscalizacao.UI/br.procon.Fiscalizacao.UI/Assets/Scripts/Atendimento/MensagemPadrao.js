MENSAGEMPADRAO = (function () {

    function init() {
        listar();

        CONTROLES.Plugins.WYSIWYG();
    }

    var deletar = function (id) {
        BASE.Modal.ExibirModalConfirmacao(
            "Excluir Mensagem Padrão", 
            "Deseja mesmo excluir a Mensagem Padrão?", 
            "small", 
            "<i class='fa fa-close margR5'></i>Não", 
            "btn-primary", 
            "<i class='fa fa-trash margR5'></i>Sim", 
            "btn-danger",
            function () {
                $.ajax({
                    type: "POST",
                    url: "/MensagemPadrao/Excluir",
                    data: { id : id },
                    dataType: "JSON",
                    success: function (response) {
                        BASE.Mensagem.Mostrar("Mensagem padrão excluída com sucessso!", TipoMensagem.Sucesso, "Excluir");
                        
                        listar();
                    },
                    error: function (response) {
                        BASE.Mensagem.Mostrar(response.message, TipoMensagem.Error, "Excluir");
                    }
                });
            },
            null
        );
    }

    var listar = function () {
        $.ajax({
            type: "GET",
            url: "/MensagemPadrao/Listar",
            data: { id : $("[name=IdClassificacao]").val() },
            dataType: "JSON",
            success: function (response) {
                $("#tbl-data tbody tr td").css({ "vertical-align": "middle;" });
                $("#tbl-data tbody").empty();
                              
                if (response != undefined && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var alterar = $.validator.format("<a class='btn btn-primary btn-xs' href='/MensagemPadrao/Salvar?id={0}' data-toggle='tooltip' data-placement='top' title='' data-original-title='Alterar'><i class='fa fa-edit'></i></a>", response[i].Id);
                        var excluir = $.validator.format("", response[i].Id);

                        var linha = $.validator.format("<tr><td>{0}</td><td class='text-center'>{1}</td><td class='text-center'>{2} {3}</td></tr>", response[i].Titulo, (response[i].Ativo == true ? "SIM" : "NÃO"), alterar, excluir);

                        $("#tbl-data tbody").append(linha);
                    }
                } else {
                    var linha = $.validator.format("<tr> <td colspan='3'>{0}</td></tr>", "Nenhum item encontrado.");

                    $("#tbl-data tbody").append(linha);
                }

                $("[data-toggle=tooltip]").tooltip();
            }
        });
    };

    return {
        Init: init,
        ExcluirMensagem: deletar
    };

}());

$(function () {
    MENSAGEMPADRAO.Init();
});
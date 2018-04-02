var CONSUMIDOR = (function () {
    var moduleName = "CONSUMIDOR";

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAll();
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAtendimentoDuplicidade();
        atendimentoDuplicidadeFornecedor();
        bindAtendimentoDuplicidadeConsulta();
    }

    function bindAtendimentoDuplicidade() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#verificar-duplicidade").off("click");
        $("#verificar-duplicidade").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var idConsumidor = $("#IdConsumidor").val(),                
                idUsuarioInternet = $("#IdUsuarioInternet").val(),
                idFicha = $('#IdFichaAtendimento').val();

            if (idConsumidor !== undefined && idConsumidor !== "0" || idUsuarioInternet !== undefined && idUsuarioInternet !== "0") {                
                window.location = "/AtendimentoTecnico/AtendimentoSolicitacoesDuplicidade?usuarioInternet=" + idUsuarioInternet + "&idFichaAtendimento=" + idFicha + "&idConsumidor=" + idConsumidor;
            }
        });
    }

    function bindAtendimentoDuplicidadeConsulta() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#verificar-duplicidadeConsulta").off("click");
        $("#verificar-duplicidadeConsulta").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var idConsumidor = $("#IdConsumidor").val();

            if (idConsumidor !== undefined && idConsumidor !== "0")
                window.location = "/AtendimentoTecnico/AtendimentoSolicitacoesDuplicidade?idConsumidor=" + idConsumidor;
        });
    }

    function atendimentoDuplicidadeFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#verificar-duplicidadeFornecedor").off("click");
        $("#verificar-duplicidadeFornecedor").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var idFichaAtendimento = $("#IdFichaAtendimento").val(),
                idConsumidor = $("#IdConsumidor").val(),
                fornecedor = $("#IdFornecedor").val();

            if (idFichaAtendimento !== undefined && idConsumidor !== undefined && fornecedor !== undefined)
                window.location = "/AtendimentoTecnico/AtendimentoSolicitacoesDuplicidade?idFichaAtendimento=" + idFichaAtendimento + "&" + "idConsumidor=" + idConsumidor + "&" + "idFornecedor=" + fornecedor;
            else
                console.log("não foi possivel verificar duplicidade de fornecedores do atendimento");
        });
    }

    function verificarDuplicidadeConsumidor() {
        BASE.LogFunction(arguments.callee, moduleName);

        var idCondimudor = $("#IdConsumidor").val();

        if (idCondimudor === 0 || idCondimudor === undefined) return;

        $.ajax({
            url: "/AtendimentoTecnico/PesquisarDuplicado",
            data: { idConsumidor: $("#IdConsumidor").val() },
            type: "POST",
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("#verificar-duplicidade").show();
                    $("#verificar-duplicidadeConsulta").show();
                } else {
                    $("#verificar-duplicidade").hide();
                    $("#verificar-duplicidadeConsulta").hide();
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                console.log("erro !");
                console.log(xmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    CONSUMIDOR.Init();
});


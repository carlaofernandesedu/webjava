ATENDIMENTOASSOCIADO = (function () {

    function init() {
        bindAll();

    }

    function bindAll() {
        bindMascara();
        bindHabilitarBtnAssociarAtendimento();
        bindBtnAssociarAtendimento();
    }

    // Binds
    function bindBtnAssociarAtendimento() {
        $("#associarAtendimento").off("click");
        $("#associarAtendimento").on("click", function () {
            salvarAssociacaoDeProtocolo();
        });
    }

    function bindMascara() {
        $("#NrProtocoloReferenciado").mask("999999/9999", { reverse: true });
    }

    function bindHabilitarBtnAssociarAtendimento() {
        $("#NrProtocoloReferenciado").off("keyup");
        $("#NrProtocoloReferenciado").on("keyup", function () {
            if ($("#NrProtocoloReferenciado").val()) {
                $("#associarAtendimento:button").prop("disabled", false);
            } else {
                $("#associarAtendimento:button").prop("disabled", true);
            }
        });
    }

    // Functions
    function salvarAssociacaoDeProtocolo() {
        $("#associarAtendimento").prop("disabled", true);

        var numeroProtocolo = $("#NrProtocoloReferenciado");
        if (numeroProtocolo != undefined && numeroProtocolo.length > 0) {

            var idFichaAtendimento = $("#IdFichaAtendimento").val(), nrProtocoloAssociado = $("#NrProtocoloReferenciado").val();

            if (idFichaAtendimento === undefined && nrProtocoloAssociado === undefined) return;

            console.log("salvando associacao de protocolo");
            $.ajax({
                url: "/AtendimentoTecnico/AssociarAtendimento/",
                type: "POST",
                data: { IdFichaAtendimento: idFichaAtendimento, NrProtocoloAssociado: nrProtocoloAssociado },
                beforeSend: function () {
                    $("#associarAtendimento").prop("disabled", true);
                },
                success: function (response) {

                    if (response !== null && response !== undefined) {

                        if (response.msg !== null && response.msg !== undefined && response.msg.length > 0) {

                            $.each(response.msg, function (index, value) {

                                switch (value.TipoMensagem) {
                                    case 2: BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo); break;
                                    case 3: BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Error, value.Titulo); break;
                                    default: BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Sucesso, value.Titulo); break;
                                }
                            });
                        }
                        else {
                            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                                obterProtocolosPorFichaAtendimento(response.data);
                            }
                        }
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem(xmlHttpRequest.responseText, TipoMensagem.Error, errorThrown);
                },
                complete: function () {
                    $("#NrProtocoloReferenciado").val("");
                    $("#associarAtendimento").prop("disabled", false);
                }
            });
        } else {
            BASE.MostrarMensagem("Favor associar um protocolo.", TipoMensagem.Informativa);
        }
    }

    function obterProtocolosPorFichaAtendimento(data) {
        $("#tabAtendimentoFichaAssociacao tbody").empty();
        $(data).each(function (i) {
            $("#tabAtendimentoFichaAssociacao tbody").append(
                "<tr>" +
                    "<td>" + data[i].NrProtocoloAssociado + "</td>" +
                    "<td>" + data[i].NomeConsumidorAssociado + "</td>" +
                    "<td>" + data[i].DescricaoSituacaoAtendimentoAssociado + "</td>" +
                "</tr>"
            );
        });
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    ATENDIMENTOASSOCIADO.Init();
});


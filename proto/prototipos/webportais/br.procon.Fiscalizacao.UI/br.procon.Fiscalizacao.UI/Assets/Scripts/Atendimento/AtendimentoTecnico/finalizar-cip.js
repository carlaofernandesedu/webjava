var FINALIZARCIP = (function () {
    var moduleName = "FINALIZARCIP";

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAll();

        var $body = $("body");

        $(document).on({
            ajaxStart: function () { $body.addClass("loading"); },
            ajaxStop: function () { $body.removeClass("loading"); }
        });
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindFinalizarCip();
        bindFinalizarReclamacao();
        bindbtnGoBack();
        obterUrlNavegacao();

    }      

    function bindbtnGoBack(){
        $('#btnGoBack').off('click');
        $('#btnGoBack').on('click', function () {

            if(window.document.referrer.indexOf('pesquisa') > -1){  
                $(this).attr('href',  $(this).attr('href') + '&urlref=pesquisa');
            }

        });

    }

    function obterUrlNavegacao() {       

        if(window.document.referrer.indexOf('pesquisa') > -1){        
            window.history.pushState('page2', 'Title', window.location + '?urlref=pesquisa');
        }

    }

    function bindFinalizarCip() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#finalizarCip").off("click");
        $("#finalizarCip").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            localStorage.removeItem('form_cip');

            $("#finalizarCip").prop("disabled", true);           

            var idFichaAtendimento = $("#IdFichaAtendimento").val(),
                idTipoEnvio = $("#tipoEnvio").val(),
                idReclamado = $("#IdReclamado").val(),
                dsReclamacao = $("#DescricaoReclamacao").val(),
                dataPrazoConsumidor = $("#PrazoConsumidor").val(),
                dataPrazoFornecedor = $("#PrazoFornecedor").val(),
                dsCorpoTexto = $("#previaProtocolo").html()
                                    + $("#previaDataGeracao").html()
                                    + $("#previaFornecedor").html()
                                    + $("#previaConsumidor").html()
                                    + $("#previaCorpoTexto").html();
            $.ajax({
                url: "/Cip/SalvarCip",
                data: { idFicha: idFichaAtendimento, idReclamado: idReclamado, descricao: dsCorpoTexto, tipoEnvio: idTipoEnvio, dataPrazoConsumidor: dataPrazoConsumidor, dataPrazoFornecedor: dataPrazoFornecedor },
                type: "Post",
                dataType: "json",
                beforeSend: function () {
                    $("#finalizarCip").prop("disabled", true);
                    $("btnGoBack").prop("disabled", true);
                },
                success: function (response) {
                    if (response.Sucesso) {
                        var origem = response.Resultado.Origem;

                        if (response.Resultado.IdDocumento !== undefined)
                            window.open("/Cip/ExibiRelatorioCip?idRelatorio=" + response.Resultado.IdDocumento, "_blank");

                        callbackFinalizaCip(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, dataPrazoConsumidor, dataPrazoFornecedor, origem);
                    }
                    else {
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta, response.TituloMensagem);
                        return false;
                    }
                    return false;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem(textStatus, TipoMensagem.Error);
                    $("#finalizarCip").prop("disabled", false);
                },
                complete: function () {
                    $("#finalizarCip").prop("disabled", false);
                    $("btnGoBack").prop("disabled", false);
                }
            });
        });
    }

    function callbackFinalizaCip(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, prazoConsumidor, prazoFornecedor, origem) {
        BASE.LogFunction(arguments.callee, moduleName);

        var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

        urlRedirect = urlRedirect !== null && urlRedirect !== "" && urlRedirect !== undefined ? urlRedirect : "/PesquisarAtendimento";

        if (origem === 3) {
            window.location = urlRedirect;
        }
        else {
            ATENDIMENTOBASE.Acao.Declaracao.ExibirModalSalvarDeclaracao(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, prazoConsumidor, prazoFornecedor, urlRedirect, null, null, null);
           
        }
    }

    function finalizarCipParaDeclaracao() {
        BASE.LogFunction(arguments.callee, moduleName);

        var idFichaAtendimento = $("#IdFichaAtendimento").val();
        var idTipoEnvio = $("input[name=enviocarta]:checked").val();
        var idReclamado = $("#IdReclamado").val();
        var dsReclamacao = $("#DescricaoConsulta").val();
        var prazoConsumidor = $("#PrazoConsumidor").val();
        var prazoFornecedor = $("#PrazoFornecedor").val();
        var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

        $.ajax({
            url: "/Cip/SalvarCipParaDeclaracao",
            data: {
                idFicha: idFichaAtendimento, tipoEnvio: idTipoEnvio, idReclamado: idReclamado, descricao: dsReclamacao, prazoConsumidor: prazoConsumidor, prazoFornecedor: prazoFornecedor
            },
            type: "Post",
            dataType: "json",
            success: function (response) {
                if (response.Sucesso) {
                    ATENDIMENTOBASE.Acao.Declaracao.ExibirModalSalvarDeclaracao(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, prazoConsumidor, prazoFornecedor, urlRedirect, null, null, null);
                 
                    if (response.Resultado.IdDocumento !== undefined) {
                        window.open("/Cip/ExibiRelatorioCip?idRelatorio=" + response.Resultado.IdDocumento, "_blank");
                    }
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.MostrarMensagem(textStatus, TipoMensagem.error);
            }
        });

        return false;
    }

    function bindFinalizarReclamacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#finalizarReclamacao").off("click");
        $("#finalizarReclamacao").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            localStorage.removeItem('form_cip');

            $("#finalizarReclamacao").addClass("disabled");
            $("#finalizarReclamacao").click(function () { return false; });

            var idFicha = $("#IdFichaAtendimento").val(),
                idReclamado = $("#IdReclamado").val(),
                descricaoReclamado = $("#DescricaoReclamacao").val();

            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

            $.ajax({
                url: "/Reclamacao/SalvarReclamacao",
                data: { idFicha: idFicha, idReclamado: idReclamado, descricao: descricaoReclamado },
                type: "POST",
                dataType: "json",
                success: function (response) {
                    if (response.Valido) {
                        BASE.Modal.ExibirModalConfirmacao("Voltar para a ficha", "Deseja voltar para a ficha de atendimento?", TamanhoModal.Pequeno, "Não", "btn-primary", "Sim", "btn-danger", function () {
                            // callback sim
                            window.location = "/PesquisarAtendimento/Detalhe?idFicha=" + idFicha;

                        }, function () {
                            // callback não
                            if (urlRedirect == null || urlRedirect == undefined) {
                                urlRedirect = "/AtendimentoTecnico/AtendimentoSolicitacoes/";
                            }

                            window.location = urlRedirect;

                        });

                        if (response.IdDocumento !== undefined) {
                            window.open("/Cip/ExibiRelatorioCip?idRelatorio=" + response.IdDocumento, "_blank");
                        }
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem(jQuery.parseJSON(xmlHttpRequest.responseText).Mensagem, TipoMensagem.error);
                    console.log("erro !");
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        });
    }  


    return {
        Init: init,
        FinalizarCipParaDeclaracao: finalizarCipParaDeclaracao,
        FinalizarDeclaracao: finalizarCipParaDeclaracao
    };
}());

$(function () {
    FINALIZARCIP.Init();
});
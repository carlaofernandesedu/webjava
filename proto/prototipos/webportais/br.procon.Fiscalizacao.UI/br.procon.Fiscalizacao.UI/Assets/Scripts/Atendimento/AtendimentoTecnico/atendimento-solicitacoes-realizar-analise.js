var TipoAtendimento = {
    Consulta: 1,
    Atendimento: 2,
    ConsultaSimples: 3,
    AtendimentoCIP: 4,
    AberturaDireita: 5,
    Reclamacao: 6,
    AtendimentoTelefonico: 7,
    AtendimentoPessoal: 8,
    AtendimentoPreliminar: 9,
    AtendimentoSazonal: 10,
    AtendimentoExtraProcon: 11,
    AtendimentoFiscalizacao: 12
};

var REALIZARANALISE = (function () {
    var moduleName = "REALIZARANALISE";
    var divComponente = "#componente-tipo-entrega #lista-tipo-entrega";

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAll();
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#label-classificacao").text("Reclassificar: ");
        //verificarErroReclassificacao();
        bindBuscarClassificacao();
        reclassificar();
        bindEnviarSupervisor();
        bindEnviarConsumidor();
        liberarAtendimento();
        identificarTipoInteracao();
        encerrarConsulta();
        bindComboTipoAtendimentoCip();
        bindBtnbtnConverter();
        selecionarTipoAtendimento();
        bindGerarRespostaFornecedor();
        bindGerarReclamacao();
        atendimentoDuplicidadeFornecedor();
        $("#iteracao #btnEnviar").css("pointer-events", "none");
        $("#encerrarConsulta").attr("disabled", "disabled");
        desabilitaLiberar();
        bindOrgoEntraProcn();
        bindAlterarSituacao();
        bindIncluirRespostaPadrao();
        bindConvertConsultaAtendimento();
        bindChangeoutroTipodeOrgao();
        bindIdTipoAtendimento();
        verificarFornecedorConfirmado();
        verificarDuplicidade();
        bindEmitirDocumento();
        bindEditarAquisicao();

        bindBtnalterarClassificacao();
        bindbtnVoltar();

        bindConfirmarFornecedor();

        bindbtnVoltarEdicaoFicha();

        bindbtnsalvarReclamacao();
        bindChangePedido();

        $("#componente-tipo-entrega").hide();
        $('#DataCompraContratacao').addClass('data');
        $('#DataOs').addClass('data');
        $('#DataComplementarCompra').addClass('data');
        $('#ValorCompra').addClass('real');

        $('#btnGerarCip').hide();
        $('#btnGerarReclamacao').hide();
        $('#btnGerarEncaminhamento').hide();   

        carregaPreviaDocumento();    
    }

    function carregaPreviaDocumento(){

        var form  = '#form_filtro';
        var data = localStorage.getItem('form_cip');

        if(data != null && data != undefined){

            data = JSON.parse(data);            
            $(' .Editor-editor').html(data.Resposta);

        }

    }

    function bindbtnVoltarEdicaoFicha() {
        $('#btnVoltarEdicaoFicha').off('click');
        $('#btnVoltarEdicaoFicha').on('click', function () {
            var idFicha = $("#IdFichaAtendimento").val();
            var tipoDeAtendimento = $("#TipoAtendimento").val();
            var idConsumidor = $("#IdConsumidor").val();
            var idFornecedor = $("#IdFornecedor").val();
            var documento = 'gerado';

            if (getUrlParameter('urlref') == "pesquisa") {
                window.location = '/PesquisarAtendimento/EditarAtendimento?idFicha=' + idFicha;
            }
            else {
                window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=' + tipoDeAtendimento + '&idFicha=' + idFicha + '&etapa=ficha_edicao';
            }
        });
    }

    function bindbtnsalvarReclamacao() {
        $('#salvarReclamacao').off('click');
        $('#salvarReclamacao').on('click', function () {          

            var data = $('#frm-filtro').serializeObject();   

            data.Resposta = $(' .Editor-editor').html();       

            var model = JSON.stringify(data);

            localStorage.setItem('form_cip', model);
            
            if (getUrlParameter('urlref') == "pesquisa") {
                window.history.pushState('page2', 'Title', $('#frm-filtro').attr('action') + '/ref/pesquisa');
            }
        });
    }

    function bindConfirmarFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#aguardandoConfirmacao").off("click");
        $("#aguardandoConfirmacao").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            $.ajax({
                url: "/AtendimentoTecnico/ConfirmarFornecedor",
                data: { idFicha: $("#IdFichaAtendimento").val(), idReclamado: $("#IdReclamado").val() },
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        $("#ConfirmadoTecnico").val("True");
                    }
                    verificarFornecedorConfirmado();
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitação.", TipoMensagem.Error);
                }
            });
        });
    }

    function bindBtnalterarClassificacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

        $("#alterarClassificacao").off("click");
        $("#alterarClassificacao").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            if ($("#hdClassificacaoAnterior").val() > 0 && $("#IdClassificacao").val() == '') {
                $("#IdClassificacao").val($("#hdClassificacaoAnterior").val());
            }
            if ($("#IdClassificacao").val() > 0) {
                if ($("#hdClassificacaoAnterior").val() === $("#IdClassificacao").val()) {
                    BASE.MostrarMensagem("Classificação não existe ou não foi alterada.", TipoMensagem.Error, "Aviso");
                    return false;
                }
                window.location = "/AtendimentoTecnico/Reclassificar?idficha=" + $("#IdFichaAtendimento").val() + "&" + "idClassificacao=" + $("#IdClassificacao").val();
            }
            else {
                BASE.MostrarMensagem("Favor Preenche a Classificação.", TipoMensagem.Alerta, "Aviso");
            }
        });
    }

    function bindEditarAquisicao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $(' button[data-original-title*="Editar Dados da Compra/Contratação"]').off('click');
        $(' button[data-original-title*="Editar Dados da Compra/Contratação"]').on('click', function (e) {
            BASE.LogEvent(e, moduleName);

            var ddl = $("#ddlTipoPedidoConsumidor");
            var hdn = $("#hdnIdTipoPedidoConsumidor");

            var callBackCarregaPedidoConsumidor = function () {
                carregaDescricaoPedido();
                bindTipoPedidoConsumidorChange();

            };
            
            ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor($('#IdClassificacao').val(), callBackCarregaPedidoConsumidor, ddl, hdn);

            var callBackCarregaMeioAquisicao = function () {
                var aquisicao = $('#hdnIdMeioAquisicao').val();
                $('#IdMeioAquisicao').val(aquisicao);

                var descricaoPagamento = $('#hdnDescricaoFormaPagamento').val();

                var pagamento = $("#IdFormaPagamento option:contains('" + descricaoPagamento + "')").val();
                $('#IdFormaPagamento').val(pagamento);

                bindMeioAquisicaoChange();
            };

            ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao($("#IdClassificacao").val(), callBackCarregaMeioAquisicao);
        });
    }

    function bindMeioAquisicaoChange() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#ddlMeioAquisicao").off('change');
        $("#ddlMeioAquisicao").on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            $("#IdMeioAquisicao").val($(this).val());
            
        });
    }

    function bindTipoPedidoConsumidorChange() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#ddlTipoPedidoConsumidor").off('change');
        $("#ddlTipoPedidoConsumidor").on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            $("#IdTipoPedidoConsumidor").val($(this).val());

            var abatimento = $("#ddlTipoPedidoConsumidor option:contains('abatimento'):selected").length > 0;
            var cancelamento = $("#ddlTipoPedidoConsumidor option:contains('cancelamento'):selected").length > 0;
            var outros = $("#ddlTipoPedidoConsumidor option:contains('outros'):selected").length > 0;
            var banco = $('#Banco').val();
            var agencia = $('#Agencia').val();
            var conta = $('#Conta').val();

            var exibir = abatimento || cancelamento;

            if (exibir) {
                $("#divPedidoAbatimentoOuCancelamento").toggle(exibir);

                $('#divBanco #Banco').val(banco);
                $('#divAgencia #Agencia').val(agencia);
                $('#divConta #Conta').val(conta);
            }
            else {
                $("#divPedidoAbatimentoOuCancelamento").toggle(false);

                $('#divBanco #Banco').val('');
                $('#divAgencia #Agencia').val('');
                $('#divConta #Conta').val('');
            }

            $("#divOutroPedido").toggle(outros);

            if(!outros){
                $('#OutroPedido').val('');
                
            }
            
        });
    }

    function bindEmitirDocumento() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#emitirDocumento", "#divModalDeclaracao").off('click');
        $("#emitirDocumento", "#divModalDeclaracao").on('click', function (e) {
            BASE.LogEvent(e, moduleName);

            editarCip();
            return false;
        });
    }

    function bindChangePedido() {
        console.log('bindChangePedido');

        $("body").off("change", "#ddlTipoPedidoConsumidor");
        $("body").on("change", "#ddlTipoPedidoConsumidor", function () {
            console.log('bindChangePedido - change');

            $("#IdTipoPedidoConsumidor").val($(this).val());

            var abatimento = $("#ddlTipoPedidoConsumidor option:contains('abatimento'):selected").length > 0;
            var cancelamento = $("#ddlTipoPedidoConsumidor option:contains('cancelamento'):selected").length > 0;
            var outros = $("#ddlTipoPedidoConsumidor option:contains('outros'):selected").length > 0;
            var banco = $('#Banco').val();
            var agencia = $('#Agencia').val();
            var conta = $('#Conta').val();

            var exibir = abatimento || cancelamento;

            if (exibir) {
                $("#divPedidoAbatimentoOuCancelamento").toggle(exibir);

                $('#divBanco #Banco').val(banco);
                $('#divAgencia #Agencia').val(agencia);
                $('#divConta #Conta').val(conta);
            }
            else {
                $("#divPedidoAbatimentoOuCancelamento").toggle(false);

                $('#divBanco #Banco').val('');
                $('#divAgencia #Agencia').val('');
                $('#divConta #Conta').val('');
            }

            $("#divOutroPedido").toggle(outros);
        });
    }

    function carregaDescricaoPedido() {
        var tipoPedido = $('#hdnIdTipoPedidoConsumidor').val(),
            descricaoPedido = $('#DescricaoPedido').val(),
            banco = $('#Banco').val(),
            agencia = $('#Agencia').val(),
            conta = $('#Conta').val();

        if (tipoPedido == "" || tipoPedido == undefined) {
            return;
        }

        if ($("#ddlTipoPedidoConsumidor option[value='" + tipoPedido + "']").length > 0) {
            $('#ddlTipoPedidoConsumidor').val(tipoPedido);
        }
        else {
            if (tipoPedido == "39" && descricaoPedido != undefined && descricaoPedido != "") {
                $('#ddlTipoPedidoConsumidor').val("39"); // OUTROS
                $('#OutroPedido').val(descricaoPedido);
            }
            else {
                $('#ddlTipoPedidoConsumidor').val("");
            }
        }

        var abatimento = $("#ddlTipoPedidoConsumidor option:contains('abatimento'):selected").length > 0;
        var cancelamento = $("#ddlTipoPedidoConsumidor option:contains('cancelamento'):selected").length > 0;
        var outros = $("#ddlTipoPedidoConsumidor option:contains('outros'):selected").length > 0;
        var banco = $('#Banco').val();
        var agencia = $('#Agencia').val();
        var conta = $('#Conta').val();

        var exibir = abatimento || cancelamento;
        var exibirOutroPedido = outros;

        if (abatimento) {
            tipoPedido = $("#ddlTipoPedidoConsumidor option:contains('abatimento')").val();
        }

        if (cancelamento) {
            tipoPedido = $("#ddlTipoPedidoConsumidor option:contains('cancelamento')").val();
        }

        if (descricaoPedido != "") {
            $("#divPedidoAbatimentoOuCancelamento").toggle(exibir);
            $("#divOutroPedido").toggle(exibirOutroPedido);
        }
        else {
            $("#divPedidoAbatimentoOuCancelamento").toggle(false);
            $("#divOutroPedido").toggle(false);
        }

        $('#ddlTipoPedidoConsumidor').val(tipoPedido);

        if (exibir) {
            $('#divBanco #Banco').val(banco);
            $('#divAgencia #Agencia').val(agencia);
            $('#divConta #Conta').val(conta);
        }
        else {
            $('#divBanco #Banco').val('');
            $('#divAgencia #Agencia').val('');
            $('#divConta #Conta').val('');
        }

        if (outros) {
            $('#OutroPedido').val(descricaoPedido);
        }
        else {
            $('#OutroPedido').val('');
        }

        $("#divOutroPedido").toggle(outros);
    }

    function verificarFornecedorConfirmado() {
        BASE.LogFunction(arguments.callee, moduleName);
        
        var confirmado = $("#ConfirmadoTecnico").val() === "True";      

        switch (confirmado) {
            case true:
                $("#confirmadoTecnico").show();
                $("#aguardandoConfirmacao").hide();
                $("#IdTipoAtendimentoCip").prop("disabled", false);
                $('#IdTipoAtendimentoCip').removeAttr('readonly');
                $("#btnConverter").prop("disabled", false);
                break;
            case false:
                $("#aguardandoConfirmacao").show();
                $("#confirmadoTecnico").hide();
                $("#IdTipoAtendimentoCip").prop("disabled", true);
                $("#IdTipoAtendimentoCip").prop("readOnly", true);
                $("#btnConverter").prop("disabled", true);
                break;
        }
    }

    function bindIdTipoAtendimento() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#IdTipoAtendimentoCip").on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            selecionarTipoAtendimento($(this));
        });
    }

    function bindGerarRespostaFornecedor() {
        $("#btnGerarRespostaFornecedor").off("click");
        $("#btnGerarRespostaFornecedor").on("click", function () {
            var idFichaAtendimento = $(this).data("id-ficha-atendimento");
            var win = window.open("/AtendimentoTecnico/PreVisualizarRespostaFornecedor?idFichaAtendimento=" + idFichaAtendimento, "_blank");
        });
    }

    function bindAlterarSituacao() {
        if (typeof ATENDIMENTO_SITUACAO !== 'undefined') {
            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

            new ATENDIMENTO_SITUACAO().Init(
                $('#IdFichaAtendimento').val(),//Id
                "Alterar Situação do Atendimento",//Titulo
                "Motivo...",//Placeholder
                [
                    { "id_situacao_atendimento": 6, ds_situacao_atendimento: "Aguardando resposta do Consumidor" },
                    { "id_situacao_atendimento": 8, ds_situacao_atendimento: "Retorno atendimento pelo Consumidor" },
                    { "id_situacao_atendimento": 9, ds_situacao_atendimento: "Baixado" }
                ], //Situacao
                "#btn-retornar-pelo-consumidor",//botao
                "Alterar", //Botao confirmar
                function () {
                    window.location = urlRedirect;
                }
           );
        }
    };

    function bindIncluirRespostaPadrao() {
        var tipoAtendimento = $('#idTipoAtendimento').val();

        if (tipoAtendimento == undefined) {
            tipoAtendimento = $('#TipoAtendimento').val();
        }

        if (tipoAtendimento == "1") {
            PESQUISAR_MENSAGENS.Init(
                "Pesquisar em Resposta Padrão",
                "#modal-resposta-padrao",
                "#Resposta",
                "button#incluir-resposta-padrao",
                ""
             );
        }
        else {
            PESQUISAR_MENSAGENS.Init(
                "Pesquisar em Texto Padrão",
                "#modal-resposta-padrao",
                "#Resposta",
                "button#incluir-resposta-padrao",
                ""
             );
        }
    };

    function desabilitaLiberar() {
        var idReclamado = $("#IdReclamado").val();

        if (idReclamado !== undefined) {
            $.ajax({
                url: "/AtendimentoTecnico/ValidaDocumentoProduzido/",
                data: { idReclamado: idReclamado },
                type: "Post",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        $("#IdTipoAtendimentoCip").prop("disabled", false);
                        //$("#IdTipoAtendimentoCip").val(4);
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                    console.log("erro !");
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    }

    function bindBuscarClassificacao() {
        $("#txtClassificacao").off('blur');
        $("#txtClassificacao").on('blur', function () {
            if ($('#IdClassificacao').val() === '') {
                $("#txtClassificacao").val('');
            }
        });

        $("#txtClassificacao").off('keyup');
        $("#txtClassificacao").on('keyup', function (e) {
            if ($(this).val() === '' || e.keyCode === 8) {
                $('#IdClassificacao').val('');
            }
        });

        $("#txtClassificacao").typeahead({
            onSelect: function (item) {
                $('#IdClassificacao').val(item.value);
            },
            ajax: {
                url: '/Classificacao/BuscarClassificacaoAutoComplete/',
                triggerLength: 4,
                dataType: "json",
                displayField: "Descricao",
                valueField: "Id",
                preDispatch: function (query) {
                    return {
                        query: query
                    };
                },
                preProcess: function (data) {
                    return data;
                }
            }
        });
    }

    function reclassificar() {
        $("#confirmarClassificacao").off('click');
        $("#confirmarClassificacao").on('click', function () {
            if ($('#hdClassificacaoAnterior').val() === $('#IdClassificacao').val()) {
                BASE.MostrarMensagem("Classificação não existe ou não foi alterada.", TipoMensagem.Error, "Aviso");
                return false;
            }

            if ($('#IdClassificacao').val()) {
                $.ajax({
                    url: '/AtendimentoTecnico/ReclassificarClassificacao/',
                    data: { idFicha: $('#IdFichaAtendimento').val(), idClassificacao: $('#IdClassificacao').val(), idTipoAtendimento: $('#idTipoAtendimento').val() },
                    type: 'Post',
                    dataType: "json",
                    success: function (data) {
                        if (data !== null) {
                            $('#descricaoClassificacao').find("span").html(data.DescricaoPaiCompleta);
                            //$('#selecionarClassificacao #classificacao-caminho').find("span").html('');
                            $('#hdClassificacaoAnterior').val($('#IdClassificacao').val());
                            BASE.MostrarMensagem("Solicitação efetuada com sucesso!", TipoMensagem.Sucesso);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                        console.log('erro !');
                        console.log(XMLHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        });
    }

    function bindEnviarSupervisor() {
        $("#enviarSupervisor").off('click');
        $("#enviarSupervisor").on('click', function () {
            var resposta = $('div[class*="Editor-editor"]').html();
            var idFichaAtendimento = $("#IdFichaAtendimento").val();
            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();
            var respostaPadraValida = validarPreenchimentoRespostaPadrao($('div[class*="Editor-editor"]'));

            if (!respostaPadraValida) return false;

            $.ajax({
                url: "/AtendimentoTecnico/EnviarSupervisor/",
                data: { idFicha: idFichaAtendimento, descricao: resposta },
                type: "Post",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        BASE.Modal.ExibirModalAlerta("Envio Supervisor!",
                            "Atendimento enviado ao supervisor com sucesso!<br>" +
                            "Estaremos redirecionando para fila de atendimento.",
                            "small", "OK",
                            "btn-primary",
                            function () {
                                window.location = urlRedirect;
                            });
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                    console.log("erro !");
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
            return false;
        });
    }

    function bindEnviarConsumidor() {
        $("#enviarConsumidor").off("click");
        $("#enviarConsumidor").on("click", function () {
            var resposta = $('div[class*="Editor-editor"]').html();
            var idFichaAtendimento = $("#IdFichaAtendimento").val();
            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();
            var respostaPadraoValida = validarPreenchimentoRespostaPadrao($('div[class*="Editor-editor"]'));          

            if(resposta == undefined){
                resposta = $('#Resposta[class*="Editor-editor"]').html();               

                if(resposta != undefined && resposta.trim() != ""){     
                    resposta = resposta.trim();                               
                    respostaPadraoValida = true;
                }
                
            }

            if (!respostaPadraoValida) return false;

            $.ajax({
                url: "/AtendimentoTecnico/EnviarConsumidor",
                type: "POST",
                data: { idFicha: idFichaAtendimento, descricao: resposta },
                success: function (data, textStatus, jqXhr) {
                    var isJson = BASE.Util.ResponseIsJson(jqXhr);

                    if (!isJson) {
                        BASE.Debug("Não é json", DebugAction.Info);
                    }
                    else {
                        if (data.Sucesso) {
                            window.location = urlRedirect;
                        }
                    }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    BASE.Debug("caiu no erro", DebugAction.Error);
                }
            });
            return false;
        });
    }

    function liberarAtendimento() {
        $("#confirmarLiberacao").off("click");
        $("#confirmarLiberacao").on("click", function () {
            liberar();
        });
    }

    function liberar() {
        var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

        if ($("#Motivo").val().trim()) {
            $.ajax({
                url: "/AtendimentoTecnico/LiberarAtendimento/",
                data: { idFicha: $("#IdFichaAtendimento").val(), motivo: $("#Motivo").val() },
                type: "Post",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        BASE.Modal.ExibirModalAlerta("Liberação de Atendimento!",
                            "Atendimento liberado com sucesso!<br>" +
                            "Estaremos redirecionando para fila de atendimento.",
                            "small", "OK",
                            "btn-primary",
                            function () {
                                window.location = urlRedirect;
                            });
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                    console.log("erro !");
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });

            $("#motivoLiberacao").modal("hide");
        } else {
            $("#Motivo").addClass('input-validation-error');
            $('span[data-valmsg-for="MotivoValidation"]').html("Informe o Motivo para liberação da consulta.");
            return false;
        }

        return true;
    }

    function identificarTipoInteracao() {
        $('input[name="tipoInteracao"]').change(function (e) {
            if ($(this).val() === 1) {
                $('#TipoInteracao').val('true');
            } else {
                $('#TipoInteracao').val('false');
            }
        });
    }

    function encerrarConsulta() {
        $("#encerrarConsulta").off("click");
        $("#encerrarConsulta").on("click", function () {
            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

            $.ajax({
                url: "/AtendimentoTecnico/EncerrarAtendimento/",
                data: { idFicha: $("#IdFichaAtendimento").val() },
                type: "Post",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        BASE.Modal.ExibirModalAlerta("Atendimento Encerrado!",
                            "Atendimento encerrado com sucesso!<br>" +
                            "Estaremos redirecionando para fila de atendimento.",
                            "small", "OK",
                            "btn-primary",
                            function () {
                                window.location = urlRedirect;
                            });
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                    console.log("erro !");
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        });
    }

    function verificarDuplicidade() {
        var idUsuarioInternet = $("#IdUsuarioInternet").val(),
            idConsumidor = $("#IdConsumidor").val(),
            idFornecedor = $("#IdFornecedor").val(),
            idFicha = $('#IdFichaAtendimento').val();

        if (idFornecedor === 0 || idFornecedor === undefined || idFornecedor === "") return;

        $.ajax({
            url: "/AtendimentoTecnico/PesquisarAtendimentosDuplicados",
            data: { usuarioInternet: idUsuarioInternet, idFornecedor: idFornecedor, idConsumidor: idConsumidor, idFichaAtendimento: idFicha },
            type: "POST",
            dataType: "json",
            success: function (response) {
                verificarAtendimentoDuplicadoConsumidor(response.ContagemMesmoFornecedor);
                verificarAtendimentoDuplicadoFornecedor(response.ContagemMesmoFornecedor);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                console.log("erro !");
                console.log(xmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    function pesquisarFonecedorDuplicado() {
        var idUsuarioInternet = $("#IdUsuarioInternet").val(),
            idFornecedor = $("#IdFornecedor").val(),
            idConsumidor = $("#IdConsumidor").val(),
            idFicha = $('#IdFichaAtendimento').val();

        if (idFornecedor === undefined || idFornecedor === null || idFornecedor === "") return;

        $.ajax({
            url: "/AtendimentoTecnico/PesquisarFornecedorDuplicado",
            data: { idFornecedor: idFornecedor, idConsumidor: idConsumidor, idFichaAtendimento: idFicha },
            type: "Post",
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("#verificar-duplicidadeFornecedor").show();
                    $("#duplicidadeSolicitacao").modal();
                }
                else {
                    $("#verificar-duplicidadeFornecedor").hide();
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.err;
                console.log("erro !");
                console.log(xmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    function verificarAtendimentoDuplicadoConsumidor(count) {
        if (count > 0) {
            $("#verificar-duplicidade").show();
            $("#verificar-duplicidadeConsulta").show();
        } else {
            $("#verificar-duplicidade").hide();
            $("#verificar-duplicidadeConsulta").hide();
        }
    }

    function verificarAtendimentoDuplicadoFornecedor(count) {
        if (count > 0) {
            $("#verificar-duplicidadeFornecedor").show();
            $("#duplicidadeSolicitacao").modal();
        }
        else {
            $("#verificar-duplicidadeFornecedor").hide();
        }
    }

    function atendimentoDuplicidadeFornecedor() {
        $("#verificar-duplicidadeFornecedor").off('click');
        $("#verificar-duplicidadeFornecedor").on('click', function () {
            var idConsumidor = $("#IdConsumidor").val(),
                 idFornecedor = $("#IdFornecedor").val();

            if (idConsumidor !== undefined && idFornecedor !== undefined) {
                window.location = "/AtendimentoTecnico/AtendimentoSolicitacoesDuplicidade?idConsumidor=" + idConsumidor + "&" + "idFornecedor=" + idFornecedor;
            }
        });
    }

    function bindComboTipoAtendimentoCip() {
        var atendimentoRemove = $("#atendimentoTecnico").val();
        var idFichaAtendimento = $("#IdFichaAtendimento").val();

        if (atendimentoRemove === undefined) return;

        $.ajax({
            url: "/Cip/ObterTipoAtendimentoCip/",
            type: "GET",
            dataType: "json",
            data: { AtendimentoTecnico: atendimentoRemove, idFicha: idFichaAtendimento },
            success: function (data) {
                if (data.listaTipoAtendimento.length > 0) {
                    $("#IdTipoAtendimentoCip").empty();
                    $("#IdTipoAtendimentoCip").append("<option value=" + "" + ">" + "Selecione" + "</option>");

                    $(data.listaTipoAtendimento).each(function (i) {
                        $("#IdTipoAtendimentoCip").append("<option value=" + data.listaTipoAtendimento[i].Value + ">" + data.listaTipoAtendimento[i].Text + "</option>");
                    });

                    verificarFornecedorConfirmado();
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.Mensagem.Mostrar("Erro ao enviar solicitacao.", TipoMensagem.Error, "Aviso");
                console.log(xmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    function selecionarTipoAtendimento(ddl) {
        BASE.LogFunction(arguments.callee, moduleName);     

        var hdnTipoAtendimentoCip = $('#hdnIdTipoAtendimentoCip');
        var ddlTipoAtendimentoCip = $('#IdTipoAtendimentoCip');

        var tipoAtendimento = $('#TipoAtendimento').val();
      
        if (ddl != undefined && ddl.val() != "0" && ddl.val() != "") {          

            hdnTipoAtendimentoCip.val(ddl.val());
            ddlTipoAtendimentoCip.prop("disabled", false);

            $('#btnConverter').prop("disabled", false);
            $('#btnConverter').show();
            $('#btnGerarCip').hide();
            $('#btnGerarReclamacao').hide();
            $('#btnGerarEncaminhamento').hide();


        } else {

            $('#btnConverter').hide();
            $('#btnGerarCip').hide();
                
            //ddlTipoAtendimentoCip.val(tipoAtendimento);            
        }
    }

    function bindBtnbtnConverter() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btnConverter").off("click");
        $("#btnConverter").on("click", function (e) {
            BASE.LogEvent(e, moduleName);
            var idTipoAtendimento = $("#IdTipoAtendimentoCip").val(),
                idFicha = $("#IdFichaAtendimento").val();

            if (idTipoAtendimento === "" || idTipoAtendimento === undefined || idTipoAtendimento === null) return false;

            $(this).prop("disabled", true);
            converterTipoAtendimento(idFicha, idTipoAtendimento);
            return false;
        });
    }

    function converterTipoAtendimento(idFicha, idTipoAtendimento) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/Cip/ConverterTipoAtendimento/",
            data: { idFicha: idFicha, idTipoAtendimento: idTipoAtendimento },
            type: "GET",
            dataType: "json",
            success: function (data) {
                obterParametrosTipoEntrega($("#IdFichaAtendimento").val());

                switch (data) {
                    case 1: //SOLICITACAO DE CONSULTA
                        var descricaoReclamacao = $("#texto-reclamacao").text();
                        retornoAtendimentoSolicitacaoConsulta(idFicha, 2, descricaoReclamacao, alterarReclamacaoFichaAtendimento);
                        break;

                    case 4: //ATENDIMENTO CIP
                        retornoAtendimentoCip();
                        break;

                    case 5: //ABERTURA DIRETA RECLAMACAO
                    case 6: //RECLAMACAO
                        retornoAtendimentoReclamacao();
                        break;

                    case 12: //ENCAMINHAMENTO A FISCALIZACAO
                        retornoAtendimentoFiscalizacao();
                        break;
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.MostrarMensagem(jQuery.parseJSON(xmlHttpRequest.responseText).Mensagem, TipoMensagem.error);
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                
            }
        });
    }

    function validaCipGerada() {
        BASE.LogFunction(arguments.callee, moduleName);

        var idFichaAtedimento = $("#IdFichaAtendimento").val();
        obterParametrosTipoEntrega(idFichaAtedimento, exibirModalDeclaracao);
    }

    function exibirModalDeclaracao() {
        $("#divModalDeclaracao").modal("show");
    }

    function editarCip() {
        BASE.LogFunction(arguments.callee, moduleName);

        verificacaoReclamacaoExistente(1, function (valido) {
            var idTipoAtendimento = $('#IdTipoAtendimentoCip').val();

            if (valido) {
                $("#btnDeclaracao", "#divAtendimentoReclamacao").prop("disabled", true);

                if (idTipoAtendimento === "4") {
                    window.location = "/Cip/EditarCip?idFicha=" + $("#IdFichaAtendimento").val() + "&tipoEnvio=" + $("input[name=IdTipoAtendimentoEnvioCIP]:checked").val() + '&urlref=pesquisa';
                }
                else if (idTipoAtendimento === "6") {
                    window.location = "/Reclamacao/CriarReclamacao?idFicha=" + $('#IdFichaAtendimento').val() + "&incluirDocumentoProduzido=True&urlref=pesquisa";
                }
            }
            else {
                BASE.MostrarMensagem("Documento já existente para esse Fornecedor!", TipoMensagem.Alerta);
                $("#btnDeclaracao", "#divAtendimentoReclamacao").prop("disabled", false);
            }
        });
    }

    function obterParametrosTipoEntrega(idFichaAtendimento, callback) {
        $("#componente-tipo-entrega").hide();

        if (idFichaAtendimento > 0) {
            $.ajax({
                url: "/Cip/DefinirTipoDeEntrega",
                type: "GET",
                cache: false,
                data: { idFichaAtendimento: idFichaAtendimento },
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        if (response.length > 0) {
                            percorrerListaTipoAlerta(response);
                        }
                    }

                    if (callback !== undefined)
                        callback();
                },
                error: function (response, status, xhr) {
                    console.log("erro ao criar lista");
                }
            });
        }
        else {
            console.log("erro ao gerar parametros de tipo de entrega");
        }
    }

    function percorrerListaTipoAlerta(listaTipoEntrega) {
        $(divComponente).empty();
        $.each(listaTipoEntrega, function (key, item) {
            criarOptionsTipoAlerta(item.Value, item.Text, item.Selected);
        });
    }

    function criarOptionsTipoAlerta(value, titulo, selected) {
        var label = $("<label class='list-group-item' />");
        var radioBtn = $("<input />", { type: "radio", name: "IdTipoAtendimentoEnvioCIP", value: value, checked: selected });

        radioBtn.appendTo(label);
        radioBtn.after(" ".concat(titulo));
        label.appendTo(divComponente);
    }

    function bindGerarReclamacao() {
        $("#btnGerarReclamacao").off("click");
        $("#btnGerarReclamacao").on("click", function () {
            $("#btnGerarReclamacao").prop("disabled", true);

            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

            var idFicha = $("#IdFichaAtendimento").val();

            verificacaoReclamacaoExistente(2, function (valido) {
                if (valido) {
                    window.location = "/Reclamacao/CriarReclamacao?idFicha=" + idFicha + '&urlref=pesquisa';
                }
                else {
                    BASE.MostrarMensagem("Reclamação Já Existente para esse Fornecedor!", TipoMensagem.Alerta);
                    $("#btnGerarReclamacao").prop("disabled", false);
                }
            });
        });
    }

    function verificacaoReclamacaoExistente(idTipo, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        var idReclamado = $("#IdReclamado").val(),
            idDocumento = $("#IdDocumento").val(),
            idFicha = $("#IdFichaAtendimento").val(),
            idFornecedor = $("#IdFornecedor").val();

        $.ajax({
            url: "/Reclamacao/VerificarDuplicidadeReclamacao/",
            data: { idReclamado: idReclamado, idDocumento: idDocumento, IdFicha: idFicha, idFonercecedor: idFornecedor, idTipo: idTipo },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (callback !== undefined)
                    callback(data.Valido);
            }
        });
    }

    function bindChangeoutroTipodeOrgao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#OrgamEncaminhado").off('change');
        $("#OrgamEncaminhado").on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            var orgao = $('#OrgamEncaminhado').val();
            if (orgao === '18') {
                $("#divOutroTipodeOrgao").toggle(true);
            }
        });
    }

    function bindOrgoEntraProcn() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btn-Orgao").off('click');
        $("#btn-Orgao").on('click', function (e) {
            BASE.LogEvent(e, moduleName);

            var resposta = $('div[class*="Editor-editor"]').html();
            var respostaPadraoValida = validarPreenchimentoRespostaPadrao($('div[class*="Editor-editor"]'));
            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();
            var nomeOrgao;

            if(resposta == undefined){
                resposta = $('#Resposta[class*="Editor-editor"]').html();               

                if(resposta != undefined && resposta.trim() != ""){     
                    resposta = resposta.trim();                               
                    respostaPadraoValida = true;
                }
                
            }

            if (!respostaPadraoValida) return;

            if (resposta == undefined) resposta = $('span[class*="Editor-editor"]').html();

            if ($("#OrgamEncaminhado").val() !== undefined && $("#OrgamEncaminhado").val() > 0) {
                nomeOrgao = $("#OrgamEncaminhado option:selected").text();

                if ($("#outroTipodeOrgao").val() !== undefined && $("#outroTipodeOrgao").val() !== "") {
                    nomeOrgao = $("#outroTipodeOrgao").val();
                }

                $.ajax({
                    url: "/AtendimentoTecnico/EnviarAtendimentoExtraProcon/",
                    data: { idFichaAtendimento: $("#IdFichaAtendimento").val(), idOrgao: $("#OrgamEncaminhado").val(), NomeOrgao: nomeOrgao, resposta: resposta },
                    type: "Post",
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            BASE.Modal.ExibirModalAlerta("Atendimento Extra Procon!",
                                "Atendimento finalizado com sucesso!",
                                "small", "OK",
                                "btn-primary",
                                function () {
                                    window.location = urlRedirect;
                                });
                        }
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem("Erro ao enviar solicitação.", TipoMensagem.Error);
                        console.log("erro !");
                        console.log(xmlHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
            else {
                BASE.MostrarMensagem("Favor escolher um orgão.", TipoMensagem.Alerta);
            }
        });
    }

    function retornoAtendimentoSolicitacaoConsulta(idFichaAtendimento, idSituacaoAtendimento, reclamacao, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        if (idFichaAtendimento === undefined) return;

        if (callback !== undefined) callback(idFichaAtendimento, idSituacaoAtendimento, reclamacao, function () {
            window.location = "/AtendimentoTecnico/EncaminharParaConsultaAtendimento?idFichaAtendimento=" + idFichaAtendimento + "&reclamacao=" + reclamacao;
        });
    }

    function alterarReclamacaoFichaAtendimento(idFicha, idSituacaoAtendimento, descricao, callback) {
        $.ajax({
            url: "/AtendimentoTecnico/AlterarReclamacaoFichaAtendimento",
            type: "POST",
            data: { idFichaAtendimento: idFicha, idSituacaoAtendimento: idSituacaoAtendimento, descricao: descricao },
            success: function (data) {
                if (callback !== undefined) callback();
            }
        });
    }

    function retornoAtendimentoCip() {
        validaCipGerada();
    }

    function retornoAtendimentoReclamacao() {
        exibirBtnGerarReclamacao();
        bindGerarReclamacao();
    }

    function retornoAtendimentoFiscalizacao() {
        exibirBtnGerarEncaminhamentoFiscalizacao();
        bindEncaminharParaFiscalizacao();
    }

    function exibirBtnGerarReclamacao() {
        $("#btnGerarReclamacao").show();
        $("#IdTipoAtendimentoCip").prop("disabled", true);
        $("#btnConverter").hide();
    }

    function exibirBtnGerarEncaminhamentoFiscalizacao() {
        $("#btnGerarEncaminhamento").show();
        $("#IdTipoAtendimentoCip").prop("disabled", true);
        $("#btnConverter").hide();
    }

    function bindEncaminharParaFiscalizacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btnGerarEncaminhamento").off("click");
        $("#btnGerarEncaminhamento").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var btn = $("#btnGerarEncaminhamento"),
                url = btn.data("url");

            btn.prop("disabled", true);
            window.location = url + '&urlref=pesquisa';
        });
    }

    function bindConvertConsultaAtendimento() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btn-converter-atendimento").off("click");
        $("#btn-converter-atendimento").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

            var resposta = $("#Resposta").val();          

            if(resposta == undefined || resposta == "<span id='span_mensagem_padrao'></span><br/>"){
                resposta = $(' .Editor-editor').html();               

                if(resposta != undefined && resposta.trim() != ""){     
                    resposta = resposta.trim(); 
                }
                
            }

            if (resposta.trim() == "" || resposta.trim() == "<span id='span_mensagem_padrao'></span><br/>") {
                BASE.MostrarMensagem("Campo Resposta Formal obrigatório.", TipoMensagem.Alerta);
                return;
            }

            $.ajax({
                url: "/AtendimentoTecnico/ConverterConsultaEmAtendimento/",
                data: { idFicha: $("#IdFichaAtendimento").val(), RespostaConsumido: resposta },
                type: "Post",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        BASE.Modal.ExibirModalAlerta("Atendimento Convertido!",
                            "Atendimento Convertido!<br>" +
                            "Estaremos redirecionando para fila de atendimento.",
                            "small", "OK",
                            "btn-primary",
                            function () {
                                window.location = urlRedirect;
                            });
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.MostrarMensagem("Erro ao Converter a Consulta em Atendimento", TipoMensagem.Error);
                }
            });
        });
    }

    function bindbtnVoltar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('button:contains("Voltar"), a:contains("Voltar")').off("click");
        $('button:contains("Voltar"), a:contains("Voltar")').on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

            if(urlRedirect.indexOf('filtro') > -1){
                urlRedirect = ATENDIMENTOBASE.Redirect.Obter().split('filtro=')[0].replace('?','');
            }

            window.location = urlRedirect;
        });
    };   

    function validarPreenchimentoRespostaPadrao(selector) {
        var respostaPadrao = selector.text();
        var valid;

        if (respostaPadrao === "" || respostaPadrao === undefined || respostaPadrao === null) {
            BASE.Mensagem.Mostrar("Informe o campo 'Resposta' antes de enviar a solicitação!", TipoMensagem.Alerta, "Atenção");
            valid = false;
        } else
            valid = true;

        return valid;
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') === 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb !== null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }

    return {
        Init: function () {
            init();
        },
        PosCarregar: function () { return false; }
    };
    

}());

$(function () {

    REALIZARANALISE.Init();

});

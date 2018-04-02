var ATENDIMENTO_CONSUMIDOR = (function () {
    var moduleName = "ATENDIMENTO_CONSUMIDOR";

    var clicked = false;

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);
        inicializaConsumidor();
        bindAll();

    }

    function bindAll() {        
        
        BASE.LogFunction(arguments.callee, moduleName);
        //Consumidor
        bindConsumidorProcura();
        bindConsumidorSeleciona();
        bindConsumidorEscrita();
        bindConsumidorContinuar();
        bindConsumidorSalvarEContinuar();
        bindVoltarParaConsumidorProcura();
        //bindValidaFormConsumidorEscrita();
        //Consumidor

        //Fornecedor
        bindFornecedorProcura();
        bindFornecedorSeleciona();
        bindFornecedorEscrita();
        bindFornecedorContinuar();
        bindFornecedorSalvarEContinuar();
        bindVoltarParaFornecedorProcura();
        bindProsseguirParaAtendimentoConsulta();
        //Fornecedor

        bindAtendimentoProcura();
        bindAtendimentoNovo();
        bindAtendimentoSelecionaPor();
        bindAtendimentoSeleciona();
        bindVoltarParaAtendimentoTipoAtendimento();

        selecionarClassificacao();

        bindDescricaoConsulta();
        bindDescricaoReclamacao();
        bindReclamacaoEncerra();
        bindChangePedido();
        bindDeclaracao();
        bindEmitirDocumento();
        bindVoltarParaAtendimentoTipoAtendimentoExtraProcon();
        bindDescricaoExtraProcon();
        bindProcurarFornecedor();

        bindTipoAtendimentoVoltar();
        definirUrlRetorno();
        navegacaoTelas(); 

    }

    function bindbtnVoltarEdicaoFicha() {
        $('#btnVoltarEdicaoFicha').off('click');
        $('#btnVoltarEdicaoFicha').on('click', function () {                  

            var idFicha = $("#IdFichaAtendimento").val();
            var tipoDeAtendimento = $("#TipoAtendimento").val();
            var idConsumidor = $("#IdConsumidor").val();
            var idFornecedor = $("#IdFornecedor").val();
            var documento = 'gerado';

            if(getUrlParameter('urlref') == "pesquisa"){
                window.location = '/PesquisarAtendimento/EditarAtendimento?idFicha=' + idFicha;

            }
            else{
                window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=' + tipoDeAtendimento + '&idFicha=' + idFicha + '&etapa=ficha_edicao';

            }

        });
    }

    function navegacaoTelas(){
        
        switch(getUrlParameter('etapa')){
            case "fornecedor_edicao":                

                var idConsumidor = getUrlParameter('idConsumidor');
           
                var idFornecedor = getUrlParameter('idFornecedor');

                var documento = getUrlParameter('doc');

                $('#IdConsumidor').val(idConsumidor);
                $('#IdFornecedor').val(idFornecedor);            

                var url = '/AtendimentoConsumidor/FornecedorSelecionaPor/' + idFornecedor;            

                $('#IdFornecedor').val(idFornecedor);            

                solicitarEdicao(url, idConsumidor, documento);

                pesquisarFonecedorDuplicado();

                $('#divFornecedorLeitura').show();


            break;

            case "consumidor_edicao":                
             
                var idConsumidor = getUrlParameter('idConsumidor');

                $('#IdConsumidor').val(idConsumidor);

                $.ajax({
                    url: '/AtendimentoConsumidor/ConsumidorSelecionaPor/' + idConsumidor,
                    success: function (response, status, xhr) {
                        $("#divConsumidorProcura").empty();
                        $("#divConsumidorEscrita").empty();
                        $("#divConsumidorLeitura").html(response);
                    },
                    error: function (xhr, text, error) {
                        BASE.MostrarMensagemErro(text);
                    },
                    complete: function () {
                        $("#divModalProcurar").modal("hide");
                    }
                });

            break;

            case "fornecedor_busca":               
            
                var idConsumidor = getUrlParameter('idConsumidor');

                $('#IdConsumidor').val(idConsumidor);            

                $.ajax({
                    url: '/AtendimentoConsumidor/ConsumidorContinuar',
                    data: {
                        id: idConsumidor
                    },
                    success: function (response, status, xhr) {
                        $("#divConsumidorProcura").empty();
                        $("#divConsumidorLeitura").hide();
                        $("#divFornecedorProcura").html(response);

                        bindIniciarEventosFornecedor();
                    },
                    error: function (xhr, text, error) {
                        BASE.MostrarMensagemErro(text);
                    }
                });


            break;

            case "tipoAtendimento":
                
                var idConsumidor = getUrlParameter('idConsumidor');
           
                var idFornecedor = getUrlParameter('idFornecedor');

                var documento = getUrlParameter('doc');

                var tipoAtendimento = getUrlParameter('tipoAtendimento');

                var idFicha = getUrlParameter('idFicha');

                var ignorarFornecedor = getUrlParameter('ignorarFornecedor');

                if(ignorarFornecedor == ""){
                    ignorarFornecedor = false;
                }


                $.ajax({
                    url: '/AtendimentoConsumidor/FornecedorContinuar',
                    data: { id: idFornecedor},
                    success: function (response, status, xhr) {
                        
                        $("#divConsumidorProcura").empty();
                        $("#divFornecedorProcura").empty();
                        $("#divFornecedorLeitura").hide();
                        $("#divAtendimentoTipoAtendimento").html(response);

                        $("#IdConsumidor").val(idConsumidor);
                        $("#IdFornecedor").val(idFornecedor);
                        $("#documentoFormatado").val(documento);
                        $("#IdFichaAtendimento").val(idFicha);

                        var element = $("#TipoAtendimento", "#divAtendimentoTipoAtendimento");
                        loadDropDownBoxElement(element, ignorarFornecedor, tipoAtendimento);

                        bindAtendimentoSelecionaPor();

                        $('#divAtendimentoTipoAtendimento').show();
                    },
                    error: function (xhr, text, error) {
                        BASE.MostrarMensagemErro(text);
                    }
                });


            break;

            case "ficha_edicao":                            
                
                var idConsumidor = getUrlParameter('idConsumidor');
           
                var idFornecedor = getUrlParameter('idFornecedor');

                var idFicha = getUrlParameter('idFicha');

                var tipoAtendimento = getUrlParameter('tipoAtendimento');                  

                if(idFicha != "" && idFicha > 0){
                    url = '/AtendimentoConsumidor/AtendimentoEncontrado/?idFicha=' + idFicha;

                    $.get(url, null, function (response, text, xhr) {
                        $('#divConsumidorProcura').empty();
                        $('#divAtendimentoReclamacao').html(response);
                        $('#divAtendimentoTipoAtendimento').hide();

                        $('#btnVoltarParaAtendimentoTipoAtendimento').hide();

                        $('#IdConsumidor').val(idConsumidor);

                        $('#IdFornecedor').val(idFornecedor);

                        $('#TipoAtendimento').val(tipoAtendimento);

                        $('#ProcurouFornecedor').trigger('click');

                        selecionarClassificacao();               

                        var idClassificacao = $("#IdClassificacao").val();                

                        if (idClassificacao > 0) {

                             var callbackMeioAquisicao = function(){                        
                                $('#IdMeioAquisicao').val($('#hdnIdMeioAquisicao').val());

                            };

                            var callbackPedidoConsumidor = function(){                       
                                $('#IdTipoPedidoConsumidor').val($('#hdnIdTipoPedidoConsumidor').val());

                            };

                            var callbackParametrosClassificacao = function(){
                                remainingChars($('#Comentarios'));
                                bindComentarios();
                                $("#IdFormaPagamento option").filter(function() { return $.trim( $(this).text() ) == $('#DescricaoFormaPagamento').val() ; }).attr('selected','selected');

                            };

                            ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao(idClassificacao, callbackMeioAquisicao);
                            ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor(idClassificacao, callbackPedidoConsumidor);
                            bindListaObjetosClassificacao(idClassificacao, callbackParametrosClassificacao);                    

                            var form = $("#frmAtendimentoReclamacao");
                            $.validator.unobtrusive.parse(form);   

                            var comentariosProcurouFornecedor = $('#Comentarios').text();

                            if(comentariosProcurouFornecedor.trim() != ""){                                        

                                $('#ProcurouFornecedor').trigger('click');
                                $('#Comentarios').val($('#Comentarios').text());

                            };

                        }
                        else {
                            $("#divVicioQualidade").hide();
                            $("#divDadosContratacao").hide();
                        }                               


                    }).fail(function (xhr, text, error) {
                        BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
                    });

                }


            break;

            default:

            break;
            
        }

    }

    function bindTipoAtendimentoVoltar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnTipoAtendimentoVoltar", function () {
            var that = $(this);
            var url = that.data("url");         

            var idConsumidor = $("#IdConsumidor").val();

            var idFornecedor = $("#IdFornecedor").val();

            var documento = $('#documentoFormatado').val();

            var ignorarFornecedor = getUrlParameter('ignorarFornecedor');

            var etapa = 'fornecedor_edicao';

            if(ignorarFornecedor == ""){
                ignorarFornecedor = false;
                etapa = 'fornecedor_edicao';
            }
            else{
                etapa = 'fornecedor_busca';
            }

            window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&etapa='+ etapa + '&ignorarFornecedor=' + ignorarFornecedor;

            /*
            $.ajax({
                url: url,
                data: {
                    id: idConsumidor
                },
                success: function (response, status, xhr) {
                    $("#divConsumidorProcura").empty();
                    $("#divConsumidorLeitura").hide();
                    $("#divFornecedorProcura").html(response);

                    bindIniciarEventosFornecedor();
                    $('#divAtendimentoTipoAtendimento').hide();
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                }
            });

            */
        });
    }

    function bindMarcaraCPFCNPJ() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('input:radio[name=TipoFornecedor]').off('click');
        $('input:radio[name=TipoFornecedor]').on('click', function () {
            if ($(this).val() === "PJ") {
                $('#frmFornecedorEscrita #CPF_CNPJ').removeClass('cpf').addClass('cnpj');
            }
            else {
                $('#frmFornecedorEscrita #CPF_CNPJ').removeClass('cnpj').addClass('cpf');
            }
        });
    }

    function bindProcurarFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divAtendimentoReclamacao').off('click', '#ProcurouFornecedor');
        $('#divAtendimentoReclamacao').on('click', '#ProcurouFornecedor', function () {
            $(this).closest('.panel').find("#Comentarios").val('');
            $(this).closest('.panel').find("#idComentarios").collapse($(this).prop('checked') ? 'show' : 'hide');
        });
    }

    function bindBtnConsumidorNaoEncontrado() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divConsumidorProcura #btnConsumidorNaoEncontrado").off("click");
        $("#divConsumidorProcura #btnConsumidorNaoEncontrado").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            $.get("/AtendimentoConsumidor/ConsumidorNaoEncontrado", null, function (response, text, xhr) {
                $("#divConsumidorEscrita").html(response);
                $("#divConsumidorProcura").empty();

                //bindValidaFormConsumidorEscrita();
                bindCampoTipoDeficiencia();
                CONTROLES.Configurar.DatePicker();

                $("#divConsumidorEscrita #DataNascimento").val("");
            }).fail(function (xhr, text, error) {
                BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
            });
        });
    }

    // --> begin Consumidor
    function inicializaConsumidor() {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divConsumidorProcura");
        var url = div.data("url");

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                div.html(response);

                bindBtnConsumidorNaoEncontrado();

                var form = $("#frmConsumidorEscrita");
                $.validator.unobtrusive.parse(form);
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $('#divConsumidorLeitura').empty();
                $('#divConsumidorEscrita').empty();
            }
        });
    }

    function bindConsumidorProcura() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnConsumidorProcura", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");

            var nome = $("#divConsumidorProcura").find("#Nome").val();
            var cpf = $("#divConsumidorProcura").find("#CPF").val();

            if ((nome === undefined || nome === "") && (cpf === undefined || cpf === "")) {
                BASE.Mensagem.Mostrar("Ao menos um filtro deve ser informado.", TipoMensagem.Alerta);
                return false;
            }

            clicked = false;

            $.ajax({
                url: url,
                type: 'POST',
                data: { Nome: nome, CPF: cpf },
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        modalConsumidorNaoEncontrado(response.Mensagem);
                    }
                    else {
                        var div = $("#divModalProcurar");
                        div.find("#divModalProcurarDados").html(response);
                        $('#modal-titulo').text('Consumidores');

                        CONTROLES.Tabela.Configurar(
                            function () {
                                var div = $("#divModalProcurar");
                                div.modal("hide");
                                $('.spinner').hide();
                                $('html, body').css('overflowY', 'auto');

                                BASE.Modal.ExibirModalConfirmacao("Alerta",
                                   'Nenhum Registro Encontrado. Deseja cadastrar um novo Consumidor?',
                                   TamanhoModal.Pequeno,
                                   "Não",
                                   "btn-danger",
                                   "Sim",
                                   "btn-primary",

                                   function () {
                                       $.get("/AtendimentoConsumidor/ConsumidorNaoEncontrado", null, function (response, text, xhr) {
                                           $('#divConsumidorEscrita').html(response);
                                           $('#divConsumidorProcura').empty();

                                           $('#frmConsumidorEscrita #CPF').val(cpf);
                                           $('#frmConsumidorEscrita #Nome').val(nome);
                                           $('#frmConsumidorEscrita #DataNascimento').val('');

                                           bindHabilitaCampoOutroTipoDeficiencia();
                                           bindCampoTipoDeficiencia();

                                       }).fail(function (xhr, text, error) {
                                           BASE.Mensagem.Mostrar(text, TipoMensagem.Error);

                                       });
                                   }, null);

                            }, function () {

                                document.body.addEventListener('DOMNodeInserted', function (event) {

                                    if (!clicked && $('#tblConsumidores tbody tr button').length === 1) {
                                        $('#tblConsumidores tbody tr button:first').trigger('click');
                                        clicked = true;

                                    }
                                    else if (!clicked && $('#tblConsumidores tbody tr button').length > 1) {
                                        div.modal("show");
                                        clicked = true;
                                    }

                                }, false);

                            });
                    }
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                }

            });

        });
    }

    function modalConsumidorNaoEncontrado(msg) {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divModalProcurar");
        div.modal("hide");
        $('.spinner').hide();
        $('html, body').css('overflowY', 'auto');

        BASE.Modal.ExibirModalConfirmacao("Alerta",
                            msg,
                            TamanhoModal.Pequeno,
                            "Não",
                            "btn-danger",
                            "Sim",
                            "btn-primary",
                            callbackConsumidorNaoEncontrado
                            , null);
    }

    function callbackConsumidorNaoEncontrado() {
        BASE.LogFunction(arguments.callee, moduleName);

        $.get("/AtendimentoConsumidor/ConsumidorNaoEncontrado", null, function (response, text, xhr) {
            $('#divConsumidorEscrita').html(response);
            $('#divConsumidorProcura').empty();

            bindHabilitaCampoOutroTipoDeficiencia();
            bindCampoTipoDeficiencia();
        }).fail(function (xhr, text, error) {
            BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
        });
    }

    function bindConsumidorSeleciona() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divModalProcurar").on("click", ".btnConsumidorSeleciona", function (e) {
            BASE.LogEvent(e, moduleName);           

            var that = $(this);
            var url = that.data("url");

            var idConsumidor = url.split('/')[url.split('/').length - 1];

            $('#IdConsumidor').val(idConsumidor);

            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=0&etapa=consumidor_edicao');

            $.ajax({
                url: url,
                success: function (response, status, xhr) {
                    $("#divConsumidorProcura").empty();
                    $("#divConsumidorEscrita").empty();
                    $("#divConsumidorLeitura").html(response);
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    $("#divModalProcurar").modal("hide");
                }
            });
        });
    }

    function consumidorSeleciona(idConsumidor) {
        BASE.LogFunction(arguments.callee, moduleName);

        var that = $(this);
        var url = "/AtendimentoConsumidor/ConsumidorSelecionaPor/" + idConsumidor;

        $('#IdConsumidor').val(idConsumidor);

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                $("#divConsumidorProcura").empty();
                $("#divConsumidorEscrita").empty();
                $("#divConsumidorLeitura").html(response);
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $("#divModalProcurar").modal("hide");
            }
        });

    }

    function bindConsumidorEscrita() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnConsumidorEscrita", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");

            var idConsumidor = $("#divConsumidorLeitura").find("#IdConsumidor").val();

            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=0&etapa=consumidor_edicao');


            $.ajax({
                url: url,
                data: { id: $("#divConsumidorLeitura").find("#IdConsumidor").val() },
                success: function (response, status, xhr) {
                    $("#divConsumidorProcura").empty();
                    $("#divConsumidorLeitura").empty();
                    $("#divConsumidorEscrita").html(response);

                    //bindValidaFormConsumidorEscrita();
                    bindComportamentoEscrita();
                    definirComportamentoFornecedorEscrita();
                    bindMascara();
                    CONTROLES.Configurar.DatePicker();
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    bindHabilitaCampoOutroTipoDeficiencia();
                    bindCampoTipoDeficiencia();
                    $("#divConsumidorEscrita #CPF").prop("disabled", true);
                    $("#divConsumidorEscrita #Email").prop("disabled", true);
                }
            });
        });
    }

    function bindMascara() {
        BASE.LogFunction(arguments.callee, moduleName);
        $("#Numero").mask("99999");
    }

    function bindComportamentoEscrita() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divConsumidorEscrita").on('click', '#PossuiDeficiencia', function () {
            definirComportamentoFornecedorEscrita();
        });
    }

    function definirComportamentoFornecedorEscrita() {
        BASE.LogFunction(arguments.callee, moduleName);
        definirDeficiencia();
    }

    function definirDeficiencia() {
        BASE.LogFunction(arguments.callee, moduleName);

        var possuiDeficiencia = $("#divConsumidorEscrita #PossuiDeficiencia").is(":checked");

        if (possuiDeficiencia)
            CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia"), true, null);
        else
            CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia"), false, function () { $("#IdTipoDeficiencia").val(""); });
    }

    function bindConsumidorContinuar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnConsumidorContinuar", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");        

            var idConsumidor = $("#divConsumidorLeitura").find("#IdConsumidor").val();

            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=0&etapa=fornecedor_busca');

            $.ajax({
                url: url,
                data: {
                    id: idConsumidor
                },
                success: function (response, status, xhr) {
                    $("#divConsumidorProcura").empty();
                    $("#divConsumidorLeitura").hide();
                    $("#divFornecedorProcura").html(response);

                    bindIniciarEventosFornecedor();
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                }
            });
        });
    }

    function bindConsumidorSalvarEContinuar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnConsumidorSalvarEContinuar", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this),
                url = that.data("url"),
                form = $("#frmConsumidorEscrita"),
                dataNasc = $('#divConsumidorEscrita #DataNascimento').val(),
                data = BASE.Util.ValidarData(dataNasc);

            if (!data.isValid()) {
                bindValidaFormConsumidorEscrita();
            }           

            var obj = $("#frmConsumidorEscrita").serializeCustom();

            if (validarDados(form)) {
                $.ajax({
                    url: url,
                    data: obj,
                    success: function (response, status, xhr) {
                        $("#divConsumidorProcura").empty();
                        if (BASE.Util.ResponseIsJson(xhr)) {
                            if (response.Sucesso === false) {
                                BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                            }
                        }
                        else {
                            $("#divConsumidorEscrita").hide();
                            $("#divFornecedorProcura").html(response);
                            $("#IdConsumidor").val($("#hdnIdConsumidor").val());
                        }                      

                        var idConsumidor = $("#IdConsumidor").val();
                        var idFornecedor = $("#IdFornecedor").val();

                        window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&etapa=fornecedor_busca');

                    },
                    error: function (xhr, text, error) {
                        BASE.MostrarMensagemErro(text);
                    },
                    complete: function () {
                        $("#divFornecedorProcura").find('#Nome').val('');
                        bindIniciarEventosFornecedor();
                    }
                });
            }
        });
    }

    function bindVoltarParaConsumidorProcura() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnVoltarParaConsumidorProcura", function (e) {
            BASE.LogEvent(e, moduleName);

            window.location = '/AtendimentoConsumidor?etapa=';
            
            /*
             var tipoDeAtendimento = $("#TipoAtendimento").val();           

            inicializaConsumidor();


            */
        });
    }

    function bindHabilitaCampoOutroTipoDeficiencia() {
        BASE.LogFunction(arguments.callee, moduleName);
        var habilita = $("#IdTipoDeficiencia").val() === "0";
        CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), habilita, null);
    }

    function bindCampoTipoDeficiencia() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#frmConsumidorEscrita #PossuiDeficiencia").on("change", function (e) {
            BASE.LogEvent(e, moduleName);

            var possuiDeficiencia = $(this).is(":checked");

            if (!possuiDeficiencia)
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia, #outroTipoDeficienciaDiv"), false, null);
            else
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #divTipoDeficiencia"), true, function () { $("#frmConsumidorEscrita #IdTipoDeficiencia").val("") });

            bindValidaTipoDeficientia(possuiDeficiencia);
        });

        $("#frmConsumidorEscrita #IdTipoDeficiencia").off("change", function () {
            CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), false, null);
        });

        $("#frmConsumidorEscrita #IdTipoDeficiencia").on("change", function () {
            var habilitaOutroTipoDef = $("#IdTipoDeficiencia").val() === "0";

            if (habilitaOutroTipoDef)
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), true, function () { bindValidaOutroTipoDeficiencia(true); });
            else
                CONTROLES.Elemento.ExibiEsconde($("#frmConsumidorEscrita #outroTipoDeficienciaDiv"), false, function () {
                    bindValidaOutroTipoDeficiencia(false);
                    limpaCampoOutroTipoDeficiencia();
                });
        });
    }

    function bindValidaFormConsumidorEscrita() {
        BASE.LogFunction(arguments.callee, moduleName);

       
    }

    function bindValidaFormFornecedorEscrita() {
        BASE.LogFunction(arguments.callee, moduleName);
    }

    function bindValidaTipoDeficientia(possuiDeficiencia) {
        BASE.LogFunction(arguments.callee, moduleName);

        var inputIdTipoDeficiencia = $("#frmConsumidorEscrita #IdTipoDeficiencia");

        if (possuiDeficiencia) {
            inputIdTipoDeficiencia.rules("add",
                {
                    required: true,
                    messages: {
                        required: "Campo obrigatório"
                    }
                });
        }
        else
            inputIdTipoDeficiencia.rules("remove", "required");
    }

    function bindValidaOutroTipoDeficiencia(possuiOutroTipoDeficiencia) {
        BASE.LogFunction(arguments.callee, moduleName);

        var inputOutroTipoDeficiencia = $("#frmConsumidorEscrita #OutroTipoDeficiencia");

        if (possuiOutroTipoDeficiencia) {
            inputOutroTipoDeficiencia.rules("add",
                {
                    required: true,
                    messages: {
                        required: "Campo obrigatório"
                    }
                });
        }
        else
            inputOutroTipoDeficiencia.rules("remove", "required");
    }

    function limpaCampoOutroTipoDeficiencia() {
        $("#frmConsumidorEscrita #OutroTipoDeficiencia").val("");
    }

    // --> end Consumidor

    // --> begin Fornecedor
    function inicializaFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divFornecedorProcura");
        var url = div.data("url");

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                div.html(response);

                bindIniciarEventosFornecedor();
                var form = $("#frmFornecedorEscrita");
                $.validator.unobtrusive.parse(form);
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $('#divFornecedorLeitura').empty();
                $('#divFornecedorEscrita').empty();
            }
        });
    }

    function bindIniciarEventosFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindNovoFornecedor();
        bindBtnVoltarParaConsumidorLeitura();
    }

    function bindFornecedorProcura() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnFornecedorProcura", function (e) {
            BASE.LogEvent(e, moduleName);

            clicked = false;

            var that = $(this);
            var url = that.data("url");

            var nome = $("#divFornecedorProcura").find("#Nome").val();
            var cpf = $("#divFornecedorProcura").find("#NumDocumento").val();

            if ((nome === undefined || nome === "") && (cpf === undefined || cpf === "")) {
                BASE.Mensagem.Mostrar("Ao menos um filtro deve ser informado.", TipoMensagem.Alerta);
                return false;
            }

            $.ajax({
                url: url,
                data: { Nome: nome, NumDocumento: cpf },
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        modalFornecedorNaoEncontrado(response.Mensagem);
                    }
                    else {
                        var div = $("#divModalProcurar");
                        div.find("#divModalProcurarDados").html(response);
                        $('#modal-titulo').text('Fornecedores');

                        CONTROLES.Tabela.Configurar(
                            function () {
                                var div = $("#divModalProcurar");
                                div.modal("hide");
                                $('.spinner').hide();
                                $('html, body').css('overflowY', 'auto');

                                BASE.Modal.ExibirModalConfirmacao("Alerta",
                                    'Nenhum Registro Encontrado. Deseja cadastrar um novo Fornecedor?',
                                    TamanhoModal.Pequeno,
                                    "Não",
                                    "btn-danger",
                                    "Sim",
                                    "btn-primary",

                                    function () {
                                        $.get("/AtendimentoConsumidor/FornecedorNaoEncontrado", null, function (response, text, xhr) {
                                            $('#divFornecedorEscrita').html(response);
                                            $('#divFornecedorProcura').empty();

                                            $('#frmFornecedorEscrita #CPF_CNPJ').val(cpf);
                                            $('#frmFornecedorEscrita #Nome').val(nome);

                                            var doc_formatado = cpf.replace(/[^0-9]+/g, '');

                                            if (doc_formatado.length > 11) {
                                                $($('input:radio[name=TipoFornecedor]')[0]).prop('checked', true);
                                                $('#frmFornecedorEscrita #CPF_CNPJ').removeClass('cpf').addClass('cnpj');
                                            }
                                            else {
                                                $($('input:radio[name=TipoFornecedor]')[1]).prop('checked', true);
                                                $('#frmFornecedorEscrita #CPF_CNPJ').removeClass('cnpj').addClass('cpf');
                                            }

                                            bindValidaFormFornecedorEscrita();
                                            bindMarcaraCPFCNPJ();
                                        }).fail(function (xhr, text, error) {
                                            BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
                                        });
                                    }, null);

                            }, function () {

                                document.body.addEventListener('DOMNodeInserted', function (event) {

                                    if (!clicked && $('#tblFornecedores tbody tr button').length === 1) {
                                        $('#tblFornecedores tbody tr button:first').trigger('click');
                                        clicked = true;

                                    }
                                    else if (!clicked && $('#tblFornecedores tbody tr button').length > 1) {
                                        div.modal("show");
                                        clicked = true;
                                    }

                                }, false);


                            });
                    }
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                }
            });
        });
    }

    function bindFornecedorSeleciona() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divModalProcurarDados").on("click", ".btnFornecedorSeleciona", function (e) {
            BASE.LogEvent(e, moduleName);         

            var that = $(this);

            var url = that.data("url");

            var documento = $(this).closest('tr').find('td').text().replace(/\D+/g, '');

            var idConsumidor = $('#IdConsumidor').val();

            var idFornecedor = url.split('/')[url.split('/').length - 1];

            $('#IdFornecedor').val(idFornecedor);   

            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&etapa=fornecedor_edicao');
        
            solicitarEdicao(url, idConsumidor, documento);

            pesquisarFonecedorDuplicado();

            $('#divFornecedorLeitura').show();
        });
    }

    function pesquisarFonecedorDuplicado() {
        BASE.LogFunction(arguments.callee, moduleName);

        var idFornecedor = $("#IdFornecedor").val();
        var idConsumidor = $("#IdConsumidor").val();

        if (idFornecedor === undefined || idFornecedor === null || idFornecedor === "") return;

        $.ajax({
            url: "/AtendimentoTecnico/PesquisarFornecedorDuplicado",
            data: { idFornecedor: idFornecedor, idConsumidor: idConsumidor },
            type: "Post",
            dataType: "json",
            success: function (data) {
                if (data) {
                    var div = $("#divModalRelacionado");
                    div.modal('show');
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                console.log(xmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    function bindFornecedorEscrita() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnFornecedorEscrita", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");          

            var idConsumidor = $("#IdConsumidor").val();

            var idFornecedor = $("#IdFornecedor").val();

            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&etapa=fornecedor_edicao');


            $.ajax({
                url: url,
                data: { id: $("#divFornecedorLeitura").find("#Codigo").val() },
                success: function (response, status, xhr) {
                    $("#divFornecedorProcura").empty();
                    $("#divFornecedorLeitura").empty();
                    $("#divFornecedorEscrita").html(response);
                    $("#divFornecedorEscrita").show();

                    bindMarcaraCPFCNPJ();
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    $("#divFornecedorEscrita #CPF_CNPJ").prop("disabled", true);
                    $('input:radio[name=TipoFornecedor]').prop('disabled', true);
                }
            });
        });
    }

    function ConsultaBlackLista(callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/AtendimentoConsumidor/GetBlackList",
            data: { id: $("#Codigo").val(), site: $("#WebSite").val() },
            success: function (data) {
                if (data === false) {
                    if (callback !== undefined) {
                        callback()
                    }
                }
                else {
                    bootbox.alert({
                        title: "Evite Sites do Procon!",
                        message: "O web site informado, pertence a lista Evite Sites do Procon, onde não cabe mais a abertura de reclamações contra estes!",
                        size: "small",
                        callback: function () {
                            window.location = "/AtendimentoConsumidor";
                        }
                    });
                }
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            }
        });
    }
    function bindFornecedorContinuar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnFornecedorContinuar", function (e) {
            BASE.LogEvent(e, moduleName);

            var tipoDeAtendimento = $("#TipoAtendimento").val();

            var idConsumidor = $("#IdConsumidor").val();

            var idFornecedor = $("#IdFornecedor").val();

            var documento = $('#documentoFormatado').val();
            
            window.history.pushState('page2', 'Title', 'AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=0&etapa=tipoAtendimento');

            var that = $(this);
            var url = that.data("url");
           

            var blackLista = ConsultaBlackLista(function () {
                $.ajax({
                    url: url,
                    data: { id: idFornecedor},
                    success: function (response, status, xhr) {
                        $("#divFornecedorProcura").empty();
                        $("#divFornecedorLeitura").hide();
                        $("#divAtendimentoTipoAtendimento").html(response);

                        $("#IdConsumidor").val(idConsumidor);
                        $("#IdFornecedor").val(idFornecedor);
                        $("#documentoFormatado").val(documento);

                        var element = $("#TipoAtendimento", "#divAtendimentoTipoAtendimento");
                        loadDropDownBoxElement(element, false);

                        bindAtendimentoSelecionaPor();

                        $('#divAtendimentoTipoAtendimento').show();
                    },
                    error: function (xhr, text, error) {
                        BASE.MostrarMensagemErro(text);
                    }
                });
            });

            
        });
    }

    function bindFornecedorSalvarEContinuar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnFornecedorSalvarEContinuar", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");           
            
            $('#NumDocumento').val($('#CPF_CNPJ').val());
            var form = $("#frmFornecedorEscrita");         

            var idConsumidor = $("#IdConsumidor").val();

            if (validarDados(form)) {               
                
                var blackLista = ConsultaBlackLista(function () {

                    var obj = $("#divFornecedorEscrita").find(":input").serialize();

                    $.ajax({
                        url: url,
                        data: obj,
                        success: function (response, status, xhr) {
                            $("#divFornecedorProcura").empty();
                            if (BASE.Util.ResponseIsJson(xhr)) {
                                if (response.Sucesso === false) {
                                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                                }
                            }
                            else {
                                $("#divFornecedorEscrita").hide();
                                $("#divAtendimentoTipoAtendimento").html(response);
                                $("#divAtendimentoTipoAtendimento").show();                             

                                var idFornecedor = $(response).find('#IdFornecedor').val();   

                                $("#IdFornecedor").val(idFornecedor);           
            
                                window.history.pushState('page2', 'Title', 'AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=&tipoAtendimento=0&etapa=tipoAtendimento');

                                var element = $("#TipoAtendimento", "#divAtendimentoTipoAtendimento");
                                loadDropDownBoxElement(element);
                            }                           
                            
                           
                        },
                        error: function (xhr, text, error) {
                            BASE.MostrarMensagemErro(text);
                        }
                    });
                });
            }
        });
    }

    function bindProsseguirParaAtendimentoConsulta() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnProsseguirParaAtendimentoConsulta", function () {
            var that = $(this);
            var url = that.data("url");           
            
            var idConsumidor = $('#IdConsumidor').val();
            
            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=0&ignorarFornecedor=true&etapa=tipoAtendimento');

            $.ajax({
                url: url,
                success: function (response, status, xhr) {
                    $("#divFornecedorProcura").empty();
                    $("#divFornecedorLeitura").empty();
                    $("#divFornecedorEscrita").empty();
                    $("#divAtendimentoTipoAtendimento").html(response);

                    var element = $("#TipoAtendimento", "#divAtendimentoTipoAtendimento");
                    loadDropDownBoxElement(element, true);
                    $('#divAtendimentoTipoAtendimento').show();

                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    $("#divAtendimentoConsulta").empty();
                    $("#divAtendimentoReclamacao").empty();
                }
            });
        });
    }

    function bindBtnVoltarParaConsumidorLeitura() {
        BASE.LogFunction(arguments.callee, moduleName);
        $("body").off("click", "#btnVoltarParaConsumidorLeitura");
        $("body").on("click", "#btnVoltarParaConsumidorLeitura", function () {
            $('#divConsumidorLeitura').show();
            $('#divConsumidorEscrita').show();
            $('#divFornecedorProcura').empty();          

            var idConsumidor = $("#IdConsumidor").val();

            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=0&etapa=consumidor_edicao');
            
            window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=0&etapa=consumidor_edicao';
            
        });
    }

    function bindNovoFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btnNovoFornecedor").unbind("click").bind("click", function () {
            fornecedorNaoEncontrado();
        });
    }

    function bindVoltarParaFornecedorProcura() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnVoltarParaFornecedorProcura", function () {
            
            var idConsumidor = $("#IdConsumidor").val();

            var idFornecedor = $("#IdFornecedor").val();
             
            window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&etapa=fornecedor_busca';
            
            
        });
    }

    function modalFornecedorNaoEncontrado(msg) {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divModalProcurar");
        div.modal("hide");
        $('.spinner').hide();
        $('html, body').css('overflowY', 'auto');

        BASE.Modal.ExibirModalConfirmacao("Alerta",
                            msg,
                            TamanhoModal.Pequeno,
                            "Não",
                            "btn-danger",
                            "Sim",
                            "btn-primary",
                            callbackFornecedorNaoEncontrado, null);
    }

    function callbackFornecedorNaoEncontrado() {
        BASE.LogFunction(arguments.callee, moduleName);

        $.get("/AtendimentoConsumidor/FornecedorNaoEncontrado", null, function (response, text, xhr) {
            $('#divFornecedorEscrita').html(response);
            $('#divFornecedorProcura').empty();
        }).fail(function (xhr, text, error) {
            BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
        });
    }

    function solicitarEdicao(url, idConsumidor, documento) {
        BASE.LogFunction(arguments.callee, moduleName);

        if (ehPessoaJuridica(documento)) {
            var result = false;

            $.ajax({
                url: "/AtendimentoTecnico/VerificaExistenciaDeOutroDocumentoAssociado",
                data: { documentoComFormatacao: documento },
                type: "GET",
                dataType: "JSON",
                async: false,
                success: function (data) {
                    result = data;

                    $("#divConsumidorProcura").empty();

                    if (result === true) {
                        BASE.MostrarModalConfirmacao(
                            "CNPJ Corporativo encontrado!",
                            "Aceita utilizar os dados corporativos para o fornecedor informado?", function () {
                                
                                var urlPai = url.replace('FornecedorSelecionaPor', 'FornecedorSelecionaPorPai');

                                $.ajax({
                                    url: urlPai,

                                    success: function (response, status, xhr) {   
                                        $("#divConsumidorProcura").empty();
                                                                      
                                        $("#divFornecedorProcura").empty();
                                        $("#divFornecedorEscrita").empty();
                                        $("#divFornecedorLeitura").html(response);

                                        $('#idConsumidor').val(idConsumidor);
                                        $('#documentoFormatado').val(documento);

                                    },
                                    error: function (xhr, text, error) {
                                        BASE.MostrarMensagemErro(text);
                                    },
                                    complete: function () {
                                        $("#divModalProcurar").modal("hide");
                                    }
                                });
                            },

                             $.ajax({
                                 url: url,

                                 success: function (response, status, xhr) {
                                     $("#divConsumidorProcura").empty();
                                     
                                     $("#divFornecedorProcura").empty();
                                     $("#divFornecedorEscrita").empty();
                                     $("#divFornecedorLeitura").html(response);

                                     $('#idConsumidor').val(idConsumidor);
                                     $('#documentoFormatado').val(documento);

                                 },
                                 error: function (xhr, text, error) {
                                     BASE.MostrarMensagemErro(text);
                                 },
                                 complete: function () {
                                     $("#divModalProcurar").modal("hide");
                                 }
                             })
                        );
                    }
                    else {
                        selecionaFornecedor(url, idConsumidor, documento);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitação.", TipoMensagem.Error);
                }
            });
        }
        else {
            selecionaFornecedor(url, idConsumidor, documento);
        }
    }

    function ehPessoaJuridica(documento) {
        BASE.LogFunction(arguments.callee, moduleName);
        return (documento.replace(/\D+/g, '').length > 11);

    }

    function selecionaFornecedor(url, idConsumidor, documento) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: url,
            
            success: function (response, status, xhr) {     
                $("#divConsumidorProcura").empty();
                       
                $("#divFornecedorProcura").empty();
                $("#divFornecedorEscrita").empty();
                $("#divFornecedorLeitura").html(response);

                $('#idConsumidor').val(idConsumidor);
                $('#documentoFormatado').val(documento);
                
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $("#divModalProcurar").modal("hide");
            }
        });
    }

    function removeElementFromSelectAt(element, index) {
        BASE.LogFunction(arguments.callee, moduleName);

        element.find("option[value=" + index + "]").remove();
    }

    function fornecedorNaoEncontrado() {
        BASE.LogFunction(arguments.callee, moduleName);

        $.get("/AtendimentoConsumidor/FornecedorNaoEncontrado", null, function (response, text, xhr) {
            renderAndEmptyHtml(response, "divFornecedorEscrita", "divFornecedorProcura", posCarregarNovoFornecedor);
        }).fail(function (xhr, text, error) {
            BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
        });
    }

    function posCarregarNovoFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);
        bindMarcaraCPFCNPJ();
        $($("input:radio[name=TipoFornecedor]")[0]).prop("checked", true);
    }
    // --> end Fornecedor

    // --> begin Atendimento
    function inicializaAtendimento(ignorarFornecedor) {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divAtendimentoTipoAtendimento");
        var url = div.data("url");

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                div.html(response);
                div.show();
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $("#divAtendimentoConsulta").empty();
                $("#divAtendimentoReclamacao").empty();
                $("#divAtendimentoExtraProcon").empty();

                var element = $("#TipoAtendimento", "#divAtendimentoTipoAtendimento");
                loadDropDownBoxElement(element, ignorarFornecedor);
            }
        });
    }

    function bindAtendimentoProcura() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnAtendimentoProcura", function () {
            var that = $(this);
            var url = that.data("url");
            var idConsumidor = $("#IdConsumidor");
            var idFornecedor = $("#Codigo");

            $.ajax({
                url: url,
                data: { idConsumidor: idConsumidor.val(), idFornecedor: idFornecedor.val() },
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        BASE.Modal.ExibirModalAlerta("Alerta",
                            response.Mensagem,
                            TamanhoModal.Pequeno,
                            "OK",
                            "btn-primary",
                            callbackAtendimentoNaoEncontrado);
                    }
                    else {
                        var div = $("#divModalProcurar");
                        div.find("#divModalProcurarDados").html(response);
                        $('#modal-titulo').text('Atendimentos');
                        div.modal("show");
                    }
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                }
            });
        });
    }

    function callbackAtendimentoNaoEncontrado() {
        BASE.LogFunction(arguments.callee, moduleName);

        $.get("/AtendimentoConsumidor/AtendimentoNaoEncontrado", null, function (response, text, xhr) {
            $('#divAtendimentoReclamacao').html(response);
            $('#divAtendimentoTipoAtendimento').hide();
        }).fail(function (xhr, text, error) {
            BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
        });
    }

    function bindAtendimentoNovo() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").on("click", "#btnAtendimentoNovo", function () {
            if ($('#TipoAtendimento').val() === undefined || "") {
                return;
            }

            var that = $(this);
            var url = that.data("url");
            url = url + "?idTipoDeAtendimento=" + $('#TipoAtendimento').val();
            $.get(url, null, function (response, text, xhr) {
                $('#divAtendimentoReclamacao').html(response);
                $('#divAtendimentoTipoAtendimento').hide();

                selecionarClassificacao();

            }).fail(function (xhr, text, error) {
                BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
            });
        });
    }

    function bindAtendimentoSelecionaPor() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divAtendimentoTipoAtendimento").off("click", "#btnAtendimentoSelecionaPor");
        $("#divAtendimentoTipoAtendimento").on("click", "#btnAtendimentoSelecionaPor", function (e) {
            BASE.LogEvent(e, moduleName);         
          
            var tipoDeAtendimento = $("#TipoAtendimento").val();

            var documento = $('#documentoFormatado').val();
            
            var idConsumidor = $('#IdConsumidor').val();

            var idFornecedor = $('#IdFornecedor').val();

            var idFicha = getUrlParameter('idFicha');            
            
            var ignorarFornecedor = getUrlParameter('ignorarFornecedor');

            if(ignorarFornecedor == ""){
                ignorarFornecedor = false;
            }
            
            window.history.pushState('page2', 'Title', '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=' + tipoDeAtendimento + '&ignorarFornecedor=' + ignorarFornecedor + '&etapa=ficha_edicao');

            if (tipoDeAtendimento === "" || tipoDeAtendimento === null || tipoDeAtendimento === undefined) {
                BASE.Mensagem.Mostrar("Os filtros com * são obrigatórios.", TipoMensagem.Alerta);
                return false;
            }

            var callbackExtraProcon = function(){
                bindDescricaoConsulta();

               var tipoAtendimento = $("#TipoAtendimento").val();

                if (tipoAtendimento == "3" || tipoAtendimento == "11") {
                    $('#btnConsultaEncerra').prop('disabled', false);

                }  

            };

            var callbackConsultaSimples = function(){
                bindDescricaoConsulta();

                var tipoAtendimento = $("#TipoAtendimento").val();

                 if (tipoAtendimento == "3" || tipoAtendimento == "11") {
                    $('#btnConsultaEncerra').prop('disabled', false);

                }
                
            };

            alterarSubTituloConsumidor(tipoDeAtendimento);

            switch (tipoDeAtendimento) {
                case "4":
                case "5":
                case "6":
                case "12":
                    procuraPorAtendimentosRelacionados(tipoDeAtendimento, idFicha);
                    $("divAtendimentoTipoAtendimento #btnDeclaracao").hide();
                    break;

                case "11":
                    inicializarFluxoExtraProcon(callbackExtraProcon);
                    break;
                default:
                    inicializaConsulta(parseInt(tipoDeAtendimento), callbackConsultaSimples);
                    break;
            }

            return false;
        });
    }

    function alterarSubTituloConsumidor(tipoDeAtendimento) {
        BASE.LogFunction(arguments.callee, moduleName);

        var subTitulo = "";

        switch (tipoDeAtendimento) {
            case "1":
            case "2":
            case "3":
                subTitulo = "/ Atendimento Consumidor/ Simples Consulta";
                break;
            case "4":
                subTitulo = "/ Atendimento Consumidor/ Atendimento CIP";
                break;
            case "5":
            case "6":
                subTitulo = "/ Atendimento Consumidor/ Reclamação";

                break;
            case "7":
                subTitulo = "/ Atendimento Consumidor/ Atendimento 151";
                break;
            case "8":
                subTitulo = "/ Atendimento Consumidor/ Atendimento Pessoal";
                break;
            case "9":
            case "10":
            case "11":
                subTitulo = "/ Atendimento Consumidor/ Atendimento Extra Procon";
                break;
            case "12":
                subTitulo = "/ Atendimento Consumidor/ Encaminhamento a Fiscalização";
                break;
            default:
                subTitulo = "/ Atendimento Consumidor"
                break;
        }

        $("#tituloLayout").text(subTitulo);
    }

    function habilitaProcurouFornecedor(opcao) {
        BASE.LogFunction(arguments.callee, moduleName);

        if (opcao === 4 || opcao === 6) {
            $("#idPanelFornecedor").show();
        } else {
            $("#idPanelFornecedor").hide();
        }
    }

    function bindAtendimentoSeleciona() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").off("click", "#btnAtendimentoSeleciona");
        $("body").on("click", "#btnAtendimentoSeleciona", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");

            $.ajax({
                url: url,
                data: {
                    id: that.closest("tr").data("id")
                },
                success: function (response, status, xhr) {
                    $("#divAtendimentoTipoAtendimento").hide();
                    $("#divAtendimentoReclamacao").html(response);

                    $("#divAtendimentoReclamacao #IdClassificacao").trigger("change");

                    selecionarClassificacao();
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                },
                complete: function () {
                    $("#divModalProcurar").modal("hide");
                }
            });
        });
    }

    function procuraPorAtendimentosRelacionados(tipoDeAtendimento, idFicha) {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divAtendimentoReclamacao");
        var url = div.data("url");
        var idConsumidor = $("#IdConsumidor");
        var idFornecedor = $("#IdFornecedor");

        habilitaProcurouFornecedor(tipoDeAtendimento);

        $.ajax({
            url: url,
            data: { idConsumidor: idConsumidor.val(), idFornecedor: idFornecedor.val(), idTipoDeAtendimento: tipoDeAtendimento },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                var url = "";

                if( idFicha == undefined || idFicha == null  || idFicha == "")
                {
                    url = '/AtendimentoConsumidor/AtendimentoNaoEncontrado/?idTipoDeAtendimento=' + $('#TipoAtendimento').val();
                    
                    $.get(url, null, function (response, text, xhr) {
                        $('#divAtendimentoReclamacao').html(response);
                        $('#divAtendimentoTipoAtendimento').hide();

                        selecionarClassificacao();                        

                        $('#ProcurouFornecedor').trigger('click');

                        remainingChars($('#Comentarios'));
                        bindComentarios();

                    }).fail(function (xhr, text, error) {                       
                        BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
                    });

                }
                else
                {

                    url = '/AtendimentoConsumidor/AtendimentoEncontrado/?idFicha=' + idFicha;
                    
                    $.get(url, null, function (response, text, xhr) {
                        $('#divAtendimentoReclamacao').html(response);
                        $('#divAtendimentoTipoAtendimento').hide();

                        selecionarClassificacao();                         

                        var idClassificacao = $("#IdClassificacao").val();

                        if (idClassificacao > 0) {
                            ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao(idClassificacao);
                            ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor(idClassificacao);
                            bindListaObjetosClassificacao(idClassificacao);

                            var form = $("#frmAtendimentoReclamacao");
                            $.validator.unobtrusive.parse(form);
                        }
                        else {
                            $("#divVicioQualidade").hide();
                            $("#divDadosContratacao").hide();
                        }                      

                        $('#ProcurouFornecedor').trigger('click');

                    }).fail(function (xhr, text, error) {                       
                        BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
                    });

                }                

            },
            error: function (xhr, text, error) {                
                BASE.MostrarMensagemErro(text);
            }
        });
    }    

    function inicializarFluxoExtraProcon(callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divAtendimentoExtraProcon");
        var url = div.data("url");

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
                else {
                    $("#divAtendimentoExtraProcon").html(response);                   

                    var form = $("#divAtendimentoExtraProcon");
                    $.validator.unobtrusive.parse(form);

                    $('#IdClassificacao').rules("add", { required: true, messages: { required: "Campo 'Classificação' é de preechimento obrigatório." } });

                    $('#divAtendimentoExtraProcon').on('blur', ':input', function () {
                        var form = $(this).closest("form");
                        var validator = form.validate();
                        validator.element(this);
                    });

                     if(callback != undefined)
                        callback();

                    bindConsultaEncerra('#divAtendimentoExtraProcon');

                   
                }
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $("#divAtendimentoTipoAtendimento").hide();

                selecionarClassificacao();
            }
        });
    }

    function inicializaConsulta(tipoDeAtendimento, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divAtendimentoConsulta");
        var url = div.data("url");

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
                else {
                    $("#divAtendimentoConsulta").html(response);

                    var form = $("#divAtendimentoConsulta");
                    $.validator.unobtrusive.parse(form);

                    $('#DescricaoConsulta').rules("add", { required: true, messages: { required: "Campo 'Descrição' é de preechimento obrigatório." } });
                    $('#IdClassificacao').rules("add", { required: true, messages: { required: "Campo 'Classificação' é de preechimento obrigatório." } });

                    $('#divAtendimentoConsulta').on('blur', ':input', function () {
                        var form = $(this).closest("form");
                        var validator = form.validate();
                        validator.element(this);
                    });

                    bindConsultaEncerra('#divAtendimentoConsulta');
                    selecionarClassificacao();

                    if(callback != undefined)
                        callback();
                }
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $("#divAtendimentoTipoAtendimento").hide();

                selecionarClassificacao();
            }
        });
    }

    function bindConsultaEncerra(contexto) {
        BASE.LogFunction(arguments.callee, moduleName);

        $(contexto).off("click", "#btnConsultaEncerra");
        $(contexto).on("click", "#btnConsultaEncerra", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");
            var idClassificacao = $("#IdClassificacao").val();
            var idConsumidor = $("#IdConsumidor").val();
            var descricaoConsulta = $("#DescricaoConsulta").val();
            var procurouFornecedor = $("#ProcurouFornecedor").val();
            var comentarios = $("#Comentarios").val();
            var idTipoAtendimento = $("#TipoAtendimento").val();
            var idOrgao = $("#OrgamEncaminhado").val();
            var idUsuarioInternt = $("#IdUsuarioInternet").val();

            var tipoAtendimento = $('#TipoAtendimento').val();

            if (idClassificacao === "0" || "") {
                BASE.Mensagem.Mostrar("Campo Classificação obrigatório.", TipoMensagem.Alerta);
                return;
            }

            if (descricaoConsulta.trim() === "" && tipoAtendimento != "3" && tipoAtendimento != "11") {
                BASE.Mensagem.Mostrar("Campo Descrição obrigatório.", TipoMensagem.Alerta);
                return;
            }

            $.ajax({
                url: url,
                type: "POST",
                data: { IdClassificacao: idClassificacao, IdTipoaAtendimento: idTipoAtendimento, DescricaoConsulta: descricaoConsulta, IdConsumidor: idConsumidor, IdOrgao: idOrgao, IdUsuarioInternet: idUsuarioInternt, ProcurouFornecedor: procurouFornecedor, Comentarios: comentarios },
                success: function (response, status, xhr) {
                    if (response) {
                        if (response.Sucesso) {
                            var idFichaAtendimento = response.Resultado.IdFichaAtendimento;
                            BASE.Modal.ExibirModalConfirmacao("Registro criado com sucesso!",
                                "Protocolo: " + response.Resultado.NrProtocolo + "/" + response.Resultado.AnoProtocolo,
                                TamanhoModal.Pequeno,
                                "<i class='fa fa-close margR5'></i> Finalizar",
                                "btn-warning",
                                "<i class='fa fa-save margR5'></i> Gerar Protocolo",
                                "btn-primary",
                                function () {
                                    window.open("/AtendimentoConsumidor/ImprimirProtocoloConsumidor?IdFicha=" + idFichaAtendimento, "_blank");
                                    window.location = BASE.Url.Simples("/AtendimentoConsumidor");
                                },
                                function () {
                                    window.location = BASE.Url.Simples("/AtendimentoConsumidor");
                                }
                            );
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                        }
                        else {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                        }
                    }
                },
                error: function (xhr, text, error) {
                    BASE.MostrarMensagemErro(text);
                }
            });
        });
    }

    function inicializaReclamacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        var div = $("#divAtendimentoReclamacao");
        var url = div.data("url");

        $.ajax({
            url: url,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
                else {
                    $("#divAtendimentoReclamacao").html(response);

                    var form = $("#frmAtendimentoReclamacao");
                    $.validator.unobtrusive.parse(form);

                    $('#divAtendimentoReclamacao').on('blur', ':input', function () {
                        var form = $(this).closest("form");
                        var validator = form.validate();
                        validator.element(this);
                    });
                }
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            },
            complete: function () {
                $("#divAtendimentoTipoAtendimento").hide();

                selecionarClassificacao();
            }
        });
    }

    function bindReclamacaoEncerra() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divAtendimentoReclamacao").off("click", "#btnReclamacaoEncerra");
        $("#divAtendimentoReclamacao").on("click", "#btnReclamacaoEncerra", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            var url = that.data("url");          

            localStorage.removeItem('form_cip');

            if ($("#ProcurouFornecedor").prop("checked") === true && $("#Comentarios").val().trim() === "") {
                BASE.Mensagem.Mostrar("Campo 'Informe como foi o seu contato com a empresa' obrigatório.", TipoMensagem.Alerta);
                return;
            }

            if ($("#IdClassificacao").val() === "" || $("#IdClassificacao").val() === "0") {
                BASE.Mensagem.Mostrar("Campo 'Classificação' obrigatório.", TipoMensagem.Alerta);
                return;
            }

            var idFornecedor = $("#IdFornecedor").val(),
                idConsumidor = $("#IdConsumidor").val(),
                descricaoConsulta = $("#DescricaoConsulta").val(),
                idTipoAtendimento = $("#TipoAtendimento").val();
            var idUsuarioInternt = $("#IdUsuarioInternet").val();

            $("#divAtendimentoReclamacao #IdFornecedor").val(idFornecedor);
            $("#divAtendimentoReclamacao #IdConsumidor").val(idConsumidor);
            $("#divAtendimentoReclamacao #IdTipoaAtendimento").val(idTipoAtendimento);
            $("#divAtendimentoReclamacao #Resposta").val(descricaoConsulta);
            $("#divAtendimentoReclamacao #IdUsuarioInternet").val(idUsuarioInternt);

            encerrarReclamacao(url, idTipoAtendimento);

        });
    }

    function encerrarReclamacao(url, idTipoAtendimento) {
        BASE.LogFunction(arguments.callee, moduleName);       

        var obj = $("#divAtendimentoReclamacao").serializeObject();

        obj.IdFormaPagamento = $("select[id=IdFormaPagamento]").val();
        obj.DescricaoFormaPagamento = $("select[id=IdFormaPagamento]").find('option:selected').text();

        $.ajax({
            url: url,
            type: "POST",
            data: obj,
            success: function (response, status, xhr) {
                if (response && response.Sucesso) {
                    $("#IdFichaAtendimento").val(response.Resultado.IdFichaAtendimento);
                    $("#IdDocumento").val(response.Resultado.IdDocumento);
                    $("#IdReclamado").val(response.Resultado.IdReclamado);
                    $("#IdAquisicao").val(response.Resultado.IdAquisicao);
                    $("#IdClassificacao").val(response.Resultado.IdClassificacao);

                    callbackPosEncerrar(idTipoAtendimento, response);
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                }
                else {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            }
        });
    }

    function callbackPosEncerrar(tipoAtendimento, data) {
        BASE.LogFunction(arguments.callee, moduleName);
             
        var callback;          

        switch (tipoAtendimento) {
            case "12":                
                IniciarComplementoEncaminharFiscalizacao();
               
                break;
                
            default:
              
                if($("#ProcurouFornecedor").prop("checked") === true && $("#Comentarios").val().trim() == "") {
                    //$("#btnVoltarParaAtendimentoTipoAtendimento").prop("disabled", true);
                    //$("#btnReclamacaoEncerra").prop("disabled", true);
                    //$("#btnDeclaracao").show();

                    BASE.Mensagem.Mostrar("Preencha o campo 'Contato com a empresa antes de prosseguir'", TipoMensagem.Alerta);

                    return;

                }

                var tipoAtendimento = $("#TipoAtendimento").val();

                switch (tipoAtendimento) {
                    case "5":
                    case "6":
                        $("#emitirDocumento", "#divModalDeclaracao").trigger("click");
                        break;
                    default:
                        var idFichaAtedimento = $("#IdFichaAtendimento").val();
                        TIPOENTREGA.ObterParametrosTipoEntrega(idFichaAtedimento, exibirModalDeclaracao);
                        break;
                }
                
                break;
        }
      
    }

    function IniciarComplementoEncaminharFiscalizacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $.get("/AtendimentoConsumidor/AtendimentoInformacaoComplementar", { IdFicha: $("#IdFichaAtendimento").val() }, function (response, text, xhr) {
            //Hide Anterior
            $('div#divAtendimentoReclamacao').hide();

            //Carrega e mostra conteudo.
            $('div#divAtendimentoInfoComplementar').html(response);
            $('div#divAtendimentoInfoComplementar').show();

            CONTROLES.Editor.Configurar();
            $('.Editor-editor').height(660);          

            bindbtnVoltarEdicaoFicha();

            $('div#divAtendimentoInfoComplementar #btnPrevisualizar').off('click');
            $('div#divAtendimentoInfoComplementar #btnPrevisualizar').on("click", function () {
                $.post("/AtendimentoConsumidor/AtendimentoInformacaoComplementarPreVisualizar", { IdFicha: $("#IdFichaAtendimento").val(), texto: $("#mensagem").val() }, function (response, text, xhr) {
                    //Hide Anterior
                    $('div#divAtendimentoInfoComplementar').hide();

                    //Carrega e mostra conteudo.
                    $('div#divAtendimentoInfoComplementarPrevisualizar').html(response);
                    $('div#divAtendimentoInfoComplementarPrevisualizar').show();

                    //Bind Voltar
                    $('div#divAtendimentoInfoComplementarPrevisualizar .btnVoltar').off('click');
                    $('div#divAtendimentoInfoComplementarPrevisualizar .btnVoltar').on("click", function () {
                        $('#divAtendimentoInfoComplementar').show();
                        $('#divAtendimentoInfoComplementarPrevisualizar').empty();
                    });

                    BindBtnGerarEncaminhamento();
                   
                    
                });
            });
        });
    };

    function BindBtnGerarEncaminhamento() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('div#divAtendimentoInfoComplementarPrevisualizar .btnGerarEncaminhamento').off('click');
        $('div#divAtendimentoInfoComplementarPrevisualizar .btnGerarEncaminhamento').on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            GerarEncaminharFiscalizacaoDocumento($("#IdFichaAtendimento").val(), $("#corpo").val(), function (data) {
                
                window.location = BASE.Url.Simples("/AtendimentoConsumidor");
                window.open('/AtendimentoConsumidor/Imprimir?IdFicha=' + $("#IdFichaAtendimento").val(), '_blank');
                window.open('/AtendimentoConsumidor/ImprimirDocumentoProduzido?IdDocumento=' + data.IdDocumentoProduzido, '_blank');
                
            });
        });
    };

    function GerarEncaminharFiscalizacaoDocumento(_idFicha, _corpo, _callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.post("/AtendimentoFiscalizacao/GerarEncaminhamentoFiscalizacao", { idFichaAtendimento: _idFicha, corpo: _corpo }, function (data) {
            _callback(data);
        });
    }

    function bindVoltarParaAtendimentoTipoAtendimento() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divAtendimentoConsulta").on("click", "#btnVoltarParaAtendimentoTipoAtendimento", function (e) {
            BASE.LogEvent(e, moduleName);            

            var tipoDeAtendimento = $("#TipoAtendimento").val();

            var documento = $('#documentoFormatado').val();

            var idConsumidor = $('#IdConsumidor').val();

            var idFornecedor = $('#IdFornecedor').val();

            var idFicha = $('#IdFichaAtendimento').val();
            
            var ignorarFornecedor = getUrlParameter('ignorarFornecedor');

            if(ignorarFornecedor == ""){
                ignorarFornecedor = false;
            }
            
            window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=' + tipoDeAtendimento + '&idFicha=' + idFicha + '&ignorarFornecedor=' + ignorarFornecedor + '&etapa=tipoAtendimento';

            /*
            var fornecedorId = $('#Codigo').val();
            var ignorarFornecedor = fornecedorId === "0" || fornecedorId === undefined || fornecedorId === "";

            alterarSubTituloConsumidor(undefined);
            inicializaAtendimento(ignorarFornecedor);

            */
        });

        $("#divAtendimentoReclamacao").on("click", "#btnVoltarParaAtendimentoTipoAtendimento", function () {
            //inicializaAtendimento();           

            var tipoDeAtendimento = $("#TipoAtendimento").val();            

            var idConsumidor = $('#IdConsumidor').val();

            var idFornecedor = $('#IdFornecedor').val();

            var idFicha = $('#IdFichaAtendimento').val();

            var documento = getUrlParameter('doc');
            
            var ignorarFornecedor = getUrlParameter('ignorarFornecedor');

            if(ignorarFornecedor == ""){
                ignorarFornecedor = false;
            }
            
            window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=' + tipoDeAtendimento + '&idFicha=' + idFicha + '&ignorarFornecedor=' + ignorarFornecedor + '&etapa=tipoAtendimento';


        });
    }

    function bindVoltarParaAtendimentoTipoAtendimentoExtraProcon() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divAtendimentoExtraProcon").on("click", "#btnVoltarParaAtendimentoTipoAtendimento", function (e) {
            BASE.LogEvent(e, moduleName);

            var fornecedorId = $('#Codigo').val();
            var ignorarFornecedor = fornecedorId === "0" || fornecedorId === undefined || fornecedorId === "";

            inicializaAtendimento(ignorarFornecedor);
        });

        $("#divAtendimentoReclamacao").on("click", "#btnVoltarParaAtendimentoTipoAtendimento", function () {
            inicializaAtendimento();
        });
    }

    // --> end Atendimento

    // --> begin Emissão de Documentos
    function bindDeclaracao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divAtendimentoReclamacao").off("click", "#btnDeclaracao");
        $("#divAtendimentoReclamacao").on("click", "#btnDeclaracao", function (e) {
            BASE.LogEvent(e, moduleName);

            var tipoAtendimento = $("#TipoAtendimento").val();

            switch (tipoAtendimento) {
                case "6":
                    $("#emitirDocumento", "#divModalDeclaracao").trigger("click");
                    break;
                default:
                    var idFichaAtedimento = $("#IdFichaAtendimento").val();
                    TIPOENTREGA.ObterParametrosTipoEntrega(idFichaAtedimento, exibirModalDeclaracao);
                    break;
            }
        });
    }

    function bindEmitirDocumento() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#emitirDocumento", "#divModalDeclaracao").off("click");
        $("#emitirDocumento", "#divModalDeclaracao").on("click", function (e) {
            BASE.LogEvent(e, moduleName);

            editarCip();
            return false;

        });
    }

    function exibirModalDeclaracao() {
        $("#divModalDeclaracao").modal("show");
    }

    // --> end Emissão de Documentos

    // --> begin Outros
    function loadDropDownBoxElement(element, ignorarFornecedor, selectedValue) {
        BASE.LogFunction(arguments.callee, moduleName);

        var url = element.data("url");

        $.ajax({
            url: url + '&ignorarPassoFornecedor=' + ignorarFornecedor,
            dataType: "json",
            success: function (response, status, xhr) {
                if (response) {
                    var lista = response.listaTipoAtendimento;

                    element.empty();
                    element.append("<option value=''>Selecione</option>");

                    $(lista).each(function (index) {
                        element.append("<option value=" + lista[index].Value + ">" + lista[index].Text + "</option>");
                    });

                    if(selectedValue != null && selectedValue != undefined)
                    {
                        element.val(selectedValue);
                    }
                }
            },
            error: function (xhr, text, error) {
                BASE.Mensagem.Mostrar(text, TipoMensagem.Error);
            }
        });
    }

    function bindDescricaoConsulta() {
        BASE.LogFunction(arguments.callee, moduleName);       

        $('#DescricaoConsulta').off('keyup');
        $('#DescricaoConsulta').on('keyup', function () {
            var that = $(this);       

            unlockButton(that);
            remainingChars(that);
        });
    }

    function bindComentarios() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#Comentarios').off('keyup');
        $('#Comentarios').on('keyup', function () {
            var that = $(this);

            unlockButton(that);
            remainingChars(that);
        });
    }

    function bindDescricaoExtraProcon() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divAtendimentoExtraProcon').off('keyup', '#DescricaoConsulta');
        $('#divAtendimentoExtraProcon').on('keyup', '#DescricaoConsulta', function () {
            var that = $(this);

            unlockButton(that);
            remainingChars(that);
        });
    }

    function bindDescricaoReclamacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divAtendimentoReclamacao').off('keyup', '#DescricaoConsulta');
        $('#divAtendimentoReclamacao').on('keyup', '#DescricaoConsulta', function () {
            var that = $(this);

            unlockButton(that);
            remainingChars(that);
        });
    }

    function unlockButton(element) {
        BASE.LogFunction(arguments.callee, moduleName);

        var length = element.val().length;

        var tipoAtendimento = $('#TipoAtendimento').val();

        if (tipoAtendimento != "3" && tipoAtendimento != "11") {
            $('#btnConsultaEncerra').prop('disabled', length === 0);

        }       
    }

    function remainingChars(element) {
        BASE.LogFunction(arguments.callee, moduleName);

        var maxLength = element.attr('maxlength');
        var len = element.val().length;
        var length = maxLength - len;

        $('.remaining-chars[data-for="' + element.attr('name') + '"]').text(length);
    }

    function editarCip() {
        BASE.LogFunction(arguments.callee, moduleName);                

        verificacaoReclamacaoExistente(1, function (valido) {
            if (valido) {
                $("#btnDeclaracao", "#divAtendimentoReclamacao").prop("disabled", true);

                if ($("#TipoAtendimento").val() === "4") {
                    window.location = "/Cip/EditarCip?idFicha=" + $("#IdFichaAtendimento").val() + "&tipoEnvio=" + $("input[name=IdTipoAtendimentoEnvioCIP]:checked").val();
                }
                else if ($("#TipoAtendimento").val() === "5" || $("#TipoAtendimento").val() === "6") {
                    window.location = "/Reclamacao/CriarReclamacao?idFicha=" + $("#IdFichaAtendimento").val() + "&incluirDocumentoProduzido=True";
                }
            }
            else {
                BASE.MostrarMensagem("Documento já existente para esse Fornecedor!", TipoMensagem.Alerta);
                $("#btnDeclaracao", "#divAtendimentoReclamacao").prop("disabled", false);
            }
        });

    }

    function verificacaoReclamacaoExistente(IdTipo, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/Reclamacao/VerificarDuplicidadeReclamacao",
            data: { idReclamado: $("#IdReclamado").val(), idDocumento: $("#IdDocumento").val(), IdFicha: $("#IdFichaAtendimento").val(), idFonercecedor: $("#Codigo").val(), idTipo: IdTipo },
            dataType: "json",
            success: function (data) {
                if (callback !== undefined) {
                    callback(data.Valido);
                }
            }
        });
    }

    function selecionarClassificacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divAtendimentoReclamacao").off("change", "#IdClassificacao");
        $("#divAtendimentoReclamacao").on("change", "#IdClassificacao", function (e) {
            BASE.LogEvent(e, moduleName);
            changeClassificacao();

            var form = $("#frmAtendimentoReclamacao");
            $.validator.unobtrusive.parse(form);
        });

        $("#selecionarClassificacao select").on("change", function (e) {
            BASE.LogEvent(e, moduleName);

            var idClassificacao = $(this).val();
            $("#IdClassificacao").val(idClassificacao);

            if (idClassificacao > 0) {
                ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao(idClassificacao);
                ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor(idClassificacao);
                bindListaObjetosClassificacao(idClassificacao);

                var form = $("#frmAtendimentoReclamacao");
                $.validator.unobtrusive.parse(form);
            }
            else {
                $("#divVicioQualidade").hide();
                $("#divDadosContratacao").hide();
            }
        });
    }

    function changeClassificacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        var idClassificacao = $("#divAtendimentoReclamacao #IdClassificacao").val();

        if (idClassificacao > 0) {
            ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao(idClassificacao);
            ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor(idClassificacao, function () {
                var form = $("#frmAtendimentoReclamacao");
                $.validator.unobtrusive.parse(form);
            });
            bindListaObjetosClassificacao(idClassificacao);

            var form = $("#frmAtendimentoReclamacao");
            $.validator.unobtrusive.parse(form);
        }
        else {
            $("#divVicioQualidade").hide();
            $("#divDadosContratacao").hide();
        }
    }

    function bindListaObjetosClassificacao(idClassificacao, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/AtendimentoConsumidor/ListaParametrosPorClassificacao",
            data: { id: parseInt(idClassificacao) },
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("div[data-id-objeto-tipo-dados]").hide();
                    $("#divVicioQualidade").hide();
                    $("#divDadosContratacao").hide();

                    $("div[data-id-objeto-tipo-dados] input, div[data-id-objeto-tipo-dados] select").rules("remove", "required");
                    $("div[data-id-objeto-tipo-dados] input, div[data-id-objeto-tipo-dados] select").attr("disabled", "disabled");

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].ObjetoDadosAtivo) {                            

                            if (i > 0 && i < 10) {
                                $("#divDadosContratacao").show();
                            }

                            if (i > 9 && i < 14) {
                                $("#divVicioQualidade").show();
                            }                           

                            var elem = $("div[data-id-objeto-tipo-dados=" + data[i].IdObjetoTipoDados + "]");
                            elem.show();

                            var input = null;
                            if (data[i].TipoLista) {
                                input = elem.find("select").attr("name");

                                elem.find("select").removeAttr("disabled");
                                elem.find("input").attr("disabled", "disabled");
                                elem.find("input").hide();

                                elem.find("select").empty();
                                elem.find("select").append("<option value=''> Selecione </option>");
                                $(data[i].ListaParametroAtendimentoLista).each(function (j) {
                                    elem.find("select").append("<option value='" + data[i].ListaParametroAtendimentoLista[j].IdObjtoDadoLista + "'>" + data[i].ListaParametroAtendimentoLista[j].DescricaoObjetoDadoLista + "</option>");
                                });

                                elem.find("select").find("option").each(function () {
                                    if ($(this).text() === $("#hdn" + elem.find("select").attr("name")).val()) {
                                        $(this).attr('selected', "selected");
                                    }
                                });

                                elem.find("select").show();
                                
                            } else {
                                input = elem.find("input").attr("name");

                                elem.find("input").removeAttr("disabled");
                                elem.find("select").attr("disabled", "disabled");
                                elem.find("select").hide();
                                elem.find("input").show();
                            }

                            var label = $('label[for="' + input + '"]');
                            if (label !== null) {
                                label.text(data[i].DescricaoObjeto);
                            }
                        }                       

                    }

                    var form = $("#frmAtendimentoReclamacao");
                    $.validator.unobtrusive.parse(form);

                    $("#divPedidoAbatimentoOuCancelamento").toggle(false);
                    $("#divOutroPedido").toggle(false);

                    bindDataContratacao();
                    bindDataComplementarCompra();
                    bindDataOs();

                    if(callback != undefined)
                        callback();
                   
                    
                }
            },
            error: function (xhr, text, error) {
                BASE.MostrarMensagemErro(text);
            }
        });
    }

    function bindDataContratacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#DataCompraContratacao", "#frmAtendimentoReclamacao").datetimepicker({
            locale: moment.locale("pt-br"),
            format: "DD/MM/YYYY",
            minDate: new Date(1900, 0, 1)
        });

        $("#DataCompraContratacao", "#frmAtendimentoReclamacao").closest("div").find(" .input-group-addon").off("click");
        $("#DataCompraContratacao", "#frmAtendimentoReclamacao").closest("div").find(" .input-group-addon").on("click", function () {
            $("#DataCompraContratacao", "#frmAtendimentoReclamacao").focus();
        });
    }

    function bindDataOs() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#DataOs", "#frmAtendimentoReclamacao").datetimepicker({
            locale: moment.locale("pt-br"),
            format: "DD/MM/YYYY",
            minDate: new Date(1900, 0, 1)
        });

        $("#DataOs", "#frmAtendimentoReclamacao").closest("div").find(" .input-group-addon").off("click");
        $("#DataOs", "#frmAtendimentoReclamacao").closest("div").find(" .input-group-addon").on("click", function (e) {
            BASE.LogEvent(e, moduleName);
            $("#DataOs", "#frmAtendimentoReclamacao").focus();
        });
    }

    function bindDataComplementarCompra() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#DataComplementarCompra", "#frmAtendimentoReclamacao").datetimepicker({
            locale: moment.locale("pt-br"),
            format: "DD/MM/YYYY",
            minDate: new Date(1900, 0, 1)
        });

        $("#DataComplementarCompra", "#frmAtendimentoReclamacao").closest("div").find(" .input-group-addon").off("click");
        $("#DataComplementarCompra", "#frmAtendimentoReclamacao").closest("div").find(" .input-group-addon").on("click", function (e) {
            BASE.LogEvent(e, moduleName);
            $("#DataComplementarCompra", "#frmAtendimentoReclamacao").focus();
        });
    }

    function bindChangePedido() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("body").off("click", "#IdTipoPedidoConsumidor");
        $("body").on("click", "#IdTipoPedidoConsumidor", function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $('select[Name="IdTipoPedidoConsumidor"] option:selected');
            var text = that.text().toLowerCase();
            var abatimento = text.indexOf("abatimento") >= 0;
            var cancelamento = text.indexOf("cancelamento") >= 0;
            var outros = text.indexOf("outros") >= 0;
            var exibir = abatimento || cancelamento;
            var exibirOutroPedido = outros;

            if (that.val() !== "") {
                $("#divPedidoAbatimentoOuCancelamento").toggle(exibir);
                $("#divOutroPedido").toggle(exibirOutroPedido);
            }
            else {
                $("#divPedidoAbatimentoOuCancelamento").toggle(false);
                $("#divOutroPedido").toggle(false);
            }
        });
    }

    function renderAndEmptyHtml(htmlResponse, elementRender, elementEmpty, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#" + elementRender).html(htmlResponse);
        $("#" + elementEmpty).empty();

        if (callback !== undefined)
            callback();
    }

    function validarDados(form) {
        BASE.LogFunction(arguments.callee, moduleName);
        
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }
        return form.valid(true);
    }

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

    function definirUrlRetorno() {
        BASE.LogFunction(arguments.callee, moduleName);

        ATENDIMENTOBASE.Redirect.Definir('/AtendimentoConsumidor');

    };

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

   return {
        Init: init,
        Confirmacao: {
            ConsumidorNaoEncontrado: modalConsumidorNaoEncontrado,
            FornecedorNaoEncontrado: modalFornecedorNaoEncontrado
        }
    };
}());

$(function () {
    ATENDIMENTO_CONSUMIDOR.Init();
});
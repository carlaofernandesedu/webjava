var ATENDIMENTOBASE = (function () {
    var moduleName = "ATENDIMENTOBASE";

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);
        bindAll();
    }

    function bindAll() {
        bindEncaminharAtendimentoFiscalizacao();
        bindGerarDeclaracao();
        bindLinkConsumidor();
        bindImprimirAnexos();
        bindImprimirDocumentos();
        bindImprimirProtocolo();
        bindVoltarAtendimento();   
        bindVoltarAtendimentoSupervisor();     
    }

    function bindVoltarAtendimento(){
        $('#btnVoltarAoAtendimento').off('click');
        $('#btnVoltarAoAtendimento').on('click', function(){
                     
            var idFicha = getUrlParameter("idFichaAtendimento");
            window.location = "/PesquisarAtendimento/EditarAtendimento?idFicha=" + idFicha;

        });
    
    } 

    function bindVoltarAtendimentoSupervisor(){
        $('button[onclick*=AtendimentoSolicitacoes]').off('click');
        $('button[onclick*=AtendimentoSolicitacoes]').on('click', function(){

            var url = ATENDIMENTOBASE.Redirect.Obter();

            if(url != undefined && url != null && url != ""){
                 window.location = url;
                
            }            

        });
    
    } 

    function bindImprimirAnexos() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#bottomToolbar").off("click", "#btnImprimirAnexos");
        $("#bottomToolbar").on("click", "#btnImprimirAnexos", function () {
            var anexos = $('#tabArquivos tbody tr');

            if (anexos.length > 0) {
                anexos.each(function (index, element) {
                    var idAquisicao = $(this).data('idaquisicao');
                    var idAnexo = $(this).data('idanexo');
                    if (idAquisicao !== undefined && idAnexo !== undefined) {
                        var url = "/AtendimentoTecnico/DownloadArquivo?idAquisicao=" + idAquisicao + "&idAnexo=" + idAnexo;

                        BASE.Util.AbrirUrlEmNovaAba(url);
                    }
                });
            }
        });
    }

    function bindImprimirDocumentos() {
        $("#bottomToolbar").off("click", "#btnImprimirDocumentos");
        $("#bottomToolbar").on("click", "#btnImprimirDocumentos", function () {
            var anexos = $('#tabDocumentosProduzidos tbody tr');

            if (anexos.length > 0) {
                anexos.each(function (index, element) {
                    var idReclamado = $(this).data('idreclamado');
                    var idDocumentoProduzido = $(this).data('iddocumentoproduzido');
                    
                    if (idReclamado !== undefined && idDocumentoProduzido !== undefined) {
                        var url = "/AtendimentoTecnico/ExibirDocumentoProduzido?IdReclamado=" + idReclamado + "&IdDocumentoProduzido=" + idDocumentoProduzido;

                        BASE.Util.AbrirUrlEmNovaAba(url, true, true);
                    }
                });
            }
        });
    }

    function bindImprimirProtocolo() {
        $("#bottomToolbar").off("click", "#btnImprimirProtocolo");
        $("#bottomToolbar").on("click", "#btnImprimirProtocolo", function () {
            var idFichaAtendimento = $(this).data("id-ficha-atendimento");
            window.open("/AtendimentoTecnico/ImprimirProtocolo?idFichaAtendimento=" + idFichaAtendimento, "_blank");
        });
    }

    function bindEncaminharAtendimentoFiscalizacao() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#btnEncaminharAtendimentoFiscalizacao").off("click");
        $("#btnEncaminharAtendimentoFiscalizacao").on("click", function () {
            console.log("clicouEncaminharAtendimentoFiscalizacao - click");

            var idFichaAtendimento = $("#IdFichaAtendimento").val(),
                idTipoAtendimento = TipoAtendimento.AtendimentoFiscalizacao,
                idSituacaoAtendimento = $(this).data("id-situacao-atendimento");

            BASE.Modal.ExibirModalConfirmacao("Encaminhar Atendimento para Fiscalização", "Deseja mesmo encaminhar a solicitação para fiscalização?", TamanhoModal.Pequeno, "Não", "btn-primary", "Sim", "btn-danger",
                function () {
                    alterarSituacaoParaAtendimentoFiscalizacao(idFichaAtendimento, idTipoAtendimento, idSituacaoAtendimento);
                }, null);
        });
    }

    function bindGerarDeclaracao() {
        BASE.LogFunction(arguments.callee, moduleName);

        var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

        $("#btnGerarDeclaracao").off("click");
        $("#btnGerarDeclaracao").on("click", function () {
            console.log("bindGerarDeclaracao - click");

            var idFichaAtendimento = $(this).data("idfichaatendimento"),
                tipoEnvio = $(this).data("idtipoenvio"),
                idReclamado = $(this).data("idreclamado"),
                descricaoReclamacao = $(this).data("dsreclamacao"),
                prazoConsumidor = $(this).data("prazoconsumidor"),
                prazoFornecedor = $(this).data("prazofornecedor");

            verificarSeExisteDeclaracao(idReclamado, function (existeDeclaracao) {
                exibirModalSalvarDeclaracao(idFichaAtendimento, tipoEnvio, idReclamado, descricaoReclamacao, prazoConsumidor, prazoFornecedor, urlRedirect, "Cancelar", "Gerar Declaração", existeDeclaracao);
            });
        });
    }    

    function verificarSeExisteDeclaracao(idReclamado, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/Cip/VerificarSeDocumentoProduzidoExiste",
            type: "GET",
            data: { idReclamado: idReclamado },
            cache: false,
            success: function (response, text, xhr) {
                console.log("verificarSeExisteDeclaracao - success");

                if (response.Sucesso) {
                    var existeDeclaracao = response.Resultado !== null;
                    if (callback !== undefined)
                        callback(existeDeclaracao);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("erro", jqXhr);
            }
        });
    };

    function bindLinkConsumidor() {
        BASE.LogFunction(arguments.callee, moduleName);

        $(".link-consumidor").off("click");
        $(".link-consumidor").on("click", function () {
            console.log("bindLinkConsumidor - click");

            var url = $(this).data("url");
            obterConsumidor(url);

        });
    }

    function obterConsumidor(url) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({           
            url: url,
            type: "GET",
            success: function (response, text, xhr) {
                renderHtmlDadosConsumidor(response);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("erro ao buscar consumidor ");
            }
        });
    }

    function renderHtmlDadosConsumidor(response) {
        $("#modalConsumidor #resultado").html(response);
        $("#modalConsumidor").modal();
    }

    function encerrarAtendimento(idFicha) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/AtendimentoTecnico/EncerrarAtendimento/",
            data: { idFicha: idFicha },
            type: "Post",
            dataType: "json",
            success: function (data) {
                if (data) {
                    ATENDIMENTOBASE.Evento.PosSalvar();
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

    function alterarSituacaoParaAtendimentoFiscalizacao(idFichaAtendimento, idTipoAtendimento, idSituacaoAtendimento) {
        BASE.LogFunction(arguments.callee, moduleName);

        var msgFiscalizacao = "Sua Solicitação foi encaminhada para Fiscalização";

        $.ajax({
            url: "/AtendimentoTecnico/EncaminharParaFiscalizacao",
            type: "POST",
            data: { idFichaAtendimento: idFichaAtendimento, idTipoAtendimento: idTipoAtendimento, idSituacaoAtendimento: idSituacaoAtendimento, msgIteracao: msgFiscalizacao },
            success: function (response, status, xhr) {
                if (response.valido === true)
                    window.location = BASE.Url.Simples("/AtendimentoTecnico/AtendimentoSolicitacoes");
            },
            error: function (response, status, xhr) {
                console.log("Erro ao alterar status do atendimento.");
            }
        });

        console.log(idFichaAtendimento);
        console.log(idSituacaoAtendimento);
    }

    //Controle de Redirecionamento de Fluxo -------------------------------->
    //Necessita verificar o carregamento de arquivo nos bundles, onde haja necessidade de utilização.
    function definirRedirect(value) {
        if (value !== undefined) {
            if (value.includes('AtendimentoTecnico')) {
                CLIENTSTORAGE.AdicionarObjeto("link", '/AtendimentoTecnico/AtendimentoSolicitacoes');
            }
            /*
            else if (value.includes('PesquisarAtendimento')) {
                CLIENTSTORAGE.AdicionarObjeto("link", '/PesquisarAtendimento');
            }

            */
            else if (value !== undefined) {
                CLIENTSTORAGE.AdicionarObjeto("link", value);
            }
        }
        else {
            CLIENTSTORAGE.AdicionarObjeto("link", document.referrer);
        }
    }

    function obterRedirect() {
        var link = CLIENTSTORAGE.ObterObjeto("link");

        return link;
    }

    function limparRedirect() {
        CLIENTSTORAGE.RemoverObjeto("link");
    }
    //Controle de Redirecionamento de Fluxo -------------------------------->

    function editarEncaminhamentofiscalizacao(idFichaAtendimento, atendTec, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/AtendimentoFiscalizacao/EditarEncaminhamento",
            data: { idFichaAtendimento: idFichaAtendimento, atendTec: atendTec },
            cache: false,
            success: function (response, text, xhr) {
                if (callback !== undefined)
                    callback(response);
            },
            error: function (jqXhr, textStatus, errorThrown) {
            }
        });
    }

    function previsualizarEncaminhamentoFiscalizacao(idFichaAtendimento, texto, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/AtendimentoFiscalizacao/PreVisualizarEncaminhamento",
            type: "POST",
            data: { idFichaAtendimento: idFichaAtendimento, texto: texto },
            cache: false,
            success: function (response, text, xhr) {
                if (callback !== undefined)
                    callback(response);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("erro", jqXhr);
            }
        });
    }

    function gerarEncaminharFiscalizacaoDocumento(idFichaAtendimento, corpo, callback) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/AtendimentoFiscalizacao/GerarEncaminhamentoFiscalizacao",
            type: "POST",
            data: { idFichaAtendimento: idFichaAtendimento, corpo: corpo },
            cache: false,
            success: function (response, text, xhr) {
                if (callback !== undefined)
                    callback(response);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("erro", jqXhr);
            }
        });
    }

    function exibirModalSalvarDeclaracao(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, prazoConsumidor, prazoFornecedor, urlRedirect, tituloBtnNegativo, tituloBtnAfirmativo, existeDeclaracao) {
        BASE.LogFunction(arguments.callee, moduleName);
        console.log("urlRedirect :" + urlRedirect);

        var tituloBtnNao = (tituloBtnNegativo !== undefined && tituloBtnNegativo !== null) ? tituloBtnNegativo : "Finalizar sem Gerar Declaração";
        var tituloBtnSim = (tituloBtnAfirmativo !== undefined && tituloBtnAfirmativo !== null) ? tituloBtnAfirmativo : "Gerar Declaração";
        var tituloDeclaracaoExistente = (existeDeclaracao !== false && existeDeclaracao !== undefined && existeDeclaracao !== null) ? "</br></br><center>Já existe Declaração nesta Ficha de Atendimento</center>" : "";

        BASE.Modal.ExibirModalPrompt("Documentos solicitados/Outras orientações" + tituloDeclaracaoExistente,
            TipoInput.Text,
            undefined,
            undefined,
            TamanhoModal.Grande,
            "",
            "<i class='fa fa-close margR5'></i>" + tituloBtnNao,
            "btn-warning",
            "<i class='fa fa-save margR5'></i>" + tituloBtnSim,
            "btn-primary",
            function (valueOrientacoes) {
                salvarDeclaracao(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, valueOrientacoes, prazoConsumidor, prazoFornecedor, urlRedirect);
            },
            function () {
                if (urlRedirect !== null && urlRedirect !== undefined)
                    window.location = urlRedirect;
            }
        );
    }

    function salvarDeclaracao(idFichaAtendimento, idTipoEnvio, idReclamado, dsReclamacao, orientacoes, prazoConsumidor, prazoFornecedor, urlRedirect) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/Cip/SalvarDeclaracao",
            data: { idFicha: parseInt(idFichaAtendimento), tipoEnvio: parseInt(idTipoEnvio), idReclamado: parseInt(idReclamado), descricao: dsReclamacao, orientacoes: orientacoes, prazoConsumidor: prazoConsumidor, prazoFornecedor: prazoFornecedor },
            type: "POST",
            dataType: "json",
            success: function (data) {
                if (data.Sucesso) {
                    window.open("/Cip/ExibiRelatorioDeclaracao?idRelatorio=" + data.Resultado.IdDocumentoProduzido, "_blank");

                    BASE.Modal.ExibirModalAlerta("Documentos Emitidos!",
                        "Emissão realizada com sucesso!",
                        "small",
                        "OK",
                        "btn-primary",
                        function () {
                            if (urlRedirect !== null && urlRedirect !== undefined)
                                window.location = urlRedirect;
                        });
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.MostrarMensagem(textStatus, TipoMensagem.error);
            }
        });
    }

    function carregarPedidoConsumidor(idClassificacao, callback, ddl, hdn ) {
        if (idClassificacao) {         

            if (ddl == undefined) {
                ddl = $("#ddlTipoPedidoConsumidor");
                
            }

            if (hdn == undefined) {
                hdn = $("#hdnIdTipoPedidoConsumidor");

            }

            if (ddl.length === 0) {
                ddl = $("#IdTipoPedidoConsumidor");
            }

            $.ajax({
                url: "/AtendimentoConsumidor/ListaTipoPedidoPorClassificacao/",
                data: { id: parseInt(idClassificacao) },
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data) {
                        ddl.empty();
                        ddl.append("<option value=" + "" + ">" + "Selecione" + "</option>");

                        $(data).each(function (i) {
                            if (data[i].bl_ativo_tipo_pedido_consumidor) {
                                ddl.append("<option value=" + data[i].id_tipo_pedido_consumidor + ">" + data[i].ds_tipo_pedido_consumidor + "</option>");
                            }
                        });

                        if (hdn.val()) {
                            var tipoPedido = hdn.val() === "0" ? "" : hdn.val();
                            ddl.val(tipoPedido);
                        }

                        if (callback != undefined)
                            callback();

                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitacao.", TipoMensagem.Error);
                    console.log(xmlHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    }

    function carregarMeioAquisicao(idClassificacao, callback, ddl, hdn) {
        if (idClassificacao) {        

            if (ddl == undefined) {
                ddl = $("#ddlMeioAquisicao");

            }

            if (hdn == undefined) {
                hdn = $("#hdnIdMeioAquisicao");

            }

            if (ddl.length === 0) {
                ddl = $("#IdMeioAquisicao");
            }

            $.ajax({
                url: "/MeioAquisicao/ObterMeioAquisicao",
                data: { idClassificacao: parseInt(idClassificacao) },
                dataType: "json",
                success: function (data) {
                    if (data) {
                        var idAquisicao = $("#IdMeioAquisicao").val();

                        ddl.empty();
                        ddl.append("<option value=" + "" + ">" + "Selecione" + "</option>");
                        $(data).each(function (i) {
                            ddl.append("<option value=" + data[i].Value + ">" + data[i].Text + "</option>");
                        });

                        if (hdn.val()) {
                            var aquisicao = hdn.val() === "0" ? "" : hdn.val();
                            ddl.val(aquisicao);
                        }

                        var form = $("#form-dados-compra");
                        if (form.length > 0) {
                            $.validator.unobtrusive.parse(form);
                        }                       

                        if (callback != undefined)
                            callback();
                    }
                },
                error: function (xhr, text) {
                    BASE.MostrarMensagemErro(text);
                }
            });
        }
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    return {
        Init: function () {
            init();
        },
        Dropdown: {
            CarregarPedidoConsumidor: carregarPedidoConsumidor,
            CarregarMeioAquisicao: carregarMeioAquisicao
        },
        Acao: {
            EncerrarAtendimento: encerrarAtendimento,
            EncaminharAtendimentoFiscalizacao: bindEncaminharAtendimentoFiscalizacao,
            Encaminhamento: {
                Editar: editarEncaminhamentofiscalizacao,
                Previsualizar: previsualizarEncaminhamentoFiscalizacao,
                Gerar: gerarEncaminharFiscalizacaoDocumento
            },
            Declaracao: {
                ExibirModalSalvarDeclaracao: exibirModalSalvarDeclaracao
            }
        },
        Evento: {
            PosSalvar: function () { return false; }
        },
        Redirect: {
            Definir: definirRedirect,
            Obter: obterRedirect,
            Limpar: limparRedirect
        }
    };
}());

$(function () {
    ATENDIMENTOBASE.Init();
});
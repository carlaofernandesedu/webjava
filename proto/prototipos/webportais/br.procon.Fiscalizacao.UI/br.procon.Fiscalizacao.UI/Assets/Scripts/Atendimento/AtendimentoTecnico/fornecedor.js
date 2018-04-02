var ATENDIMENTOTECNICOFORNECEDOR = (function () {

    function init() {
        bindAll();
    }

    function bindAll() {
        bindEditarFornecedor();
        bindSelecionarCpfCnpj();
        bindCep();
        selecionarEstado();
        //bindConfirmarFornecedor();
        bindNomeFornecedorAutoComplete();
        bindNrDocumentoFornecedorAutoComplete();
        bindSite();
        bindSitePessoal();

        if (possuiDocumentoCorporativo()) {
            $("#sinaliza-documento-corporativo").show();
        }
        else {
            $("#sinaliza-documento-corporativo").hide();
        }

        var docFormatado = $("#NumDocumento").val().replace(/[^0-9]+/g, "");

        if (ehPessoaJuridica() || docFormatado.length === 0) {
            $($("#editarDadosConsumidor #DocumentoCnpj")[0]).prop("checked", true);
            definirMascaraCpfCnpj(true);
        }
        else {
            $($("#editarDadosConsumidor #DocumentoCnpj")[1]).prop("checked", true);
            definirMascaraCpfCnpj(false);
        }
    }

    function bindSelecionarCpfCnpj() {
        $("input[name=DocumentoCnpj]").off("change");
        $("input[name=DocumentoCnpj]").on("change", function () {
            var that = $(this);
            var isCnpj = that.val() === "True";

            definirMascaraCpfCnpj(isCnpj);
        });
    }

    function bindEditarFornecedor() {
        $("#salvarEdicaoFornecedor").off("click");
        $("#salvarEdicaoFornecedor").on("click", function () {
            console.log("salvando edicao fornecedor");
            var form = $("#form-editar-fornecedor"),
                valido = validarDados(form);

            if (valido) {
                solicitarAlteracao();
            }
        });
    }

    function bindCep() {
        $("input[name=Cep]").off("blur");
        $("input[name=Cep]").on("blur", function () {
            console.log("disparou");
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "/Cep/GetEnderecoByCep",
                cache: false,
                data: { cep: $(this).val().replace(/[^\d]+/g, "") },
                success: function (data) {
                    if (data === "") {
                        BASE.Mensagem.Mostrar("CEP", "CEP não localizado", TipoMensagem.Alerta);
                        console.log("Cep não foi localizado!");

                    } else {
                        data = JSON.parse(data);

                        $("#editarDadosConsumidor #IdMunicipio").val(data[0].idMunicipio);
                        $("#Logradouro").val((data[0].tipoLogradouro + " " + data[0].endereco).trim());
                        $("#Bairro").val(data[0].bairro);
                        $("#Cidade").val(data[0].municipio);
                        $("#Estado").val(data[0].uf);

                        $("#Logradouro").valid();
                        $("#Bairro").valid();
                        $("#Cidade").valid();
                        $("#Estado").valid();

                        $("#Numero").focus();
                    }
                },
                error: function () {
                    BASE.Mensagem.Mostrar("CEP", "CEP não localizado", TipoMensagem.Alerta);
                }
            });
        });
    }

    function bindNomeFornecedorAutoComplete() {
        $("#Nome", "#editarDadosConsumidor").data("val", "true");
        $("#Nome", "#editarDadosConsumidor").data("valRequired", "O campo 'Nome' é de preenchimento obrigatório.");

        $("#Nome", "#editarDadosConsumidor").typeahead({
            onSelect: function (item) {
                obterFornecedorPorId(item.value);
                $("#IdFornecedor").val(item.value);
            },
            ajax: {
                url: "/Fornecedor/ObterFornecedorAutoCompletePJSomentePai/",
                triggerLength: 2,
                dataType: "json",
                displayField: "Html",
                valueField: "Id",
                preDispatch: function (query) {
                    return {
                        filtro: query
                    }
                },
                preProcess: function (data) {

                    if (data.length === 0) {
                        $("#IdFornecedor").val(null);
                        limparModalFornecedor();
                    }


                    return data;
                }
            }
        });
    }

    function bindNrDocumentoFornecedorAutoComplete() {
        $("#NumDocumento", "#editarDadosConsumidor").off("blur");
        $("#NumDocumento", "#editarDadosConsumidor").on("blur", function () {
            console.log("executando busca por nr documento");

            var nrDocumento = $(this).val();
            obterFornecedorPorNrDocumento(nrDocumento);
        });
    }

    function bindSite() {
        $('input[name="Site"]').off("blur");
        $('input[name="Site"]').on("blur", function () {
            $.ajax({
                type: "GET",
                url: "/AtendimentoBase/GetBlackList",
                data: { site: $(this).val() },
                success: function (data) {
                    if (data === true) {
                        bootbox.alert({
                            title: "Evite Sites do Procon!",
                            message: "O web site informado, pertence a lista Evite Sites do Procon, onde não cabe mais a abertura de reclamações contra estes!",
                            size: "small",
                            callback: function () {
                                window.location = "/AtendimentoConsumidor/Index";
                            }
                        });
                    }
                }
            });
        });
    }

    function bindSitePessoal() {
        $('input[name="WebSite"]').off("blur");
        $('input[name="WebSite"]').on("blur", function () {
            $.ajax({
                type: "GET",
                url: "/AtendimentoBase/GetBlackList",
                data: { site: $(this).val() },
                success: function (data) {
                    if (data === true) {
                        bootbox.alert({
                            title: "Evite Sites do Procon!",
                            message: "O web site informado, pertence a lista Evite Sites do Procon, onde não cabe mais a abertura de reclamações contra estes!",
                            size: "small",
                            callback: function () {
                                window.location = "/AtendimentoConsumidor/Index";
                            }
                        });
                    }
                }
            });
        });
    }

    function selecionarEstado() {
        if ($("#Estado").val()) {
            $("#Estado").val($("#Estado").val());
        }
    }

    function solicitarAlteracao() {
        if (ehPessoaJuridica()) {
            if (possuiDocumentoCorporativo()) {
                BASE.MostrarModalConfirmacao(
                    "CNPJ Corporativo encontrado!",
                    "Aceita utilizar os dados corporativos para o fornecedor informado?",
                    salvarFornecedor
                );
            }
            else {
                salvarFornecedor();
            }
        }
        else {
            salvarFornecedor();
        }
    }

    function ehPessoaJuridica() {
        var docFormatado = $("#NumDocumento").val().replace(/[^0-9]+/g, "");

        return (docFormatado.length > 11) || ($("#DocumentoCnpj", "body").val() === "True");
    }

    function possuiDocumentoCorporativo() {
        var result = false;

        $.ajax({
            url: "/AtendimentoTecnico/VerificaExistenciaDeOutroDocumentoAssociado",
            data: { documentoComFormatacao: $("#NumDocumento").val() },
            type: "GET",
            dataType: "JSON",
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitação.", TipoMensagem.Error);
            }
        });

        return result;
    }

    function salvarFornecedor() {
        $.ajax({
            url: "/AtendimentoTecnico/EditarFornecedor",
            data: $("#form-editar-fornecedor").serialize(),
            type: "POST",
            dataType: "JSON",
            async: false,
            success: function (data) {

                if(data.Sucesso) {
                    var idFichaAtendimento = $("#IdFichaAtendimento").val();
                    window.location = "/AtendimentoTecnico/AtendimentoSolicitacaoRealizarAnalisePerfilTecnico?idficha=" + idFichaAtendimento + "&verificarDuplicidade=false";
                } else {
                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error, "Erro");
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                console.log("erro ao editar fornecedor");
            }
        });
    }

    function obterFornecedorPorId(idFornecedor) {
        $.ajax({
            url: "/Fornecedor/ObterFornecedorPorId/",
            data: {
                idFornecedor: idFornecedor
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data) {
                    carregarFornecedor(data);
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitação.", TipoMensagem.Error);
            }
        });
    }

    function obterFornecedorPorNrDocumento(nrDocumento) {
        $.ajax({
            url: "/Fornecedor/GetFornecedorByCnpj",
            data: { cnpj: nrDocumento },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.retorno) {
                    carregarFornecedor(data.retorno);
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                BASE.Mensagem.Mostrar( "Aviso", TipoMensagem.Error, "Erro ao enviar solicitação.");
            }
        });
    }

    function carregarFornecedor(data) {
        if(data.PJ.CNPJ !== null) {
            $("#Cnpj").prop("checked", true);
            $("#NumDocumento").val(data.PJ.CNPJ);
            definirMascaraCpfCnpj(true);
        } else {
            $("#Cpf").prop("checked", true);
            $("#NumDocumento").val(data.PF.CPF);
            definirMascaraCpfCnpj(false);
        }

        $("#IdFornecedor").val(data.Codigo);
        $("#Nome").val(data.Nome);
        $("#NomeFantasia").val(data.NomeFantasia);
        $("#Telefone").val(data.Telefone);
        definirMascaraTelefone();

        $("#Email").val(data.Email);
        $("#Site").val(data.WebSite);
        $("#Cep").val(data.EnderecoSEFAZ.CEP);

        definirMascaraCep();
        $("#Cep").trigger("blur");
    }

    function definirMascaraCpfCnpj(isCnpj) {
        $("#NumDocumento").rules("remove");
        if (isCnpj) {
            $("#NumDocumento").mask("00.000.000/0000-00");
            $("#NumDocumento").rules("add", { cnpj: true });
        } else {
            $("#NumDocumento").mask("000.000.000-00");
            $("#NumDocumento").rules("add", { cpf: true });
        }
        $("#NumDocumento").val($("#NumDocumento").masked($("#NumDocumento").val()));
    }

    function definirMascaraTelefone() {
        $("#Telefone").mask("(00) 0000-0000");
        $("#Telefone").val($("#Telefone").masked($("#Telefone").val()));
    }

    function definirMascaraCep() {
        $("#Cep").mask("00000-000");
        $("#Cep").val($("#Cep").masked($("#Cep").val()));
    }

    function validarDados(form) {
        if($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug("problema no jQuery validator", DebugAction.Warn);
        }

        return form.valid(true);
    }

    function limparModalFornecedor() {
        $("#IdFornecedor").val(null);
        $("#form-editar-fornecedor #IdMunicipio").val("");

        $("#form-editar-fornecedor #NomeFantasia").val("");
        $("#form-editar-fornecedor #NumDocumento").val("");
        $("#form-editar-fornecedor #Site").val("");
        $("#form-editar-fornecedor #Telefone").val("");
        $("#form-editar-fornecedor #Email").val("");
        $("#form-editar-fornecedor #Cep").val("");
        $("#form-editar-fornecedor #Logradouro").val("");
        $("#form-editar-fornecedor #Numero").val("");
        $("#form-editar-fornecedor #ComplementoEndereco").val("");
        $("#form-editar-fornecedor #Bairro").val("");
        $("#form-editar-fornecedor #Cidade").val("");
        $("#form-editar-fornecedor #Estado").val(null);
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function() {
    ATENDIMENTOTECNICOFORNECEDOR.Init();
});
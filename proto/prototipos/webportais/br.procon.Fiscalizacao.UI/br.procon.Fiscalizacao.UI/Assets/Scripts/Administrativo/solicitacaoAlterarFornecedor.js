SOLICITACAO_ALTERAR_FORNECEDOR = (function () {
    function definirModalPosSalvar() {
        BASE.MostrarModalConfirmacao('Inclusão de Registro', 'Registro incluído com sucesso! Deseja realizar um novo cadastro?', function () {
            window.location.href = window.location.pathname;
        },
            CRUDBASE.Eventos.Cancelar);
    }

    function bindChangeCnae() {
        //CNAE AUTOCOMPLETE
        window.cnaeAutocomplete.init();
    }

    function bindSalvar() {
        $("#divToolbar").on("click", "#btnSpecifico", function () {
            window.location = '/alteracaoFornecedor/CriarSolicitacao';
        });
        CRUDBASE.Eventos.Cancelar = function () {
            window.location = "/alteracaoFornecedor/Index";
        };
        CRUDBASE.Eventos.ModalPosCriar = definirModalPosSalvar;
    }

    function pesuisarPorCriterios() {

        CRUDFILTRO.Filtrar();
    }

    function carregarDdl() {
        CONTROLES.DropDown.Preencher('#CodigoCNAE', 'CNAE', 'SelectList', null, "Selecione", null, null, null);
        CONTROLES.DropDown.Preencher('#ClassificacaoFiscal', 'AlteracaoFornecedor', 'ClassificacaoFiscalSelectList', null, "Selecione", null, null, null);
    }

    function carregarConteudo() {
        var form = '#frm-filtro';
        $(form).off('keyup', "#CPF:not('.filtro-busca-campo')");
        $(form).on('keyup', "#CPF:not('.filtro-busca-campo')", function () {
            if (parseInt($(this).val().length) == 14) {
                $(this).attr('readonly', true);
                pesuisarPorCriterios();
            }
        });

        $(form).off('keyup', "#CNPJ:not('.filtro-busca-campo')");
        $(form).on('keyup', "#CNPJ:not('.filtro-busca-campo')", function () {
            if (parseInt($(this).val().length) == 18) {
                $(this).attr('readonly', true);
                pesuisarPorCriterios();              
            }
        });

        form = "#form-detalhe";

        $(form).off('change', '.data');
        $(form).on('change', '.data', function () {

            var valorAtual = $(this).val();
            var valorAntido = $(this).data('valor-anterior');

            if (valorAtual !== valorAntido) {
                $(this).css("border", "2px solid #000");
            }
            else {
                $(this).css("border", "1px solid #ccc");
            }

        });


        $(form).off('blur', ".validaValorOriginal:not('.data'):not('.cep')");
        $(form).on('blur', ".validaValorOriginal:not('.data'):not('.cep')", function () {

            var valorAtual = $(this).val();
            var valorAntido = $(this).data('valor-anterior');

            if (valorAtual !== valorAntido) {
                $(this).css("border", "2px solid #000");
            }
            else {
                $(this).css("border", "1px solid #ccc");
            }
        });

        $(form).off('blur', ".cep");
        $(form).on('blur', ".cep", function () {

            var valorAtual = $(this).val().replace(/[\.\-]/g, '');
            var valorAntido = $(this).data('valor-anterior');

            if (valorAtual !== valorAntido) {
                $(this).css("border", "2px solid #000");
                $($(this).closest('.div-panel')).find('.loadLogradouro').css("border", "2px solid #000");
                $($(this).closest('.div-panel')).find('.loadBairro').css("border", "2px solid #000");
                $($(this).closest('.div-panel')).find('.loadMunicipio').css("border", "2px solid #000");
                $($(this).closest('.div-panel')).find('.loadUF').css("border", "2px solid #000");
            }
            else {
                $(this).css("border", "1px solid #ccc");
                $($(this).closest('.div-panel')).find('.loadLogradouro').css("border", "1px solid #ccc");
                $($(this).closest('.div-panel')).find('.loadBairro').css("border", "1px solid #ccc");
                $($(this).closest('.div-panel')).find('.loadMunicipio').css("border", "1px solid #ccc");
                $($(this).closest('.div-panel')).find('.loadUF').css("border", "1px solid #ccc");
            }
        });

        $(form).off('change', '#CodigoCNAE');
        $(form).on('change', '#CodigoCNAE', function () {
            $("#RamoAtividade").val($(this).find('option:selected').data('descricao'));
            $("#Fornecedor_CNAE_Descricao").val($(this).find('option:selected').data('descricao'));

            var valorAtual = $(this).val();
            var valorAntido = $(this).data('valor-anterior');

            if (valorAtual !== valorAntido) {
                $("#RamoAtividade").css("border", "2px solid #000");
                $(this).css("border", "2px solid #000");
            }
            else {
                $("#RamoAtividade").css("border", "1px solid #ccc");
                $(this).css("border", "1px solid #ccc");
            }

        });

        if ($('#form-detalhe').length > 0) {
            var charsno = $('#Solicitacao').val().length;
            $('#ValorCampo').html("500 : " + charsno);
        }

        if ($('#CodigoCNAE').val() != '' && $('#ClassificacaoFiscal').val() != '') {
            carregarDdl();
        }
         
        bindChangeCnae();
    }

    function bindContadorCaracteres() {
        $('#Solicitacao').keyup(function () {
            var charsno = $(this).val().length;
            $('#ValorCampo').html("500 : " + charsno);
        });
    }

    function bindAll() {
        bindSalvar();
        if ($(".frm-filtro #btnFiltrar").length > 0) {
            CRUDFILTRO.Filtrar();
        }
        carregarConteudo();
        bindContadorCaracteres();
    }

    function carregarDiv(value) {
        $("#CPF").val('');
        $("#CNPJ").val('');
        $('.frm-filtro').off('change', '.btn-cancelar');
        $('.frm-filtro').on('change', '.btn-cancelar', function() {
        });
        switch (value) {
            case "PF":
                $("#CPF").closest('.div-display').show();
                $("#CPF").focus();

                $("#CNPJ").closest('.div-display').hide();
                $("#CNPJ").val('');
                $(".div-panel").hide();

                break;
            case "PJ":
                $("#CNPJ").closest('.div-display').show();
                $("#CNPJ").focus();

                $("#CPF").closest('.div-display').hide();
                $("#CPF").val('');
                $(".div-panel").hide();

                break;
            default:
                $("#CPF").closest('.div-display').hide();
                $("#CNPJ").closest('.div-display').hide();

                $("#CPF").val('');
                $("#CNPJ").val('');
                $(".div-panel").hide();
                break;
        }
    }

    function configuraDivSolicitacao() {
        carregarConteudo();
        $('#frm-filtro').off('change', '#TipoFornecedor');
        $('#frm-filtro').on('change', '#TipoFornecedor', function () {
            carregarDiv($(this).val());
        });
    }

    function limparEndereco(container) {
        $(".loadLogradouro", container).val('');
        $(".loadBairro", container).val('');
        $(".loadMunicipio", container).val('');
        $(".loadUF", container).val('');
        $(".loadPais", container).val('');
    }

    function carregarCep() {
        $(".loadCEP").blur(function (evt) {
            var $this = $(this);
            var container = jQuery($this).closest(".BuscaEndereco");
            if ($this.val() !== "") {
                var errorArray = {};
                $.ajax({
                    url: "/Cep/GetEnderecoByCep",
                    data: { cep: $this.val().replace(/[^\d]+/g, '') },
                    cache: false,
                    success: function (result) {
                        if (result != null && result != "") {
                            var enderecoPesquisado = jQuery.parseJSON(result);
                            if (enderecoPesquisado[0].numeroIBGE != null) {
                                $('#UF option', container).attr('disabled', false);
                                $('#Logradouro,.loadLogradouro', container).val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                                $('#Endereco', container).val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                                $('#Bairro,.loadBairro', container).val(enderecoPesquisado[0].bairro);
                                $('#Municipio,.loadMunicipio', container).val(enderecoPesquisado[0].municipio);
                                $('#UF,.loadUF,.loadHiddenUF', container).val(enderecoPesquisado[0].uf);
                                $('#Numero', container).focus();
                                return true;
                            }
                        }
                        else {
                            MostraMensagemInformativa('CEP não cadastrado na base de dados. Favor preencher os campos!');
                            limparEndereco(container);
                            return false;
                        }
                        return false;
                    }
                });
            }
        });

    }

    function carregarFiltro() {
        configuraDivSolicitacao();
        carregarCep();
        CRUDFILTRO.ElementoResultado.html('');
    }

    function posListar() {
        $("#CPF").attr('readonly', false);
        $("#CNPJ").attr('readonly', false);
        $("#btnCancelarFiltrar").hide();
        carregarCep();
        CONTROLES.Configurar.DatePicker();
        carregarDdl();
        CRUDBASE.bindSalvar();
        carregarConteudo();
        bindContadorCaracteres();
    }

    function bindErro() {
        $("#CPF").attr('readonly', false);
        $("#CNPJ").attr('readonly', false);


        $("#CPF").val('');
        $("#CNPJ").val('');

        CRUDFILTRO.ElementoResultado.html('');
        $("#btnCancelarFiltrar").show();
    }

    function bindCancelar(element) {
        var url = $(element).data("url");
        $.ajax({
            url: url,
            method: "POST",
            success: function (result) {
                BASE.MostrarMensagem(result.Mensagem, TipoMensagem.Sucesso);
                BASE.EscondeModalConfirmacao();
                CRUDFILTRO.Filtrar();
            }
        });

    }

    function init() {
        bindAll();
        CRUDFILTRO.Carregar = carregarFiltro;
        CRUDFILTRO.ElementoResultado = $("#divLista");
        CRUDFILTRO.Evento.PosListar = posListar;
        CRUDFILTRO.Evento.PosFitrarErro = bindErro;
    }

    return {
        Init: function () {
            init();
        },
        Cancelar: function (element) {
            bindCancelar(element);
        }
    };
}());


$(function () {
    SOLICITACAO_ALTERAR_FORNECEDOR.Init();
    CRUDFILTRO.Carregar();   
});








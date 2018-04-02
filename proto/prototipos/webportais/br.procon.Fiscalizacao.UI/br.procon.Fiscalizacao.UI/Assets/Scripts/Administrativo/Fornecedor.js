RESULTADO = (function () {
    function init() {
        bindAll();
    }

    function bindAll() {
        bindTipoFornecedorCreateEdit();
        bindTipoFornecedorDetalhe();
        bindEndereco();
        bindCep();
        verificarTipoFornecedor();
        verificarEdicao();
        getRamoDeAtividade();
        bindTipoFornecedorEdit();
        bindTipoFornecedorDetalhes();
    }

    function bindTipoFornecedorEdit() {
        if ($("#TipoFornecedor").last('input').val() == "1") {
            $("#form_fornecedor  #TipoPessoaFisica").last('select').show();
            $("#form_fornecedor  #TipoPessoaJuridica").last('select').hide();
            $(' .tipofornecedor').show();
            $("#form_fornecedor  #CPF_CNPJ").mask('000.000.000-00', { placeholder: '___.___.___-__' });
            $("#form_fornecedor  #IE_RG").unmask();

            if ($("#Codigo").val() > 0) {
                $("#form_fornecedor  #TipoFornecedor").last('select').attr("readonly", "readonly");
                $("#form_fornecedor  #CPF_CNPJ").attr("readonly", "readonly");
            }
        }
        else if ($("#TipoFornecedor").last('input').val() == "2") {
            $("#form_fornecedor  #TipoPessoaFisica").last('select').hide();
            $("#form_fornecedor  #TipoPessoaJuridica").last('select').show();
            $(' .tipofornecedor').show();
            $("#form_fornecedor  #CPF_CNPJ").mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' });
            $("#form_fornecedor  #IE_RG").mask('000.000.000.000', { placeholder: '___.___.___.___' });

            if ($("#Codigo").val() > 0) {
                $("#form_fornecedor  #TipoFornecedor").last('select').attr("readonly", "readonly");
                $("#form_fornecedor  #CPF_CNPJ").attr("readonly", "readonly");
            }
        }
        else {
            $("#form_fornecedor  #TipoFornecedor").last('select').attr("readonly", false);
            $("#form_fornecedor  #TipoPessoaFisica").last('select').hide();
            $("#form_fornecedor  #TipoPessoaJuridica").last('select').hide();
            $(' .tipofornecedor').hide();
            $("#form_fornecedor  #IE_RG").unmask();
        }

        if ($("#Codigo").val() > 0) {
            $("#form_fornecedor  #TipoFornecedor").last('select').attr("disabled", "disabled");
        }
    }

    function bindTipoFornecedorDetalhes() {
        if ($("#TipoFornecedor_detalhe").last('input').val() == "1") {
            $("#form_fornecedor_detalhe  #TipoPessoaFisica").last('select').show();
            $("#form_fornecedor_detalhe  #TipoPessoaJuridica").last('select').hide();

            if ($("#Codigo").val() > 0) {
                $("#form_fornecedor_detalhe  #TipoFornecedor").last('select').attr("readonly", "readonly");
                $("#form_fornecedor_detalhe  #CPF_CNPJ").attr("readonly", "readonly");
            }
        }
        else if ($("#TipoFornecedor_detalhe").last('input').val() == "2") {
            $("#form_fornecedor_detalhe  #TipoPessoaFisica").last('select').hide();
            $("#form_fornecedor_detalhe  #TipoPessoaJuridica").last('select').show();

            if ($("#Codigo").val() > 0) {
                $("#form_fornecedor_detalhe  #TipoFornecedor").last('select').attr("readonly", "readonly");
                $("#form_fornecedor_detalhe  #CPF_CNPJ").attr("readonly", "readonly");
            }
        }
        else {
            $("#form_fornecedor_detalhe  #TipoFornecedor").last('select').attr("readonly", false);
            $("#form_fornecedor_detalhe  #TipoPessoaFisica").last('select').hide();
            $("#form_fornecedor_detalhe  #TipoPessoaJuridica").last('select').hide();
        }

        if ($("#Codigo").val() > 0) {
            $("#form_fornecedor_detalhe  #TipoFornecedor").last('select').attr("disabled", "disabled");
        }
    }

    function bindEndereco() {
        jQuery(".BuscaEndereco").each(function () {
            BloquearEndereco(true);
        });
    }

    function bindTipoFornecedorCreateEdit() {
        if ($("#Codigo").val() == 0) {
            $("#form_fornecedor  #TipoFornecedor").last('select').off('change');

            $("#form_fornecedor  #TipoFornecedor").last('select').on('change', function () {
                if ($("#form_fornecedor  #TipoFornecedor").last('input').val() == "1") {
                    $("#form_fornecedor  #TipoPessoaFisica").last('select').show();
                    $("#form_fornecedor  #TipoPessoaJuridica").last('select').hide();
                    $(' .tipofornecedor').show();
                    $("#form_fornecedor  #CPF_CNPJ").mask('000.000.000-00', { placeholder: '___.___.___-__' });
                    $("#form_fornecedor  #IE_RG").unmask();

                    selecionarTipoFornecedorCreateEdit(1);
                }
                else if ($("#form_fornecedor  #TipoFornecedor").last('input').val() == "2") {
                    $("#form_fornecedor  #TipoPessoaFisica").last('select').hide();
                    $("#form_fornecedor  #TipoPessoaJuridica").last('select').show();
                    $(' .tipofornecedor').show();
                    $("#form_fornecedor  #CPF_CNPJ").mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' });
                    $("#form_fornecedor  #IE_RG").mask('000.000.000.000', { placeholder: '___.___.___.___' });

                    selecionarTipoFornecedorCreateEdit(2);
                }
                else {
                    $("#form_fornecedor  #TipoPessoaFisica").last('select').hide();
                    $("#form_fornecedor  #TipoPessoaJuridica").last('select').hide();
                    $(' .tipofornecedor').hide();
                    $("#form_fornecedor  #IE_RG").unmask();
                }
            });
        }
    }

    function bindTipoFornecedorDetalhe() {
        if ($("#Codigo").val() == 0) {
            $("#form_fornecedor_detalhe  #TipoFornecedor").last('select').off('change');

            $("#form_fornecedor_detalhe  #TipoFornecedor").last('select').on('change', function () {
                if ($("#form_fornecedor_detalhe  #TipoFornecedor").last('input').val() == "1") {
                    $("#form_fornecedor_detalhe  #TipoPessoaFisica").last('select').show();
                    $("#form_fornecedor_detalhe  #TipoPessoaJuridica").last('select').hide();
                    $("#form_fornecedor  #CPF_CNPJ").mask('000.000.000-00', { placeholder: '___.___.___-__' });
                    $("#form_fornecedor  #IE_RG").unmask();

                    selecionarTipoFornecedorDetalhe(1);
                }
                else if ($("#form_fornecedor_detalhe  #TipoFornecedor").last('input').val() == "2") {
                    $("#form_fornecedor_detalhe  #TipoPessoaFisica").last('select').hide();
                    $("#form_fornecedor_detalhe  #TipoPessoaJuridica").last('select').show();

                    $("#form_fornecedor  #CPF_CNPJ").mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' });
                    $("#form_fornecedor  #IE_RG").mask('000.000.000.000', { placeholder: '___.___.___.___' });

                    selecionarTipoFornecedorDetalhe(2);
                }
                else {
                    $("#form_fornecedor_detalhe  #TipoPessoaFisica").last('select').hide();
                    $("#form_fornecedor_detalhe  #TipoPessoaJuridica").last('select').hide();
                    $("#form_fornecedor  #IE_RG").unmask();
                }
            });
        }
    }

    function bindCep() {
        $("#EnderecoSEFAZ_CEP").off('blur');
        $("#EnderecoSEFAZ_CEP").on('blur', (function (evt) {
            var $this = $(this);
            $('#EnderecoSEFAZ_Municipio_UF').val('');
            $('#EnderecoSEFAZ_Logradouro').val('');
            $('#EnderecoSEFAZ_Numero').val('');
            $('#EnderecoSEFAZ_Complemento').val('');
            $('#EnderecoSEFAZ_Bairro').val('');
            $('#EnderecoSEFAZ_Municipio_Descricao').val('');
            $('#EnderecoSEFAZ_Municipio_UF').val('');
            BloquearEndereco(true);
            $('#EnderecoSEFAZ_Numero').focus();
            if ($this.val() != "") {
                $.ajax({
                    url: "/Cep/GetEnderecoByCep",
                    data: { cep: $this.val().replace(/[^\d]+/g, '') },
                    success: function (result) {
                        if (result != null && result != "") {
                            var enderecoPesquisado = jQuery.parseJSON(result);
                            if (enderecoPesquisado[0].numeroIBGE != null) {
                                $('#EnderecoSEFAZ_Municipio_UF').attr('disabled', false);
                                $('#EnderecoSEFAZ_Logradouro').val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                                $('#EnderecoSEFAZ_Bairro').val(enderecoPesquisado[0].bairro);
                                $('#EnderecoSEFAZ_Municipio_Descricao').val(enderecoPesquisado[0].municipio);
                                $('#EnderecoSEFAZ_Municipio_UF').val(enderecoPesquisado[0].uf);
                                BloquearEndereco(true);
                                $('#EnderecoSEFAZ_Numero').focus();
                            }
                        }
                        else {
                            MostraMensagemInformativa('CEP não cadastrado na base de dados. Favor preencher os campos!');
                            BloquearEndereco(false);
                            return false;
                        }
                    }
                });
            }
        })
        );
    }

    function verificarTipoFornecedor() {
        jQuery("#form_fornecedor").submit(function () {
            if ($("#form_fornecedor #TipoFornecedor").last('select').val() == "1" && !validarCPF(jQuery("#CPF_CNPJ").val())) {
                if (jQuery("#CPF_CNPJ").val() != "") {
                    BASE.MostrarMensagemErro("CPF inválido.");
                }
                return false;
            }
            else if ($("#form_fornecedor #TipoFornecedor").last('select').val() == "2" && !validarCNPJ(jQuery("#CPF_CNPJ").val())) {
                if (jQuery("#CPF_CNPJ").val() != "") {
                    BASE.MostrarMensagemErro("CNPJ inválido.");
                }
                return false;
            }
        });
    }

    function BloquearEndereco(bloq) {
        $('#EnderecoSEFAZ_Municipio_UF').prop("readonly", bloq);
        $('#EnderecoSEFAZ_Logradouro').prop("readonly", bloq);
        $('#EnderecoSEFAZ_Bairro').prop("readonly", bloq);
        $('#EnderecoSEFAZ_Municipio_Descricao').prop("readonly", bloq);
        if (!bloq) {
            $('#EnderecoSEFAZ_Municipio_UF').val("");
            $('#EnderecoSEFAZ_Municipio_UF').prop('readonly', bloq);
        }
        else {
            $('#EnderecoSEFAZ_Municipio_UF option:not(:selected)').prop('readonly', bloq);
        }
    }

    function getRamoDeAtividade() {
        $('#Id_CNAE').off('change');
        $('#Id_CNAE').on('change', function () {
            jQuery.ajax({
                url: "/CNAE/GetCNAEById",
                data: { id: $('#Id_CNAE').val() },
                success: function (result) {
                    if (result != null && result != "") {
                        $('#txtRamoDeAtividade').val(result.Descricao);
                    }
                }
            });
        });
    }

    function selecionarTipoFornecedorCreateEdit(valor) {
        $('#form_fornecedor #TipoFornecedor option[value="' + valor + '"]').attr('selected', 'selected');
    }

    function selecionarTipoFornecedorDetalhe(valor) {
        $('#form_fornecedor_detalhe #TipoFornecedor option[value="' + valor + '"]').attr('selected', 'selected');
    }

    function verificarEdicao() {
        if ($('#Codigo').val() > 0) {
            selecionarTipoFornecedorCreateEdit($("#TipoFornecedor").last('input').val());
            selecionarTipoFornecedorDetalhe($("#TipoFornecedor_detalhe").last('input').val());
        }
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    RESULTADO.Init();
});
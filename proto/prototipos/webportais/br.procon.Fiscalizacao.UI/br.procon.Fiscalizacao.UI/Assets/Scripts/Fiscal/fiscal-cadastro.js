FISCAL = (function () {
    function init() {
        CRUDBASE.Eventos.PosCarregarEditar = posCarregarModal;
        bindAll();
    };

    function bindAll() {
        bindCampoNomeFiscal();

    };

    function posCarregarModal() {
        bindCampoNomeFiscal();
        selecaoTipoFiscal();
        if ($('#hdnEdicao').val()) {
            retornarTipoFiscal();
            selecaoAutomaticaTipoFiscal();
            //desabilitarSalvar(false);
        } else {
            ocultarDivCorpo();
            ocultarDivTipoFiscal();
            ocultarDivRodape();
            desabilitarSalvar(true);
        }
        selecionarSetor($('#form-detalhe #IdSetor').val());
        selecionarConvenio($('#form-detalhe #IdConvenio').val());

        $("#ComboSetor").change(function () {
            $('#form-detalhe #IdSetor').val($('#ComboSetor').val());
            verificarSelecaoCombos();
        });
        $("#ComboConvenio").change(function () {
            $('#form-detalhe #IdConvenio').val($('#ComboConvenio').val());
            verificarSelecaoCombos();
        });


        if ($("input[id='idSetor']:checked").val() === 'on') {
            if ($('#ComboSetor').val() == 0) {
                desabilitarSalvar(true);

            }
            else {
                desabilitarSalvar(false);

            }
        }
        else {
            if ($('#ComboConvenio').val() == 0) {
                desabilitarSalvar(true);
            }
            else {
                desabilitarSalvar(false);

            }
        }
    }

    function bindCampoNomeFiscal() {
        $('#form-detalhe #Cpf').off('blur');
        $('#form-detalhe #Cpf').on('blur', function () {
            var _cpf = $(this).val();

            if (_cpf === '' || _cpf === undefined || _cpf === null)
                return;
            obterFiscalPorCpf($('#form-detalhe #Cpf').val());
        });
    }

    function obterPessoaFisicaPorCpf(cpf) {
        $.ajax({
            url: '/PessoaFisica/ObterPessoaFisicaPorCpf',
            type: 'get',
            data: { cpf: cpf },
            cache: false,
            success: function (data) {
                if (data.Resultado == null && data.Sucesso == true)
                {
                    BASE.Mensagem.Mostrar("Pessoa Física não cadastrada.", TipoMensagem.Error);
                } else {
                    if (data.Sucesso == false)
                    {
                        BASE.Mensagem.Mostrar("ObterPessoaFisicaPorCpf: " + data.Mensagem, TipoMensagem.Error);
                    } else {
                        $('#form-detalhe #IdPessoaFisica').val(data.Resultado.Codigo);
                        $('#form-detalhe #NomeFiscal').val(data.Resultado.Nome);
                        mostrarDivCorpo();
                    }
                }
            },
            error: function (erro) {
                BASE.Mensagem.Mostrar("ObterPessoaFisicaPorCpf: " + erro.toString(), TipoMensagem.Error);
            }
        });
    }

    function obterFiscalPorCpf(cpf) {
        $.ajax({
            url: '/Fiscal/ObterFiscalPorCpf',
            type: 'get',
            data: { cpf: cpf },
            cache: false,
            success: function (data) {
                if (data.Resultado != null && data.Sucesso == true)
                {
                    BASE.Mensagem.Mostrar("Fiscal já cadastrado.", TipoMensagem.Error);
                } else {
                    if (data.Sucesso == false)
                    {
                        BASE.Mensagem.Mostrar("ObterPessoaFisicaPorCpf: " + data.Mensagem, TipoMensagem.Error);
                    }
                    else
                    {
                        obterPessoaFisicaPorCpf($('#form-detalhe #Cpf').val());
                    }
                }
            },
            error: function (erro) {
                BASE.Mensagem.Mostrar("obterFiscalPorCpf: " + erro.toString(), TipoMensagem.Error);
            }
        });
    }

    function mostrarDivCorpo() {
        $("#corpo").show();
    }

    function ocultarDivCorpo() {
        $("#corpo").hide();
    }

    function mostrarDivTipoFiscal() {
        $("#tipoFiscal").show();
    }

    function ocultarDivTipoFiscal() {
        $("#tipoFiscal").hide();
    }

    function mostrarDivRodape() {
        $("#rodape").show();
    }

    function ocultarDivRodape() {
        $("#rodape").hide();
    }

    function mostrarComboSetor() {
        $("#comboSetor").show();
    }

    function ocultaComboSetor() {
        $("#comboSetor").hide();
    }

    function mostrarComboConvenio() {
        $("#comboConvenio").show();
    }

    function ocultaComboConvenio() {
        $("#comboConvenio").hide();
    }

    function ocultaComboSetor() {
        $("#comboSetor").hide();
    }

    function selecaoTipoFiscal() {
        $('input[type=radio][name=tipoFiscal]').change(changeTipoFiscal);
    }

    function changeTipoFiscal() {
        mostrarDivTipoFiscal();
        mostrarDivRodape();
        verificarSelecaoCombos();
    }

    function selecaoAutomaticaTipoFiscal() {
        if ($('#OrigemFiscal').val() === 'Procon') {
            $("#idSetor").prop("checked", true);
        } else {
            $("#idConvenio").prop("checked", true);
        }
        changeTipoFiscal();
    }

    function retornarTipoFiscal() {
        if ($('#form-detalhe #IdSetor').val() === '' || $('#form-detalhe #IdSetor').val() === undefined || $('#form-detalhe #IdSetor').val() === null) {
            $("#form-detalhe #idConvenio").prop("checked", true);
        } else {
            $("#idSetor").prop("checked", true);
            ocultaComboConvenio();
        }
    }

    function selecionarSetor(valor) {
        $('#ComboSetor option[value="' + valor + '"]').attr('selected', 'selected');
    }

    function selecionarConvenio(valor) {
        $('#ComboConvenio option[value="' + valor + '"]').attr('selected', 'selected');
    }

    function desabilitarSalvar(bool) {
        $("#btnSalvar").prop("disabled", bool);
    }

    function verificarSelecaoCombos() {
        if ($("input[id='idSetor']:checked").val() === 'on') {
            ocultaComboConvenio();
            mostrarComboSetor();

            $('#OrigemFiscal').val('Procon');
            $('#IdConvenio').val(null);

            if ($('#ComboSetor').val() == 0) {
                desabilitarSalvar(true);

            } else {
                desabilitarSalvar(false);

            }
        } else {
            mostrarComboConvenio();
            ocultaComboSetor();

            $('#OrigemFiscal').val('Municipio');
            $('#IdSetor').val(null);

            if ($('#ComboConvenio').val() == 0) {
                desabilitarSalvar(true);

            }
            else {
                desabilitarSalvar(false);

            }
        }
    }

    return { Init: init }
}());

$(function () {
    FISCAL.Init();
    CRUDFILTRO.Carregar();
    CRUDFILTRO.Filtrar();
});
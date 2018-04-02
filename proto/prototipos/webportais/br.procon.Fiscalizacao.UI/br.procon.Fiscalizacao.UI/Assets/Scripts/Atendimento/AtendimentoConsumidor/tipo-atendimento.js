var TIPOATENDIMENTO = (function () {
    function init() {
        bindAll();
    }
    function bindAll() {
        selecionarClassificacaoPrimeiroNivel();
        selecionarClassificacaoSegundoNivel();
        selecionarClassificacaoTerceiroNivel();
        desabilitarHabilitarTipoAtendimento(true);
        bindTipoAtendimento();
        selecionarTipoAtendimento();
    }

    function desabilitarHabilitarTipoAtendimento(boleano) {
        $("#selecao-tipo-atendimento input:radio").attr('disabled', boleano);
    }

    function bindTipoAtendimento() {
        console.log('bindTipoAtendimento');
        $("input[name=tipoatendimento]").off('click');
        $("input[name=tipoatendimento]").on('click', function () {
            console.log('clicou');
            clickComboTipoAtendimento();
            $('#btn-salvar').removeAttr('disabled');
            if ($(this).val() === '0') {
                $('#divGerarCip').show();
                $("#TipoAtendimento option[value='3']").remove();
                $("#TipoAtendimento option[value='7']").remove();
                $("#TipoAtendimento option[value='8']").remove();
            }
            else {
                $('#divGerarCip').hide();
                $("#TipoAtendimento option[value='3']").remove();
                $("#TipoAtendimento option[value='4']").remove();
                $("#TipoAtendimento option[value='6']").remove();
            }
        });
    }

    function selecionarTipoAtendimento() {
        $('#TipoAtendimento').off('change');
        $('#TipoAtendimento').on('change', function () {
            if ($(this).val() === '4') {
                $('#btnGerarCip').show();
            }
            else {
                $('#btnGerarCip').hide();
            }
        });
    }

    function selecionarClassificacaoPrimeiroNivel() {
        $('#1st').off('change');
        $('#1st').on('change', function () {
            changeClassificacao();
        });
    }
    function selecionarClassificacaoSegundoNivel() {
        $('#2nd').off('change');
        $('#2nd').on('change', function () {
            changeClassificacao();
        });
    }
    function selecionarClassificacaoTerceiroNivel() {
        $('#3rd').off('change');
        $('#3rd').on('change', function () {
            changeClassificacao();
        });
    }
    function changeClassificacao() {
        if ($('#IdClassificacao').val() > 0) {
            desabilitarHabilitarTipoAtendimento(false);
            ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao($('#IdClassificacao').val());
            ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor($('#IdClassificacao').val());
            bindListaObjetosClassificacao($('#IdClassificacao').val());
        } else {
            $("#TipoAtendimento").empty();
            desabilitarHabilitarTipoAtendimento(true);
        }
    }

    function clickComboTipoAtendimento() {
        console.log('clickComboTipoAtendimento');

        $.ajax({
            url: '/Cip/ObterTipoAtendimentoCip/',
            type: 'GET',
            dataType: "json",
            success: function (data) {
                if (data.listaTipoAtendimento.length > 0) {
                    $("#TipoAtendimento").empty();
                    $("#TipoAtendimento").append("<option value=" + "" + ">" + "Selecione" + "</option>");

                    $(data.listaTipoAtendimento).each(function (i) {
                        $("#TipoAtendimento").append("<option value=" + data.listaTipoAtendimento[i].Value + ">" + data.listaTipoAtendimento[i].Text + "</option>");
                    });
                }
                if ($("input[name=tipoatendimento]:checked").val() === 0) {
                    $("#TipoAtendimento option[value='3']").remove();
                    $("#TipoAtendimento option[value='7']").remove();
                    $("#TipoAtendimento option[value='8']").remove();
                } else {
                    $("#TipoAtendimento option[value='3']").remove();
                    $("#TipoAtendimento option[value='4']").remove();
                    $("#TipoAtendimento option[value='6']").remove();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                BASE.Mensagem.Mostrar("Aviso", XMLHttpRequest.message, TipoMensagem.Error);
            }
        });
    }

    function bindListaObjetosClassificacao(idClassificacao) {
        $.ajax({
            url: '/AtendimentoConsumidor/ListaParametrosPorClassificacao/',
            data: { idClassificacao: parseInt(idClassificacao) },
            type: 'GET',
            dataType: "json",
            success: function (data) {
                if (data) {
                    $('div[data-id-objeto-tipo-dados]').hide();
                    $('#DataCompraContratacao').rules("remove", "required");
                    $('#ObjetoReclamacaoCompra').rules("remove", "required");
                    $('#DataComplementarCompra').rules("remove", "required");
                    $('#IdFormaPagamento').rules("remove", "required");
                    $('div[data-id-objeto-tipo-dados] input, div[data-id-objeto-tipo-dados] select').rules("remove", "required");
                    $('div[data-id-objeto-tipo-dados] input, div[data-id-objeto-tipo-dados] select').attr('disabled', 'disabled');

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].ObjetoDadosAtivo) {
                            var elem = $('div[data-id-objeto-tipo-dados=' + data[i].IdObjetoTipoDados + ']');
                            elem.show();

                            var input = null;
                            if (data[i].TipoLista) {
                                input = elem.find('select').attr('name');

                                elem.find('select').removeAttr('disabled');
                                elem.find('input').attr('disabled', 'disabled');
                                elem.find('input').hide();

                                elem.find('select').empty();
                                elem.find('select').append("<option value=''> Selecione </option>");
                                $(data[i].ListaParametroAtendimentoLista).each(function (j) {
                                    elem.find('select').append("<option value='" + data[i].ListaParametroAtendimentoLista[j].IdObjtoDadoLista + "'>" + data[i].ListaParametroAtendimentoLista[j].DescricaoObjetoDadoLista + "</option>");
                                });

                                elem.find('select').find('option').each(function () {
                                    if ($(this).text() == $('#hdn' + elem.find('select').attr('name')).val()) {
                                        $(this).attr('selected', 'selected');
                                    }
                                });

                                elem.find('select').show();
                                //elem.find('input').parent().parent().hide();
                            } else {
                                input = elem.find('input').attr('name');

                                elem.find('input').removeAttr('disabled');
                                elem.find('select').attr('disabled', 'disabled');
                                elem.find('select').hide();
                                elem.find('input').show();

                                //elem.find('select').parent().parent().hide();
                            }

                            //$('input[name="' + input + '"]').rules("add", { required: true, messages: { required: "Campo obrigatório." }});

                            var label = $('label[for="' + input + '"]');
                            if (label != null) {
                                label.text(data[i].DescricaoObjeto);
                            }
                        }// if
                    }//for
                    $('input[name="IdMeioAquisicao"]').rules("add", { required: true, messages: { required: "Campo obrigatório." } });
                    $('input[name="IdTipoPedidoConsumidor"]').rules("add", { required: true, messages: { required: "Campo obrigatório." } });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                BASE.Mensagem.Mostrar("Aviso", "Erro ao enviar solicitacao.", TipoMensagem.Error);
                console.log(XMLHttpRequest);
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
    TIPOATENDIMENTO.Init();
});
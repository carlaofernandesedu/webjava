$(document).ready(function () {

    if ($('#hdnReplicado').val() === 'True') {
        AbreFrame(4);
    }
    else if ($('#EnumFrameAtual').val() != '') {
        AbreFrame($('#EnumFrameAtual').val());
    }

    var situacaoEhProtocolado = $("#ehSituacaoProtocolado").val();
    if (situacaoEhProtocolado === "False") {
        if ($('input[name="Origem"]').is('[readonly]')) {
            $('input[name="Origem"]').click(function (e) {
                e.preventDefault();
            });
        }
    }

    var dataDoc;
    var result;

    $("#nrProtocolo").focus();
    bindSerieDocumental();

    var data = $("#DataRecebimento").val();

    if (data !== undefined) {
        dataDoc = data.toString().split('/');
        result = new Date(dataDoc[1] + "/" + dataDoc[0] + "/" + dataDoc[2]);
    }

    $('.field-validation-error').empty();
    $($("#DataDocumento")).datetimepicker('setEndDate', result);

    if ($('input[name=Numero]').length > 0)
        $($('input[name=Numero]')[1]).val(padLeft($($('input[name=Numero]')[1]).val()));

    $("#SerieDocumental").val("");

    jQuery.extend(jQuery.validator.messages,
    {
        minlength: jQuery.validator.format("Digite mais de 3 caracteres para efetuar a pesquisa!")
    });

    $('#DataDocumento').blur(function (e) {
        var dataDigitada = e.target.value;
        var dataRecebimento = $("#DataRecebimento").val();

        var dataDigitadaArray = dataDigitada.toString().split('/');
        var dataDigitadaFormatada = dataDigitadaArray[1] + "/" + dataDigitadaArray[0] + "/" + dataDigitadaArray[2];

        var dataRecebimentoArray = dataRecebimento.toString().split('/');
        var dataRecebimentoFormatada = dataRecebimentoArray[1] + "/" + dataRecebimentoArray[0] + "/" + dataRecebimentoArray[2];

        var novaDataRecebimento = new Date(dataDigitadaFormatada)
        var novaDataRecebimentoFormatada = new Date(dataRecebimentoFormatada)

        if (novaDataRecebimento > novaDataRecebimentoFormatada) {
            BASE.Mensagem.Mostrar("O campo Data Documento não pode ser posterior a data de emissão do protocolo.", TipoMensagem.Error);
            $("#DataDocumento").val('');
        }
    });

    AutoCompleteSerieDocumental();
    PopulaFuncao(PopulaSubFuncao);
    PopulaOrgaoExterno();
    ConsultaOrgaoExterno($("#OrgaoExterno").val(), $("#Codigo").val(), $("#TipoOrgao").val());
    popularComboTipoDocumentoExterno();

    $('#SomeOtherDdlId').change(function () {
        var value = $(this).val();

        $.ajax({
            url: '@Url.Action("foo")',
            type: 'POST',
            data: { someValue: value },
            success: function (result) {
                $('#ddlcontainer').html(result);
            }
        });
    });

    $('#SomeOtherDdlId').change(function () {
        var value = $(this).val();

        $.ajax({
            url: '@Url.Action("foo")',
            type: 'POST',
            data: { someValue: value },
            success: function (result) {
                $('#ddlcontainer').html(result);
            }
        });
    });

    CarregaSeriePorId($("#idSerie").val());

    ValidaCamposObrigatorios($('input[name=Origem]:checked').val());

    $('input[name="Origem"]').change(function (e) {
        var situacaoEhProtocolado = $("#ehSituacaoProtocolado").val();

        if (situacaoEhProtocolado === "False") {
            return false;
        }

        switch ($('input[name="Origem"]:checked').val()) {
            case "Interno":
                $("#SerieDocumental").val("");
                $("#divIntSerieDocumental").css("display", "block");
                $("#divExtOrgao").css("display", "none");
                $("#divTipoDocumento").css("display", "none");
                $("#divNomeDocumento").css("display", "none");
                ValidaCamposObrigatorios($('input[name=Origem]:checked').val());
                break;

            case "Externo":
                $("#divIntSerieDocumental").css("display", "none");
                $("#divExtOrgao").css("display", "block");
                $("#divTipoDocumento").css("display", "block");
                $("#divNomeDocumento").css("display", "block");
                ValidaCamposObrigatorios($('input[name=Origem]:checked').val());
                break;
        }
    });

    ExibirMensagemSerieDocumental();
    bindEnterBtnPesquisar();
    bindClickBtnCancelarProtocolo();
    bindEnterBtnCancelarProtocolo();

});

function bindEnterBtnPesquisar() {
    $('#btnPesquisar').off('keypress');
    $('#btnPesquisar').on('keypress', function (e) {
        var key = e.which;
        if (key === 13)  // the enter key code
        {
            $('#btnPesquisar').click();
            return false;
        }
        return false;
    });
}

function bindClickBtnCancelarProtocolo() {
    $('#btnCancelarProtocolo').off('click');
    $("#btnCancelarProtocolo").on('click', function () {
        $("#nrProtocolo").val('');
    });
}

function bindEnterBtnCancelarProtocolo() {
    $('#btnCancelarProtocolo').off('keypress');
    $('#btnCancelarProtocolo').on('keypress', function (e) {
        var key = e.which;
        if (key === 13)  // the enter key code
        {
            $('#nrProtocolo').val('');
            return false;
        }
        return false;
    });
}

function bindSerieDocumental() {
    var idFuncao = $('#ObjetoFuncao_IdFuncao').val();

    if (idFuncao !== '' && idFuncao !== null && idFuncao !== undefined) {
        $("#Funcao").val(idFuncao);
        $("#SubFuncao").prop("disabled", false);
        $("#Funcao").prop("disabled", true);
        AutoCompleteSerieDocumental();

        popularSubFuncao(idFuncao);

        $("#SerieDocumental").change(function () {
            var value = $(this).val();

            if (value === '' || value === null || value === undefined) {
                var idFuncao = $('#ObjetoFuncao_IdFuncao').val();

                $("#Funcao").val(idFuncao);
                $("#SubFuncao").prop("disabled", false);
                $("#Funcao").prop("disabled", true);
                AutoCompleteSerieDocumental();

                popularSubFuncao(idFuncao);
            }
        });
    }
}

var AutoCompleteSerieDocumental = function () {
    var value = $('#ObjetoFuncao_IdFuncao').val() == '' ? 0 : $('#ObjetoFuncao_IdFuncao').val();

    $("#SerieDocumental").typeahead({
        onSelect: function (item) {
            $("#SerieDocumental").val(item.value);
            $("#SerieDocumento").empty();
            $("#SerieDocumento").append($("<option value='" + item.value + "'>" + item.text + "</option>"));
            $("#Funcao").val("0");
            $("#SubFuncao").empty();
            $("#Atividade").empty();
            $("#SubFuncao").prop("disabled", true);
            $("#Atividade").prop("disabled", true);

            var list = $.parseJSON(localStorage.getItem("SerieDocumental_array"));

            var serieDoc = list.filter(s=> s.IdSerieDocumental == item.value);
            
            if (serieDoc != null) {
                if (serieDoc[0].IdTipoPrazoGuardaProdutora != 3) {
                    $('#DataAprovacaoConta').attr('disabled', 'disabled');
                    $('#DataAprovacaoConta').val('');
                }
                else {
                    $('#DataAprovacaoConta').removeAttr('disabled');
                }
            }
        },
        ajax: {
            url: '/Documento/RetornaSerieDocumentalPorFuncao',
            triggerLength: 4,
            dataType: "json",
            displayField: "DescricaoSerie",
            valueField: "IdSerieDocumental",
            preDispatch: function (query) {
                return {
                    query: query,
                    idFuncao: value
                }
            },
            preProcess: function (data) {
                var listaSerie = [];
                if (data.lista.length === 0) {
                    BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                    return false;
                }

                localStorage.setItem("SerieDocumental_array", JSON.stringify(data.lista));

                return data.lista;
            }
        }
    });
}

var PopulaFuncao = function (calback) {
    $.ajax({
        url: '/Documento/CarregaComboFuncao',
        type: 'POST',
        success: function (data) {
            var idFuncao = $('#ObjetoFuncao_IdFuncao').val();

            $("#Funcao").empty();
            $("#Funcao").append($("<option value='0'>Selecione</option>"));

            $.each(data.lista, function (index, value) {
                $("#Funcao").append($("<option value='" + value.IdFuncao + "'>" + value.DescricaoFuncao + "</option>"));
            });

            if (idFuncao != null && idFuncao != '') {
                $("#Funcao").val(idFuncao);
                $("#SubFuncao").prop("disabled", false);
                $("#Funcao").prop("disabled", true);
                AutoCompleteSerieDocumental();

                popularSubFuncao(idFuncao);
            }
            else {
                $("#SubFuncao").prop("disabled", true);
                $("#Atividade").prop("disabled", true);
            }

            calback($("#Funcao"));
        }
    });
}

var PopulaSubFuncao = function (combo) {
    $("#Funcao").change(function () {
        $("#SerieDocumento").empty();

        if (combo.val() != "0") {
            popularSubFuncao(combo.val());
        }
        else {
            $("#SubFuncao").empty();
            $("#SubFuncao").prop("disabled", true);
            $("#Atividade").empty();
            $("#Atividade").prop("disabled", true);
            $("#SerieDocumento").empty();
        }
    });
}

function popularSubFuncao(value) {
    $.ajax({
        url: '/Documento/CarregaComboSubFuncao',
        type: 'POST',
        cache: false,
        data: { idFuncao: value },
        success: function (data) {
            $("#SerieDocumental").val("");
            $("#SubFuncao").empty();
            $("#Atividade").empty();
            $("#Atividade").prop("disabled", true);

            if (data.lista.length > 0) {
                $("#SubFuncao").append($("<option value='0'>Selecione</option>"));

                $.each(data.lista, function (index, value) {
                    $("#SubFuncao").append($("<option value='" + value.IdSubFuncao + "'>" + value.DescricaoSubFuncao + "</option>"));
                });

                $("#SubFuncao").prop("disabled", false);
                $("#Atividade").prop("disabled", true);

                populaAtividade($("#SubFuncao"));
            }
            else {
                $("#SubFuncao").empty();
                $("#SubFuncao").prop("disabled", true);
            }
        }
    });
}

var populaAtividade = function (combo) {
    combo.change(function () {
        if (combo.val() != "0") {
            $.ajax({
                url: '/Documento/CarregaComboAtividade',
                type: 'POST',
                cache: false,
                data: { idSubFuncao: combo.val() },
                success: function (data) {
                    $("#Atividade").empty();

                    if (data.lista.length > 0) {
                        $("#Atividade").append($("<option value='0'>Selecione</option>"));

                        $.each(data.lista, function (index, value) {
                            $("#Atividade").append($("<option value='" + value.IdAtividade + "'>" + value.DescricaoAtividade + "</option>"));
                        });
                        $("#Atividade").prop("disabled", false);

                        populaSerie($("#Atividade"));
                    }
                    else {
                        $("#Atividade").empty();
                        $("#SubFuncao").append($("<option>Selecione</option>"));
                        $("#Atividade").prop("disabled", true);
                    }
                }
            });
        } else {
            $("#Atividade").empty();
            $("#Atividade").prop("disabled", true);
            $("#SerieDocumento").empty();
        }
    });
}

var populaSerie = function (combo) {
    combo.change(function () {
        if (combo.val() != "0") {
            $.ajax({
                url: '/Documento/CarregaComboSeriePorIdAtividade',
                type: 'POST',
                cache: false,
                data: { idAtividade: combo.val() },
                success: function (data) {
                    $("#SerieDocumento").empty();

                    if (data.lista.length > 0) {
                        $("#SerieDocumento").append($("<option value='0'>Selecione</option>"));

                        $.each(data.lista, function (index, value) {
                            $("#SerieDocumento").append($("<option value='" + value.IdSerieDocumental + "'>" + value.DescricaoSerie + "</option>"));
                        });
                    }
                    else {
                        $("#SerieDocumento").empty();
                        $("#SerieDocumento").append($("<option>Selecione</option>"));
                    }
                }
            });
        } else {
            $("#SerieDocumento").empty();
            $("#SerieDocumento").prop("disabled", true);
        }
    });
}

var LimpaCamposClassificacao = function () {
    $("#OrgaoExterno").val("");
    $("#OrgaoExternoAutoComplete").val("")
    $("#DataDocumento").val("");
    $("#DescricaoAssunto").val("");
    $("#QtdeVolume").val("");
    $("#NomeDocumento").val("");
    $("#NomeDocumento").val("");
    $("#SerieDocumental").val("");
    $("#SerieDocumento").val("");
    $("#SerieDocumento").val("");
    $('#TipoOrgao').val("");
};

var PopulaOrgaoExterno = function () {
    $("#OrgaoExternoAutoComplete").typeahead({
        onSelect: function (item) {
            var tipoOrgao = item.value.substring(0, 2);
            var orgaoExterno = item.value.substring(2)

            $("#TipoOrgao").val(tipoOrgao);
            $("#OrgaoExterno").val(orgaoExterno);
        },
        ajax: {
            url: '/Documento/AutoCompleteOrgaoExterno',
            triggerLength: 4,
            dataType: "json",
            displayField: "Nome",
            valueField: "TipoCodigoOrgao",
            preDispatch: function (query) {
                return {
                    query: query
                }
            },
            preProcess: function (data) {
                var listaSerie = [];
                if (data.lista.length === 0) {
                    $("#TipoOrgao").val('');
                    $("#OrgaoExterno").val('0');

                    return false;
                }
                return data.lista;
            }
        }
    });
}

var popularComboTipoDocumentoExterno = function () {
    CONTROLES.DropDown.Preencher('#TipoDocumentoExterno', 'Documento', 'CarregarComboTipoDocumentoExterno', null, true, false, false, null);
}

var ConsultaOrgaoExterno = function (id, codDocumento, tipoOrgao) {
    if ((id !== undefined && id !== "0") || (codDocumento !== undefined && codDocumento !== "0")) {
        $.ajax({
            url: '/Documento/ConsultaOrgaoExterno',
            type: 'POST',
            cache: false,
            data: { id: id, codDocumento: codDocumento, tipoOrgao: tipoOrgao },
            success: function (data) {
                if (data.ListaDeOrgao == null) return;
                $("#OrgaoExternoAutoComplete").val(data.ListaDeOrgao.Nome);               


            }
        });
    }
}

var CarregaSeriePorId = function (value) {
    if (value != undefined) {
        $.ajax({
            url: '/Documento/CarregaComboSeriePorId',
            type: 'POST',
            cache: false,
            data: { idSerieDocumental: value },
            success: function (data) {
                $.each(data.lista, function (index, value) {
                    $("#SerieDocumento").append($("<option value='" + value.IdSerieDocumental + "'>" + value.DescricaoSerie + "</option>"));
                });     

                if (data.lista[0].IdTipoPrazoGuardaProdutora != 3) {
                    $('#DataAprovacaoConta').attr('disabled', 'disabled');
                    $('#DataAprovacaoConta').val('');
                }
                else {
                    $('#DataAprovacaoConta').removeAttr('disabled');
                }
            }
        });
    }
}

var ValidaCamposObrigatorios = function (value) {
    $("#OrgaoExternoAutoComplete").rules('remove');
    $("#NomeDocumento").rules('remove');
    $("#SerieDocumento").rules('remove');

    switch (value) {
        case "Interno":
            $("#divIntSerieDocumental").css("display", "block");
            $("#divExtOrgao").css("display", "none");
            $("#divTipoDocumento").css("display", "none");
            $("#divNomeDocumento").css("display", "none");

            $("#SerieDocumento").rules("add", {
                required: true,
                messages: { required: "O campo Série é obrigatório!" }
            });
            break;

        case "Externo":

            $("#divIntSerieDocumental").css("display", "none");
            $("#divExtOrgao").css("display", "block");
            $("#divTipoDocumento").css("display", "block");
            $("#divNomeDocumento").css("display", "block");

            $("#OrgaoExternoAutoComplete").rules("add", {
                required: true,
                minlength: 4,
                messages: { required: "O campo Origem é de preenchimento obrigatório." }
            });

            $("#NomeDocumento").rules("add", {
                required: true,
                messages: { required: "O campo Nome Documento é de preenchimento obrigatório." }
            });
            break;
    }
}

var ExibirMensagemSerieDocumental = function () {
    $("#btnSalvar").click(function () {
        var msg = [];

        var form = $('#formClassificarDoc');

        var valido = BASE.ValidarForm(form);

        if (valido) {
            if (($("#SerieDocumento").val() == "" || $("#SerieDocumento").val() == null || $("#SerieDocumento").val() == "0") && $('input[name=Origem]:checked').val() == "Interno") {
                $('span[data-valmsg-for="SerieDocumento"]').html('O campo Série Documental é de preenchimento obrigatório');
                $('span[data-valmsg-for="SerieDocumento"]').show();

                msg.push("A Série Documental é obrigatória. Para obtê-la digite ");
                msg.push("a série no campo “Descrição” ou selecione as opções dos campo Função/Sub Função/Atividade e Série");

                BASE.MostrarMensagem(msg, TipoMensagem.Error);
                return false;
            } else {
                $('span[data-valmsg-for="SerieDocumento"]').hide();
            }
        }
        else {
            return false;
        }
    });
};

$("#btnCancelarProtocolo").on('click', function () {
    $("#nrProtocolo").val('');
});

$('#ultimoProtocolo').on('blur', function () {
    var tipoDocumento = $('#ultimoProtocolo').val();
    $.ajax({
        url: "/Documento/PesquisarReplicaDocumento",
        data: { documento: $('#ultimoProtocolo').val() },
        cache: false,
        success: function (result) {
            if (result.result == "Desabilitar" && result.remessa == '') {
                BASE.Mensagem.Mostrar('Protocolo não finalizado!', TipoMensagem.Alerta);
                $('#btnReplicar').attr('disabled', 'disabled');
            } else if (result.result == "Desabilitar" && result.remessa != '') {
                BASE.Mensagem.Mostrar(result.remessa, TipoMensagem.Alerta);
                $('#btnReplicar').attr('disabled', 'disabled');
            } else {
                $('#btnReplicar').removeAttr('disabled');
            }
        }
    });
});
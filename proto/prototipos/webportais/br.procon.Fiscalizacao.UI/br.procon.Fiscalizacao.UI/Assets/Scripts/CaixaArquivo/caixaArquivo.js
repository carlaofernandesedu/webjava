$(document).ready(function () {
    bindIdCaixaArquivo();
    bindOnchangeLocalArquivo($("#IdLocalArquivo"));
    bindOnchangeDivisaoMovelArquivo($("#IdMovelArquivo"));
    bindIncluirCaixaArquivo();
    AutoCompleteSerieDocumental();
});

function bindIdCaixaArquivo() {
    $("#table_caixa_arquivo button.btnExcluirCaixa").off('click');
    $("#table_caixa_arquivo button.btnExcluirCaixa").on('click', function () {
        $('#IdCaixaArquivo').val($(this).data('id'));
        $('#modalExcluirCaixaArquivo').modal('show');
        bindExcluirCaixaArquivo();
    });
}

function bindIncluirCaixaArquivo() {
    $('#btnIncluirCaixaArquivo').off('click');
    $('#btnIncluirCaixaArquivo').on('click', function () {
        IncluirCaixaArquivo();
    });
}

function IncluirCaixaArquivo() {

    var codigo = $('#CodigoCaixa').val();
    var descricao = $('#DescricaoCaixa').val();
    var ativo = ($('#AtivoCaixa').is(":checked"));
    var idMovelDivisao = $('#IdMovelDivisao').val();
    var idSerieDocumental = $('#IdSerieDocumental').val();

    $.ajax({
        url: "/CaixaArquivo/Incluir",
        type: "POST",
        data: { codigo: codigo, descricao: descricao, ativo: ativo, idMovelDivisao: idMovelDivisao, idSerieDocumental: idSerieDocumental },
        success: function (result) {
            if (result != null) {
                if (result.valido) {
                    BASE.MostrarMensagem("Caixa de Arquivo Incluída com sucesso!", TipoMensagem.Sucesso);
                    $('#modalIncluirCaixaArquivo').modal('hide');
                } else {
                    BASE.MostrarMensagemErro(result.mensagens);
                }
            }
        },
        error: function (result) {
            BASE.MostrarMensagemErro('Os dados não foram salvos ,Favor verificar as informações!');
        }
    });
}

function bindExcluirCaixaArquivo() {
    $("#modalExcluirCaixaArquivo #confirmar-Exclusao").off('click');
    $("#modalExcluirCaixaArquivo #confirmar-Exclusao").on('click', function () {
        $.ajax({
            url: "/CaixaArquivo/Excluir/",
            type: "post",
            dataType: "json",
            data: { idCaixaArquivo: $('#IdCaixaArquivo').val() },
            success: function (result) {
                if (result != null) {
                    if (result.valido) {
                        BASE.MostrarMensagem("Caixa de arquivo excluída com sucesso!", TipoMensagem.Sucesso);
                        $('#modalExcluirCaixaArquivo').modal('hide');
                    } else {
                        BASE.MostrarMensagemErro(result.mensagens);
                    }
                }
            },
            error: function (result) {
                BASE.MostrarMensagemErro('Os dados não foram salvos ,Favor verificar as informações!');
            }
        });
    });
}

function bindOnchangeLocalArquivo(cmbLocalArquivo) {
    cmbLocalArquivo.change(function () {
        $.ajax({
            url: '/CaixaArquivo/CarregarMoveis',
            type: 'POST',
            cache: false,
            data: { idLocalArquivo: cmbLocalArquivo.val() },
            success: function (data) {
                $("#IdMovelArquivo").empty();

                if (data.lista.length > 0) {
                    $("#IdMovelArquivo").append($("<option value='0'>--Selecione--</option>"));

                    $.each(data.lista, function (index, value) {
                        $("#IdMovelArquivo").append($("<option value='" + value.Id + "'>" + value.Codigo + ' - ' + value.Descricao + "</option>"));
                    });
                    $("#IdMovelArquivo").prop("disabled", false);
                }
                else {
                    $("#IdMovelArquivo").empty();
                    $("#IdMovelArquivo").prop("disabled", true);
                }
            }
        });
    });
}

function bindOnchangeDivisaoMovelArquivo(cmbMovelArquivo) {
    cmbMovelArquivo.change(function () {
        $.ajax({
            url: '/CaixaArquivo/CarregarDivisoes',
            type: 'POST',
            cache: false,
            data: { idMovelArquivo: cmbMovelArquivo.val() },
            success: function (data) {
                $("#IdMovelDivisao").empty();

                if (data.lista.length > 0) {
                    $("#IdMovelDivisao").append($("<option value='0'>--Selecione--</option>"));

                    $.each(data.lista, function (index, value) {
                        $("#IdMovelDivisao").append($("<option value='" + value.Id + "'>" + value.Codigo + ' - ' + value.Descricao + "</option>"));
                    });
                    $("#IdMovelDivisao").prop("disabled", false);
                }
                else {
                    $("#IdMovelDivisao").empty();
                    $("#IdMovelDivisao").prop("disabled", true);
                }
            }
        });
    });
}

var AutoCompleteSerieDocumental = function () {
    $("#SerieDocumental").typeahead({
        onSelect: function (item) {
            $("#IdSerieDocumental").val(item.value);
        },
        ajax: {
            url: '/CaixaArquivo/RetornaSerieDocumental',
            triggerLength: 4,
            dataType: "json",
            displayField: "DescricaoSerie",
            valueField: "IdSerieDocumental",
            preDispatch: function (query) {
                return {
                    query: query
                }
            },
            preProcess: function (data) {
                var listaSerie = [];
                if (data.lista.length === 0) {
                    BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                    return false;
                }

                return data.lista;
            }
        }
    });
}
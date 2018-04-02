$(function () {
    bindMascaraInicialParamentroPesquisa();
    bindChangeNumeroProtocolo();
    popularComboTipoDocumentoExterno();
    popularComboUnidadeAdministrativa();
    popularComboUsuarioCriacao();
    bindParametroPesquisa();
    bindBtnBuscaAvancada();
    bindLinkBuscaAvancada();
});

// INICIA A MASCARA DO CAMPO N° DO PROTOCOLO
function bindMascaraInicialParamentroPesquisa() {
    $('.dadosPesquisa').mask('000000/0000', { reverse: true });
    $('.dadosPesquisa').attr('placeholder', '______/____');
}

// APLICA ZEROS A ESQUERDA CASO NECESSÁRIO NO Nº DO PROTOCOLO
function bindChangeNumeroProtocolo() {
    $('.nrProtocolo').off('change');
    $('.nrProtocolo').on('change', (function () {
        $('.nrProtocolo').val(BASE.AdicionarQtdCaracterAEsquerda($('.nrProtocolo').val(), 11, 0));
        if ($('.nrProtocolo').val().indexOf('000000') >= 0) {
            $('.nrProtocolo').val('');
        }
    }));
}

// APLICA A MASCARA DE ACORDO COM O PARAMETRO DE PESQUISA
function bindParametroPesquisa() {
    $('.parametro').off('click');
    $('.parametro').on('click', (function () {
        var id = $(this).attr('data-id');

        $('.parametro').removeClass('ativo');
        $('.dadosPesquisa').focus();
        $('.dadosPesquisa').removeAttr('id').attr('id', id).val('');

        if ($('.dadosPesquisa').is('#dadosProtocolo')) {
            $('.dadosPesquisa').mask('000000/0000', { reverse: true });
            $('.dadosPesquisa').attr('placeholder', '______/____');
            $('.dadosPesquisa').attr('maxlength', '11');
        }
        else if ($('.dadosPesquisa').is('#dadosProcesso')) {
            $('.dadosPesquisa').mask('000000/0000.0', { reverse: true });
            $('.dadosPesquisa').attr('placeholder', '______/____._');
            $('.dadosPesquisa').attr('maxlength', '13');
        }

        if ($(this).not('ativo')) {
            $(this).addClass('ativo');
        }
    }));
}

// CLIQUE NO BOTAO BUSCA DA BUSCA AVANÇADA
function bindBtnBuscaAvancada() {
    $("#btnBuscaAvancada").off("click");
    $("#btnBuscaAvancada").on("click", function () {
        var _form = $(this).parents('form:first');
        buscar(_form);
    });
}

// CLIQUE NO LINK BUSCA AVANÇADA
function bindLinkBuscaAvancada() {
    $('#abreBA').off('click');
    $('#abreBA').on('click', (function () {
        $('#iconeAbre').toggleClass('fa-angle-up fa-angle-down');
        $('#buscaSimples').slideToggle();
        $('.dadosPesquisa').val('');

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //JANEIRO COMECA COM '0'

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var today = dd + '/' + mm + '/' + yyyy;

        $('#pesquisaDocumentoAvancada .data').val(today);

        var uaPosse = $('#UaPosse_UsuarioLogado').val();

        if (uaPosse != undefined && uaPosse != "") {
            $('#pesquisaDocumentoAvancada #UaPosse').val(uaPosse);

            //$.ajax({
            //    url: '/Usuario/ComboUsuariosCriacaoPorUA',
            //    type: 'POST',
            //    data: { unidadeAdministrativa: uaUsuario },
            //    success: function (data) {
            //        if (data.Sucesso == true) {
            //            bindCombo(data.Resultado, '#UsuarioCriacao');
            //        }
            //        else {
            //            $('#UsuarioCriacao').empty();
            //            $('#UsuarioCriacao').append($("<option value=''>Selecione</option>"));
            //            $('#UsuarioCriacao').attr('disabled', true);
            //        }
            //    }
            //});
        }
    }));
}

function buscar(_form) {
    var valido = validarDados(_form);
    var dataInicial = $('#pesquisaDocumentoAvancada #dataInicial').val();
    var dataFinal = $('#pesquisaDocumentoAvancada #dataFinal').val();

    if (dataInicial != "" && dataFinal != "") {
        var dtIniArr = dataInicial.split('/');
        var dtfimArr = dataFinal.split('/');

        var dtIni = new Date(dtIniArr[2], dtIniArr[1], dtIniArr[0]);
        var dtFim = new Date(dtfimArr[2], dtfimArr[1], dtfimArr[0], 23, 59, 59, 999);

        var timeDiff = Math.abs(dtFim.getTime() - dtIni.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (dtFim < dtIni) {
            BASE.Mensagem.Mostrar('Data Inicial deve ser maior que Data Final', TipoMensagem.Alerta);
            valido = false;
        }
    }

    if (valido) {
        var obj = _form.serialize();

        $.ajax({
            url: '/PesquisarDocumento/PesquisaAvancada',
            type: 'POST',
            data: { pesquisa: obj },
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
            },
            error: function (e) {
                console.log(e)
            }
        });
    }
}

function validarDados(form) {
    if ($.validator !== undefined) {
        $.validator.unobtrusive.parse(form);
        camposObrigatorios();
    }
    else {
        BASE.Debug('problema no jQuery validator', DebugAction.Warn);
    }

    return form.valid(true);
}

function camposObrigatorios() {
    $('#pesquisaDocumentoAvancada #dataInicial').rules('add', {
        required: true
        , messages: {
            required: "Campo Data Inicial obrigatório"
        }
    });

    $('#pesquisaDocumentoAvancada #dataFinal').rules('add', {
        required: true
        , messages: {
            required: "Campo Final obrigatório"
        }
    });
}

var popularComboTipoDocumentoExterno = function () {
    CONTROLES.DropDown.Preencher('#TipoDocumentoExterno', 'Documento', 'CarregarComboTipoDocumentoExterno', null, true, false, false, null);
}

function popularComboUnidadeAdministrativa() {
    CONTROLES.DropDown.Preencher('#UaProdutora', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true, false, false, null);
    CONTROLES.DropDown.Preencher('#UaPosse', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true, false, false, null);
}

function popularComboUsuarioCriacao() {
    $('#UaProdutora').off('change');
    $('#UaProdutora').on('change', function () {
        $.ajax({
            url: '/Usuario/ComboUsuariosCriacaoPorUA',
            type: 'POST',
            data: { unidadeAdministrativa: $(this).val() },
            success: function (data) {
                if (data.Sucesso == true) {
                    bindCombo(data.Resultado, '#UsuarioCriacao');
                }
                else {
                    $('#UsuarioCriacao').empty();
                    $('#UsuarioCriacao').append($("<option value=''>Selecione</option>"));
                    $('#UsuarioCriacao').attr('disabled', true);
                }
            }
        });
    });
}

function bindCombo(data, combo) {
    totalItens = data.length;
    $(combo).empty();
    $(combo).append($("<option value=''>Selecione</option>"));
    $.each(data, function (index, value) {
        $(combo).append($("<option value='" + value.Value + "'>" + value.Text.toUpperCase() + "</option>"));
    });

    $(combo).attr('disabled', false);
}

var DynamicValidation = function (tipoPesquisa) {
    $('input, select, textarea').each(function () {
        $(this).rules('remove', 'required');
    });

    if (tipoPesquisa == '1') {
        ValidationInteressados();
    }
}

var ValidationInteressados = function () {
    $("#Interessado").rules("add", {
        required: true,
        messages: {
            required: "O campo Interessado é de preenchimento obrigatório!"
        }
    });

    $("#DataInicial").rules("add", {
        required: true,
        messages: {
            required: "O campo Data do Documento de é de preenchimento obrigatório!"
        }
    });

    $("#DataFinal").rules("add", {
        required: true,
        messages: {
            required: "O campo Data do Documento Até é de preenchimento obrigatório!"
        }
    });
}

$('#tblPesquisaDocumento').dataTable({
    /*Coluna que não permite ordenação, partindo do array 0*/
    "aoColumnDefs": [{ "bSortable": false, "aTargets": [5] }],

    /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
    "order": [[0, "asc"]],

    /*Resposividade da tabela*/
    responsive: true,
    "bDestroy": true
});
$('select[name=tblPesquisaDocumento_length]').addClass('tabela-length');

var PopularComboSerieDocumental = function (calback) {
    $.ajax({
        url: '/Documento/ConsultaSerieDocumental',
        type: 'POST',
        success: function (data) {
            $("#Funcao").empty();
            $("#Funcao").append($("<option>Selecione</option>"));

            $.each(data.lista, function (index, value) {
                $("#Funcao").append($("<option value='" + value.IdFuncao + "'>" + value.DescricaoFuncao + "</option>"));
            });

            $("#SubFuncao").prop("disabled", true);
            $("#Atividade").prop("disabled", true);

            calback($("#Funcao"));
        }
    });
};
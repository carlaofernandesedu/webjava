ARQUIVOPESQUISA = (function () {

    var nrProtocolo = undefined,
        nrProcesso = undefined;

    function init() {
        BASE.Debug("arquivopesquisainit");
        CRUDFILTRO.Evento.PosListar = obterDadosDocumento;
        bindAll();
    }

    function bindAll() {
        bindMascara();
    }

    function obterDadosDocumento() {

        nrProtocolo = ($("#NrProtocolo").val() !== "" && $("#NrProtocolo").val() != undefined) ? $("#NrProtocolo").val() : null;
        nrProcesso = ($("#NrProcesso").val() !== "" && $("#NrProcesso").val() != undefined) ? $("#NrProcesso").val() : null;

        $.ajax({
            url: '/ArquivamentoPesquisa/ObterDadosDocumento',
            type: 'POST',
            data: { nrProtocolo: nrProtocolo, nrProcesso: nrProcesso },
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (!isJson) {
                    renderHtml(response);
                }
            },
            error: function (xhr) {
                BASE.Util.TratarErroAjax(xhr, true);
            }
        });
    }

    function bindMascara() {
        $('#NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $("#NrProcessoFormatado").mask('000000/0000.0', { reverse: true, placeholder: '______/____._' }).attr('maxlength', '13');

        $('#NrProtocoloFormatado').change(function () {
            $('#NrProtocoloFormatado').val(BASE.AdicionarQtdCaracterAEsquerda($('#NrProtocoloFormatado').val(), 11, 0));
            if ($('#NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $('#NrProtocoloFormatado').val('');
            }
        });

        $('#NrProcessoFormatado').change(function () {
            $('#NrProcessoFormatado').val(BASE.AdicionarQtdCaracterAEsquerda($('#NrProcessoFormatado').val(), 13, 0));
            if ($('#NrProcessoFormatado').val().indexOf('000000') >= 0) {
                $('#NrProcessoFormatado').val('');
            }
        });

    }

    function renderHtml(html) {
        $('#arquivo-dados-documento').html(html);
    }

    return {
        Init: function () {
            init();
        }
    };
}());


$(function () {

    ARQUIVOPESQUISA.Init();

    CRUDFILTRO.Carregar();

    //CRUDFILTRO.Filtrar();
});
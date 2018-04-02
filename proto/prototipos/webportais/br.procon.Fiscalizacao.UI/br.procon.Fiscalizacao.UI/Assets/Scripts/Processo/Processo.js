PROCESSO = (function () {

    var form = '#filtro-processo';

    var tipoSituacaoProcesso = {
        EmAndamento: 1,
        SobGuardaProcon: 2,
        Encerrado: 3
    };

    function init() {
        bindAll();
        carregarPaginacao();
        carregarComboCompetencia();
        carregarComboSituacao();
        carregarComboUAPosse();

        CONTROLES.Tabela.Configurar();
    }

    function bindAll() {
        bindBntfiltrar();
        bindMascara();
        bindDataInicial();
        dindDataFinal();
    }

    function bindBntfiltrar() {
        $('#filtro-processo #btn-pesquisar').off('click');
        $('#filtro-processo #btn-pesquisar').on('click', function () {
            //console.log("caiu no pesquisar");
            //var vmodel = $(form).serializeObject();
            //filtrar(vmodel);
            var tabela = $('table.dataTable').DataTable();
            tabela.page(1).draw();
        });

    }

    function bindMascara() {

        $('#NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $('#NrProcessoFormatado').mask('000000/0000.0', { reverse: true, placeholder: '______/____._' }).attr('maxlength', '13');

        $('#NrProtocoloFormatado').change(function () {
            $('#NrProtocoloFormatado').val(adicionarQtdCaracterAEsquerda($('#NrProtocoloFormatado').val(), 11, 0));
            if ($('#NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $('#NrProtocoloFormatado').val('');
            }
        });

        $('#NrProcessoFormatado').change(function () {
            $('#NrProcessoFormatado').val(adicionarQtdCaracterAEsquerda($('#NrProcessoFormatado').val(), 13, 0));
            if ($('#NrProcessoFormatado').val().indexOf('000000') >= 0) {
                $('#NrProcessoFormatado').val('');
            }
        });

    }

    function adicionarQtdCaracterAEsquerda(num, qtdTotalCampo, caracterAdicionado) {
        var str = ("" + num);
        return (Array(Math.max((qtdTotalCampo + 1) - str.length, 0)).join(caracterAdicionado) + str);
    }

    function bindDataInicial() {
        $('#filtro-processo #DataInicial').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });
    }

    function dindDataFinal() {
        $('#filtro-processo #DataFinal').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });
    }

    function carregarPaginacao() {
        $('#table-processo').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"]
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"]
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "desc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function carregarComboCompetencia() {

        $.ajax({
            url: "/Processo/ListarCompetenciaProcesso",
            type: "GET",
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {
                    $("#IdCompetencia").empty();
                    $("#IdCompetencia").append($("<option value=''>Selecione</option>"));

                    $.each(response.ListaCompetencia,
                        function (index, value) {
                            $("#IdCompetencia").append($("<option value='" + value.Codigo + "'>" + value.Descricao + "</option>"));
                        });
                }
            },
            error: function () {
                console.log("Erro ao carregar lista de competencia");
            }
        });
    }

    function carregarComboSituacao() {
        $.ajax({
            url: "/Processo/ListarSituacaoProcesso",
            type: "GET",
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {
                    $("#Situacao").empty();
                    $("#Situacao").append($("<option value=''>Selecione</option>"));

                    $.each(response.ListaSituacao,
                        function (index, value) {
                            $("#Situacao").append($("<option value='" + value.Codigo + "'>" + value.Descricao + "</option>"));
                        });

                    $("#Situacao").val(tipoSituacaoProcesso.EmAndamento);
                }
            },
            error: function () {
                console.log("Erro ao carregar lista de situação");
            }
        });
    }

    function carregarComboUAPosse() {
       
        $.ajax({
            url: "/Processo/ListarUA",
            type: "GET",
            cache: false,
            success: function (response, status, xhr) {                

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {
                    $("#IdUaPosse").empty();
                    $("#IdUaPosse").append($("<option value=''>Selecione</option>"));

                    $.each(response.ListaSituacao,
                        function (index, value) {
                            $("#IdUaPosse").append($("<option value='" + value.IdUA + "'>" + value.Nome + "</option>"));
                        });

                    $("#IdUaPosse").val('');
                }
            },
            error: function () {                

                console.log("Erro ao carregar lista de Unidades Administrativas");
            }
        });
 }

    function filtrar(vmodel) {
        $.ajax({
            url: '/Processo/Filtrar',
            type: 'POST',
            data: { filtro: vmodel },
            cache: false,
            success: function (response, status, xhr) {

                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (!isJson) {
                    renderHtml(response);
                    posCarregar();
                }
            },
            error: function () {
                console.log("Erro ao pesquisar processo");
            }
        });
    }

    function posCarregar() {
        carregarPaginacao();
    }

    function renderHtml(view) {
        $('#lista-processo').html(view);
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    PROCESSO.Init();
});

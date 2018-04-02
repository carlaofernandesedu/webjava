$(document).ready(function () {

    $('#DataInicial').datetimepicker();
    $('#DataFinal').datetimepicker({
        useCurrent: true //Important! See issue #1075
    });
    $("#DataInicial").on("dp.change", function (e) {
        $('#DataFinal').data("DateTimePicker").minDate(e.date);
    });
    $("#DataFinal").on("dp.change", function (e) {
        $('#DataInicial').data("DateTimePicker").maxDate(e.date);
    });

    PopulaComboUA("/Remessa/PopulaComboUA", "idUaDestino", localStorage.getItem('idUaDestino'));
    PopulaComboSituacao("/Remessa/PopulaComboSituacao", "idSituacaoRemessa", localStorage.getItem('idSituacaoRemessa'))

    ValidaCamposDatasPreenchido();

    $("#NumeroAnoRemessa").focusout(function () {
        if ($("#NumeroAnoRemessa").val() != "" && $("#NumeroAnoRemessa").val() != null) {
            $("#DataInicial").rules("remove");
            $("#DataFinal").rules("remove");
        }
        else {
            ValidaCamposDatasPreenchido();
        }
    });

    $("#NumeroAnoRemessa").val(localStorage.getItem('NumeroAnoRemessa'));
    $("#DataInicial").val(localStorage.getItem('DataInicial'));
    $("#DataFinal").val(localStorage.getItem('DataFinal'));   

    $(' .numeroAno').FormatarProtocoloProcesso();
   
    bindLinkBuscaAvancada();

    bindDataTable();
});


// CLIQUE NO LINK BUSCA AVANÇADA
function bindLinkBuscaAvancada() {
    $('#abreBA').off('click');
    $('#abreBA').on('click', (function () {
        $('#iconeAbre').toggleClass('fa-angle-up fa-angle-down');
        $('#buscaSimples').slideToggle();
        $('.dadosPesquisa').val('');
        $('#idSituacaoRemessa').val('0');
        $('#idUaDestino').val('0');
        $('#DataInicial').val('');
        $('#DataFinal').val('');

    }));
}

$('#tblRelacaoRemessa td a').click(function () {
    var identificador = $(this).attr('name');
    $('i', this).toggleClass('fa-plus fa-minus')
    $('#' + identificador).toggle('fade', 200);
});

$('.data').each(function () {
    $(this).datepicker({
        language: "pt-BR"
    });
});

function bindDataTable() {   
    $('#grupo_lista_relacionar').dataTable({
       
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [] }],

        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "desc"]],
        "bDestroy": true,
        
        /*Resposividade da tabela*/
        responsive: true
    });

}

var PopulaComboUA = function (url, combo, idSelected) {

    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            $("#" + combo).empty();
            $("#" + combo).append($("<option value='0'>Selecione</option>"));

            $.each(data, function (index, value) {
                $("#" + combo).append($("<option value='" + value.Codigo + "'>" + value.Nome + "</option>"));
            });

            if (idSelected != null && idSelected != undefined)
                $("#" + combo).val(idSelected);
            else
                $("#" + combo).val("0");
        }
    });
}

var PopulaComboSituacao = function (url, combo, idSelected) {

    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            $("#" + combo).empty();
            $("#" + combo).append($("<option value='0'>Selecione</option>"));

            $.each(data, function (index, value) {
                $("#" + combo).append($("<option value='" + value.IdSituacaoRemessa + "'>" + value.DescSituacaoRemessa + "</option>"));
            });

            if (idSelected != null && idSelected != undefined)
                $("#" + combo).val(idSelected);
            else
                $("#" + combo).val("0");
        }
    });
}

var ValidaCamposDatasPreenchido = function () {

    $("#DataInicial").rules("add", {
        DataInicial: {
            required: true
        },
        messages: {
            required: "Enter something"
        }
    });

    $("#DataFinal").rules("add", {
        DataFinal: {
            required: true
        },
        messages: {
            required: "Enter something"

        }
    });
};

var FiltroPesquisa = function () {

    localStorage.setItem('NumeroAnoRemessa', $("#NumeroAnoRemessa").val());
    localStorage.setItem('idSituacaoRemessa', $("#idSituacaoRemessa").val());
    localStorage.setItem('idUaDestino', $("#idUaDestino").val());
    localStorage.setItem('DataInicial', $("#DataInicial").val());
    localStorage.setItem('DataFinal', $("#DataFinal").val());
};

REMESSA = (function () {

    function bindFiltrar() {
        $('#formPesquisarRemessa').off('click');
        $('#formPesquisarRemessa').on('click', '.btn-filtrar', function () {
            filtrar();
        });
    }

    function filtrar() {
        var form = $('#formPesquisarRemessa');
        var url = form.prop('action');

        var object = form.serializeObject();

        if ($('#buscaSimples').is(":visible")) // BUSCA SIMPLES
        {
            if (object.NumeroAnoRemessa === "")
            {
                BASE.Mensagem.Mostrar("Preencha o Nº da Remessa para realizar a pesquisa!", TipoMensagem.Error);
                return false;
            }
        }
        else {                                 // BUSCA AVANÇADA
            if (object.NumeroAnoDocumento === "" && (object.DataInicial === "" || object.DataFinal === "")) {
                BASE.Mensagem.Mostrar("Preencha o Nº do Documento ou o Período para realizar a pesquisa!", TipoMensagem.Error);
                return false;
            }
        }

        $.ajax({
            type: 'GET',
            url: url,
            data: object,
            success: function (data) {
                $('#divListaRemessa').html(data);
                bindDataTable();
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
                return false;
            }
        });
    }

    function bindAll() {
        bindFiltrar();
    }

    function init() {
        bindAll();
    }

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    return {
        Init: init
    }
})();

$(function () {
    REMESSA.Init();
});
var CLASSIFICACAO = (function () {

    var form = $("#form-detalhe");

    function init() {
        console.log('atendimento-classificacao.js');
        CRUDBASE.Eventos.PosCarregarEditar = posCarregarEditar;
        CRUDFILTRO.Carregar = carregarFiltro;
        CRUDBASE.Eventos.PosLimparEditar = propagarClassificacaoPai;
        CONTROLES.Tabela.Configurar();
        bindLimpar();

        CRUDBASE.VerificarModo();
    }

    function bindLimpar() {
        $('.frm-filtro').on('click', '.acoes #btnLimpar', function () {
            $('.frm-filtro #IdPai').val('');

            return false;
        });
    }

    function carregarFiltro() {
        CONTROLES.DropDown.Preencher('.frm-filtro #Codigo', 'Classificacao', 'SelectList', null, "Nenhum");

        //Cascade Dropdown
        CLASSIFICACAO_CASCADE_DDL.SetIdObject("#IdPai");
        $('#filtrar').slideToggle('show');

    }

    function posCarregarEditar() {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdPai', 'Classificacao', 'SelectList', null, "Nenhum");

        console.log('posCarregarEditar');
        CONTROLES.DropDown.Preencher('#form-detalhe #IdArea', 'Area', 'SelectList', null, true, false, false, function () {
            CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdArea', '#IdAssunto, #IdProblema', false, "Selecione", function (idPai) {
                if (idPai) {
                    console.log('areaselecionada: ' + idPai);
                    selectArea(idPai);

                    form.find("#IdAssunto").rules('remove', "required");
                }
            });
            CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdAssunto', '#IdProblema', false, "Selecione", function (idPai) {
                if (idPai) {
                    console.log('assuntoselecionado-' + idPai);
                    CONTROLES.DropDown.Preencher('#form-detalhe #IdProblema', 'Problema', 'SelectList', idPai, true);
                }
            });
        });

        bindChangeIdPai();

        bindChangeVisibilidade();

        $('#form-detalhe').find("#Externa").trigger("change");
    }

    function selectArea(idArea) {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdAssunto', 'Assunto', 'SelectList', idArea, true, false, false, function () {

            var idAssunto = $('#IdAssunto option:selected').val();

            debugger
            CONTROLES.DropDown.Preencher('#form-detalhe #IdProblema', 'Problema', 'SelectList', idAssunto, true);
        });


        //if ($('#Pai').val() !== undefined && $('#Pai').val() != '') {
        //    var pai = JSON.parse($('#Pai').val());
        //    if (pai !== null) {
        //        $('#form-detalhe select[name="Externa"]').val(pai.Resultado.Externa.toString());
        //        $('#form-detalhe select[name="Status"]').val(pai.Resultado.Status.toString());

        //        $('#form-detalhe select[name="Externa"]').find('option[value!="' + pai.Resultado.Externa.toString() + '"]').prop('disabled', true);
        //        $('#form-detalhe select[name="Status"]').find('option[value!="' + pai.Resultado.Status.toString() + '"]').prop('disabled', true);

        //        $('#StatusEdicao').val(pai.Resultado.Status.toString());
        //    }
        //}
    }

    function bindChangeVisibilidade() {
        form.on("change", "#Externa", function () {
            var that = $(this);
            var showDiv = that.val() === "true";
            var ruleAction = showDiv ? "add" : "remove";

            form.find("#divOnlyExternal").toggle(showDiv);

            form.find("#IdArea").rules(ruleAction, "required");
            form.find("#IdAssunto").rules(ruleAction, "required");
            form.find("#IdProblema").rules(ruleAction, "required");
        });
    }

    function bindChangeIdPai() {
        $('#form-detalhe').off('change', '#IdPai');
        $('#form-detalhe').on('change', '#IdPai', function () {
            propagarStatusVisibilidadePai($(this));

            return false;
        });

        $('.frm-filtro input').keypress(function (e) {
            if (e.keyCode === 13) {
                filtrar();

                return false;
            }
        });
    }

    function propagarClassificacaoPai() {
        var ddl = $('#form-detalhe #IdPai');

        propagarStatusVisibilidadePai(ddl);
    }

    function propagarStatusVisibilidadePai(ddl) {
        var selectedOption = ddl.find(':selected');
        var statusPai = selectedOption.data('status');
        var visibilidadePai = selectedOption.data('externa');

        var ddlStatus = $('#form-detalhe select[name="Status"]');
        var ddlVisibilidade = $('#form-detalhe select[name="Externa"]');

        ddlHerdar(ddlStatus, statusPai);
        ddlHerdar(ddlVisibilidade, visibilidadePai);

        ddlVisibilidade.trigger("change");

        $('#StatusEdicao').val(statusPai);
    }

    function ddlHerdar(ddl, valorPai) {
        if (valorPai === undefined || valorPai === null || valorPai === '') {
            ddl.val('');
            //ddl.removeAttr("disabled");
            ddl.find('option').prop('disabled', false);
        } else {
            ddl.val(valorPai.toString());
            ddl.find('option').prop('disabled', false);
            ddl.find('option[value!="' + valorPai + '"]').prop('disabled', true);
            //ddl.attr("disabled", "disabled");
        }
    }

    return {
        Init: init
    };
}());

$(function () {
    CLASSIFICACAO.Init();
    CRUDFILTRO.Carregar();
});







































//$(document).ready(function () {

//    $('#DataInicial').datetimepicker();
//    $('#DataFinal').datetimepicker({
//        useCurrent: true //Important! See issue #1075
//    });
//    $("#DataInicial").on("dp.change", function (e) {
//        $('#DataFinal').data("DateTimePicker").minDate(e.date);
//    });
//    $("#DataFinal").on("dp.change", function (e) {
//        $('#DataInicial').data("DateTimePicker").maxDate(e.date);
//    });    

//    ValidaCamposDatasPreenchido();

//    $("#NumeroAnoRemessa").focusout(function () {
//        if ($("#NumeroAnoRemessa").val() != "" && $("#NumeroAnoRemessa").val() != null) {
//            $("#DataInicial").rules("remove");
//            $("#DataFinal").rules("remove");
//        }
//        else {
//            ValidaCamposDatasPreenchido();
//        }
//    });

//    $("#NumeroAnoRemessa").val(localStorage.getItem('NumeroAnoRemessa'));
//    $("#DataInicial").val(localStorage.getItem('DataInicial'));
//    $("#DataFinal").val(localStorage.getItem('DataFinal'));

//    $(' .numeroAno').FormatarProtocoloProcesso();

//    bindLinkBuscaAvancada();

//    bindDataTable();
//});


//var ValidaCamposDatasPreenchido = function () {

//    $("#DataInicial").rules("add", {
//        DataInicial: {
//            required: true
//        },
//        messages: {
//            required: "Enter something"
//        }
//    });

//    $("#DataFinal").rules("add", {
//        DataFinal: {
//            required: true
//        },
//        messages: {
//            required: "Enter something"

//        }
//    });
//};


//var FiltroPesquisa = function () {

//    localStorage.setItem('NumeroAnoRemessa', $("#NumeroAnoRemessa").val());
//    localStorage.setItem('idSituacaoRemessa', $("#idSituacaoRemessa").val());
//    localStorage.setItem('idUaDestino', $("#idUaDestino").val());
//    localStorage.setItem('DataInicial', $("#DataInicial").val());
//    localStorage.setItem('DataFinal', $("#DataFinal").val());
//};



//DENUNCIA = (function () {

//    function bindFiltrar() {
//        $('#formPesquisarRemessa').off('click');
//        $('#formPesquisarRemessa').on('click', '.btn-filtrar', function () {
//            filtrar();
//        });
//    }

//    function filtrar() {
//        var form = $('#formPesquisarRemessa');
//        var url = form.prop('action');

//        var object = form.serializeObject();

//       // BUSCA AVANÇADA
//        if (object.NumeroAnoDocumento === "" && (object.DataInicial === "" || object.DataFinal === ""))
//        {
//            BASE.Mensagem.Mostrar("Preencha o Nº do Documento ou o Período para realizar a pesquisa!", TipoMensagem.Error);
//            return false;
//       }
       

//        $.ajax({
//            type: 'GET',
//            url: url,
//            data: object,
//            success: function (data) {
//                $('#divListaRemessa').html(data);
//                bindDataTable();
//            },
//            error: function (e) {
//                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
//                return false;
//            }
//        });
//    }

//    function bindAll() {
//        bindFiltrar();
//    }

//    function init() {
//        bindAll();
//    }

//    $.fn.serializeObject = function () {
//        var o = {};
//        var a = this.serializeArray();
//        $.each(a, function () {
//            if (o[this.name] !== undefined) {
//                if (!o[this.name].push) {
//                    o[this.name] = [o[this.name]];
//                }
//                o[this.name].push(this.value || '');
//            } else {
//                o[this.name] = this.value || '';
//            }
//        });
//        return o;
//    };

//    return {
//        Init: init
//    }
//})();

//$(function () {
//    DENUNCIA.Init();
//});
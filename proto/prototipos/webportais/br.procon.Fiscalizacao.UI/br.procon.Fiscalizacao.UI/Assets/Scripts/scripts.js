$(document).ready(function () {
    //Tratamento de selects com o atributo readonly
    jQuery("select[readonly]").each(function () {
        if (jQuery(this).attr("readonly") == "readonly") {
            var valor = jQuery(this).val();

            jQuery('option', jQuery(this)).filter(function () {
                if (jQuery(this).val() == valor) {
                    jQuery(this).attr("disabled", false);
                    return true;
                }
                else {
                    jQuery(this).attr("disabled", true);
                    return false;
                }
            }).val();
        }
    });

    //TABELAS	
    if (!$.fn.DataTable.isDataTable('#grupo_lista_relacionar')) {
        $('#grupo_lista_relacionar').dataTable({

            /*Coluna que não permite ordenação, partindo do array 0*/
            //"aoColumnDefs": [{ "bSortable": false, "aTargets": ["no-sort"] },
            //                 { "word-wrap": "break-word", "aTargets": ["col-wrap"] }], // HACK no-sort não funciona e quebra o datatables com coluna com checkbox. Mantis 0001908

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],


            /*Resposividade da tabela*/
            responsive: false,

        });
    }

    //$('#table_recurso').dataTable({
    //    "autoWidth": false,
    //    /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
    //    "order": [[0, "asc"]],


    //    /*Resposividade da tabela*/
    //    responsive: false,

    //});

    $('#table_recurso').dataTable({
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [5] }],
        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "asc"]],
        /*Resposividade da tabela*/
        responsive: true,
        "bDestroy": true,
        bAutoWidth: false,
        "aoColumns": [
         { "sWidth": "10%" },
         { "sWidth": "20%" },
         { "sWidth": "20%" },
         { "sWidth": "20%" },
         { "sWidth": "20%" },
         { "sWidth": "10%" }
        ],
    });

    // Extensão para Ordernar de Forma Correta a Data nas Tabelas.
    // Ex.: "aoColumnDefs": [{ "sType": "ordemData", "aTargets": [0] }]
    $.extend(jQuery.fn.dataTableExt.oSort, {
        "ordemData-pre": function (d) {
            var x;
            try {
                var dataA = d.replace(/ /g, '').split("/");
                var dia = parseInt(dataA[0], 10);
                var mes = parseInt(dataA[1], 10);
                var ano = parseInt(dataA[2], 10);
                var data = new Date(ano, mes - 1, dia)
                x = data.getTime();
            }
            catch (err) {
                x = new Date().getTime();
            }

            return x;
        },

        "ordemData-asc": function (a, b) {
            return a - b;
        },

        "ordemData-desc": function (a, b) {
            return b - a;
        }
    });

    $(".has-sub li a[href$='/DocumentoDestino']").on("click", function () {
        localStorage.clear();
    });

    $(".has-sub li a[href$='/PesquisarRemessa']").on("click", function () {
        localStorage.clear();
    });

    $('.confirma-excluir').on('click', function () {
        return confirm('Deseja excluir o item selecionado?');
    });

    $('.confirma-ativa-inativa').on('click', function () {
        return confirm('Confirma a ' + ($(this).attr('data-status') == "True" ? 'inativação' : 'ativação') + ' do registro ' + $(this).attr('data-registro') + '?');
    });

    // aumentando a fonte
    $(".inc-font").click(function () {
        var size = $("body").css('font-size');

        size = size.replace('px', '');
        size = parseInt(size) + 1.4;

        if (size < 19) {
            $("body").animate({ 'font-size': size + 'px' });
            $(".inc-font").removeClass('iconOff');
            $(".dec-font").removeClass('iconOff');
        }
        else {
            $(".inc-font").addClass('iconOff');
            $(".dec-font").removeClass('iconOff');
        }
    });

    //diminuindo a fonte
    $(".dec-font").click(function () {
        var size = $("body").css('font-size');
        size = size.replace('px', '');
        size = parseInt(size) - 1.4;

        if (size > 10) {
            $("body").animate({ 'font-size': size + 'px' });
            $(".dec-font").removeClass('iconOff');
            $(".inc-font").removeClass('iconOff');
        }
        else {
            $(".dec-font").addClass('iconOff');
            $(".inc-font").removeClass('iconOff');
        }

    });

    // resetando a fonte
    $(".res-font").click(function () {

        $("body").animate({ 'font-size': '14px' });
        $(".inc-font").removeClass('iconOff');
        $(".dec-font").removeClass('iconOff');
    });

    //Reset Inputs
    $(".reset-form").click(function () {
        $('#form_filtro input').each(function () {
            $(this).val('');
        });
        $('#form_filtro select').each(function () {
            $(this).val('');
        });
        location.href = location.href;
    });

    $('#form_filtro').submit(function () {
        var submit = false;

        $('#form_filtro input').each(function () {
            if ($(this).val() != '')
                submit = true;
        });
        $('#form_filtro select').each(function () {
            if ($(this).val() != '')
                submit = true;
        });

        if (!submit)
            BASE.MostrarMensagemErro('Favor preencher um dos campos para efetuar a pesquisa');

        return submit;
    });

    IniciarDateTimePicker();

    $('#js-menu li').click(function () {
        var id = $('a', this).attr('href');
        $('#js-menu li').each(function () {
            $(this).removeClass('js-menu-active');
        });
        $(this).addClass('js-menu-active');
        $('div#frmContent > div').each(function () {
            $(this).removeClass('frame-active');
        })
        $(id).addClass('frame-active');
    })

    $('#js-menu li ul li').click(function () {
        var valor = $('a', this).attr('name');
        $(this).parent().parent().each(function () {
            $(this).removeClass('menu--subitens__opened');
        });
        $(this).parent().parent().addClass('menu--subitens__opened');
        return false;
    });

    /*$(".numeroAno").blur(function (event) {        

        var id = $(this).attr("id")        

        if ($("#" + id).val() === "" || $("#" + id).val() === undefined) return;

        var value = padLeft($("#" + id).cleanVal(), true);

        $("#" + id).val(value);

        $("#" + id).mask("000000/0000");
    })*/

    //InicializaTypeahead();
    CONTROLES.Typeahead.Configurar();
    configurarMascara();

});

var configurarMascara = function() {
    $("input[data-uimask]").each(function () {

        var reverseData = $(this).data("uimaskReverse") != null;

        $(this).mask($(this).data("uimask"), {
            reverse: reverseData,
            translation: {
                'Z': {
                    pattern: /[0-9]/, optional: true
                }
            }
        });
    });
}

var InicializaTypeahead = function () {

    $("input[type='text'][data-istypeahead='true']").unbind('keyup').bind('keyup', function (e) {
        var value = $('input[name="' + $(this).attr('data-value-field') + '"]');
        if (e.keyCode == 8)
        {
            console.log('clear!');
            value.val('');
        }
    });

    $("input[type='text'][data-istypeahead='true']").unbind('blur').bind('blur', function (e) {
        var value = $('input[name="' + $(this).attr('data-value-field') + '"]');
        if (value.val() == '')
        {
            console.log('clear this!');
            $(this).val('');
        }
    });

    $("input[type='text'][data-istypeahead='true']").each(function () {

        /*
        var builderHidden = new TagBuilder("input");
        builderHidden.Attributes["type"] = "hidden";
        builderHidden.Attributes["name"] = strHtmlFieldName;
        builderHidden.Attributes["value"] = oModelMetadata.Model.ToString();

        var builderInput = new TagBuilder("input");
        builderInput.Attributes["type"] = "text";
        builderInput.Attributes["autocomplete"] = off;
        builderInput.Attributes["maxlength"] = length.ToString();
        builderInput.Attributes["auto-complete"] = "true";
            
        builderInput.Attributes["data-service-url"] = url.url;
        builderInput.Attributes["data-service-valueField"] = url.valueField;
        builderInput.Attributes["data-service-displayField"] = url.displayField;

        builderInput.Attributes["data-minlength"] = minLength.ToString();
        builderInput.Attributes["data-typeahead"] = "true";
        builderInput.Attributes["data-value-field"] = strHtmlFieldName;
        builderInput.Attributes["name"] = strHtmlFieldName + "-textfd";
        builderInput.Attributes["value"] = text;

        builderInput.Attributes["class"] = "form-control";
        */
        var id = $(this).attr('name');
        var displayField_value   = $(this).attr('data-service-displayField');
        var valueField_value = $(this).attr('data-service-valueField');
        var dataServiceUrl_value = $(this).attr('data-service-url');
        var dataValueField_value = $(this).attr('data-value-field');
        var minlength_value = parseInt($(this).attr('data-minlength'));

        var parametosExtras = {};
        if ($(this).attr('data-parametros')) {
            parametosExtras = JSON.parse($(this).attr('data-parametros'));
            parametosExtras = "?" + $.param(parametosExtras);
        }


        if ($.isEmptyObject(parametosExtras)) {
            parametosExtras = '';
        }

        $(this).typeahead({
            onSelect: function (item) {
                $('[name="' + dataValueField_value + '"]').val(dataValueField_value).val(item.value);
                $('[name="' + dataValueField_value + '"]').trigger('change');
                console.log(item.value);
            },
            ajax: {
                url: $.validator.format(dataServiceUrl_value, $("input[name='" + id + "']").val()) + parametosExtras,
                triggerLength: minlength_value,
                dataType: "json",
                displayField: displayField_value,
                valueField: valueField_value,
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    var listaSerie = [];
                    if (data.length === 0) {
                        return false;
                    }
                    return data;
                }
            }
        }).on('typeahead:selected', function (event, selection) {            
            setTimeout(function () {
                $('#pesquisar-id').focus();
            },2000);
        });
    });
}

function Saida() {
    localStorage.clear();
    sessionStorage.clear();
}
function TornarReadOnly(obj) {
    jQuery(obj).attr("readonly", "readonly");
    jQuery(obj).each(function () {
        if (jQuery(this).attr("readonly") == "readonly") {
            var valor = jQuery(this).val();

            jQuery('option', jQuery(this)).filter(function () {
                if (jQuery(this).val() == valor) {
                    jQuery(this).attr("disabled", false);
                    return true;
                }
                else {
                    jQuery(this).attr("disabled", true);
                    return false;
                }
            }).val();
        }
    });
}
function RetirarReadOnly(obj) {
    jQuery(obj).removeAttr("readonly");
    jQuery("option", obj).removeAttr("disabled");
}
function IniciarDateTimePicker() {

    $.fn.datetimepicker.dates['pt-BR'] = {
        format: 'dd/mm/yyyy',
        days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
        daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
        months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        suffix: [],
        meridiem: []
    };

    $('.hora').datetimepicker({
        format: 'hh:ii',
        language: 'pt-BR',
        autoclose: true,
        startView: 1,
        maxView: 1,
        pickDate: false,
        inline: true,
        forceParse: false
    });

    $('.data-hora').datetimepicker({
        format: 'dd/mm/yyyy hh:ii',
        language: 'pt-BR',
        autoclose: true,
        startView: 1,
        startDate: new Date,
        maxView: 1,
        pickDate: true,
        inline: true,
        forceParse: false
    });

    CONTROLES.Configurar.DatePicker();

    DataMinima();
    InicializarIntervaloDatas();

}
function DataMinima() {
    $('.data').blur(function () {
        var data = $(this).val();

        if (parseInt(data.split('/')[2]) < 1753) {
            $(this).val('');
        }
    });
}
function ValidarDataInicialDataFinal(valor) {

    /*
    //
    // NECESSITA DE INCLUSÃO DESTA REGRA NO DOCUMENTO DE REQUISITOS
    // PARA A TASK 1114
    //
    //
    var dataInicial = $("#dataInicial").val();
    var datafinal = $("#dataFinal").val();

    if (dataInicial != null && datafinal != null) {
        if (dataInicial.length != 10 || datafinal.length != 10) return;
        if (converterParaData(datafinal) < converterParaData(dataInicial)) {
            BASE.MostrarMensagemErro('A data incial é maior que a data final');
        }
    }

    */
}
function converterParaData(strData){
    var partes = strData.split("/");
    return new Date(partes[2], partes[1] - 1, partes[0]);
}
function InicializarIntervaloDatas() {

    $($("[data-intervalo='inicial']")).on("change", function (e) {
        $($("[data-intervalo='final']")).datetimepicker('setStartDate', $("[data-intervalo='inicial']").val());
    });

    $($("[data-intervalo='final']")).on("change", function (e) {
        $($("[data-intervalo='inicial']")).datetimepicker('setEndDate', $("[data-intervalo='final']").val());
    });
}

function InicializarIntervaloDatasComContexto(context)
{
    var dpInicial = $(context + "[data-intervalo='inicial']");
    var dpFinal = $(context + "[data-intervalo='final']");

    dpInicial.datetimepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR',
        autoclose: true,
        startView: 1,
        startDate: new Date,
        maxView: 1,
        pickDate: true,
        inline: true,
        forceParse: false
    });

    dpFinal.datetimepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR',
        autoclose: true,
        startView: 1,
        startDate: new Date,
        maxView: 1,
        pickDate: true,
        inline: true,
        forceParse: false
    });

    $(context + "[data-intervalo]").off('click');
    $(context + "[data-intervalo]").on('click', function () {
        InicializarIntervaloDatasComContextoUpdateInterval(dpInicial, dpFinal);
    });
    dpInicial.off('blur').on('blur', function () {

        var inicial = ("" + dpInicial.val()).toDate();
        var final = ("" + dpFinal.val()).toDate();

        var inicial = ("" + dpInicial.val()).toDate();
        var final = ("" + dpFinal.val()).toDate();
        if (inicial !== "" && final !== "") {
            if (inicial > final) {
                dpFinal.val('');
            }
        }
    });
    dpFinal.off('blur').on('blur', function () {

        var inicial = ("" + dpInicial.val()).toDate();
        var final = ("" + dpFinal.val()).toDate();

        var inicial = ("" + dpInicial.val()).toDate();
        var final = ("" + dpFinal.val()).toDate();
        if (inicial !== "" && final !== "") {
            if (inicial > final) {
                dpFinal.val('');
            }
        }
    });

    dpInicial.on('changeDate', function (selected)
    {
        InicializarIntervaloDatasComContextoUpdateInterval(dpInicial, dpFinal);
    });
    dpFinal.on('changeDate', function (selected) {
        InicializarIntervaloDatasComContextoUpdateInterval(dpInicial, dpFinal);
    });
}

function InicializarIntervaloDatasComContextoUpdateInterval(dpInicial, dpFinal)
{
    var inicial = ("" + dpInicial.val()).toDate();
    var final = ("" + dpFinal.val()).toDate();
    dpInicial.datetimepicker('setEndDate', final);
    dpFinal.datetimepicker('setStartDate', inicial);
}

function SelecionaTipoOcorrencia(sel) {
    opcao = sel.value;
    $('#divOpcaoUnica').toggle(opcao == '0' ? true : false);
    $('#divOpcaoRecorrente').toggle(opcao == '1' ? true : false);
    $('#js-menu li').click(function () {
        var id = $('a', this).attr('href');
        $('#js-menu li').each(function () {
            $(this).removeClass('js-menu-active');
        });
        $(this).addClass('js-menu-active');
        $('div#frmContent > div').each(function () {
            $(this).removeClass('frame-active');
        })
        $(id).addClass('frame-active');
    })

    $('#js-menu li ul li').click(function () {
        var valor = $('a', this).attr('name');
        MudaPaginaRFC(valor);
        $(this).parent().parent().each(function () {
            $(this).removeClass('menu--subitens__opened');
        });
        $(this).parent().parent().addClass('menu--subitens__opened');
        return false;
    });
}

//MENU E RECURSOS
function GetRecursos() {
    var id = $('.ddlAplicacao option:selected').val();
    ListarItens(id);
}
function ListarItens(id) {
    $.ajax({
        url: "/Recurso/GetRecursoByAplicacao",
        cache: false,
        data: { id: id },
        success: function (result) {
            $('.ddlRecurso').children().remove().end().append($('<option value>--Selecione--</option>'))
            $.each(result, function (i, field) {
                $('.ddlRecurso').append($('<option>', {
                    value: field.Codigo,
                    text: field.Nome
                }));
            });
        }

    });
};
function GetRecursosDisponivelMenu(menuItem) {
    var id = $('.ddlMenu option:selected').val();
    $.ajax({
        url: "/MenuItem/GetRecursoDisponivelMenu",
        data: { id: id, idItem: menuItem },
        cache: false,
        success: function (result) {
            $('.ddlRecurso').children().remove().end().append($('<option value>--Selecione--</option>'))
            $.each(result, function (i, field) {
                $('.ddlRecurso').append($('<option>', {
                    value: field.Codigo,
                    text: field.Nome
                }));
            });
        }
    });
}
function MostraMensagemInformativa(mensagem, sucesso) {
    //jQuery("#divMensagem").html("<div id='mensagemInformativa' class='alert alert-danger mensagemAlerta fade in'> <button data-dismiss='alert' class='close' type='button'>×</button> <strong>Ops!</strong> <span>" + mensagem + "</span></div>");

    //if (sucesso != undefined)
    //    setTimeout(function () {
    //        jQuery("#mensagemInformativa").fadeOut("slow", function () {
    //            jQuery("#mensagemInformativa").remove();
    //        });
    //    }, 3000);

    BASE.MostrarMensagemInformativa(mensagem);
}

if (String.prototype.toDate == undefined) {
    String.prototype.toDate = function () {
        var value = this.toString();
        if (value.length >= 10)
        {
            value = value.substring(0, 10);
            var parts = value.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            return mydate;
        } else {
            return "";
        }
    }
}

var padLeft = function (n, comAno) {

    var str = "" + n
    var pad = comAno === true ? "0000000000" : "000000"

    var valor = pad.substring(0, pad.length - str.length) + str

    return valor;
};
function MostraMensagemSucesso(mensagem) {
    //jQuery("#divMensagem").html('<div id="mensagemSucesso" class="alert alert-success mensagemAlerta fade in" style="bottom: 510px; right: 10px;"><button data-dismiss="alert" class="close" type="button">×</button><div style="text-align: initial"><strong>Sucesso!</strong>' + mensagem + '</div></div>');

    //setTimeout(function () {
    //    jQuery("#mensagemSucesso").fadeOut("slow", function () {
    //        jQuery("#mensagemSucesso").remove();
    //    });
    //}, 6000);
    BASE.MostrarMensagemInformativa(mensagem);
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
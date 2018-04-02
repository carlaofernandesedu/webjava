var CLASSIFICACAO_CASCADE_DDL = (function () {
    var moduleName = "CLASSIFICACAO_CASCADE_DDL";

    var totalItens;
    var seletorIdClassificacao = "#IdClassificacao";

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAll();
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        //popularCombo("#1nivel select");
        bindChangePrimeiroNivel();
        bindChangeSegundoNivel();
        bindChangeTerceiroNivel();
        bindChangeQuartoNivel();

        obterArvoreClassificacao($(seletorIdClassificacao).val());
    }

    function setIdObject(id) {
        BASE.LogFunction(arguments.callee, moduleName);

        seletorIdClassificacao = id;
    }

    function obterArvoreClassificacao(idClassificacao) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/Classificacao/ObterArvore",
            type: 'post',
            data: { idClassificacao: idClassificacao },
            success: function (response) {
                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        if (i === 0) {
                            popularCombo("#" + (i + 1) + "nivel select", null, null, response[i].id);
                        }
                        else {
                            popularCombo("#" + (i + 1) + "nivel select", response[i - 1].id, response[i - 1].nivel + 1, response[i].id);
                        }
                    }
                    popularCombo("#" + (i + 1) + "nivel select", response[response.length - 1].id, response[response.length - 1].nivel + 1);
                }
                else {
                    popularCombo("#1nivel select");
                }
            }
        });
    }


    function popularCombo(combo, idClassificacaoPai, nivel, idClassificacaoSelecionada) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            url: "/Classificacao/BuscarClassificacao",
            type: 'post',
            data: { idClassificacao: idClassificacaoPai },
            success: function (response) {
                bindCombo(response, combo, idClassificacaoSelecionada);
                //complete(nivel);
            }
        });

    }

    //function complete(nivel) {
    //    if (nivel === 1) {
    //        $('.1nivel').html($('#1nivel select option:selected').text() + '<i class="fa fa-angle-right margL5 margR5"></i>');
    //        $('#classificacao-caminho').removeClass('hide');
    //        if (totalItens > 0) {
    //            $('#2nivel').removeClass('hide');
    //            $('.1nivel').html($('#1nivel select option:selected').text() + '<i class="fa fa-angle-right margL5 margR5"></i>');
    //        }
    //        else {
    //            $('#2nivel').addClass('hide');
    //            $('.1nivel').html($('#1nivel select option:selected').text());
    //        }
    //    }
    //    else if (nivel === 2) {
    //        if (totalItens > 0) {
    //            $('#3nivel').removeClass('hide');
    //            $('.2nivel').html($('#2nivel select option:selected').text() + '<i class="fa fa-angle-right margL5 margR5"></i>');
    //        }
    //        else {
    //            $('#3nivel').addClass('hide');
    //            $('.2nivel').html($('#2nivel select option:selected').text());
    //        }
    //    } else if (nivel === 3) {
    //        if (totalItens > 0) {
    //            $('#4nivel').removeClass('hide');
    //            $('.3nivel').html($('#3nivel select option:selected').text() + '<i class="fa fa-angle-right margL5 margR5"></i>');
    //        }
    //        else {
    //            $('#4nivel').addClass('hide');
    //            $('.3nivel').html($('#3nivel select option:selected').text());
    //        }
    //    }

    //}

    function bindCombo(lista, combo, idClassificacaoSelecionada) {
        totalItens = lista.length;
        $(combo).empty();
        $(combo).append($("<option value='0'>Selecione</option>"));

        $.each(lista, function (index, value) {
            if (value) {
                $(combo).append($("<option value='" + value.Codigo + "'>" + value.Descricao + "</option>"));
            }
        });

        if (idClassificacaoSelecionada) {
            $(combo).val(idClassificacaoSelecionada);
            atualizarBreadcrumb(combo);
        }

        $(combo).parent().removeClass('hide');
    }

    function atualizarBreadcrumb(combo) {
        BASE.LogFunction(arguments.callee, moduleName);

        var caret = '<i class="fa fa-angle-right margL5 margR5"></i>';
        var texto = $(combo).find('option:selected').text();

        if ($(combo).data('nivel') > 1) {
            texto = caret + texto;
        }

        $('.classificacao-breadcrumb[data-nivel=' + $(combo).data('nivel') + ']').html(texto);

        $('#classificacao-caminho').removeClass('hide');
    }

    function bindChangePrimeiroNivel() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#selecionarClassificacao #1nivel select').off('change');
        $('#selecionarClassificacao #1nivel select').on('change', function (e) {
            BASE.LogEvent(e, moduleName);

                atualizarBreadcrumb($(this));

                $('#2nivel').addClass('hide');
                $('.2nivel').html('');

                $('#3nivel').addClass('hide');
                $('.3nivel').html('');

                $('#4nivel').addClass('hide');
                $('.4nivel').html('');


                var valor = $(this).val();
                $(seletorIdClassificacao).val(valor);
                $('#2nivel option[value=""]').show();

                if (valor != 0) {
                    $('#2nivel').removeClass('hide');
                    $('#2nivel option[value!=' + valor + ']').hide();
                    $('#2nivel option[value=' + valor + ']').show();
                    popularCombo('#2nivel select', valor, 1);
                    $('.btn-classificacao').prop("disabled", false);

                } else {

                    $(seletorIdClassificacao).val('');
                    $('#2nivel').addClass('hide');
                    $('.1nivel').html('');
                    $('#classificacao-caminho').addClass('hide');
                    $('.btn-classificacao').prop("disabled", true);
                }
            });

    }

    function bindChangeSegundoNivel() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#selecionarClassificacao #2nivel select').off('change');
        $('#selecionarClassificacao #2nivel select').on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            atualizarBreadcrumb($(this));

            $('#3nivel').addClass('hide');
            $('.3nivel').html('');

            $('#4nivel').addClass('hide');
            $('.4nivel').html('');

            var valor = $(this).val();
            $(seletorIdClassificacao).val(valor);

            if (valor != 0) {
                $('#3nivel').removeClass('hide');
                $('#3nivel option[value!=' + valor + ']').hide();
                $('#3nivel option[value=' + valor + ']').show();
                $('#2nivel option[value=""]').show();
                $('#3nivel option[value=""]').show();
                $('.btn-classificacao').prop("disabled", false);
                popularCombo('#3nivel select', valor, 2);

            } else {

                $(seletorIdClassificacao).val($('#selecionarClassificacao #1nivel select').val());
                $('#2nivel').addClass('hide');
                $('.2nivel').html('');
                $('.btn-classificacao').prop("disabled", true);
            }
        });
    }

    function bindChangeTerceiroNivel() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#selecionarClassificacao #3nivel select').off('change');
        $('#selecionarClassificacao #3nivel select').on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            atualizarBreadcrumb($(this));

            $('#4nivel').addClass('hide');
            $('.4nivel').html('');

            var valor = $(this).val();
            if (valor != "0") {
                $(seletorIdClassificacao).val(valor);
                popularCombo('#4nivel select', valor, 3);
                $('.btn-classificacao').prop("disabled", false);

            } else {
                $(seletorIdClassificacao).val($('#selecionarClassificacao #2nivel select').val());
                $('#3nivel').addClass('hide');
                $('.3nivel').html('');
                $('.btn-classificacao').prop("disabled", true);

            }
        });

    }

    function bindChangeQuartoNivel() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#selecionarClassificacao #4nivel select').off('change');
        $('#selecionarClassificacao #4nivel select').on('change', function (e) {
            BASE.LogEvent(e, moduleName);

            atualizarBreadcrumb($(this));

            var valor = $(this).val();
            if (valor != "0") {
                $(seletorIdClassificacao).val(valor);
                $('.btn-classificacao').prop("disabled", false);

            } else {
                $(seletorIdClassificacao).val($('#selecionarClassificacao #3nivel select').val());
                $('#4nivel').addClass('hide');
                $('.4nivel').html('');
                $('.btn-classificacao').prop("disabled", true);

            }
        });

    }

    return {
        Init: function () {
            init();
        },
        SetIdObject: setIdObject
    };
}());

$(function () {
    CLASSIFICACAO_CASCADE_DDL.Init();
});


var AUDITBARRAINFERIOR = (function () {
    'use strict';
    var moduleName = "AUDITBARRAINFERIOR";

    var arrDadosEnvio = {};
    arrDadosEnvio['acao'] = '';
    arrDadosEnvio['listaIdsControleCheckbox']= '';
    arrDadosEnvio['listaIdsControleRadio'] = '';

    var arrParametrosAcoes = {
        "prosseguireliminacao": { url: "FornecedorAtendimentoEliminado/Eliminar", exibemodal: false, mensagem: "" },
        "recuperareliminados": { url: "FornecedorAtendimentoEliminado/Eliminar", exibemodal: true, mensagem: "Confirma recuperar o(s) cadastro(s) de fornecedor(es) selecionado(s)" }
    }

    var controleCheck = '.chkitens:checked';
    var controleRadio = 'input[name=radioitens]:checked';

    function init()
    {
        AUDITBARRAINFERIOR.ElementoResultado = $("#divLista");
        bindAll();
    }

    function bindAll()
    {
        bindbotaoBarraInferior();
    }

    function bindbotaoBarraInferior() 
    {
        $('#btnacaobarrainferior').off('click');
        $('#btnacaobarrainferior').on('click', function (e) {
            var identificadorAcao = $(this).attr('data-acao')
            var objetoParametrosAcao = arrParametrosAcoes[identificadorAcao];
            arrDadosEnvio['acao'] = identificadorAcao;
            if (validarPreenchimentoControles(objetoParametrosAcao))
            {
                definirValoresPorControle(controleCheck, arrDadosEnvio['listaIdsControleCheckbox']);
                definirValoresPorControle(controleRadio, arrDadosEnvio['listaIdsControleRadio']);
                if (objetoParametrosAcao.exibemodal) {
                    alert(objetoParametrosAcao.mensagem);
                }
                else {
                    alert('sem modal');
                }
                executarAcao(objetoParametrosAcao.url, "POST", arrDados);
            }
        });
    }

    function validarPreenchimentoControles(objAcao)
    {
        if ($(controleCheck).length == 0 && 1 == 1)
        {
            alert('Selecione um item do Checkbox');
            return false;
        }
        if ($(controleCheck).length == 0 && 1 == 1) {
            alert('Selecione um item do Radio');
            return false;
        }
        return true;
    }


    function definirValoresPorControle(nomeControle, paramEnvio)
    {
        var chkArray = [];

        $(nomeControle).each(function () {
            chkArray.push($(this).attr('data-id'));
        });

        var selected;
        selected = chkArray.join(',');

        if (selected.length > 0) {
            paramEnvio = selected;
        } 
    }


    function obterValoresCheckbox()
    {

        var chkArray = [];

        $(".chkitens:checked").each(function () {
              chkArray.push($(this).attr('data-id'));
        });

        var selected;
        selected = chkArray.join(',');

        if (selected.length > 0) {
            arrDados['listaIdsControleCheckbox'] = selected;
            alert("You have selected " + selected);
            return true;
        } else {
            alert("Please at least check one of the checkbox");
            return false; 
        }
    }

    function obterValoresRadio() {

        var chkArray = [];

        $("input[name=radioitens]:checked").each(function () {
            chkArray.push($(this).attr('data-id'));
        });

        var selected;
        selected = chkArray.join(',');

        if (selected.length > 0) {
            arrDados['listaIdsControleRadio'] = selected;
            alert("You have selected radio " + selected);
            return true;
        } else {
            alert("Please at least check one of the radio");
            return false;
        }
    }

    function executarAcao(url, method,data)
    {
        //$.ajax({
        //    url: url,
        //    data: data,
        //    type: method,
        //    cache: false,
        //    success: function (response, status, xhr) {
        //        var isJson = BASE.Util.ResponseIsJson(xhr);
        //        if (isJson) {
        //            BASE.Util.TratarRespostaJson(response);
        //            //CRUDFILTRO.Evento.PosFitrarErro();
        //        }
        //        else {
        //            carregarLista(response);
        //            //CRUDFILTRO.Evento.PosListar();
        //            //CONTROLES.Tabela.Configurar();
        //        }
        //    },
        //    error: function (xhr) {
        //        console.log('err');
        //        BASE.Util.TratarErroAjax(xhr, true);
        //    },
        //    complete: function () {
        //        //BASE.SpinnerOff("#divLista");
        //    }
        //});
        AUDITBARRAINFERIOR.ElementoResultado.html('<div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div>');

        $.ajax({
            url: url,
            data: data,
            type: method,
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (isJson) {
                    BASE.Util.TratarRespostaJson(response);
                }
                else {
                    AUDITBARRAINFERIOR.ElementoResultado.html(response);
                    AUDITBARRAINFERIOR.ElementoResultado.fadeIn();
                    CONTROLES.Tabela.Configurar();
                }
            },
            error: function (xhr) {
                console.log('err');
                BASE.Util.TratarErroAjax(xhr, true);
            },
            complete: function () {
                //BASE.SpinnerOff("#divLista");
            }
        });
    
    }

    return {
        Init: init
    }

}());
﻿var AUDITBARRAINFERIOR = (function () {
    'use strict';
    var moduleName = "AUDITBARRAINFERIOR";

    var dadosEnvioSerializados = '';
   
    var arrParametrosAcoes = {
        "prosseguireliminacao": { url: "FornecedorAtendimentoEliminado/Eliminar", method:'GET', callbackRedirectServidor: null, possuiCheck: true, possuiRadio: true, exibeModal: false, mensagem: "" },
        "recuperareliminados": { url: "FornecedorAtendimentoEliminado/Eliminar",  method:'GET', callbackRedirectServidor: null, possuiCheck: true, possuiRadio:true, exibeModal: false, mensagem: "Confirma recuperar o(s) cadastro(s) de fornecedor(es) selecionado(s)" }
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
            if (validarPreenchimentoControles(objetoParametrosAcao))
            {
                dadosEnvioSerializados = serializarValoresParaEnvio(identificadorAcao,objetoParametrosAcao);
                if (objetoParametrosAcao.exibemodal) {
                    BASE.MostrarModalConfirmacao('titulo modal', objetoParametrosAcao.mensagem,
                        submeterPorAjax(objetoParametrosAcao.url, objetoParametrosAcao.method,
                            dadosEnvioSerializados, null));
                }
                else {
                    alert('sem modal');
                }
                submeterPorGet(objetoParametrosAcao.url, objetoParametrosAcao.method,dadosEnvioSerializados);
            }
        });
    }

  

    function validarPreenchimentoControles(objAcao)
    {
        if (objAcao.possuiCheck) {
            if (!($(controleCheck).length > 0)) {
                alert('Selecione um item do Checkbox');
                return false;
            }
        }
        if ($(controleCheck).length == 0 && 1 == 1) {
            alert('Selecione um item do Radio');
            return false;
        }
        return true;
    }

    function serializarValoresParaEnvio(identificadorAcao, objAcao) {
        var resultado = '';
        resultado = 'acao=' + identificadorAcao;
        if (objAcao.possuiCheck) {
            resultado = resultado + '&listaIdsControleCheckbox='  + obterValoresPorControle(controleCheck);
        }
        if (objAcao.possuiRadio) {
            resultado = resultado + '&listaIdsControleRadio=' + obterValoresPorControle(controleRadio);
        }
        return resultado;
    }

    function obterValoresPorControle(nomeControle)
    {
        var controlArray = [];

        $(nomeControle).each(function () {
            controlArray.push($(this).attr('data-id'));
        });

        var selecionado;
        selecionado = controlArray.join(',');

        if (selecionado.length > 0) {
            return selecionado;
        }
        else {
            return '';
        }
    }

    function submeterPorGet(url, method, data, callback) {
      window.location = url + '?' + data;
    }

    function submeterPorAjax(url, method,data ,callback)
    {
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
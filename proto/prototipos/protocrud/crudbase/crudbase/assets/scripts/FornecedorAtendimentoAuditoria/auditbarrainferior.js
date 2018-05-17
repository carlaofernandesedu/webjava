﻿var AUDITBARRAINFERIOR = (function () {
    'use strict';
    var moduleName = "AUDITBARRAINFERIOR";

    var dadosEnvioSerializados = '';
   
    var arrParametrosAcoes = {
        "prosseguireliminacao": { possuiCheck: true, possuiRadio: true, enviarAjax:false, exibeModal: true, mensagem: "XXXX",  },
        "recuperareliminados":  {possuiCheck: true, possuiRadio:true, enviarAjax:true, exibeModal: true, mensagem: "Confirma recuperar o(s) cadastro(s) de fornecedor(es) selecionado(s)" }
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
            var identificadorAcao = $(this).attr('data-acao');
            var urlAcao = $(this).attr('data-url');
            var objetoParametrosAcao = arrParametrosAcoes[identificadorAcao];
            if (validarPreenchimentoControles(objetoParametrosAcao))
            {
                dadosEnvioSerializados = serializarValoresParaEnvio(identificadorAcao, objetoParametrosAcao);
                var paramEnvio = { url: urlAcao, method: objetoParametrosAcao.method, data: dadosEnvioSerializados};
                if (objetoParametrosAcao.exibeModal) {
                    BASE.MostrarModalConfirmacao('titulo modal', objetoParametrosAcao.mensagem,
                        submeterPorAjax, null, paramEnvio);
                }
                else {
                    alert('sem modal');
                    if (objetoParametrosAcao.enviarAjax)
                        submeterPorAjax(paramEnvio);
                    else
                        submeterPorGet(urlAcao, dadosEnvioSerializados);
                }
               

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

    function submeterPorModal(parametrosEnvio) {
        submeterPorAjax(parametrosEnvio);
    }

    function submeterPorGet(url, data) {
      window.location = url + '?' + data;
    }

    function submeterPorAjax(parametrosEnvio)
    {
        AUDITBARRAINFERIOR.ElementoResultado.html('<div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div>');

        $.ajax({
            url: parametrosEnvio.url,
            data: parametrosEnvio.data,
            type: parametrosEnvio.method,
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (isJson) {
                    BASE.Util.TratarRespostaJson(response);
                }
                else {
                    tratarRespostaServidor(response);
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

    function tratarRespostaServidor(response) {
        AUDITBARRAINFERIOR.ElementoResultado.html(response);
        AUDITBARRAINFERIOR.ElementoResultado.fadeIn();
        CONTROLES.Tabela.Configurar();
        var msg = "sucesso operacao";
        var titulo = 'titulo ok';
        var tipo = TipoMensagem.Sucesso;
        BASE.MostrarMensagem(msg, tipo, titulo);
        submeterPorGet('FornecedorAtendimentoEliminado', '');
        //BASE.Modal.ExibirModalAlertaCallbackArgs('titulo alerta', 'ocorrido com sucesso', 'small', 'OK', 'btn-primary', function (argsx) { alert('alerta' + argsx); }, respostaModal);

    }

    return {
        Init: init
    }

}());
var AUDITBARRAINFERIOR = (function () {
    'use strict';
    var moduleName = "AUDITBARRAINFERIOR";

    var dadosEnvioSerializados = '';
   
    var arrParametrosAcoes = {
        "prosseguireliminacao": { possuiCheck: true, method: 'GET', msgCheck: 'Selecione um fornecedor para eliminar', possuiRadio: false, msgRadio: '', funcaoEnvio: submeterPorGet, exibeModal: false, msgmodal: '' },
        "eliminar" : {  possuiCheck:true,method:'POST',msgCheck:'Selecione um fornecedor para eliminar',possuiRadio:true,msgRadio:'Selecione um fornecedor padrão',funcaoEnvio:submeterPorAjax,exibeModal:true,msgmodal:"Os fornecedor(es) selecionado(s) correspondem ao mesmo fornecedor?" }
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
                    exibirModalConfirmacao('Confirmação', objetoParametrosAcao.msgmodal, objetoParametrosAcao.funcaoEnvio, paramEnvio);
                }
                else {
                    objetoParametrosAcao.funcaoEnvio(paramEnvio);
                }
            }
        });
    }

    function validarPreenchimentoControles(objAcao)
    {
        if (objAcao.possuiCheck) {
            if (!($(controleCheck).length > 0)) {
                BASE.MostrarMensagem(objAcao.msgCheck, TipoMensagem.Alerta, 'Alerta');
                return false;
            }
        }
        if ($(controleRadio).length == 0 && objAcao.possuiRadio) {
            BASE.MostrarMensagem(objAcao.msgRadio, TipoMensagem.Alerta, 'Alerta');
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

    function exibirModalConfirmacao(titulo, msg, callBackSucesso, parametrocallBack) {
        BASE.Modal.ExibirModalConfirmacaoCallbackArgs(
            titulo, msg,
            'small',
            '<i class="fa fa-close margR5"></i>Não',
            'btn-danger',
            '<i class="fa fa-check margR5"></i>Sim',
            'btn-primary',
            callBackSucesso,
            null, parametrocallBack);
    }

    function submeterPorGet(parametrosEnvio) {
      window.location = parametrosEnvio.url + '?' + parametrosEnvio.data;
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
        //submeterPorGet('FornecedorAtendimentoEliminado', '');
        //BASE.Modal.ExibirModalAlertaCallbackArgs('titulo alerta', 'ocorrido com sucesso', 'small', 'OK', 'btn-primary', function (argsx) { alert('alerta' + argsx); }, respostaModal);

    }

    return {
        Init: init
    }

}());
var AUDITBARRAINFERIOR = (function () {
    var moduleName = "AUDITBARRAINFERIOR";

    var arrMensagensAcoes = {
        "prosseguireliminacao": { url: "eliminar" ,exibemodal:false , mensagem: "" },
        "recuperareliminados": {  url: "recuperareliminados", exibemodal: true, mensagem: "Confirma recuperar o(s) cadastro(s) de fornecedor(es) selecionado(s)" }
    }

    function init()
    {
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
            var acao = arrMensagensAcoes[$(this).attr('data-acao')]
            if (acao.exibemodal)
            {
                alert(acao.mensagem);
            }
            else 
            {
                alert('sem modal');
            }
        });
    }

    function executarAcao() 
    {
        $.ajax({
            url: url,
            data: (data !== false && data !== undefined) ? data : form.serialize(),
            type: method,
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (isJson) {
                    BASE.Util.TratarRespostaJson(response);
                    //CRUDFILTRO.Evento.PosFitrarErro();
                }
                else {
                    carregarLista(response);
                    //CRUDFILTRO.Evento.PosListar();
                    //CONTROLES.Tabela.Configurar();
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
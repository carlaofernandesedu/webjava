//TODO:DEVERIAM SER CONSTANTES 
//INFO:Paginas de acesso URL 
var ACESSONEGADOURL = "/AcessoNegado/Index";
var LOGINURL = "/Login/Index";
var ERROURL = "/Home/Erro";

var BASE = (function () {
    //INFO: Usado para procedimento de DEBUG
    var callStackIndex = 0;

    function init() {

    }

    //INFO: Tratamento para exibicao de Mensagens 
    //INFO: https://notifyjs.jpillora.com/
    //INFO: Tratamento para mudanças http://bootstrap-growl.remabledesigns.com/
    function mostrarMensagemInformativa(mensagem) {
        mostrarMensagem(mensagem, TipoMensagem.Informativa);
    }

    function mostrarMensagemErro(mensagem) {
        mostrarMensagem(mensagem, TipoMensagem.Error);
    }

    function mostrarMensagem(msg, tipoMensagem, titulo) {

        //jQuery(".notifyjs-wrapper").click();
        setTimeout(function () {
            switch (tipoMensagem) {
                case TipoMensagem.Sucesso:
                    (titulo === undefined || titulo === null) ? titulo = 'Sucesso' : titulo;
                   // $.Notification.notify('success', 'top right', titulo, msg);
                    $.notify({
                        title: titulo,
                        message: msg
                    }, {
                        type: 'success'
                    });
                    break;
                case TipoMensagem.Error:
                    (msg === undefined || msg === null) ? msg = 'Ocorreu um erro no Sistema.' : msg;
                    //$.Notification.notify('error', 'top right', titulo, msg);
                    $.notify({
                        title: titulo,
                        message: msg
                    }, {
                        type: 'danger'
                    });
                    break;
                case TipoMensagem.Informativa:
                    (titulo === undefined || titulo === null) ? titulo = 'Alerta' : titulo;
                    //$.Notification.notify('info', 'top right', titulo, msg);
                    $.notify({
                        title: titulo,
                        message: msg
                    }, {
                        type: 'info'
                    });
                    break;
                case TipoMensagem.Alerta:
                    (titulo === undefined || titulo === null) ? titulo = 'Alerta' : titulo;
                    //$.Notification.notify('warning', 'top right', titulo, msg);
                    $.notify({
                        title: titulo,
                        message: msg
                    }, {
                        type: 'warning'
                    });
                    break;
                default:
                    (titulo === undefined || titulo === null) ? titulo = 'Alerta' : titulo;
                    //$.Notification.notify('warning', 'top right', titulo, msg);
                    $.notify({
                        title: titulo,
                        message: msg},{
                        type: 'warning'
                    });

            }
        }, 100);
    }

    function monstrarListaMensagensAlerta(response) {
        $.each(response.MensagensCriticas, function (index, value) {
            BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
        });
    }

    return {
        Init: init,
        MostrarMensagemInformativa: mostrarMensagemInformativa,
        MostrarMensagemErro: mostrarMensagemErro,
        MostrarMensagem: mostrarMensagem,
    };

}());
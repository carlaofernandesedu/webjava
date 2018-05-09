//TODO:DEVERIAM SER CONSTANTES 
//INFO:Paginas de acesso URL 
var ACESSONEGADOURL = "/AcessoNegado/Index";
var LOGINURL = "/Login/Index";
var ERROURL = "/Home/Erro";

var BASE = (function () {
    //INFO: Usado para procedimento de DEBUG
    var callStackIndex = 0;

    function init() {
        validationRules();
        contagemCaracteresTextArea();
    }

    //INFO: Tratamentos De Requisicoes Ajax 
    function responseIsJson(xhr) {
        var ct = xhr.getResponseHeader("content-type") || "";
        if (ct.indexOf('html') > -1) {
            return false;
        }
        if (ct.indexOf('json') > -1) {
            return true;
        }
    }

    function tratarErroAjax(xhr, redirect) {
        if (redirect === true) {
            if (xhr.status === 403) {
                window.location = ACESSONEGADOURL;
            }
            if (xhr.status === 401) {
                window.location = LOGINURL;
            }
        }
        else {
            if (xhr.responseJSON !== undefined) {
                BASE.Mensagem.Mostrar(xhr.responseJSON.Mensagem, TipoMensagem.Error);
            }
            else {
                //window.location = ERROURL;
                BASE.Mensagem.Mostrar("Erro ao efetuar chamada.", TipoMensagem.Error);
            }
        }
    }

    function tratarRespostaJson(response, forceRedirect) {
        if (response !== undefined) {
            if (response.Sucesso === false) {
                if ((response.RedirectTo !== undefined && response.RedirectTo !== null) || forceRedirect === true) {
                    window.location = response.RedirectTo + "?ReturnUrl=" + obterEncodedUrl();
                }
                else {
                    if (response.StatusCode >= 400) {
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                    }
                }
            }
        }
    }



    //INFO: Tratamento para envio de URL 
    function montarUrl(controller, action) {
        var urlBase = '';

        var novaUrlBase = $('body').data('urlbase');

        if (novaUrlBase !== undefined && novaUrlBase.length > 0) {
            urlBase = novaUrlBase;
        }

        var url = urlBase + '/' + controller;

        if (action !== undefined && action.length > 0) {
            url += '/' + action;
        }

        return url;
    }


    //INFO: Tratamento para exibicao de Mensagens 
    //INFO: https://notifyjs.jpillora.com/
    function mostrarMensagemInformativa(mensagem) {
        mostrarMensagem(mensagem, TipoMensagem.Informativa);
    }

    function mostrarMensagemErro(mensagem) {
        mostrarMensagem(mensagem, TipoMensagem.Error);
    }

    function mostrarMensagem(msg, tipoMensagem, titulo) {

        jQuery(".notifyjs-wrapper").click();
        setTimeout(function () {
            switch (tipoMensagem) {
                case TipoMensagem.Sucesso:
                    (titulo === undefined || titulo === null) ? titulo = 'Sucesso' : titulo;
                    $.Notification.notify('success', 'top right', titulo, msg);
                    break;
                case TipoMensagem.Error:
                    (msg === undefined || msg === null) ? msg = 'Ocorreu um erro no Sistema.' : msg;
                    $.Notification.notify('error', 'top right', titulo, msg);
                    break;
                case TipoMensagem.Informativa:
                    (titulo === undefined || titulo === null) ? titulo = 'Alerta' : titulo;
                    $.Notification.notify('info', 'top right', titulo, msg);
                    break;
                case TipoMensagem.Alerta:
                    (titulo === undefined || titulo === null) ? titulo = 'Alerta' : titulo;
                    $.Notification.notify('warning', 'top right', titulo, msg);
                    break;
                default:
                    (titulo === undefined || titulo === null) ? titulo = 'Alerta' : titulo;
                    $.Notification.notify('warning', 'top right', titulo, msg);
            }
        }, 100);
    }

    function monstrarListaMensagensAlerta(response) {
        $.each(response.MensagensCriticas, function (index, value) {
            BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
        });
    }
    //INFO: Fim tratamento de Mensagens 
    //INFO: https://weblogs.asp.net/imranbaloch/unobtrusive-client-side-validation-with-dynamic-contents-in-asp-net-mvc
    //INFO: http://blog.2mas.xyz/creating-custom-unobtrusive-file-extension-validation-in-asp-net-mvc-3-and-jquery/
    //INFO: Validacao de Campos com Jquery Validator 
    function validationRules() {

        if (jQuery.validator === undefined || jQuery.validator === null || jQuery.validator === "")
            return;
        //Celular
        jQuery.validator.addMethod('celular', function (value, element) {
            value = value.replace("(", "");
            value = value.replace(")", "");
            value = value.replace("-", "");
            value = value.replace(" ", "").trim();
            if (value == '0000000000') {
                return (this.optional(element) || false);
            } else if (value == '00000000000') {
                return (this.optional(element) || false);
            }
            if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
                return (this.optional(element) || false);
            }
            if (value.length < 10 || value.length > 11) {
                return (this.optional(element) || false);
            }
            if (["6", "7", "8", "9"].indexOf(value.substring(2, 3)) == -1) {
                return (this.optional(element) || false);
            }
            return (this.optional(element) || true);
        }, 'Informe um celular válido');

        //Telefone fixo
        jQuery.validator.addMethod('telefone', function (value, element) {
            value = value.replace("(", "");
            value = value.replace(")", "");
            value = value.replace("-", "");
            value = value.replace(" ", "").trim();
            if (value == '0000000000') {
                return (this.optional(element) || false);
            } else if (value == '00000000000') {
                return (this.optional(element) || false);
            }
            if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
                return (this.optional(element) || false);
            }
            if (value.length < 10 || value.length > 11) {
                return (this.optional(element) || false);
            }
            if (["1", "2", "3", "4", "5"].indexOf(value.substring(2, 3)) == -1) {
                return (this.optional(element) || false);
            }
            return (this.optional(element) || true);
        }, 'Informe um telefone válido');

        //Telefone fixo e Celular
        jQuery.validator.addMethod('telefoneFixoCelular', function (value, element) {
            value = value.replace("(", "");
            value = value.replace(")", "");
            value = value.replace("-", "");
            value = value.replace(" ", "").trim();
            if (value == '0000000000') {
                return (this.optional(element) || false);
            } else if (value == '00000000000') {
                return (this.optional(element) || false);
            }
            if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
                return (this.optional(element) || false);
            }
            if (value.length < 10 || value.length > 12) {
                return (this.optional(element) || false);
            }
            return (this.optional(element) || true);
        }, 'Informe um telefone válido');

        //CPF
        jQuery.validator.addMethod("cpf", function (value, element) {
            value = jQuery.trim(value);

            value = value.replace('.', '');
            value = value.replace('.', '');
            cpf = value.replace('-', '');
            while (cpf.length < 11) cpf = "0" + cpf;
            var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
            var a = [];
            var b = new Number;
            var c = 11;
            for (i = 0; i < 11; i++) {
                a[i] = cpf.charAt(i);
                if (i < 9) b += (a[i] * --c);
            }
            if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
            b = 0;
            c = 11;
            for (y = 0; y < 10; y++) b += (a[y] * c--);
            if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }

            var retorno = true;
            if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;

            return this.optional(element) || retorno;

        }, "Informe um CPF válido");

        //CNPJ
        jQuery.validator.addMethod("cnpj", function (value, element) {

            cnpj = jQuery.trim(value);

            // DEIXA APENAS OS NÚMEROS
            cnpj = cnpj.replace('/', '');
            cnpj = cnpj.replace('.', '');
            cnpj = cnpj.replace('.', '');
            cnpj = cnpj.replace('-', '');

            var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
            digitos_iguais = 1;

            if (cnpj.length < 14 && cnpj.length < 15) {
                return this.optional(element) || false;
            }
            for (i = 0; i < cnpj.length - 1; i++) {
                if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                    digitos_iguais = 0;
                    break;
                }
            }

            if (!digitos_iguais) {
                tamanho = cnpj.length - 2
                numeros = cnpj.substring(0, tamanho);
                digitos = cnpj.substring(tamanho);
                soma = 0;
                pos = tamanho - 7;

                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) {
                        pos = 9;
                    }
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0)) {
                    return this.optional(element) || false;
                }
                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) {
                        pos = 9;
                    }
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1)) {
                    return this.optional(element) || false;
                }
                return this.optional(element) || true;
            } else {
                return this.optional(element) || false;
            }
        }, "Informe um CNPJ válido."); // Mensagem padrão

        $.validator.unobtrusive.adapters.addBool('celular');
        $.validator.unobtrusive.adapters.addBool('telefone');
        $.validator.unobtrusive.adapters.addBool('cpf');
        $.validator.unobtrusive.adapters.addBool('cnpj');
    }
    //INFO: Fim Validacao de Campos com Jquery Validator

    //INFO: Tratamento de Validacao de FORM para PARTIAL VIEWS 
    //https://mfranc.com/javascript/unobtrusive-validation-in-partial-views/
    function validarDados(form) {
        BASE.Debug('validarDados');
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    //INFO: Tratamento para TextArea contagem regressiva textarea
    function contagemCaracteresTextArea() {
        $('textarea').keyup(function () {
            var maxLength = $(this).attr('maxlength');
            var length = $(this).val().length;
            var length = maxLength - length;
            $('.remaining-chars[data-for="' + $(this).attr('name') + '"]').text(length);
        });
    }


    return {
        Init: init,
        Mensagem: {
            Mostrar: mostrarMensagem
            //Ocultar: escondeModalConfirmacao,
            //Confirmacao: mostrarModalConfirmacao,
           // MostrarListaMensagem: {
           //     MensagensAlerta: monstrarListaMensagensAlerta
           // }
        },
        MostrarMensagemInformativa: mostrarMensagemInformativa,
        MostrarMensagemErro: mostrarMensagemErro,
        MostrarMensagem: mostrarMensagem,
        //ValidarForm: validarDados,
        //Validacoes: validacoes
        Util: {
            ResponseIsJson: responseIsJson,
            TratarRespostaJson: tratarRespostaJson,
            TratarErroAjax: tratarErroAjax,
            MontarUrl: montarUrl
        },

    };

}());

$(function(){
    BASE.Init();
});
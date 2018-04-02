var ACESSONEGADOURL = "/AcessoNegado/Index";
var LOGINURL = "/Login/Index";
var ERROURL = "/Home/Erro";

var BASE = (function () {
    var callStackIndex = 0;

    function init() {
        validationRules();
        configurarOffline();
        contagemCaracteresTextArea();
        bindMostrarModalConfirmacao();
        inicializaAjaxGlobal();
        verificarMensagensParaUsuario();
        //registrarServiceWorker();
    }

    function registrarServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/Scripts/Base/serviceworker.js').then(function (registration) {
                    // Registration was successful
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }).catch(function (err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }

    function debug(msg, debugAction) {
        var debugParam = getQuerystringParameterByName("debuglevel");

        var debugLevel = parseInt(debugParam);

        if (debugLevel > (4 - debugAction)) {
            callStackIndex++;
            msg = "DEBUG(" + callStackIndex + "): " + msg
            switch (debugAction) {
                case DebugAction.Info:
                    console.info(msg);
                    break;
                case DebugAction.Warn:
                    console.warn(msg);
                    break;
                case DebugAction.Error:
                    console.error(msg);
                    break;
                case DebugAction.Log:
                default:
                    console.log(msg);
                    break;
            }
        }
    }
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function getFunctionName(callee) {
        var functionName = callee.toString();

        if (isFunction(callee)) {
            return callee.name;
        }

        functionName = functionName.substr('function '.length);
        functionName = functionName.substr(0, functionName.indexOf('('));

        return functionName;
    }

    function logFunction(callee, moduleName) {
        var functionName = getFunctionName(callee);
        moduleName = moduleName.length > 0 ? moduleName + "." : "";

        if (functionName.length == 0) {
            console.log(callee);
        }
        else {
            debug(moduleName + functionName + "()", DebugAction.Log);
        }
    }

    function logEvent(e, moduleName) {
        if (e === undefined) {
            debug("evento não passado", DebugAction.Warn);
        }
        else {
            moduleName = moduleName.length > 0 ? moduleName + "." : "";

            var targetIdentifier = e.target.id;

            if (targetIdentifier === undefined || targetIdentifier.length === 0) {
                targetIdentifier = e.target.className.replace(/ /g, '');
            }

            debug(moduleName + targetIdentifier + "." + e.type + "()", DebugAction.Log);
        }
    }

    function getQuerystringParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)","i"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function inicializaAjaxGlobal() {

        $.ajaxSetup({ cache: false });

        $(document).ajaxSend(function () {
        });

        $(document).ajaxStart(function () {
        });

        $(document).ajaxStop(function () {
        });

        $(document).ajaxSuccess(function (event, xhr, options, data) {
        });

        $(document).ajaxComplete(function (event, xhr, options) {
            BASE.Util.TratarRespostaJson(xhr.responseJSON);
        });
        $(document).ajaxError(function (event, xhr, settings) {
            BASE.Util.TratarErroAjax(xhr, true);
        });
    }

    function configurarOffline() {
        var
        $online = $('.online'),
        $offline = $('.offline');

        Offline.on('confirmed-down', function () {
            $online.fadeOut(function () {
                $offline.fadeIn();
            });
        });

        Offline.on('confirmed-up', function () {
            $offline.fadeOut(function () {
                $online.fadeIn();
            });
        });

        Offline.options = { checks: { xhr: { url: 'home/connectiontest' } } };
    }

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

    function capturarFormSubmitGlobal() {
        $('form').submit(function (e) {
            e.preventDefault();

            debug('capturando submit do formulario');

            var self = this;

            verificarConexao().done(function () { debug('conexao ok. submetendo formulario...'); self.submit(); });
        });
    }

    function capturarFormSubmitGlobalAguarde() {
        $('form').submit(function (e) {
            e.preventDefault();

            exibirModalAguarde();

            if ($(this).valid()) {
                this.submit();
            }

            esconderModalAguarde();
        });
    }

    function verificarConexao() {
        debug('testando conexao');
        return $.ajax({
            url: '/Home/ConnectionTest',
            type: 'HEAD'
        });
    }

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

    function bindMostrarModalConfirmacao() {
        $(document).on('show.bs.modal', '.modal', function (event) {
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function () {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);
        });

        $(document).on('hidden.bs.modal', '.modal', function (e) {
            if ($('.modal').hasClass('in')) {
                $('body').addClass('modal-open');
            }
        });
    }

    function mostrarModalConfirmacao(titulo, textoCorpo, callbackSim, callbackNao, element) {

        $('#titulo').text(titulo);
        $('#textoCorpo').text(textoCorpo);

        $("#modalConfirmacao").modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });

        $('#modalConfirmacao #btnSim').off('click');
        $('#modalConfirmacao #btnSim').on('click', function () {
            if (callbackSim) {
                callbackSim(element);
            }
            BASE.EscondeModalConfirmacao();
        });

        $('#modalConfirmacao #btnNao').on('click', function () {
            if (callbackNao) {
                callbackNao(element);
            }
            BASE.EscondeModalConfirmacao();
        });
    }

    // modal detalhe inicio
    function modalDetalheMostrar(html, context) {
        if (context === null || context === undefined) {
            context = $('#modalDetalhe');
        }

        context.html(html);

        context.modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
    }

    function modalDetalheOcultar(callbackFechar) {
        $('#modalDetalhe').modal("hide");

        if (callbackFechar) {
            callbackFechar();
        }
    }

    function modalDetalheBindFechar(callbackFechar) {
        $('#modalDetalhe').off('click', 'a.fechar-modal');
        $('#modalDetalhe').on('click', 'a.fechar-modal', function () {
            modalDetalheOcultar(callbackFechar);

            return false;
        });
    }
    // modal detalhe fim

    function escondeModalConfirmacao() {
        $("#modalConfirmacao").modal("hide");
    }

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

    function spinnerOn(div) {
        $('#loader').toggle(true);
        if (div != undefined)
            $(div).toggle(false);
    }

    function spinnerOff(div) {
        $('#loader').toggle(false);
        if (div != undefined)
            $(div).toggle(true);
    }

    function exibirModalAguarde() {
        $("#divAguarde").removeClass("hidden");

        $("#divAguarde").modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });


        return true;
    }

    function esconderModalAguarde() {
        $("#divAguarde").addClass("hidden");
        $("#divAguarde").modal("hide");

        return true;
    }

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

    // contagem regressiva textarea
    function contagemCaracteresTextArea() {
        $('textarea').keyup(function () {
            var maxLength = $(this).attr('maxlength');
            var length = $(this).val().length;
            var length = maxLength - length;
            $('.remaining-chars[data-for="' + $(this).attr('name') + '"]').text(length);
        });
    }

    function mostraDataEHora() {
        var date = new Date();

        var monthNames = [
          "Janeiro", "Fevereiro", "Março",
          "Abril", "Maio", "Junho", "Julho",
          "Agosto", "Setembro", "Outubro",
          "Novembro", "Dezembro"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + time;
    }

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

    function exibirModalConfirmacao(title, mensagem, tamanho, textoBtnNao, classeBtnNao, textoBtnSim, classeBtnSim, callbackSim, callbackNao) {

        bootbox.confirm({
            title: title,
            message: mensagem,
            size: tamanho,
            buttons: {
                cancel: {
                    label: textoBtnNao,
                    className: classeBtnNao
                },
                confirm: {
                    label: textoBtnSim,
                    className: classeBtnSim
                }
            },
            callback: function (result) {

                if (result === true) {
                    if (callbackSim != null && callbackSim != undefined) {
                        callbackSim();
                    }
                } else {
                    if (callbackNao != null && callbackNao != undefined) {
                        callbackNao();
                    }
                }
                //bootbox.hideAll();
            }
        });
    }

    function exibirModalAlerta(title, mensagem, tamanho, btnOk, classBtnOk, callbackSucesso) {

        bootbox.alert({
            title: title,
            message: mensagem,
            size: tamanho,
            buttons: {
                ok: {
                    label: btnOk,
                    className: classBtnOk
                }
            },
            callback: callbackSucesso
        });
    }

    function exibirModalPrompt(title, tipoInput, optionInput, mensagem, tamanho, value, btnNao, classBtnNao, btnSim, classBtnSim, callbackSucesso, callbackErro) {
        bootbox.prompt({
            title: title,
            inputType: tipoInput,
            inputOptions: optionInput,
            message: mensagem,
            size: tamanho,
            value: value,
            buttons: {
                cancel: {
                    label: btnNao,
                    className: classBtnNao
                },
                confirm: {
                    label: btnSim,
                    className: classBtnSim
                }
            },
            callback: function (result) {
                if (result !== null) {
                    if (callbackSucesso != null && callbackSucesso != undefined) {
                        return callbackSucesso(result);
                    }
                } else {
                    if (callbackErro != null && callbackErro != undefined) {
                        return callbackErro();
                    }
                }
            }
        });
    }

    var validacoes = {
        CNPJ: function (cnpj) {
            cnpj = cnpj.replace(/[^\d]+/g, '');

            if (cnpj == '') return false;

            if (cnpj.length != 14)
                return false;

            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" ||
                cnpj == "11111111111111" ||
                cnpj == "22222222222222" ||
                cnpj == "33333333333333" ||
                cnpj == "44444444444444" ||
                cnpj == "55555555555555" ||
                cnpj == "66666666666666" ||
                cnpj == "77777777777777" ||
                cnpj == "88888888888888" ||
                cnpj == "99999999999999")
                return false;

            // Valida DVs
            tamanho = cnpj.length - 2;
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return false;

            return true;
        },
        CPF: function (cpf) {
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf == '') return false;
            // Elimina CPFs inválidos conhecidos    
            if (cpf.length != 11 ||
                cpf == "00000000000" ||
                cpf == "11111111111" ||
                cpf == "22222222222" ||
                cpf == "33333333333" ||
                cpf == "44444444444" ||
                cpf == "55555555555" ||
                cpf == "66666666666" ||
                cpf == "77777777777" ||
                cpf == "88888888888" ||
                cpf == "99999999999")
                return false;
            // Valida 1o digito 
            add = 0;
            for (i = 0; i < 9; i++)
                add += parseInt(cpf.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(9)))
                return false;
            // Valida 2o digito 
            add = 0;
            for (i = 0; i < 10; i++)
                add += parseInt(cpf.charAt(i)) * (11 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(10), 10))
                return false;
            return true;
        },
        Email: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }

    function formatarDataJson(dataJson) {
        var dateString = dataJson.substr(6);
        var currentTime = new Date(parseInt(dateString));
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var date = day + "/" + month + "/" + year;

        return date;
    }

    function adicionarQtdCaracterAEsquerda(num, qtdTotalCampo, caracterAdicionado) {
        var str = ("" + num);
        return (Array(Math.max((qtdTotalCampo + 1) - str.length, 0)).join(caracterAdicionado) + str);
    }

    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }

    function adicionarBotaoBuscaRF() {

        var obj = $('.consultarRF');

        if (obj.is(':text')) {
            var textoAjuda = "Consulta o cnpj informado na base da Receita Federal";
            var tooltip = 'data-toggle="tooltip" data-placement="top" title="' + textoAjuda + '"';

            obj.parent('div').append('<span class="input-group-btn"><button class="btn btn-default btnConsultarRF"' + tooltip + '><img src="/Content/Images/rf-32.png" width="24px"></button></span>');
            obj.parent('div').addClass('input-group');

            $('.btnConsultarRF').tooltip({ container: 'body' });

            $('.btnConsultarRF').off('click');
            $('.btnConsultarRF').on('click', function () {
                var cnpjVal = obj.val().toString().replace(/\D/g, '');

                if (cnpjVal.length == 11) {
                    BASE.Mensagem.Mostrar("Esta busca funciona apenas com CPNJ", TipoMensagem.Alerta);
                    return false;
                }

                consultarRFCNPJ(cnpjVal);

                return false;
            });
        }
    }

    function consultarRFCNPJ(cnpjVal) {
        if (cnpjVal.length > 0) {
            var urlRF = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/Cnpjreva_Solicitacao2.asp?cnpj=' + cnpjVal;
            window.open(urlRF, '_blank');
        }
        else {
            BASE.Mensagem.Mostrar("Sem CNPJ para consultar na Receita Federal");
        }
    }

    var countWords = function (node) {

        if (node == undefined) return 0;

        var count = 0;
        var textNodes = node.contents().filter(function () {
            return (this.nodeType == 3);
        });
        for (var index = 0; index < textNodes.length; index++) {
            text = textNodes[index].textContent;
            text = text.replace(/[^-\w\s]/gi, ' ');
            text = $.trim(text);
            count = count + text.split(/\s+/).length;
        }
        var childNodes = node.children().each(function () {
            count = count + countWords.apply(this, [$(this)]);
        });
        return count
    };

    function criarObjetoDinamico(obj) {
        var novoObjeto = {},
            key;

        if (jQuery.type(obj) === "object") {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    novoObjeto[key] = obj[key];
                }
            }
        }
        return novoObjeto;
    }

    function criarArrayObjetoDinamico(arrayObjeto, obj) {
        var arrayNovoObjeto = [];

        $.each(arrayObjeto, function (index, value) {
            var novoObjeto = {},
                key;

            if (jQuery.type(value) === "object") {
                for (key in value) {
                    if (value.hasOwnProperty(key)) {
                        novoObjeto[key.toLowerCase()] = value[key];
                    }
                };
                arrayNovoObjeto.push(novoObjeto);
            }
        });
        return arrayNovoObjeto;
    }

    function obterEncodedUrl() {
        return encodeURIComponent((location.pathname + location.search));
    }

    function renderHtml(selector, html, callback) {
        $(selector).html(html);

        if (callback !== undefined)
            callback();
    }

    function actionUrlSimples(url, parametes) {

        return parametes !== undefined ? url + parametes : url;
    }

    function camelize(str) {
        if (str == str.toUpperCase()) {
            return str.toLowerCase();
        }

        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    function validarData(data) {
        return moment(data, "DD-MM-YYYY");
    }

    function verificarMensagensParaUsuario() {
        if ($('#hdnMsgInfo').val()) {
            BASE.MostrarMensagem($('#hdnMsgInfo').val(), TipoMensagem.Informativa, "Informação");
            $('#hdnMsgInfo').val('');
        }
        if ($('#hdnMsgSucesso').val()) {
            BASE.MostrarMensagem($('#hdnMsgSucesso').val(), TipoMensagem.Sucesso, "Sucesso");
            $('#hdnMsgSucesso').val('');
        }
        if ($('#hdnMsgAlerta').val()) {
            BASE.MostrarMensagem($('#hdnMsgAlerta').val(), TipoMensagem.Alerta, "Aviso");
            $('#hdnMsgAlerta').val('');
        }
        if ($('#hdnMsgErro').val()) {
            BASE.MostrarMensagem($('#hdnMsgErro').val(), TipoMensagem.Error, "Aviso");
            $('#hdnMsgErro').val('');
        }
    }

    function irPara(url) {
        if (url) {
            window.location = url;
        }
    }

    function abrirUrlEmNovaAba(url, focar, imprimir) {
        var win = window.open(url, "_blank");

        if (focar === true) {
            win.focus();
        }

        if (imprimir === true) {
            win.print();
        }
    }
    function imprimir() {
        window.print();
    }

    //re-set all client validation given a jQuery selected form or child
    $.fn.resetValidation = function () {

        var $form = this.closest('form');

        //reset jQuery Validate's internals
        $form.validate().resetForm();

        //reset unobtrusive validation summary, if it exists
        $form.find("[data-valmsg-summary=true]")
            .removeClass("validation-summary-errors")
            .addClass("validation-summary-valid")
            .find("ul").empty();

        //reset unobtrusive field level, if it exists
        $form.find("[data-valmsg-replace]")
            .removeClass("field-validation-error")
            .addClass("field-validation-valid")
            //.find("span")
            .empty();

        //$form.find('')

        return $form;
    };

    //reset a form given a jQuery selected form or a child
    //by default validation is also reset
    $.fn.formReset = function (resetValidation) {
        var $form = this.closest('form');

        $form[0].reset();

        if (resetValidation == undefined || resetValidation) {
            $form.resetValidation();
        }

        return $form;
    }

    $.fn.serializeCustom = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').not('.ignoreSerialize').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }

    jQuery.expr[':'].contains = function (a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    return {
        Init: init,
        Debug: debug,
        LogFunction: logFunction,
        LogEvent: logEvent,
        GetFunctionName: getFunctionName,
        Mensagem: {
            Mostrar: mostrarMensagem,
            Ocultar: escondeModalConfirmacao,
            Confirmacao: mostrarModalConfirmacao,
            MostrarListaMensagem: {
                MensagensAlerta: monstrarListaMensagensAlerta
            }
        },
        Modal: {
            Mostrar: modalDetalheMostrar,
            Ocultar: modalDetalheOcultar,
            BindFechar: modalDetalheBindFechar,
            ExibirModalConfirmacao: exibirModalConfirmacao,
            ExibirModalAlerta: exibirModalAlerta,
            ExibirModalPrompt: exibirModalPrompt
        },
        RF: {
            AdicionarBotao: adicionarBotaoBuscaRF,
            ConsultarCNPJ: consultarRFCNPJ
        },
        MostrarMensagemInformativa: mostrarMensagemInformativa,
        MostrarMensagemErro: mostrarMensagemErro,
        MostrarMensagem: mostrarMensagem,
        MostrarModalConfirmacao: mostrarModalConfirmacao,
        MostraDataEHora: mostraDataEHora,
        EscondeModalConfirmacao: escondeModalConfirmacao,
        SpinnerOff: spinnerOff,
        SpinnerOn: spinnerOn,
        CountWords: countWords,
        Util: {
            ResponseIsJson: responseIsJson,
            TratarRespostaJson: tratarRespostaJson,
            TratarErroAjax: tratarErroAjax,
            MontarUrl: montarUrl,
            EncodedUrl: obterEncodedUrl,
            FormatarDataJson: formatarDataJson,
            Pad: pad,
            RenderHtml: renderHtml,
            ValidarData: validarData,
            IrPara: irPara,
            AbrirUrlEmNovaAba: abrirUrlEmNovaAba,
            Imprimir: imprimir,
            GetQuerystringParameterByName: getQuerystringParameterByName
        },
        Objeto: {
            CriarObjetoDinamico: criarObjetoDinamico,
            CriarArrayObjetoDinamico: criarArrayObjetoDinamico
        },
        Validacoes: validacoes,
        ValidarForm: validarDados,
        AdicionarQtdCaracterAEsquerda: adicionarQtdCaracterAEsquerda,
        Url: {
            Simples: actionUrlSimples
        },
        Texto: {
            ToCamelCase: camelize
        }
    };
}());

$(function () {
    BASE.Init();
});
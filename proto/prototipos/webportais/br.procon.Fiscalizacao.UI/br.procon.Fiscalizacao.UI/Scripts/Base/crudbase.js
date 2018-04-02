var CRUDBASE = (function () {
    var moduleName = "CRUDBASE";
    var editar = false;

    // core - inicio
    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAll();

        CRUDFILTRO.Evento.PosListar = bindLista;
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindMostrarFiltro();
        bindCriar();
        bindEditarLista();
        bindDetalhar();
        bindDetalharEditar();
        bindAlterarStatus();
        bindExcluir();
        bindAcaoModal();

        bindLimparDetalhe();
        bindSalvar();
        bindCancelar();
        bindVoltar();

        bindOutrasAcoes();

        BASE.Modal.BindFechar(fecharModal);
    }

    function verificarModo() {
        BASE.LogFunction(arguments.callee, moduleName);

        editar = $('#form-detalhe').length == 1;
        console.log('editar: ' + editar);
        if (editar) {
            CRUDBASE.Eventos.PosCarregarEditar();
        }
    }
    // core - fim

    // bind - inicio
    function bindLista() {
        CRUDBASE.Eventos.PosListar();
    }

    function bindMostrarFiltro() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divFiltro').on('click', '#btnFiltroAvancado', function (e) {
            BASE.LogEvent(e, moduleName);

            var that = $(this);
            $('#filtrar').slideToggle('show', function () {
                var icon = that.find('span i');
                if (icon.hasClass('fa-search-plus')) {
                    icon.removeClass('fa-search-plus');
                    icon.addClass('fa-search-minus');
                }
                else if (icon.hasClass('fa-search-minus')) {
                    icon.removeClass('fa-search-minus');
                    icon.addClass('fa-search-plus');
                }
            });

            return false;
        });
    }

    function bindCriar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divToolbar').off('click', '#btnNovo');
        $('#divToolbar').on('click', '#btnNovo', function (e) {
            BASE.LogEvent(e, moduleName);

            var btn = $(this);
            var url = btn.data('url');
            var complexo = btn.data('complexo');

            if (complexo) {
                criarEditarComplexo(url);
            }
            else {
                criarEditar(url);
            }

            return false;
        });
    }

    function bindAlterarStatus() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#divLista").on("click", "tbody tr td.status .btn-status-alterar", function (e) {
            BASE.LogEvent(e, moduleName);

            var btn = $(this),
                idString = btn.closest("tr").data("id"),
                id = parseInt(idString, 10) || 0,
                url = btn.data("url"),
                ativar = btn.data("text-original") !== "Ativo";

            alterarStatus(url, ativar, id, CRUDFILTRO.Filtrar);

            return false;
        });
    }

    function bindExcluir() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divLista').on('click', 'tbody tr td.acoes .btn-excluir', function (e) {
            BASE.LogEvent(e, moduleName);

            var btn = $(this);
            url = btn.data('url');

            BASE.MostrarModalConfirmacao('Exclusão de Registro', 'Deseja realmente excluir o registro?', function () {
                excluir(url, CRUDFILTRO.Filtrar);
            },
            cancelar(), '.btn-excluir');

            return false;
        });
    }

    function bindDetalhar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divLista').on('click', 'tbody tr td.exibir-detalhe', function (e) {
            BASE.LogEvent(e, moduleName);

            var btn = $(this);
            url = btn.closest('tr').data('urlDetalhar');

            detalhar(url);
            return false;
        });
    }

    function bindEditarLista() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divLista').on('click.lista', 'tbody tr td.acoes .btn-editar', function (e) {
            BASE.LogEvent(e, moduleName);

            bindEditar($(this));

            return false;
        });
    }

    function bindDetalharEditar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#modalDetalhe').on('click.detalhe', '.acoesdetalhar .btn-editar', function (e) {
            BASE.LogEvent(e, moduleName);

            bindEditar($(this));

            return false;
        });
    }

    function bindEditar(btn) {
        var url = btn.data('url');
        if (url === undefined) {
            if (btn.prop('href') === undefined) {
                BASE.Debug("URL DE EDIÇÃO NÃO DEFINIDA!", DebugAction.Warn);
            }
            else {
                url = btn.prop('href');

                criarEditar(url);
            }
        }
        else {
            var complexo = btn.data('complexo');

            if (complexo !== undefined) {
                criarEditarComplexo(url);
            }
            else {
                criarEditar(url);
            }
        }
    }

    function bindLimparDetalhe() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#form-detalhe').on('click', 'div.acoesform #btnLimpar', function (e) {
            BASE.LogEvent(e, moduleName);

            limparForm("#form-detalhe");
            CONTROLES.DropDown.Desabilitar('#form-detalhe .ddl-chain-filho', true);
            CRUDBASE.Eventos.PosLimparEditar();

            return false;
        });
    }

    function bindSalvar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#modalDetalhe, #form-detalhe').on('click', 'div.acoesform #btnSalvar', function (e) {
            BASE.LogEvent(e, moduleName);

            var form = $("#form-detalhe");
            var valido = validarDados(form);

            if (valido) {
                var novo = $('#form-detalhe #Codigo').val();

                if (novo <= 0) {
                    salvar(form, true); //identifica se é um novo registro
                } else {
                    salvar(form, false); //Identifica se é edição de registro
                }
            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Dados inválidos!", TipoMensagem.Informativa);
            }

            return false;
        });
    }

    function bindAcaoModal() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#form-detalhe').on('click', 'div.acoesform .btn-acao', function (e) {
            BASE.LogEvent(e, moduleName);

            var form = $("#form-detalhe");
            var url = $(this).data('url');
            var valido = validarDados(form);

            if (valido) {
                var novo = $('#form-detalhe #Codigo').val();
                enviarAcaoModal(url, form, false);

            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Dados inválidos!", TipoMensagem.Informativa);
            }

            return false;
        });
    }

    function bindCancelar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#modalDetalhe').on('click', 'div.acoesform #btnCancelar', function (e) {
            BASE.LogEvent(e, moduleName);
            cancelarCadastro();
            return false;
        });
    }

    function bindVoltar() {
        BASE.LogFunction(arguments.callee, moduleName);

        $(".crudcreateeditoolbar").on('click', '#btnVoltar', function () {
            console.log('clicou');
            var btn = $(this);
            var url = btn.data('url');

            BASE.Util.IrPara(url);
        });
    }

    function bindOutrasAcoes() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#divLista').on('click', 'tbody tr td.acoes .btn-acao', function (e) {
            BASE.LogEvent(e, moduleName);
            var
            btn = $(this);
            url = btn.data('url');

            if (url !== '#' && url !== undefined && url.length > 0) {
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (response, status, xhr) {
                        var isJson = BASE.Util.ResponseIsJson(xhr);

                        if (!isJson) {
                            exibirDetalhe(response);
                        }
                        else {
                            BASE.Util.TratarRespostaJson(response);
                        }
                    },
                    error: function (xhr) {
                        BASE.Util.TratarErroAjax(xhr);
                    }
                });
            }

            return false;
        });
    }
    // bind - fim

    function limparForm(seletorContexto) {
        $(seletorContexto + ' input:text:not([readonly])').val('');
        $(seletorContexto + ' textarea').val('');
        $(seletorContexto + ' select').val('');
        $(seletorContexto + ' input:radio.radio-default-value').prop('checked', true);
    }

    function criarEditar(url) {
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    exibirDetalhe(response, true);
                }
                else {
                    BASE.Util.TratarRespostaJson(response);
                }
            },
            error: function (xhr) {
                BASE.Util.TratarErroAjax(xhr);
            }
        });
    }

    function criarEditarComplexo(url) {

        window.location = url;
        CRUDBASE.Eventos.PosCarregarEditar();

    }

    function alterarStatus(url, ativar, id, callback) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                ativar: ativar,
                id: id
            },
            success: function (response) {
                if (response.Sucesso === false) {
                    BASE.Util.TratarRespostaJson(response);
                }
                else {
                    BASE.MostrarMensagemInformativa(response.Mensagem);

                    if (callback) {
                        callback();
                    }
                }
            },
            error: function (xhr) {
                BASE.Util.TratarErroAjax(xhr);
            }
        });
    }

    function excluir(url, callBackSucesso) {

        //Tenta excluir do banco
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            success: function (response) {
                //Exclui o registro do HTML
                if (response.Sucesso === true) {
                    if (callBackSucesso) {
                        callBackSucesso();
                    }
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                } else if (response.Sucesso === false) {

                    if (response.Mensagem.length > 0)
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);

                    BASE.Util.TratarRespostaJson(response);
                }
            },
            error: function (xhr) {
                BASE.Util.TratarErroAjax(xhr);
            }
        });

    }

    function detalhar(url) {
        $.ajax({
            type: "GET",
            url: url,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson && response.Sucesso === false) {
                    BASE.Util.TratarRespostaJson(response);
                }
                else {
                    exibirDetalhe(response);
                }
            },
            error: function (e) {
                BASE.MostrarMensagem('Erro ao detalhar.', TipoMensagem.Error);
                return false;
            }
        });
    }

    function exibirDetalhe(htmlResult, editar) {

        var divModal = $('#modalDetalhe');

        BASE.Modal.Mostrar(htmlResult, divModal);


        //Configura os botões de edição do TextArea
        CONTROLES.Plugins.WYSIWYG();

        CONTROLES.Configurar.DatePicker();

        //Configura intervalo de datas
        CONTROLES.Configurar.ConfigurarIntervaloData(); // TODO mover para regra de negócio específica (Administrativo)

        if (editar) {
            CONTROLES.Geral.DefinirMaxLength(divModal);
            CRUDBASE.Eventos.PosCarregarEditar();
        }
        else {
            CRUDBASE.Eventos.PosCarregarDetalhe();
        }
    }

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
            CRUDBASE.Validator.RegrasEspecificas();
        }
        else {

            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    function salvar(form, criar) {
        BASE.LogFunction(arguments.callee, moduleName);

        $.ajax({
            type: "POST",
            url: form.attr('action'),
            data: form.find('input, select, textarea').not('.postignore').serialize(),
            success: function (response) {

                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
                else if (response.Sucesso === true) {
                    var telaCheia = form.closest('#modalDetalhe').length === 0;

                    if (criar === true) {
                        BASE.Modal.Ocultar();
                        CRUDBASE.Eventos.ModalPosCriar();
                    } else {
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);

                        CRUDBASE.Eventos.PosSalvar();
                    }
                    if (telaCheia) {
                        var url = $(".crudcreateeditoolbar #btnVoltar").data('url');
                        BASE.Util.IrPara(url);
                    }
                    else {
                        BASE.Modal.Ocultar(CRUDFILTRO.Filtrar);
                    }
                }
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
            }
        });
    }

    function enviarAcaoModal(url, form, criar) {
        console.clear();
        BASE.LogFunction(arguments.callee, moduleName);


        $.ajax({
            type: "POST",
            url: url,
            data: form.find('input, select, textarea').not('.postignore').serialize(),
            success: function (response) {

                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                }
                else if (response.Sucesso === true) {

                    if (criar === true) {
                        BASE.Modal.Ocultar();
                        CRUDBASE.Eventos.ModalPosCriar();
                    } else {
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                    }

                    BASE.Modal.Ocultar(CRUDFILTRO.Filtrar);
                }
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
            }
        });
    }

    function modalPosCriar() {

        BASE.MostrarModalConfirmacao('Inclusão de Registro', 'Registro incluído com sucesso! Deseja realizar um novo cadastro?', function () {
            var btnNovo = $('#divToolbar #btnNovo');
            var urlCriar = btnNovo.data('url');

            criarEditar(urlCriar);
        },
        cancelarNovaInclusao, '.btn-excluir');

    }

    function mostrarModal(tipo) {
        if (tipo === 'alterar') {
            prepararModalAlterar();
        }

        $("html").css("overflow", "hidden");
        $('#modalDetalhe').modal();
    }

    function prepararModalAlterar() {
        $('#btnExcluir').show();
    }

    function fecharModal() {
        // evento acionado ao fechar o modal detalhe
        return false;
    }
    function cancelarCadastro() {
        BASE.MostrarModalConfirmacao('Cancelamento da Edição', 'Deseja realmente cancelar a edição?', function () {
            BASE.Modal.Ocultar();
        }, cancelarModal, '.btn-cancelar');
    }
    function cancelarModal() {
        // evento acionado ao cancelar o modal detalhe
        return false;
    }
    function cancelarNovaInclusao() {
        cancelar();
    }
    function cancelar() {
        CRUDBASE.Eventos.Cancelar();
    }

    return {
        Init: init,
        VerificarModo: verificarModo,
        Bind: {
            BotaoFiltroAvancado: bindMostrarFiltro
        },
        Eventos: {
            Cancelar: function () { return false; },
            Salvar: function (form, criar) { salvar(form, criar); return false; },
            PosCarregarDetalhe: function () { return false; },
            PosCarregarEditar: function () { return false; },
            PosListar: function () { return false; },
            PosAlterarStatus: function () { return false; },
            PosLimparEditar: function () { return false; },
            PosSalvar: function () { console.log('possalvar não definido'); return false; },
            ModalPosCriar: function () { modalPosCriar(); }
        },
        AlterarStatus: alterarStatus,
        Criar: mostrarModal,
        Editar: mostrarModal,
        Detalhar: detalhar,
        EditarComplexo: criarEditarComplexo,
        bindSalvar: bindSalvar,
        UrlPDF: null,
        Validator: {
            RegrasEspecificas: function () { return false; }
        }
    };
}());

$(function () {
    CRUDBASE.Init();
    CRUDFILTRO.Init();
});
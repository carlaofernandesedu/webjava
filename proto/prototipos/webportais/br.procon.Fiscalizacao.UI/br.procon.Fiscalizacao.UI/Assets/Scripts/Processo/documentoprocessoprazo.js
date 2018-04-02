DOCUMENTOPROCESSOPRAZO = (function () {
    var url = {
        editar: '/DocumentoProcessoPrazo/Editar'
    };

    var form = '#form-modal-processo-prazo',
        btnNovo = '.btn-Novo',
        btnEditar = '.btn-Editar',
        btnExcluir = '.btn-Excluir',
        btnSalvar = '#btnSalvar',
        btnLimpar = '.btn-limpar',
        btnCancelar = '.btn-cancelar',
        conteudo = '#modal-operacao-prazo',
        modalOperacoes = '.modal-operacao-prazo',
        documento = $('#IdDocumento').val();

    function init() {
        bindAll();
    };

    function bindAll() {
        carregarPaginacao();
        bindBtnNovo();
        bindBtnEditar();
        bindBtnExcluir();
        bindDropDownList();
    };

    function bindDropDownList() {
        CONTROLES.DropDown.Preencher('#IdSituacaoProcessoPrazo', 'DocumentoProcessoPrazo', 'ObterSitucaoProcessoPrazo', documento, '--Selecione--', null, null, null);
        CONTROLES.DropDown.Preencher('#IdPrazoCumprimento', 'DocumentoProcessoPrazo', 'ObterPrazoCumprimento', documento, '--Selecione--', null, null, null, null);
    }

    function bindBtnNovo() {
        $(btnNovo).off('click');
        $(btnNovo).on('click', function () {
            definirTitleModal('Incluir Processo Prazo');
            limparCamposModal();
            carregarModal();
            $(form + ' #DataProcessoPrazo').datetimepicker('update', new Date());
        });
    }

    function bindBtnEditar() {
        $(btnEditar).off('click');
        $(btnEditar).on('click', function () {
            definirTitleModal('Editar Processo Prazo');
            carregarModal();
            var prazo = $(this).data('id');
            editar(prazo);
        });
    }

    function bindBtnExcluir() {
        $(btnExcluir).off('click');
        $(btnExcluir).on('click', function () {
            var prazo = $(this).data('id');

            BASE.Modal.ExibirModalConfirmacao(
                'Excluir Processo Prazo', 'Deseja mesmo excluir o processo?',
                'small',
                '<i class="fa fa-close margR5"></i>Cancelar',
                'btn-primary',
                '<i class="fa fa-trash margR5"></i>Excluir',
                'btn-danger',
                function () {
                    excluir(prazo);
                },
                null);
        });
    }

    function excluir(prazo) {
       
        $.ajax({
            url: "/DocumentoProcessoPrazo/Excluir/",
            type: "POST",
            data: { prazo: prazo },
            success: function (response, status, xhr) {
              
                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
                else if (response.Sucesso === true) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                }

                REGISTRARPROCESSO.AbreFrame(9);
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
            }
        });
    }

    function bindBtnLimpar() {
        $(btnLimpar).off('click');
        $(btnLimpar).on('click', function () {        
            limparCamposModal();
        });
    }

    function bindBtnCancelar() {
        $(btnCancelar).off('click');
        $(btnCancelar).on('click', function () {
            BASE.Modal.ExibirModalConfirmacao(
               'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
               'small',
               'Sim',
               'btn-primary',
               'Não',
               'btn-danger',
               null,
               function () {
                   limparCamposModal();
                   $(modalOperacoes).modal('hide');
               });
        });
    }

    function carregarModal() {
        $(modalOperacoes).modal('show');
        bindData();
        bindSalvar();
        bindBtnLimpar();
        bindBtnCancelar();
    }

    function definirTitleModal(title) {
        $('.modal-title').text(title);
    }

    function limparCamposModal() {
        var elementos = $(form);

        $.each(elementos, function (key, value) {
            if ($(value).is('select')) {
                $(value).val('null');
            }
            else {
                $(value).val("");
            }
        });

        $('#DataProcessoPrazo').val('');
        $('#IdSituacaoProcessoPrazo').val('');
        $('#IdPrazoCumprimento').val('');
        $(form).resetValidation();
    }

    function bindSalvar() {
        $(btnSalvar).off('click');
        $(btnSalvar).on('click', function () {
            var valido = validarDados($(form));

            if (valido) {
                var novo = $(form + ' #IdProcessoPrazo').val();

                if (novo <= 0) {
                    salvar($(form), true);
                } else {
                    salvar($(form), false);
                }
            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Dados inválidos!", TipoMensagem.Informativa);
            }

            return false;
        });
    }

    function salvar(form, criar) {
        var model = String(form.find('input, select, textarea').not('.postignore').serialize()).concat('&IdDocumento=' + documento);

        $.ajax({
            type: "POST",
            url: form.attr('action'),
            data: model,
            success: function (response) {
                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                }
                else if (response.Sucesso === true) {
                    if (criar === true) {
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                        limparCamposModal();
                    } else {
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                    }

                    $(modalOperacoes).modal('hide');
                    REGISTRARPROCESSO.AbreFrame(9);
                }
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
            }
        });
    }

    function bindData() {
        $('#DataProcessoPrazo').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990"
        });
    }

    function editar(prazo) {
        $.ajax({
            url: url.editar,
            data: { prazo: prazo },
            type: 'GET',
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);
                preencherModal(response);
            },
            error: function () {
                console.log("erro ao retornar o processo prazo");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function preencherModal(model) {
        $('#IdProcessoPrazo').val(model.IdProcessoPrazo);
        $('#IdProcesso').val(model.IdProcesso);

        $('#DataProcessoPrazo').datetimepicker('update', new Date(model.DataProcessoPrazo));
        $('#IdSituacaoProcessoPrazo').val(model.IdSituacaoProcessoPrazo);
        $('#IdPrazoCumprimento').val(model.IdPrazoCumprimento);
        $('#IdDocumentoMovimentacao').val(model.IdDocumentoMovimentacao);
    }

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    function carregarPaginacao() {
        $('#table-processo-prazo').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"],
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"],
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true,
            bAutoWidth: false,
        });
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    DOCUMENTOPROCESSOPRAZO.Init();
});
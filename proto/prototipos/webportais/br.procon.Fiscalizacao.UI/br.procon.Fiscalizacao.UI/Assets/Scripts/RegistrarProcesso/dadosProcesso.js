var DADOSPROCESSO = (function () {
    function init() {
        bindAll();
    }

    function bindAll() {
        bindSalvarDadosProcesso();
        bindLimparDadosProcesso();
        bindCancelarDadosProcesso();
        bindImprimirFolhaLider();
        bindImprimirFolhaDespacho();
        bindBtnEncerrarReativarProcesso();
        AutoCompleteSerieDocumental();
       
    }

    function AutoCompleteSerieDocumental() {
        $("#SerieDocumental").typeahead({
            onSelect: function (item) {
                $("#SerieDocumental").val(item.value);
                $("#SerieDocumento").val(item.value); //val.append($("<option value='" + item.value + "'>" + item.text + "</option>"));
            },
            ajax: {
                url: '/Documento/RetornaSerieDocumental',
                triggerLength: 4,
                dataType: "json",
                displayField: "DescricaoSerie",
                valueField: "IdSerieDocumental",
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    var listaSerie = [];
                    if (data.lista.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                        return false;
                    }

                    return data.lista;
                }
            }
        });
    }

    function bindSalvarDadosProcesso() {
        $("#form-dados-processo #btn-salvar").off("click");
        $("#form-dados-processo #btn-salvar").on("click", function () {
            console.log("Executando método de salvar Dados do Processo");
            atualizarDadosProcesso();
        });
    }

    function bindLimparDadosProcesso() {
        $("#form-dados-processo #btn-limpar").off("click");
        $("#form-dados-processo #btn-limpar").on("click", function () {
            console.log("Executando método de apagar Dados do Projeto");
            limparCampos();
        });
    }

    function bindCancelarDadosProcesso() {
        $("#form-dados-processo #btn-cancelar").off("click");
        $("#form-dados-processo #btn-cancelar").on("click", function () {
            console.log("Executando método de cancelar Dados do Projeto");
        });
    }

    function bindImprimirFolhaLider() {
        $("#form-dados-processo #btn-imprimir").off("click");
        $("#form-dados-processo #btn-imprimir").on("click", function () {
            console.log("Executando método de imprimir folha lider ");
            imprimirFolhaLider();
        });
    }

    function bindImprimirFolhaDespacho() {
        $("#form-dados-processo #btn-imprimir-despacho").off("click");
        $("#form-dados-processo #btn-imprimir-despacho").on("click", function () {
            var documento = $("#IdDocumento").val();

            $.ajax({
                url: "/RegistrarProcesso/ValidarRegrasFolhaDespacho",
                type: "POST",
                data: { idDocumento: documento },
                success: function (response, status, xhr) {
                    if (response.erro != undefined && response.erro != "") {
                        BASE.Mensagem.Mostrar(response.erro, TipoMensagem.Error, "Erro");
                        return;
                    }

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (!isJson) {
                        console.log("Não é json");
                    }
                    else {
                        if (response.MensagensCriticas) {
                            $.each(response.MensagensCriticas,
                                function (index, value) {
                                    BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
                                });
                        } else {
                            $('#operacao-modal-dados-processo').modal('show');

                            limparModal();
                            carregarUnidadeAdministrativaDestino();
                            carregarUnidadeAdministrativaAutoridade();
                            bindDataDespacho();
                            bindBtnImprimirDespacho();
                            bindBtnCancelar();
                            bindBtnLimpar();
                        }
                    }
                },
                error: function (response, status, xhr) {
                    BASE.Mensagem.Mostrar(response.erro, TipoMensagem.Error, "Erro");
                }
            });
        });
    }

    function bindDataEncerramentoProcesso() {
        $('#dataencerramentoprocesso').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990",
            endDate: new Date()
        });
        $("#dataencerramentoprocesso").datetimepicker('update', new Date());
    }

    function bindBtnEncerrarReativarProcesso() {
        $("#btn-encerrar-reativar").off("click");
        $("#btn-encerrar-reativar").on("click", function () {
            var btn = $(this);
            exibirModalEncerrarProcesso(posCarregarModal, btn);
        });
    }

    function atualizarDadosProcesso() {
        var form = $("#form-dados-processo"),
        valido = BASE.ValidarForm(form);

        var serieDocumento = $('#SerieDocumento').val();
        var serieDocumental = $('#SerieDocumental').val();
        var assunto = $("#AssuntoProtocolo").val();
        var informacao = $('#Informacao').val();

        var model = form.serializeObject();

        model.SerieDocumento = serieDocumento;
        model.AssuntoProtocolo = assunto;
        model.Informacao = informacao;
        model.SerieDocumental = serieDocumental;

        if (valido) {
            $.ajax({
                url: "/RegistrarProcesso/AtualizarDadosProcesso",
                type: 'POST',
                data: { vmodel: model },
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);
                    if (!isJson) {
                        console.log("Não é json");
                    }
                    else {
                        if (response.MensagensCriticas) {
                            $.each(response.MensagensCriticas,
                                function (index, value) {
                                    BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
                                });
                        } else {
                            BASE.Mensagem.Mostrar("Dados do processo atualizado com sucesso.", TipoMensagem.Sucesso, "Sucesso");
                        }
                    }
                },
                error: function () {
                    BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
                }
            });
        }
        else {
            form.validate();
        }
    }

    function imprimirFolhaLider() {
        var obj = $("#form-dados-processo").serializeObject();

        if (obj !== null)
            window.open("/RegistrarProcesso/EmitirFolhaLiderProcesso?nrProcesso=" + obj.NrProcesso + "&anoProcesso=" + obj.AnoProcesso + "&nrCompetencia=" + obj.IdCompetencia);
    }

    function imprimirFolhaDespacho() {
        var form = $('#form-modal-dados-processo');

        var valido = REGISTRARPROCESSO.ValidarForm(form);

        if (valido) {
            var model = form.serializeObject();

            model.descricao = $('#AssuntoProtocolo').val();
            model.IdDocumento = $('#IdDocumento').val();

            window.open('/RegistrarProcesso/EmitirFolhaDespacho?vmodel=' + btoa(unescape(encodeURIComponent(JSON.stringify(model)))), '_blank');
        } else {
            BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
            form.validate();
        }
    }

    function bindBtnImprimirDespacho() {
        $("#form-modal-dados-processo #btn-imprimir-despacho-modal").off("click");
        $("#form-modal-dados-processo #btn-imprimir-despacho-modal").on("click", function () {
            imprimirFolhaDespacho();
            $('#operacao-modal-dados-processo').modal('hide');
        });
    }

    function bindBtnCancelar() {
        $("#form-modal-dados-processo #btn-cancelar").off('click');
        $("#form-modal-dados-processo #btn-cancelar").on('click', function () {
            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
                'small',
                'Sim',
                'btn-primary',
                'Não',
                'btn-danger',
                null,
                function () {
                    limparModal();
                    $('#operacao-modal-dados-processo').modal('hide');
                });
        });
    }

    function bindBtnLimpar() {
        $("#form-modal-dados-processo #btn-limpar").off('click');
        $("#form-modal-dados-processo #btn-limpar").on('click', function () {
            limparModal();
        });
    }

    function bindDataDespacho() {
        $("#form-modal-dados-processo #DataDespacho").mask('00/00/0000', { placeholder: '__/__/____' }).attr('maxlength', '10');

        $("#form-modal-dados-processo #DataDespacho").datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: "pt-BR",
            autoclose: true,
            startDate: "01/01/1990",
            endDate: new Date()
        });
    }

    function carregarUnidadeAdministrativaDestino() {
        CONTROLES.DropDown.Preencher('#IdUaDestino', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function carregarUnidadeAdministrativaAutoridade() {
        CONTROLES.DropDown.Preencher('#IdUaAutoridade', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function limparCampos() {
        $("#Sigilo").prop("checked", false);
        $("#Informacao").val("");
    }

    function limparModal() {
        $('#form-modal-dados-processo #IdUaDestino').val('');
        $('#form-modal-dados-processo #DecisaoProvidencia').val('');
        $('#form-modal-dados-processo #Cargo').val('');
        $('#form-modal-dados-processo #IdUaAutoridade').val('');
    }

    function posCarregarModal() {
        $('.bootbox-form').find('input').attr('id', 'dataencerramentoprocesso');
        bindDataEncerramentoProcesso();
        $("#dataencerramentoprocesso").mask("99/99/9999");
    }

    function exibirModalEncerrarProcesso(callback, btn) {
        var label = $("#btn-encerrar-reativar").html();
        _idDocumento = $("#IdDocumento").val();
        var situacao = 0;

        if (label.indexOf('Encerrar Processo') > -1) {
            //Encerramento de Processo
            situacao = 3; //protocolo.tb_situacao_documento = Cancelado
        }
        else {
            //Reativação de Processo
            situacao = 1; //protocolo.tb_situacao_documento = Protocolado
        }

        if (situacao === 3) {
            BASE.Modal.ExibirModalPrompt("Escolha a data de Encerramento",
                   TipoInput.Text,
                   undefined,
                   "",
                   TamanhoModal.Pequeno,
                   null,
                   '<i class="fa fa-close margR5"></i>Cancelar',
                   "btn-danger",
                   '<i class="fa fa-save margR5"></i>Confirmar',
                   "btn-primary",
                   function (value) {
                       var dataArray = value.toString().split('/');
                       var dia = dataArray[0];
                       var mes = dataArray[1];
                       var ano = dataArray[2];

                       if (parseInt(dia) >= 0 && parseInt(mes) >= 0 && parseInt(ano) <= 1900) {
                           BASE.Mensagem.Mostrar("Data de encerramento inválida", TipoMensagem.Alerta, "Atenção");
                           return;
                       }

                       if (parseInt(dia) > new Date().getDate() && parseInt(mes) >= new Date().getMonth() + 1 && parseInt(ano) >= new Date().getFullYear()) {
                           BASE.Mensagem.Mostrar("Data de encerramento inválida", TipoMensagem.Alerta, "Atenção");
                           return;
                       }

                       if (value == "") {
                           BASE.Mensagem.Mostrar("Data de encerramento obrigatória", TipoMensagem.Alerta, "Atenção");
                           return;
                       }
                       salvarDataEncerramentoProcesso(_idDocumento, value, situacao);
                   },
                   null);

            callback !== undefined ? callback() : null;
        }
        else if (situacao === 1) {
            BASE.Modal.ExibirModalConfirmacao(
                  'Reativação do Processo', 'Esta operação reativará o processo!<br> Deseja reativar?',
                  'small',
                  'Sim',
                  'btn-primary',
                  'Não',
                  'btn-danger',
                  null,
                  function () {
                      salvarDataEncerramentoProcesso(_idDocumento, null, situacao);
                  });
        }
    }

    function salvarDataEncerramentoProcesso(documento, encerramento, situacao) {
        $.ajax({
            url: "/RegistrarProcesso/AlterarSituacao",
            type: "POST",
            data: { idDocumento: documento, dataEncerramento: encerramento, idSituacao: situacao },
            success: function (response, status, xhr) {
                if (response.erro != undefined && response.erro != "") {
                    BASE.Mensagem.Mostrar(response.erro, TipoMensagem.Alerta, "Alerta");
                    return;
                }

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    if (response.retorno.Situacao === "Encerrado") {
                        $("#btn-encerrar-reativar").html('<i class="fa fa-save margR5"></i>Reativar Processo');
                        BASE.Mensagem.Mostrar("Processo encerrado com sucesso.", TipoMensagem.Sucesso, "Sucesso");
                    }
                    else {
                        $("#btn-encerrar-reativar").html('<i class="fa fa-save margR5"></i>Encerrar Processo');
                        BASE.Mensagem.Mostrar("Processo reativado com sucesso.", TipoMensagem.Sucesso, "Sucesso");
                    }
                }
            },
            error: function (response, status, xhr) {
                BASE.Mensagem.Mostrar(response.erro, TipoMensagem.Error, "Erro");
            }
        });
    }

    $.fn.serializeObject = function () {
        var o = {};
       
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
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

    return {
        Init: function () {
            init();
        }
    }
}());

$(function () {
    DADOSPROCESSO.Init();
});
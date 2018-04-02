ARQUIVOCAIXA = (function () {
    var ddlEmpty = "";

    function init() {
        CRUDFILTRO.Carregar();
        CRUDFILTRO.Filtrar();
        CRUDFILTRO.Evento.PosListar = posListar;
        CRUDBASE.Eventos.PosCarregarEditar = posCarregar;

        editarMenssagensJquery();
        bindAll();
    }

    function bindAll() {
        resetEventoModal();
        fechaModal();
        bindLimparDetalhe();
        bindCancelar();
        bindSalvar();

        CarregarCombo();
        bindData();
        bindMascara();
        AutoCompleteSerieDocumental();
        definirOperacao();

        bindIdCaixaArquivo();
        bindOnchangeLocalArquivo();
        bindOnchangeDivisaoMovelArquivo();
        bindIncluirCaixaArquivo();

        bindSerieDocumental();
        renLabelSituacao();
    }

    function posListar() {
        $('[data-toggle="tooltip"]').tooltip();

        bindPaginacao();
    }

    function bindPaginacao() {
        $('#grupo_lista_relacionar').dataTable({
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

    function renLabelSituacao() {
        $('#filtrar label[for=Situacao]').html('Situação');
    }

    function CarregarCombo() {
        bindLocal();
        bindCarregarRegras();
        bindUAProdutora();
    }

    function posCarregar() {
        if (parseInt($('#Id').val()) > 0) {
            $('#incluirMovelCaixa-label').text($('#incluirMovelCaixa-label').text().replace($('#incluirMovelCaixa-label').text(), 'Editar Caixa de Arquivo'));
        }
        else {
            $('#incluirMovelCaixa-label').text($('#incluirMovelCaixa-label').text().replace($('#incluirMovelCaixa-label').text(), 'Incluir Caixa de Arquivo'));
            setarStatusAtivo();
        }
    }

    function resetEventoModal() {
        $('#modalDetalhe').off('click');
    }

    function bindLimparDetalhe() {
        $('#modalDetalhe').on('click', 'div.acoesform #btnLimpar', function () {
            $('#form-detalhe')[0].reset();
        });
    }

    function bindCancelar() {
        $('#modalDetalhe').on('click', 'div.acoesform #btnCancelar', function () {
            cancelarCadastro();
            return false;
        });
    }

    function fechaModal() {
        $('#modalDetalhe').on('click', 'div[class=modal-header] button[class=close]', function () {
            cancelarCadastro();
            return false;
        });
    }

    function cancelarCadastro() {
        BASE.Modal.ExibirModalConfirmacao(
            'Cancelar Operação', 'Deseja mesmo cancelar a inclusão/alteração da caixa?',
            'small',
            '<i class="fa fa-close margR5"></i>Não',
            'btn-primary',
            '<i class="fa fa-check margR5"></i>Sim',
            'btn-danger',
            function () {
                $('#form-detalhe')[0].reset();
                $('#modalDetalhe').modal('hide');
            },
            function () {
                $('#modalDetalhe').modal('show');
            });
    }

    function bindSalvar() {
        $('#modalDetalhe').on('click', 'div.acoesform #btnSalvar', function () {
            var form = $('#form-detalhe');

            var valido = validarDados(form);

            if (valido) {
                var obj = form.serialize();

                $.ajax({
                    type: "POST",
                    url: form.attr('action'),
                    data: obj,
                    success: function (response) {
                        if (response.Sucesso === false) {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                        }
                        else if (response.Sucesso === true) {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);

                            $('#modalDetalhe').modal('hide');
                            CRUDFILTRO.Filtrar();
                        }
                    },
                    error: function (e) {
                        BASE.Mensagem.Mostrar(e.responseText, TipoMensagem.Error);
                    }
                });
            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Por favor preencha os campos obrigatórios", TipoMensagem.Alerta);
            }
        });
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

    function definirOperacao() {
        if ($('#Id').val() == '0') {
            $('.modal-title').text('Incluir Caixa de Arquivo')
            $('#CodigoCaixa').prop('readonly', false);
        }
        else {
            $('.modal-title').text('Alterar Caixa de Arquivo')
            $('#CodigoCaixa').prop('readonly', true);
        }
    }

    function definirCamposRequeridos(valor) {
        $('#form-detalhe').validate({
            messages: {
                "resume[zip_code]": {
                    required: "this field is required",
                    minlength: "this field must contain at least {0} characters",
                    digits: "this field can only contain numbers"
                }
            }
        });

        $('#form-detalhe').validate();

        var obj = [
               { elemento: '#IdLocalArquivo' },
               { elemento: '#IdMovelArquivo' },
               { elemento: '#IdMovelDivisao' }
        ];

        $(obj).each(function (index, item) {
            var _data = $(item.elemento).data('Local')
            $(item.elemento).rules('remove');
            $(item.elemento).removeClass('input-validation-error');
            $('.ddlLocal').text('');
        });

        if (valor != ddlEmpty) {
            $(obj).each(function (index, item) {
                var _data = $(item.elemento).data('ddl');
                $(item.elemento).rules('add', 'required');
                $(item.elemento).addClass('input-validation-error');
                $('.ddlLocal').text('* ');
            });
        }
    }

    function bindCarregarRegras() {
        $('#form-detalhe #IdLocalArquivo').off('change');
        $('#form-detalhe #IdLocalArquivo').on('change', function () {
            definirCamposRequeridos($(this).val());
        });
    }

    function bindSerieDocumental() {
        $('#form-detalhe #SerieDocumental').off('change');
        $('#form-detalhe #SerieDocumental').on('change', function () {
            if ($('#form-detalhe #SerieDocumental').val() == "") {
                $('#form-detalhe #IdSerieDocumental').val('');
            }
        });
    }

    function setarStatusAtivo() {
        $('input[name=Ativo]').prop('checked', true);
    }

    function bindLocal() {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdLocalArquivo', 'ArquivoCaixa', 'ObterCaixaComboBoxLocal', null, true, false, false, function () {
            CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdLocalArquivo', '#IdMovelArquivo, #IdMovelDivisao', false, "Selecione um local", function (idPai) {
                if (idPai) {
                    selectMovel(idPai);
                }
            });
        });
    }

    function bindUAProdutora() {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdUAProdutora', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true, false, false, null);
    }

    function selectMovel(idLocal) {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdMovelArquivo', 'ArquivoMovel', 'ObterMovelComboBox', idLocal, true, false, false, function () {
            CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdMovelArquivo', '#IdMovelDivisao', false, "Selecione um movel", function (idPai) {
                if (idPai) {
                    CONTROLES.DropDown.Preencher('#form-detalhe #IdMovelDivisao', 'ArquivoMovel', 'ObterDivisaoComboBox', idPai, true);
                }
            });
        });
    }

    function AutoCompleteSerieDocumental() {
        $("#SerieDocumental").typeahead({
            onSelect: function (item) {
                $("#IdSerieDocumental").val(item.value);
            },
            ajax: {
                url: '/ArquivoCaixa/RetornaSerieDocumental',
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

    function bindData() {
        $('#form-detalhe #PeriodoInicio').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        $('#form-detalhe #PeriodoFim').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });
    }

    function bindMascara() {
        $('#form-detalhe #PeriodoInicio').mask('00/00/0000');
        $('#form-detalhe #PeriodoFim').mask('00/00/0000');
    }

    function bindIdCaixaArquivo() {
        $("#table_caixa_arquivo button.btnExcluirCaixa").off('click');
        $("#table_caixa_arquivo button.btnExcluirCaixa").on('click', function () {
            $('#IdCaixaArquivo').val($(this).data('id'));
            $('#modalExcluirCaixaArquivo').modal('show');
            bindExcluirCaixaArquivo();
        });
    }

    function bindIncluirCaixaArquivo() {
        $('#btnIncluirCaixaArquivo').off('click');
        $('#btnIncluirCaixaArquivo').on('click', function () {
            IncluirCaixaArquivo();
        });
    }

    function bindOnchangeLocalArquivo() {
        $("#IdLocalArquivo").off('change');
        $("#IdLocalArquivo").on('change', function () {
            $.ajax({
                url: '/ArquivoCaixa/CarregarMoveis',
                type: 'POST',
                cache: false,
                data: { idLocalArquivo: $("#IdLocalArquivo").val() },
                success: function (data) {
                    $("#IdMovelArquivo").empty();

                    if (data.lista.length > 0) {
                        $("#IdMovelArquivo").append($("<option value='0'>--Selecione--</option>"));

                        $.each(data.lista, function (index, value) {
                            $("#IdMovelArquivo").append($("<option value='" + value.Id + "'>" + value.Codigo + ' - ' + value.Descricao + "</option>"));
                        });
                        $("#IdMovelArquivo").prop("disabled", false);
                    }
                    else {
                        $("#IdMovelArquivo").empty();
                        $("#IdMovelArquivo").prop("disabled", true);

                        $("#IdMovelDivisao").empty();
                        $("#IdMovelDivisao").append($("<option value='0'>Nenhum item para selecionar</option>"));
                        $("#IdMovelDivisao").prop("disabled", true);
                    }
                }
            });
        });
    }

    function bindOnchangeDivisaoMovelArquivo() {
        $("#IdMovelArquivo").off('change');
        $("#IdMovelArquivo").on('change', function () {
            $.ajax({
                url: '/ArquivoCaixa/CarregarDivisoes',
                type: 'POST',
                cache: false,
                data: { idMovelArquivo: $("#IdMovelArquivo").val() },
                success: function (data) {
                    $("#IdMovelDivisao").empty();

                    if (data.lista.length > 0) {
                        $("#IdMovelDivisao").append($("<option value='0'>--Selecione--</option>"));

                        $.each(data.lista, function (index, value) {
                            $("#IdMovelDivisao").append($("<option value='" + value.Id + "'>" + value.Codigo + ' - ' + value.Descricao + "</option>"));
                        });
                        $("#IdMovelDivisao").prop("disabled", false);
                    }
                    else {
                        $("#IdMovelDivisao").empty();
                        $("#IdMovelDivisao").prop("disabled", true);
                    }
                }
            });
        });
    }

    function editarMenssagensJquery() {
        jQuery.extend(jQuery.validator.messages, {
            required: "Campo Obrigatório."
        });
    }
   

    return {
        Init: function () {
            init();
        },
    };
}());

$(function () {
    ARQUIVOCAIXA.Init();
    CRUDFILTRO.Carregar();
    CRUDFILTRO.Filtrar();
});
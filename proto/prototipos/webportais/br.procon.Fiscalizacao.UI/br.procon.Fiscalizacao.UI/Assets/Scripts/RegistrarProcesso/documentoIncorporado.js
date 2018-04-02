DOCUMENTOINCORPORACAO = (function () {
    var formFiltro = '#form-documento-incorporacao-filtro',
        formDocumentoIncorporacao = "#form-documento-incorporacao",
        divConteudoDocumentoIncorporacao = '#conteudo-documento-incorporacao',
        idDocumento = $('#IdDocumento').val();

    function init() {
        bindAll();
        carregarPaginacao();
        bindDataIncorporacao();
        carregarComboVolume(idDocumento);
    }

    function bindAll() {
        bindMascara();
        bindBtnModalPesquisar();
        bindBtnIncluir();
        bindBtnEditar();
        bindBtnExcluir();
    }

    function carregarPaginacao() {
        $('#table-documento-incorporacao').dataTable({
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
            destroy: true
        });
    }

    function bindMascara() {
        $('#form-documento-incorporacao-filtro #NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $('#form-documento-incorporacao-filtro #NrProcessoFormatado').mask('000000/0000.0', { reverse: true, placeholder: '______/____._' }).attr('maxlength', '13');

        $('#form-documento-incorporacao-filtro #NrProtocoloFormatado').change(function () {
            $('#form-documento-incorporacao-filtro #NrProtocoloFormatado').val(REGISTRARPROCESSO.AdicionarQtdCaracterAEsquerda($('#form-documento-incorporacao-filtro #NrProtocoloFormatado').val(), 11, 0));
            if ($('#form-documento-incorporacao-filtro #NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $('#form-documento-incorporacao-filtro #NrProtocoloFormatado').val('');
            }
        });

        $('#form-documento-incorporacao-filtro #NrProcessoFormatado').change(function () {
            $('#form-documento-incorporacao-filtro #NrProcessoFormatado').val(REGISTRARPROCESSO.AdicionarQtdCaracterAEsquerda($('#form-documento-incorporacao-filtro #NrProcessoFormatado').val(), 13, 0));
            if ($('#form-documento-incorporacao-filtro #NrProcessoFormatado').val().indexOf('000000') >= 0) {
                $('#form-documento-incorporacao-filtro #NrProcessoFormatado').val('');
            }
        });

        $('#DataIncorporacao').mask('00/00/0000', { placeholder: '__/__/____' }).attr('maxlength', '10');
        $('#form-documento-incorporacao #NrFolhaInicial').mask('00000', { placeholder: '00000' }).attr('maxlength', '5');
        $('#form-documento-incorporacao #NrFolhaFinal').mask('00000', { placeholder: '00000' }).attr('maxlength', '5');
    }

    function bindBtnIncluir() {
        $('#documentoIncorporado #btn-incluir').off('click');
        $('#documentoIncorporado #btn-incluir').on('click', function () {
            escondeConteudoModal();
            limparFiltroModal();
            limparCamposModal();
            $('#modalDocumentoIncorporacao').modal('show');
        });
    }

    function bindBtnEditar() {
        $('#documentoIncorporado #btn-editar').off('click');
        $('#documentoIncorporado #btn-editar').on('click', function () {
            var id = $(this).data('id'),
                idDocumento = $('#IdDocumento').val();
            editarDocumentoIncorporacao(id, idDocumento, null);
        });
    }

    function bindBtnExcluir() {
        $('#documentoIncorporado #btn-excluir').off('click');
        $('#documentoIncorporado #btn-excluir').on('click', function () {
            var id = $(this).data('id'),
                form = $(formDocumentoIncorporacao);

            BASE.Modal.ExibirModalConfirmacao(
                'Excluir Incorporação', 'Deseja mesmo excluir a Incorporação?',
                'small',
                '<i class="fa fa-close margR5"></i>Cancelar',
                'btn-primary',
                '<i class="fa fa-trash margR5"></i>Excluir',
                'btn-danger',
                function () {
                    excluirDocumentoIncorporacao(id, form);
                },
                null);
        });
    }

    function bindBtnModalPesquisar() {
        $('#form-documento-incorporacao-filtro #btn-pesquisar').off('click');
        $('#form-documento-incorporacao-filtro #btn-pesquisar').on('click', function () {
            var idDocumento = $("#IdDocumento").val();
            filtraDocumento(idDocumento, carregarComboVolume);
        });
    }

    function bindBtnPosCarregar() {
        bindBtnModalCancelar();
        bindBtnModalLimpar();
        bindBtnModalSalvar();
    }

    function bindBtnModalCancelar() {
        $('#form-documento-incorporacao #btn-cancelar').off('click');
        $('#form-documento-incorporacao #btn-cancelar').on('click', function () {
            console.log('btnCancelar');

            BASE.Modal.ExibirModalConfirmacao(
               'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
               'small',
               'Não',
               'btn-primary',
               'Sim',
               'btn-danger',
               function () {
                   escondeModal();
               },
               null);
        });
    }

    function bindBtnModalLimpar() {
        $('#form-documento-incorporacao #btn-limpar').off('click');
        $('#form-documento-incorporacao #btn-limpar').on('click', function () {
            limparCamposModal();
        });
    }

    function bindBtnModalSalvar() {
        $('#form-documento-incorporacao #btn-salvar').off('click');
        $('#form-documento-incorporacao #btn-salvar').on('click', function () {
            $("#form-documento-incorporacao #btn-salvar").prop('disabled', true);

            var form = $(formDocumentoIncorporacao),
                valido = REGISTRARPROCESSO.ValidarForm(form);

            if (valido) {
                var documentoIncorporacao = form.serializeObject();
                documentoIncorporacao.IdDocumento = $("#IdDocumento").val();

                if (documentoIncorporacao.Codigo === "0" || documentoIncorporacao.Codigo === "" || documentoIncorporacao.Codigo === null)
                    salvarDocumentoIncorporacao(documentoIncorporacao);
                else
                    atualizarDocumentoIncorporacao(documentoIncorporacao);
            } else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }
            $("#form-documento-incorporacao #btn-salvar").prop('disabled', false);
        });
    }

    function bindDataIncorporacao() {
        $('#form-documento-incorporacao #DataIncorporacao').val($('#form-documento-incorporacao #DataIncorporacao').val().substr(0, 10));

        $('#form-documento-incorporacao #DataIncorporacao').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            language: 'pt-BR',
            autoclose: true
        });
        $('#form-documento-incorporacao #DataIncorporacao').datetimepicker('update');
    }

    function filtraDocumento(idDocumento) {
        var objeto = $(formFiltro).serializeObject();

        if (objeto.NrProcessoFormatado !== "" || objeto.NrProtocoloFormatado !== "") {
            $.ajax({
                url: '/DocumentoIncorporacao/FiltrarDocumento',
                type: 'POST',
                data: { filtro: objeto },
                cache: false,
                success: function (response, status, xhr) {
                    if (response === "")
                        return BASE.Mensagem.Mostrar("Documento não encontrado", TipoMensagem.Alerta, "Alerta");

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        posCarregar(response, idDocumento);
                    }
                },
                error: function () {
                    console.log("Erro ao pesquisar documento");
                }
            });
        } else {
            BASE.Mensagem.Mostrar("Informe o Número de Processo ou Número de Protocolo", TipoMensagem.Alerta, "Alerta");
        }
    }   

    function salvarDocumentoIncorporacao(documentoIncorporacao) {
        $.ajax({
            url: '/DocumentoIncorporacao/SalvarDocumentoIncorporado',
            type: 'POST',
            data: { vmodel: documentoIncorporacao },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    escondeModal();
                    REGISTRARPROCESSO.AbreFrame(8);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao salvar Documento Incorporado");
            }
        });
    }

    function atualizarDocumentoIncorporacao(documentoIncorporacao) {
        $.ajax({
            url: '/DocumentoIncorporacao/AtualizarDocumentoIncorporado',
            type: 'POST',
            data: { vmodel: documentoIncorporacao },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    escondeModal();
                    REGISTRARPROCESSO.AbreFrame(8);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao atualizar Documento Incorporado");
            }
        });
    }

    function editarDocumentoIncorporacao(id, idDocumento, callback) {
        $.ajax({
            url: '/DocumentoIncorporacao/EditarDocumentoIncorporado',
            data: { idDocumentoIncorporacao: id },
            type: 'GET',
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    exibeModal();
                    posCarregar(response, idDocumento);
                }
            },
            error: function () {
            }
        });
    }

    function excluirDocumentoIncorporacao(id, form) {
        var documentoIncorporado = $(form).serializeObject();
        documentoIncorporado.Codigo = id;

        $.ajax({
            url: '/DocumentoIncorporacao/ExcluirDocumentoIncorporado',
            data: { vmodel: documentoIncorporado },
            type: 'POST',
            cache: false,
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    REGISTRARPROCESSO.AbreFrame(8);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao excluir Documento Incorporado");
            }
        });
    }

    function carregarComboVolume(idDocumento) {
        $.ajax({
            url: '/DocumentoIncorporacao/ListarVolume',
            type: 'GET',
            data: { idDocumento: idDocumento },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {
                    $("#form-documento-incorporacao #IdVolume").empty();
                    $("#form-documento-incorporacao #IdVolume").append($("<option value='null'>Selecione</option>"));

                    if (response.ListaVolume) {
                        $.each(response.ListaVolume, function (index, value) {
                            $("#IdVolume").append($("<option value='" + value.Codigo + "'>" + value.NrVolumeDocumento + "</option>"));
                        });
                    }
                    $("#IdVolume").val('null');
                }
            },
            error: function () { }
        });
    }

    function posCarregar(response, idDocumento) {
        popularDadosDocumentoincorporacao(response, idDocumento);
        exibeConteudoModal();
        bindBtnPosCarregar();
    }

    function limparFiltroModal() {
        var elementos = $(formFiltro + " input");

        $.each(elementos, function (key, value) {
            if ($(value).is('select')) {
                $('#' + value.id).val('null');
            }
            else {
                $(value).val("");
            }
        });
    }

    function limparCamposModal() {
        var elementos = $(formDocumentoIncorporacao + " input,select#IdVolume,textarea");

        $.each(elementos, function (key, value) {
            if ($(value).is('select')) {
                $('#' + value.id).val('null');
            }
            else {
                $(value).val("");
            }
        });
        $('#form-documento-incorporacao').resetValidation();
    }

    function exibeConteudoModal() {
        $(divConteudoDocumentoIncorporacao).collapse('show');
    }

    function escondeConteudoModal() {
        $(divConteudoDocumentoIncorporacao).collapse('hide');
    }

    function popularDadosDocumentoincorporacao(parameters) {
        $('#form-documento-incorporacao #Codigo').val(parameters.Codigo);
        $('#form-documento-incorporacao #IdDocumentoIncorporado').val(parameters.IdDocumentoIncorporado);
        $('#form-documento-incorporacao #IdDocumento').val(parameters.IdDocumento);
        $('#form-documento-incorporacao #IdVolume').val(parameters.IdVolume === 0 ? 'null' : parameters.IdVolume);
        $('#form-documento-incorporacao #NrProcesso').text(parameters.NrProcesso);
        $('#form-documento-incorporacao #NrProtocolo').text(parameters.NrProtocolo);
        $('#form-documento-incorporacao #DescricaoSerieDocumental').text(parameters.DescricaoSerieDocumental);
        $('#form-documento-incorporacao #NrFolhaInicial').val(parameters.NrFolhaInicial);
        $('#form-documento-incorporacao #NrFolhaFinal').val(parameters.NrFolhaFinal);
        $('#form-documento-incorporacao #DataIncorporacao').datetimepicker('update', new Date(parameters.DataIncorporacao));
        $('#form-documento-incorporacao #DataRegistro').datetimepicker('update', new Date(parameters.DataRegistro));
        $('#form-documento-incorporacao #DataRegistro').datetimepicker('update', new Date(parameters.DataRegistro));
        $('#form-documento-incorporacao #Assunto').text(parameters.Assunto);
        $('#form-documento-incorporacao #NomeInteressado').text(parameters.NomeInteressado);
    }

    function exibeModal() {
        $('#modalDocumentoIncorporacao').modal('show');
    }

    function escondeModal() {
        $('#modalDocumentoIncorporacao').modal('hide');
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
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
    DOCUMENTOINCORPORACAO.Init();
});
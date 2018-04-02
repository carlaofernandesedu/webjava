VOLUME = (function () {
    function init() {
        bindAll();
    }

    function bindAll() {
        bindBtnIncluir();
        bindBtnEditar();
        bindBtnSalvar();
        bindBtnExcluir();
        bindBtnCancelar();
        bindBtnLimpar();
        bindComboSolicitacao();
        carregarPaginacao();
        bindDataCriacao();
        bindBtnGerarPDF();
        bindBtnAbertura();
        bindComboFiltroUASolicitante();
    }

    function bindComboFiltroUASolicitante() {
        CONTROLES.DropDown.Preencher('#UnidadeAdministrativa', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativaRetornaTexto', null, true);
    }

    function bindBtnIncluir() {
        $("#form-volume .btn-incluir").off('click');
        $("#form-volume .btn-incluir").on('click', function () {
            var ultimaFolha = $("#ObterUltimoVolume").val();
                  
            if (ultimaFolha == undefined)
                ultimaFolha = 1;

            var novoVolume = parseInt(ultimaFolha) + parseInt(1);            

            $(".labelVolumeAnterior").text($(".labelVolumeAnterior").text().replace($('.labelVolumeAnterior').text(), 'Última folha do Volume ' + ultimaFolha));
            $(".labelUltimoVolume").text($(".labelUltimoVolume").text().replace($('.labelUltimoVolume').text(), 'Incluir Volume ' + novoVolume));

            limparCamposModal('#form-modal-volume-operacao');

            $("#operacao-modal-volume").modal();
        });
    }

    function bindBtnEditar() {
        $("#form-volume .btn-editar").off('click');
        $("#form-volume .btn-editar").on('click', function () {
            var ultimaFolha = parseInt($(this).data('nr_ultima_folha'));
            $(".labelVolumeAnterior").text($(".labelVolumeAnterior").text().replace($('.labelVolumeAnterior').text(), 'Última folha do Volume ' + ultimaFolha))
            $(".labelUltimoVolume").text($(".labelUltimoVolume").text().replace($('.labelUltimoVolume').text(), 'Alterar Volume ' + ultimaFolha))

            var idVolume = $(this).data('id');
            editar(idVolume, popularDocumentoMovimentacao);
            $("#operacao-modal-volume").modal();
        });
    }

    function bindBtnAbertura() {
        $("#form-volume .btn-folha-lider").off('click');
        $("#form-volume .btn-folha-lider").on('click', function () {
            var idVolume = $(this).data('id');
            window.open('/DocumentoVolume/GerarPDFFolhaLider?id=' + idVolume, '_blank');
        });
    }

    function bindBtnGerarPDF() {
        $("#form-volume .btn-gerar-pdf").off('click');
        $("#form-volume .btn-gerar-pdf").on('click', function () {
            var idVolume = $(this).data('id');
            var nrVolume = $(this).data('volume');

            if (nrVolume == '1') {
                BASE.Mensagem.Mostrar("Não existem termos para este volume", TipoMensagem.Alerta, "Alerta");
            } else {
                if (idVolume != '0' && idVolume != '') {
                    window.open('/DocumentoVolume/GerarPDFEncerramento?id=' + idVolume, '_blank');
                    window.open('/DocumentoVolume/GerarPDFAbertura?id=' + idVolume, '_blank');
                }
                else {
                    BASE.Mensagem.Mostrar("Erro ao executar termos", TipoMensagem.Error, "Erro");
                }
            }
        });
    }

    function bindBtnLimpar() {
        $("#form-modal-volume-operacao .btn-limpar").off('click');
        $("#form-modal-volume-operacao .btn-limpar").on('click', function () {
            var form = $("#form-modal-volume-operacao");
            limparCamposModal(form);
        });
    }

    function bindDataCriacao() {
        $('#DataAberturaVolume').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990"
        });
    }

    function editar(id, callback) {
        $.ajax({
            url: '/DocumentoVolume/EditarDocumentoVolume',
            data: { idDocumentoVolume: id },
            type: 'GET',
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {
                    if (callback !== undefined) callback(response, bloquearCampoData);
                }
            },
            error: function () {
            }
        });
    }

    function popularDocumentoMovimentacao(dados, callback) {
        $("#form-modal-volume-operacao #Codigo").val(dados.Codigo);
        $("#form-modal-volume-operacao #IdDocumento").val(dados.Codigo);
        $("#form-modal-volume-operacao #NrUltimaFolha").val(dados.NrUltimaFolha);
        $("#form-modal-volume-operacao #NrSolicitacaoProcedimento").val(dados.NrSolicitacaoProcedimento);
        $("#form-modal-volume-operacao #DataAberturaVolume").datetimepicker('update', dados.DataAberturaVolume);
        $("#form-modal-volume-operacao #NomeSolicitante").val(dados.NomeSolicitante);
        $("#form-modal-volume-operacao #UnidadeAdministrativa").val(dados.UnidadeAdministrativa);
        $("#form-modal-volume-operacao #Cargo").val(dados.Cargo);
        $("#form-modal-volume-operacao #CargoFuncionario").val(dados.CargoFuncionario);

        callback(dados.NrVolumeDocumento);
    }

    function bindComboSolicitacao() {
        CONTROLES.DropDown.PreencherSimples('#NrSolicitacaoProcedimento', 'SolicitacaoProcedimento', 'SelectSolicitacaoProcedimentoList', '--Selecione--', null);
    }

    function bindBtnSalvar() {
        $("#btn-confirmar").off('click');
        $("#btn-confirmar").on('click', function () {
            $("#btn-confirmar").prop('disabled', true);

            var form = $("#form-modal-volume-operacao"),
                idDocumento = $("#IdDocumento").val();

            salvarAtualizarVolume(form, idDocumento);
            $("#btn-confirmar").prop('disabled', false);
        });
    }

    function bindBtnCancelar() {
        $("#form-modal-volume-operacao .btn-cancelar").off('click');
        $("#form-modal-volume-operacao .btn-cancelar").on('click', function () {
            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
                'small',
                'Sim',
                'btn-primary',
                'Não',
                'btn-danger',
                null,
                function () {
                    limparCamposModal($("#form-modal-volume-operacao"));
                    ocultarModal();
                });
        });
    }

    function bindBtnExcluir() {
        $(".btn-excluir").off('click');
        $(".btn-excluir").on('click', function () {
            var idDocumento = $("#IdDocumento").val();

            BASE.Modal.ExibirModalConfirmacao(
                'Excluir Volume', 'Deseja mesmo excluir o volume?',
                'small',
                '<i class="fa fa-close margR5"></i>Cancelar',
                'btn-primary',
                '<i class="fa fa-trash margR5"></i>Excluir',
                'btn-danger',
                function () {
                    excluirVolume(idDocumento, "#form-modal-volume-operacao");
                },
                null);
        });
    }

    function excluirVolume(id, form) {
        var documentoVolume = $(form).serializeObject();
        documentoVolume.IdDocumento = id;

        $.ajax({
            url: '/DocumentoVolume/ExcluirDocumentoVolume',
            data: { vmodel: documentoVolume },
            type: 'POST',
            cache: false,
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else {
                    REGISTRARPROCESSO.AbreFrame(6);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao excluir Documento Movimentação");
            }
        });
    }

    function salvarAtualizarVolume(form, idDocumento) {
        var valido = REGISTRARPROCESSO.ValidarForm(form);

        if (valido) {
            var documentoVolume = form.serializeObject();
            documentoVolume.IdDocumento = idDocumento;

            if (documentoVolume.Codigo === "0" || documentoVolume.Codigo === "" || documentoVolume.Codigo === null) {
                salvarDocumetoVolume(documentoVolume);
            }
            else {
                atualizarDocumetoVolume(documentoVolume);
            }

            ocultarModal();
        } else {
            BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
            form.validate();
        }
    }

    function salvarDocumetoVolume(documentoVolume) {
        $.ajax({
            url: "/DocumentoVolume/SalvarDocumentoVolume/",
            type: "POST",
            data: { vmodel: documentoVolume },
            cache: false,
            success: function (data, status, xhr) {
                if (data.MensagensCriticas !== null && data.MensagensCriticas !== undefined && data.MensagensCriticas.length > 0) {
                    REGISTRARPROCESSO.MostrarMensagensAlerta(data);
                }
                else {
                    if (data._objeto !== '' && data._objeto !== null & data._objeto !== undefined) {
                        if (data._objeto.CodigoPdfEncerramento > 0 && data._objeto.CodigoPdfAbertura > 0) {
                            window.open('/DocumentoVolume/GerarPDFEncerramento?id=' + data._objeto.CodigoPdfAbertura, '_blank');
                            window.open('/DocumentoVolume/GerarPDFAbertura?id=' + data._objeto.CodigoPdfAbertura, '_blank');
                            window.open('/DocumentoVolume/GerarPDFFolhaLider?id=' + data._objeto.CodigoPdfAbertura, '_blank');
                        }
                    }

                    posSalvarAlterar();
                    REGISTRARPROCESSO.AbreFrame(6);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao salvar a volume");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function renderHtml(view) {
        $('#div-lista-documento-volume').html(view);
    }

    function atualizarDocumetoVolume(documentoVolume) {
        $.ajax({
            url: "/DocumentoVolume/AtualizarDocumentoVolume/",
            type: "POST",
            data: { vmodel: documentoVolume },
            cache: false,
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                }
                else {
                    posSalvarAlterar();
                    REGISTRARPROCESSO.AbreFrame(6);
                    BASE.Mensagem.Mostrar("Registro alterado com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao salvar a volume");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function carregarPaginacao() {
        $('#table-documento-volume').dataTable({
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

    function limparCamposModal(form) {
        $(form)[0].reset();

        bloquearCampoData(null);
    }

    function posSalvarAlterar() {
        bindAll();
        ocultarModal();
    }

    function ocultarModal() {
        $("#operacao-modal-volume").modal("hide");
    }

    function bloquearCampoData(nrVolume) {
        if (nrVolume !== null && nrVolume !== undefined && nrVolume === 1)
            $('#DataAberturaVolume').prop('disabled', true);
        else {
            $('#DataAberturaVolume').prop('disabled', false);
        }
    }

    $.fn.serializeObject = function () {
        var o = {};

        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') == 'hidden') {
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
    VOLUME.Init();
});
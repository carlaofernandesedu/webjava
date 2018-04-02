MOVIMENTACAO = (function () {

    var form = $("#form-documento-movimentacao");

    function init() {
        bindAll();
        carregarListaMotivo();
        carregarPaginacao();
    }

    function bindAll() {
        bindDataCriacao();

        bindBtnIncluir();
        bindBtnEditar();
        bindBtnExcluir();

        bindModalBtnCancelar();
        bindModalBtnLimpar();
        bindModalBtnConfirmar();
        bindModalChangeTipoMovimento();
    }

    function bindDataCriacao() {
        $('#form-documento-movimentacao #DataMovimentacao').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });
    }

    function bindBtnIncluir() {
        $("#index-movimentacao #btn-incluir").off('click');
        $("#index-movimentacao #btn-incluir").on('click', function () {

            limparCamposModal();
            $("#form-documento-movimentacao #DataMovimentacao").datetimepicker('update', new Date());
            $('#incluirMovimentacao').modal();
        });
    }

    function bindBtnEditar() {
        $("#index-movimentacao .btn-editar").off('click');
        $("#index-movimentacao .btn-editar").on('click', function () {
            var idMovimentacao = $(this).data('id');
            editar(idMovimentacao, popularDocumentoMovimentacao);
            tituloModalMovimantacao(TipoaAcao.Alteracao);
            $("#incluirMovimentacao").modal();
        });
    }

    function tituloModalMovimantacao(acao) {
        switch (acao) {
            case 1:
                $("#incluirMovimentacao-label").text("Incluir Movimentação");
                break;
            case 2:
                $("#incluirMovimentacao-label").text("Alterar Movimentação");
                break;
        }
    }

    function bindBtnExcluir() {
        $("#index-movimentacao  .btn-excluir").off('click');
        $("#index-movimentacao  .btn-excluir").on('click', function () {

            var idMovimentacao = $(this).data('id'),
                movimentoManual = $(this).data('movimento-manual'),
                idDocumento = $(this).data('id-documento'),
                idMovimento = $(this).data('id-movimento');

            BASE.Modal.ExibirModalConfirmacao(
                'Excluir Movimentação', 'Deseja mesmo excluir a movimentação?',
                'small',
                '<i class="fa fa-close margR5"></i>Cancelar',
                'btn-primary',
                '<i class="fa fa-trash margR5"></i>Excluir',
                'btn-danger',
                function () {
                    excluirMovimentacao(idMovimentacao, movimentoManual, idDocumento, idMovimento, form);
                },
                null);
        });
    }

    function bindModalBtnCancelar() {
        $("#form-documento-movimentacao #btn-cancelar").off('click');
        $("#form-documento-movimentacao #btn-cancelar").on('click', function () {

            BASE.Modal.ExibirModalConfirmacao(
               'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
               'small',
               'Não',
               'btn-primary',
               'Sim',
               'btn-danger',
               function () {
                   ocultarModal();
               },
               null);
        });
    }

    function bindModalBtnLimpar() {
        $("#form-documento-movimentacao #btn-limpar").off('click');
        $("#form-documento-movimentacao #btn-limpar").on('click', function () {

        });
    }

    function bindModalBtnConfirmar() {
        $("#form-documento-movimentacao #btn-confirmar").off('click');
        $("#form-documento-movimentacao #btn-confirmar").on('click', function (e) {
            e.preventDefault();        

            var valido = REGISTRARPROCESSO.ValidarForm(form);

            if (valido) {
                var documentoMovimentacao = form.serializeObject();
                documentoMovimentacao.IdDocumento = $("#IdDocumento").val();

                if (documentoMovimentacao.Codigo === "0" || documentoMovimentacao.Codigo === "" || documentoMovimentacao.Codigo === null)
                    salvarMovimentacao(documentoMovimentacao, $(this));
                else
                    atualizarMovimentacao(documentoMovimentacao);

            } else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }

            $("#form-documento-movimentacao #btn-confirmar").prop('disabled', false);
        });
    }

    function bindModalChangeTipoMovimento() {
        $('#IdMovimento').off('change');
        $('#IdMovimento').on('change', function () {

            var idMovimento = $(this).val();

            $.ajax({
                url: '/DocumentoMovimentacao/ObterMotivoPorId',
                type: 'GET',
                data: { idMovimento: idMovimento },
                cache: false,
                success: function (response, status, xhr) {
                    popularCampoDescricaoMovimento(response.Movimento);
                },
                error: function () {
                    console.log('Erro ao carregar movimento');
                }
            });
        });
    }

    function carregarPaginacao() {
        $('#table-documento-movimentacao').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "autoWidth": false,
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
            "order": [[0, "desc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function carregarListaMotivo() {

        $.ajax({
            url: "/DocumentoMovimentacao/ListarMotivo",
            type: "GET",
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {

                    $("#IdMovimento").empty();
                    $("#IdMovimento").append($("<option value='null'>Selecione</option>"));

                    $.each(response.ListaMotivo, function (index, value) {
                        $("#IdMovimento").append($("<option value='" + value.Codigo + "'>" + value.NomeMovimento + "</option>"));
                    });
                }
            },
            error: function () {
                console.log("Erro ao carregar lista de movimento");
            }
        });

    }

    function editar(id, callback) {
        $.ajax({
            url: '/DocumentoMovimentacao/EditarDocumentoMovimentacao',
            data: { idDocumentoMovimentacao: id },
            type: 'GET',
            cache: false,
            success: function (response, status, xhr) {

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {
                    if (callback !== undefined) callback(response);
                }
            },
            error: function () {

            }
        });
        //$('#incluirMovimentacao').modal('show');
        console.log(id);
    }

    function salvarMovimentacao(documentoMovimentacao, btn) {

        if (btn.data('requestRunning')) {
            return;
        }

        btn.data('requestRunning', true);

        $.ajax({
            url: '/DocumentoMovimentacao/SalvarDocumentoMovimentacao',
            type: 'POST',
            data: { vmodel: documentoMovimentacao },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    posSalvarAlterar();
                    REGISTRARPROCESSO.AbreFrame(5);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao salvar Documento Movimentação");
            },
            complete: function () {
                btn.data('requestRunning', false);
            }
        });
    }

    function atualizarMovimentacao(documentoMovimentacao) {
        $.ajax({
            url: '/DocumentoMovimentacao/AtualizarDocumentoMovimentacao',
            type: 'POST',
            data: { vmodel: documentoMovimentacao },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    posSalvarAlterar();
                    REGISTRARPROCESSO.AbreFrame(5);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao atualizar Documento Movimentação");
            }
        });
    }

    function excluirMovimentacao(id, movimentoManual, idDocumento, idMovimento, form) {

        var documentoMovimentacao = $(form).serializeObject();

        documentoMovimentacao.Codigo = id;
        documentoMovimentacao.MovimentacaoManual = movimentoManual;
        documentoMovimentacao.IdDocumento = idDocumento;
        documentoMovimentacao.IdMovimento = idMovimento;

        $.ajax({
            url: '/DocumentoMovimentacao/ExcluirDocumentoMovimentacao',
            data: { vmodel: documentoMovimentacao },
            type: 'POST',
            cache: false,
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    REGISTRARPROCESSO.AbreFrame(5);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao excluir Documento Movimentação");
            }
        });
    }

    function popularDocumentoMovimentacao(dados) {

        $("#form-documento-movimentacao #Codigo").val(dados.Codigo);
        $("#form-documento-movimentacao #DataMovimentacao").datetimepicker('update', new Date(dados.DataMovimentacao));
        $("#form-documento-movimentacao #IdMovimento").val(dados.IdMovimento);
        $("#form-documento-movimentacao #DescricaoMovimentacao").val(dados.DescricaoMovimentacao);
        $("#form-documento-movimentacao #MovimentacaoManual").val(dados.MovimentacaoManual);
    }

    function popularCampoDescricaoMovimento(movimento) {
        $('#DescricaoMovimentacao').val(movimento.DescricaoMovimento);
    }

    function posSalvarAlterar() {
        bindAll();
        ocultarModal();
        limparCamposModal();
    }

    function ocultarModal() {
        $('#incluirMovimentacao').modal("hide");
    }

    function limparCamposModal() {

        var elementos = $("#form-documento-movimentacao input,select#IdMovimento,textarea");

        $.each(elementos, function (key, value) {
            if ($(value).is('select')) {
                $('#' + value.id).val('null');
            }
            else {
                $(value).val("");
            }
        });

        $('#form-documento-movimentacao').resetValidation();

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
    MOVIMENTACAO.Init();
});

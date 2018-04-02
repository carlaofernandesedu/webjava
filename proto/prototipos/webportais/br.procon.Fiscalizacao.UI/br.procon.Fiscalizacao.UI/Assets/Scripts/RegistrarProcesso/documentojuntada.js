var TipoaAcao = {
    Inclusao: 1,
    Alteracao: 2
}

DOCUMENTOJUNTADA = (function () {
    var validate = null;

    function init() {
        bindAll();
        carregarPaginacao();
        carregarListaVolume();
    }

    function bindAll() {
        bindDataCriacao();

        bindBtnIncluir();
        bindBtnEditar();
        bindBtnExcluir();

        //Modal documentoJuntada
        bindCloseModal();
        bindModalBtnConfirmar();
        bindModalBtnLimpar();
        bindModalBtnCancelar();
        bindMascara();
    }

    function bindDataCriacao() {
        $('#form-modal-juntada #DataJuntada').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });
    }

    function bindMascara() {
        $("#form-modal-juntada #DataJuntada").mask("99/99/9999");
        $("#NrFolhaInicial").mask('00000', { placeholder: '00000' });
        $("#NrFolhaFinal").mask('00000', { placeholder: '00000' });
    }

    function bindBtnIncluir() {
        $("#form-juntada #btn-incluir").off('click');
        $("#form-juntada #btn-incluir").on('click', function () {
            console.log("btn-incluir");
            limparCamposModal();
            $("#form-modal-juntada #DataJuntada").datetimepicker('update', new Date());
            tituloDocumentoJuntada(TipoaAcao.Inclusao);
            $("#modalIncluirJuntada").modal();
        });
    }

    function bindBtnEditar() {
        $("#form-juntada .btn-editar").off('click');
        $("#form-juntada .btn-editar").on('click', function () {
            
            console.log("editando jundata");

            var idDocumentoJuntada = $(this).data('id');
            editarJuntada(idDocumentoJuntada, popularJuntada);
            tituloDocumentoJuntada(TipoaAcao.Alteracao);
            $("#modalIncluirJuntada").modal();
        });
    }

    function bindBtnExcluir() {
        $("#form-juntada .btn-excluir").off('click');
        $("#form-juntada .btn-excluir").on('click', function () {
            console.log("excluindo juntada");
            var form = $("#form-modal-juntada"),
                idDocumentoJuntada = $(this).data('id'),
                descricaoJuntada = $(this).data('descricao'),
                idDocumento = $("#IdDocumento").val();

            BASE.Modal.ExibirModalConfirmacao(
                'Excluir Juntada', 'Deseja mesmo excluir a Juntada?',
                'small',
                '<i class="fa fa-close margR5"></i>Cancelar',
                'btn-primary',
                '<i class="fa fa-trash margR5"></i>Excluir',
                'btn-danger',
                function () {
                    excluirJuntada(form, idDocumentoJuntada, descricaoJuntada, idDocumento);
                },
                null);
        });
    }

    function bindModalBtnConfirmar() {
        $("#modalIncluirJuntada #btn-confirmar").off('click');
        $("#modalIncluirJuntada #btn-confirmar").on('click', function (e) {
            e.preventDefault();

            var form = $("#form-modal-juntada"),
                idDocumento = $("#IdDocumento").val();

            salvarAtualizarJuntada(form, idDocumento, $(this));
        });
    }

    function bindModalBtnLimpar() {
        $("#modalIncluirJuntada #btn-limpar").off('click');
        $("#modalIncluirJuntada #btn-limpar").on('click', function () {
            console.log("btn-limpar");
            limparCamposModal();
        });
    }

    function bindModalBtnCancelar() {
        $("#modalIncluirJuntada #btn-cancelar").off('click');
        $("#modalIncluirJuntada #btn-cancelar").on('click', function () {
            console.log("btnCancelar");

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

    function bindCloseModal() {
        $(document).off('hidden.bs.modal', '#modalIncluirJuntada');
        $(document).on('hidden.bs.modal', '#modalIncluirJuntada', function () {
            console.log("fechando o modal incluir juntada");

            if (validate !== null)
                $('#form-modal-juntada').resetValidation();
        });
    }

    function carregarPaginacao() {
        $('#table-documento-juntada').dataTable({
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

    function carregarListaVolume() {
        var idDocumento = $("#IdDocumento").val();

        $.ajax({
            url: '/DocumentoJuntada/BuscarListaVolume',
            type: 'POST',
            data: { idDocumento: idDocumento },
            success: function (data) {
                $("#IdDocumentoVolume").empty();
                $("#IdDocumentoVolume").append($("<option value='null'>Selecione</option>"));

                $.each(data.listaVolume, function (index, value) {
                    $("#IdDocumentoVolume").append($("<option value='" + value.Codigo + "'>" + value.NrVolumeDocumento + "</option>"));
                });
            }
        });
    }

    function salvarAtualizarJuntada(form, idDocumento, btn) {
        var valido = REGISTRARPROCESSO.ValidarForm(form);

        if (valido) {
            var documentoJuntada = form.serializeObject();
            documentoJuntada.IdDocumento = idDocumento;

            if (documentoJuntada.Codigo === "0" || documentoJuntada.Codigo === "" || documentoJuntada.Codigo === null)
                salvarDocumetoJuntada(documentoJuntada, btn);
            else
                atualizarDocumentoJuntada(documentoJuntada);
        } else {
            BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
            validate = form.validate();
        }
    }

    function salvarDocumetoJuntada(documentoJuntada, btn) {
        if (btn.data('requestRunning')) {
            return;
        }

        btn.data('requestRunning', true);

        $.ajax({
            url: "/DocumentoJuntada/SalvarJuntada/",
            type: "POST",
            data: { vmodel: documentoJuntada },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao salvar juntada", TipoMensagem.Error, "Erro");

                else {
                    posSalvarAlterar();
                    REGISTRARPROCESSO.AbreFrame(4);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao salvar a juntada");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            },
            complete: function () {
                btn.data('requestRunning', false);
            }
        });
    }

    function atualizarDocumentoJuntada(documentoJuntada) {
        $.ajax({
            url: "/DocumentoJuntada/AtualizarJuntada/",
            type: "POST",
            data: { vmodel: documentoJuntada },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao atualizar juntada", TipoMensagem.Error, "Erro");

                else {
                    posSalvarAlterar();
                    REGISTRARPROCESSO.AbreFrame(4);
                    BASE.Mensagem.Mostrar("Registro atualizado com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao alterar a juntada");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function editarJuntada(idDocumentoJuntada, callback) {
        $.ajax({
            url: "/DocumentoJuntada/EditarJuntada/",
            type: "POST",
            data: { idDocumentoJuntada: idDocumentoJuntada },
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
    }

    function excluirJuntada(form, idDocumentoJuntada, descricaoJuntada, idDocumento) {
        var documentoJuntada = form.serializeObject();
        documentoJuntada.Codigo = idDocumentoJuntada;
        documentoJuntada.DescricaoJuntada = descricaoJuntada;
        documentoJuntada.IdDocumento = idDocumento;

        $.ajax({
            url: "/DocumentoJuntada/ExcluirJuntada/",
            type: "POST",
            data: { vmodel: documentoJuntada },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao excluir juntada", TipoMensagem.Error, "Erro");

                else {
                    REGISTRARPROCESSO.AbreFrame(4);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao excluir a juntada");
            }
        });
    }

    function popularJuntada(dados) {
        $("#form-modal-juntada #Codigo").val(dados.Codigo);
        $("#form-modal-juntada #DataJuntada").datetimepicker('update', new Date(dados.DataJuntada));
        $("#form-modal-juntada #DescricaoJuntada").val(dados.DescricaoJuntada);
        $("#form-modal-juntada #IdDocumento").val(dados.IdDocumento);
        $("#form-modal-juntada #IdDocumentoVolume").val(dados.IdDocumentoVolume);
        $("#form-modal-juntada #IdUsuarioAlteracao").val(dados.IdUsuarioAlteracao);
        $("#form-modal-juntada #NrFolhaInicial").val(dados.NrFolhaInicial);
        $("#form-modal-juntada #NrFolhaFinal").val(dados.NrFolhaFinal);
    }

    function posSalvarAlterar() {
        bindAll();
        ocultarModal();
        limparCamposModal();
        desabilitarBotaoSalvar(false);
    }

    function limparCamposModal() {
        var elementos = $("#form-modal-juntada input, select");

        $.each(elementos, function (key, value) {
            if ($(value).is('select')) {
                $(value).val('null');
            }
            else {
                $(value).val("");
            }
        });

        $('#form-modal-juntada').resetValidation();
    }

    function ocultarModal() {
        $("#modalIncluirJuntada").modal("hide");
    }

    function desabilitarBotaoSalvar(desabilitar) {
        $("#form-modal-juntada #btn-confirmar").prop("disabled", desabilitar);
    }

    function monstrarMensagens(response) {
        $.each(response.MensagensCriticas, function (index, value) {
            BASE.Mensagem.Mostrar(value.Descricao, TipoMensagem.Alerta, value.Titulo);
        });
    }

    function tituloDocumentoJuntada(acao) {
        switch (acao) {
            case 1:
                $("#tituloDocumentoJuntada").text("Incluir Juntada");
                break;
            case 2:
                $("#tituloDocumentoJuntada").text("Alterar Juntada");
                break;
        }
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
        },
        Validate: function () { return validate }
    }
}());

$(function () {
    DOCUMENTOJUNTADA.Init();
});
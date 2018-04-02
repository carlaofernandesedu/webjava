APENSAMENTO = (function () {

    var formFiltro = '#form-documento-apensamento-filtro',
        formDocumentoApensamento = "#form-documento-apensamento",
        divConteudoDocumentoApensamento = '#conteudo-documento-apensamento',
        idDocumento = $('#IdDocumento').val(),
        id_processo_apensar = undefined;

    function init() {
        bindAll();
        carregarPaginacao();
        carregarCombo();
    }

    function bindAll() {
        bindBtnIncluir();
        bindBtnEditar();
        bindBtnExcluir();
        bindBtnDesapensar();
        bindBtnModalPesquisar();
        bindBtnModalLimpar();
        bindBtnModalCancelar();
        bindMascara();
    }

    function bindBtnIncluir() {
        $('#index-apensamento .btn-incluir').off('click');
        $('#index-apensamento .btn-incluir').on('click', function () {
            
            exibirModalDocumentoApensar("Incluir Apensamento", "Processo Apensado", function () {
                escondeConteudoModal();
                exibeConteudoFiltro();
                limparFiltroModal();
                limparCamposModal();
                exibirCampoApensar(true);
                exibirCampoInsercao(true);
            });
        });
    }

    function bindBtnEditar() {
        $('.btn-editar').off('click');
        $('.btn-editar').on('click', function () {
            console.log("executando edição de apensamento");

            $(formDocumentoApensamento + " #Codigo").val($(this).data('id'));
            id_processo_apensar = $(this).data('id');

            var objFiltro = {
                NrProtocoloFormatado: $(this).data('protocolo'),
                NrProcessoFormatado: $(this).data('processo')
            }

            exibirModalDocumentoApensar("Editar Apensamento", "Processo Apensado", function () {
                limparFiltroModal();
                limparCamposModal();
                escondeConteudoFiltro();
                exibeConteudoModal();
                exibirCampoApensar(true);
                exibirCampoInsercao(false);
            });
            filtraDocumento(objFiltro);
        });
    }

    function bindBtnExcluir() {
        $('.btn-excluir').off('click');
        $('.btn-excluir').on('click', function () {

            var id = $('#index-apensamento .btn-excluir').data('id');
            var processo = $('#index-apensamento .btn-excluir').data('processo');
            var processoApensar = $('#index-apensamento .btn-excluir').data('apensamento');

            $(formDocumentoApensamento + " #Codigo").val(id);
            $(formDocumentoApensamento + " #CodigoProcesso").val(processo);
            $(formDocumentoApensamento + " #CodigoProcessoApensar").val(processoApensar);

            BASE.Modal.ExibirModalConfirmacao(
                'Excluir Incorporação', 'Deseja mesmo excluir o apensamento ?',
                'small',
                '<i class="fa fa-close margR5"></i>Cancelar',
                'btn-primary',
                '<i class="fa fa-trash margR5"></i>Excluir',
                'btn-danger',
                function () {
                    excluirDocumentoApensamento(id);
                },
                null);

        });
    }

    function bindBtnDesapensar() {
        $('.btn-desapensar').off('click');
        $('.btn-desapensar').on('click', function () {

            var objFiltro = {
                NrProtocoloFormatado: $(this).data('protocolo'),
                NrProcessoFormatado: $(this).data('processo')
            }

            var campoApensar = $(this).data('verificar') === "True" ? true : false;
            $(formDocumentoApensamento + " #Codigo").val($(this).data('id'));

            exibirModalDocumentoApensar("Incluir Desapensamento", "Processo Desapensado", function () {
                limparFiltroModal();
                limparCamposModal();
                escondeConteudoFiltro();
                exibeConteudoModal();
                exibirCampoApensar(false);
                exibirCampoInsercao(false);
            });

            filtraDocumento(objFiltro);
        });
    }

    function bindBtnModalPesquisar() {
        $(formFiltro + ' #btn-pesquisar').off('click');
        $(formFiltro + ' #btn-pesquisar').on('click', function () {
            
            filtraDocumento(criarObjetoFiltro($("#form-documento-apensamento-filtro").serializeObject()));
        });
    }

    function bindBtnModalSalvar() {

        $(formDocumentoApensamento + ' #btn-salvar').off('click');
        $(formDocumentoApensamento + ' #btn-salvar').on('click', function () {
            
            $(formDocumentoApensamento + ' #btn-salvar').prop('disabled', true);
            $(formDocumentoApensamento).removeData("validator");            

            var form = $(formDocumentoApensamento);
            var valido = REGISTRARPROCESSO.ValidarForm(form);

            if (valido) {
                var documentoApensamento = form.serializeObject();

                if (documentoApensamento.Codigo === "0" || documentoApensamento.Codigo === "" || documentoApensamento.Codigo === null)
                    salvarDocumentoApensamento(documentoApensamento);
                else
                    atualizarDocumentoApensamento(documentoApensamento);

            } else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }

            $(formDocumentoApensamento + ' #btn-salvar').prop('disabled', false);
        });
    }

    function filtraDocumento(objeto) {

        objeto.IdDocumento = $('#IdDocumento').val();
        if (objeto.NrProcessoFormatado !== "" || objeto.NrProtocoloFormatado !== "") {

            console.log('filtro');

            $.ajax({
                url: '/DocumentoApensar/FiltrarDocumento',
                type: 'POST',
                data: { filtro: objeto },
                cache: false,
                success: function (response, status, xhr) {

                    if (response.retorno === "" || response.retorno === null || response.retorno.CodigoProcessoApensar === 0) {

                        limparCamposModal();
                        escondeConteudoModal();
                        
                        if (response.retorno.CodigoProcessoApensar === 0) 
                            return BASE.Mensagem.Mostrar("Documento não está autuado", TipoMensagem.Alerta, "Alerta");
                         else 
                            return BASE.Mensagem.Mostrar("Documento não encontrado", TipoMensagem.Alerta, "Alerta");

                    }                   

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        posCarregar(response.retorno, idDocumento);
                    }
                    return false;
                },
                error: function (e) {

                    console.log(e);
                }
            });

        } else {
            BASE.Mensagem.Mostrar("Informe o Número de Processo ou Número de Protocolo", TipoMensagem.Alerta, "Alerta");
        }
    }

    function salvarDocumentoApensamento(documentoApensamento) {

        $.ajax({
            url: '/DocumentoApensar/SalvarDocumentoApensamento',
            type: 'POST',
            data: { vmodel: documentoApensamento },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    if (response._objeto.Codigo > 0)
                        window.open('/DocumentoApensar/GerarPDFApensamento?id=' + response._objeto.Codigo, '_blank');

                    escondeModal();
                    REGISTRARPROCESSO.AbreFrame(7);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    bindBtnPosCarregar();
                }
            },
            error: function () {
                console.log("Erro ao salvar Documento Incorporado");
            }
        });
    }

    function atualizarDocumentoApensamento(documentoApensamento) {
        $.ajax({
            url: '/DocumentoApensar/AtualizarDocumentoApensamento',
            type: 'POST',
            data: { vmodel: documentoApensamento },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {

                    if (response._objeto.Codigo > 0)
                        window.open('/DocumentoApensar/GerarPDFDesapensamento?id=' + response._objeto.Codigo, '_blank');

                    escondeModal();
                    REGISTRARPROCESSO.AbreFrame(7);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    bindBtnPosCarregar();
                }
            },
            error: function () {
                console.log("Erro ao atualizar Documento Incorporado");
            }
        });
    }

    function excluirDocumentoApensamento(id) {

        var form = $(formDocumentoApensamento);
        var documentoApensamento = $(form).serializeObject();
        documentoApensamento.Codigo = id;

        $.ajax({
            url: '/DocumentoApensar/ExcluirDocumentoApensamento',
            data: { vmodel: documentoApensamento },
            type: 'POST',
            cache: false,
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                else {
                    REGISTRARPROCESSO.AbreFrame(7);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("Erro ao excluir processo apensado");
            }
        });
    }

    function exibirCampoInsercao(valor) {
        switch (valor) {
            case false:
                $(".container-campos-insercao").hide();
                $("#NomeSolicitante").hide();
                $("#UnidadeAdministrativa").hide();
                $("#Cargo").hide();
                break;
            default:
                $(".container-campos-insercao").show();
                $("#NomeSolicitante").show();
                $("#UnidadeAdministrativa").show();
                $("#Cargo").show();
                $("#form-documento-apensamento #Codigo").val("");
                break;
        }
    }

    function exibirCampoApensar(valor) {
        switch (valor) {
            case true:
                $("#container-data-apensamento").show();
                $("#container-data-desapensamento").hide();
                break;
            case false:
                $("#container-data-apensamento").hide();
                $("#container-data-desapensamento").show();
                break;
        }
    }

    function carregarCombo() {
        CONTROLES.DropDown.Preencher('#UnidadeAdministrativa', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function exibirModalDocumentoApensar(tituloModal, tituloContainer, callback) {
        $('#modalDocumentoApensar').modal('show');

        $(".titulo-modal").text(tituloModal);
        $(".titulo-container").text(tituloContainer);

        if (callback != undefined)
            callback();
    }

    function escondeModal() {
        $('#modalDocumentoApensar').modal('hide');
    }

    function exibeConteudoModal() {
        $("#modalDocumentoApensar " + divConteudoDocumentoApensamento).collapse('show');
    }

    function exibeConteudoFiltro() {
        $(formFiltro).show();
    }

    function escondeConteudoFiltro() {
        $(formFiltro).hide();
    }

    function escondeConteudoModal() {
        $("#modalDocumentoApensar " + divConteudoDocumentoApensamento).collapse('hide');
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

    function carregarPaginacao() {
        $('#table-documento-apensar').dataTable({
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
            "aoColumns": [
             { "sWidth": "10%" },
             { "sWidth": "55%" },
             { "sWidth": "10%" },
             { "sWidth": "10%" },
             { "sWidth": "15%" },
            ],
        });
    }

    function posCarregar(response) {
        popularDadosDocumentoApensamento(response);
        exibeConteudoModal();
        bindBtnPosCarregar();
    }

    function popularDadosDocumentoApensamento(parameters) {

        $(formDocumentoApensamento + ' #NrProcesso').text(parameters.NrProcesso);
        $(formDocumentoApensamento + ' #NrProtocolo').text(parameters.NrProtocolo);
        $(formDocumentoApensamento + ' #DescricaoSerieDocumental').text(parameters.DescricaoSerieDocumental);
        $(formDocumentoApensamento + ' #CodigoDocumento').val(idDocumento);
        $(formDocumentoApensamento + ' #CodigoProcesso').val(parameters.CodigoProcesso);
        $(formDocumentoApensamento + ' #CodigoProcessoApensar').val(parameters.CodigoProcessoApensar);
        $(formDocumentoApensamento + ' #DataApensamento').mask('00/00/0000', { placeholder: '__/__/____' }).attr('maxlength', '10');
        $(formDocumentoApensamento + ' #NomeInteressado').text(parameters.NomeInteressado);
        $(formDocumentoApensamento + ' #Assunto').text(parameters.Assunto);
    }

    function bindDataApensamento() {
        $(formDocumentoApensamento + " #DataApensamento").datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: "pt-BR",
            autoclose: true,
            startDate: "01/01/1990",
            endDate: new Date()
        });
    }

    function bindDataDesapensamento() {
        $(formDocumentoApensamento + " #DataDesapensamento").datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: "pt-BR",
            autoclose: true,
            startDate: "01/01/1990",
            endDate: new Date()
        });
    }

    function bindBtnModalLimpar() {

        $('#form-documento-apensamento #btn-limpar').off('click');
        $('#form-documento-apensamento #btn-limpar').on('click', function () {
            limparCamposModal();
        });

    }

    function bindBtnModalCancelar() {
        $("#form-documento-apensamento #btn-cancelar").off('click');
        $("#form-documento-apensamento #btn-cancelar").on('click', function () {

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
                    escondeModal();
                });
        });
    }

    function bindBtnPosCarregar() {
        bindBtnModalCancelar();
        bindBtnModalLimpar();
        bindBtnModalSalvar();
        bindDataApensamento();
        bindDataDesapensamento();
    }

    function bindMascara() {
        $(formFiltro + ' #NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $(formFiltro + ' #NrProcessoFormatado').mask('000000/0000.0', { reverse: true, placeholder: '______/____._' }).attr('maxlength', '13');

        $(formFiltro + ' #NrProtocoloFormatado').change(function () {
            $(formFiltro + ' #NrProtocoloFormatado').val(REGISTRARPROCESSO.AdicionarQtdCaracterAEsquerda($(formFiltro + ' #NrProtocoloFormatado').val(), 11, 0));
        });

        $(formFiltro + ' #NrProcessoFormatado').change(function () {
            $(formFiltro + ' #NrProcessoFormatado').val(REGISTRARPROCESSO.AdicionarQtdCaracterAEsquerda($(formFiltro + ' #NrProcessoFormatado').val(), 13, 0));
        });
    }

    function limparCamposModal() {

        var elementos = $(formFiltro + " input,select#IdVolume,textarea");

        $.each(elementos, function (key, value) {
            if ($(value).is('select')) {
                $('#' + value.id).val('null');
            }
            else {
                $(value).val("");
            }
        });
        $("#form-documento-incorporacao").resetValidation();

        $("#form-documento-apensamento #NrProcesso").text("");
        $("#form-documento-apensamento #NrProtocolo").text("");
        $("#form-documento-apensamento #DescricaoSerieDocumental").text("");

        $(formDocumentoApensamento)[0].reset();
    }

    function criarObjetoFiltro(obj) {
        var novoObjeto = {};

        if (jQuery.type(obj) === "object") {
            for (key in obj) {
                novoObjeto[key] = obj[key];
            }
        }
        return novoObjeto;
    }

    return {
        Init: function () {
            init();
        }
    }

}());

$(function () {
    APENSAMENTO.Init();
});
var TipoSolicitacaoProcedimento = {
    SolicitacaoProcedimentoPrimario: 1,
    SolicitacaoProcedimentoSecundario: 2
};

var SituacaoSolicitacaoProcedimento = {
    Aberta: 1,
    Atendida: 2,
    Cancelada: 3
}

var TipoaAcao = {
    Inclusao: 1,
    Alteracao: 2
}

SOLICITACAOPROCEDIMENTO = (function () {

    var filtro = '#filtro-solicitacao-procedimento',
        solicitacaoProcedimento = '#form-solicitacao-procedimento';

    function init() {
        bindAll();
    }

    function bindAll() {
        bindMascara();
        bindModalFiltroChange();
        bindModalNrProtocoloPrimarioChange();
        bindModalNrProcessoPrimarioChange();
        bindModalNrProtocoloSecundarioChange();
        bindModalNrProcessoSecundarioChange();
        bindData();
        bindControleBotao();
        bindMontarPesquisaDocumento();
        bindDetalharSolicitacao();
        carregarPaginacao();
        carregarCombo();
        setarSituacaoFiltro();
    }

    function bindControleBotao() {
        bindModalNrProtocoloChange();
        bindBtnFiltrarSolicitacao();
        bindBtnIncluirSolicitacao();
        bindBtnAtenderSolicitacao();
        bindBtnCancelarSolicitacao();
        //bindBtnEditarSolicitacao();
        bindBtnModalPesquisarDocumento();
        bindBtnModalPesquisarDocumentoSecundario();
        bindModalBtnCancelar();
        bindBtnModalLimpar();
        bindBtnModalSalvar();
    }

    function bindMascara() {
        bindMascaraFiltro();
        bindMascaraModalDocumentoPrimario();
        bindMascaraModalDocumentoSecundario();
    }

    function bindModalNrProtocoloChange() {
        $("#NrProtocoloFormatado").mask("000000/0000", { reverse: true, placeholder: "______/____" }).attr("maxlength", "11");
        $('#NrProtocoloFormatado').change(function () {
            $('#NrProtocoloFormatado').val(BASE.AdicionarQtdCaracterAEsquerda($('#NrProtocoloFormatado').val(), 11, 0));
            if ($('#NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $('#NrProtocoloFormatado').val('');
            }
        });
    }

    function bindMascaraModalDocumentoPrimario() {
        $(solicitacaoProcedimento + " #NrProtocoloPrimario").mask("000000/0000", { reverse: true, placeholder: "______/____" }).attr("maxlength", "11");
        $(solicitacaoProcedimento + " #NrProcessoPrimario").mask("000000/0000.0", { reverse: true, placeholder: "______/____._" }).attr("maxlength", "13");
    }

    function bindMascaraModalDocumentoSecundario() {
        $(solicitacaoProcedimento + " #NrProtocoloSec").mask("000000/0000", { reverse: true, placeholder: "______/____" }).attr("maxlength", "11");
        $(solicitacaoProcedimento + " #NrProcessoSec").mask("000000/0000.0", { reverse: true, placeholder: "______/____._" }).attr("maxlength", "13");
    }

    function bindMascaraFiltro(parameters) {
        $(filtro + ' #DataInicial').mask('00/00/0000').attr('maxlength', '10');
        $(filtro + ' #DataFinal').mask('00/00/0000').attr('maxlength', '10');
    }

    function bindModalNrProtocoloPrimarioChange() {
        $(solicitacaoProcedimento + ' #NrProtocoloPrimario').change(function () {
            $(solicitacaoProcedimento + ' #NrProtocoloPrimario').val(BASE.AdicionarQtdCaracterAEsquerda($(solicitacaoProcedimento + ' #NrProtocoloPrimario').val(), 11, 0));
            if ($(solicitacaoProcedimento + ' #NrProtocoloPrimario').val().indexOf('000000') >= 0) {
                $(solicitacaoProcedimento + ' #NrProtocoloPrimario').val('');
            }
        });
    }

    function bindModalNrProcessoPrimarioChange() {
        $(solicitacaoProcedimento + ' #NrProcessoPrimario').change(function () {
            $(solicitacaoProcedimento + ' #NrProcessoPrimario').val(BASE.AdicionarQtdCaracterAEsquerda($('#form-solicitacao-procedimento #NrProcessoPrimario').val(), 13, 0));
            if ($(solicitacaoProcedimento + ' #NrProcessoPrimario').val().indexOf('000000') >= 0) {
                $(solicitacaoProcedimento + ' #NrProcessoPrimario').val('');
            }
        });
    }

    function bindModalNrProtocoloSecundarioChange() {
        $(solicitacaoProcedimento + ' #NrProtocoloSec').change(function () {
            $(solicitacaoProcedimento + ' #NrProtocoloSec').val(BASE.AdicionarQtdCaracterAEsquerda($(solicitacaoProcedimento + ' #NrProtocoloSec').val(), 11, 0));
            if ($(solicitacaoProcedimento + ' #NrProtocoloSec').val().indexOf('000000') >= 0) {
                $(solicitacaoProcedimento + ' #NrProtocoloSec').val('');
            }
        });
    }

    function bindModalNrProcessoSecundarioChange() {
        $(solicitacaoProcedimento + ' #NrProcessoSec').change(function () {
            $(solicitacaoProcedimento + ' #NrProcessoSec').val(BASE.AdicionarQtdCaracterAEsquerda($('#form-solicitacao-procedimento #NrProcessoSec').val(), 13, 0));
            if ($(solicitacaoProcedimento + ' #NrProcessoSec').val().indexOf('000000') >= 0) {
                $(solicitacaoProcedimento + ' #NrProcessoSec').val('');
            }
        });
    }

    function bindModalFiltroChange() {
        $(filtro + " #NrProtocoloPrimario").change(function () {
            $(filtro + " #NrProtocoloPrimario").val(BASE.AdicionarQtdCaracterAEsquerda($(filtro + " #NrProtocoloPrimario").val(), 11, 0));
            if ($(filtro + " #NrProtocoloPrimario").val().indexOf("000000") >= 0) {
                $(filtro + " #NrProtocoloPrimario").val("");
            }
        });
    }

    function bindMontarPesquisaDocumento() {
        $(solicitacaoProcedimento + ' #IdProcedimento').change(function () {
            montarPesquisaDocumento($(solicitacaoProcedimento + ' #IdProcedimento').val());
        });
    }

    function bindComboUaTramitacao() {
        CONTROLES.DropDown.Preencher('#IdUAProtocolo', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativaAtribuicaoProtocolo', null, true);
    }

    function bindBtnAtenderSolicitacao() {
        $('#div-lista-solicitacao-procedimento #table-solicitacao-procedimento .btn-atender').off('click');
        $('#div-lista-solicitacao-procedimento #table-solicitacao-procedimento .btn-atender').on('click', function () {

            var id = $(this).data('id'),
                idSituacaoProcedimento = SituacaoSolicitacaoProcedimento.Atendida;

            BASE.Modal.ExibirModalConfirmacao(
                'Atender Solicitação de Procedimento', 'Deseja mesmo alterar esta Solicitação para atendida?',
                'small',
                '<i class="fa fa-close margR5"></i>Não',
                'btn-primary',
                '<i class="fa fa-check margR5"></i>Sim',
                'btn-danger',
                function () {
                    alterarSituacaoProcedimento(id, idSituacaoProcedimento);
                },
                null);
        });
    }

    function bindBtnCancelarSolicitacao() {
        $('#div-lista-solicitacao-procedimento #table-solicitacao-procedimento .btn-cancelar').off('click');
        $('#div-lista-solicitacao-procedimento #table-solicitacao-procedimento .btn-cancelar').on('click', function () {
            
            var id = $(this).data('id'),
                idSituacaoProcedimento = SituacaoSolicitacaoProcedimento.Cancelada;

            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Solicitação de Procedimento', 'Deseja mesmo cancelar a Solicitação?',
                'small',
                '<i class="fa fa-close margR5"></i>Não',
                'btn-primary',
                '<i class="fa fa-check margR5"></i>Sim',
                'btn-danger',
                function () {
                    alterarSituacaoProcedimento(id, idSituacaoProcedimento);
                },
                null);
        });
    }

    function bindBtnEditarSolicitacao() {
        $('#div-lista-solicitacao-procedimento, #table-solicitacao-procedimento tbody').off('click', '.btn-editar');
        $('#div-lista-solicitacao-procedimento, #table-solicitacao-procedimento tbody').on('click', '.btn-editar', function () {
            $('#incluirSolicitacao').modal('show');

            var id = $(this).data('id');
            limparCampos($(solicitacaoProcedimento));
            limparCamposPesquisaDocumento();
            $("#pesquisaProtocolo").collapse('show');
            obterSolicitacaoProcedimento(id);
            tituloSolicitacaoProcedimento(TipoaAcao.Alteracao);
        });
    }

    function bindBtnIncluirSolicitacao() {
        $("#btn-incluir").off('click');
        $("#btn-incluir").on('click', function () {
            limparCampos($(solicitacaoProcedimento));
            limparCamposPesquisaDocumento();
            tituloSolicitacaoProcedimento(TipoaAcao.Inclusao);
        });
    }

    function bindDetalharSolicitacao() {
        $('#div-lista-solicitacao-procedimento').off('click', 'tbody tr td.exibir-detalhe');
        $('#div-lista-solicitacao-procedimento').on('click', 'tbody tr td.exibir-detalhe', function () {
            var codigo = $(this).parent().data("id");
            console.log(codigo);
            detalharSolicitacao(codigo);
        });
    }

    function bindComboFiltroUaSolicitante() {
        CONTROLES.DropDown.Preencher('#UASolicitante', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function bindBtnFiltrarSolicitacao() {
        $(filtro + " #btn-filtrar").off('click');
        $(filtro + " #btn-filtrar").on('click', function () {

            var form = $(filtro);
            var objPesquisa = $(form).serializeObject();
            $.ajax({
                url: '/SolicitacaoProcedimento/Filtrar',
                type: 'POST',
                data: { filtro: objPesquisa },
                cache: false,
                success: function (response, status, xhr) {


                    if (response === "") {
                        return BASE.Mensagem.Mostrar("Documento não encontrado", TipoMensagem.Alerta, "Alerta");
                    }

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (!isJson){
                        renderHtml(response);
                        bindControleBotao();
                    }

                },
                error: function () {
                    console.log("Erro ao pesquisar documento");
                }
            });

        });
    }

    function bindBtnModalPesquisarDocumento() {
        $("#btn-pesquisar-protocolo").off('click');
        $("#btn-pesquisar-protocolo").on('click', function () {
            filtrarDocumentoPorTipoSolicitacaoProcedimento(TipoSolicitacaoProcedimento.SolicitacaoProcedimentoPrimario);
        });
    }

    function bindModalBtnCancelar() {

        $(".modal#incluirSolicitacao ").off('click #btn-cancelar');
        $(".modal#incluirSolicitacao #btn-cancelar").on('click #btn-cancelar', function () {

            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
                'small',
                'Sim',
                'btn-primary',
                'Não',
                'btn-danger',
                null,
                function () {
                    limparCampos($(solicitacaoProcedimento));
                    limparCampos($(filtro));
                    $(solicitacaoProcedimento).removeData("validator");
                    $(filtro).removeData("validator");
                    $('#incluirSolicitacao').modal('hide');
                });
        });
    }

    function bindBtnModalPesquisarDocumentoSecundario() {
        $("#btn-pesquisar-protocolo-secundario").off('click');
        $("#btn-pesquisar-protocolo-secundario").on('click', function () {
            filtrarDocumentoPorTipoSolicitacaoProcedimento(TipoSolicitacaoProcedimento.SolicitacaoProcedimentoSecundario);
        });
    }

    function bindBtnModalLimpar() {
        $("#btn-limpar").off('click');
        $("#btn-limpar").on('click', function () {
            limparCampos($(solicitacaoProcedimento));
            limparCampos($(filtro));
            $(solicitacaoProcedimento).removeData("validator");
            $(filtro).removeData("validator");

            limparCamposPesquisaDocumento();
        });
    }

    function bindBtnModalSalvar() {

        $('#btn-salvar').off('click');
        $('#btn-salvar').on('click', function () {
            var solicitacaoProcedimento = '#form-solicitacao-procedimento';

            //$(solicitacaoProcedimento + ' #btn-salvar').prop('disabled', true);
            $(solicitacaoProcedimento).removeData("validator");

            var form = $(solicitacaoProcedimento);
            var valido = validarDados(form);

            if (valido) {
                var solicitacao = form.serializeObject();

                if ((solicitacao.IdProcedimento === "1" && verificarSeForNulo(solicitacao.IdDocumento)) || (solicitacao.IdProcedimento > "1" && verificarSeForNulo(solicitacao.IdDocumento) && verificarSeForNulo(solicitacao.IdDocumentoSecundario))) {
                    if (solicitacao.Codigo === "0" || solicitacao.Codigo === "" || solicitacao.Codigo === null)
                        salvarSolicitacao(solicitacao);
                    else
                        atualizarSolicitacao(solicitacao);
                }
                else {
                    BASE.Mensagem.Mostrar("Informe o Número de Processo ou Número de Protocolo", TipoMensagem.Alerta, "Alerta");
                }
            } else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }

            //$(solicitacaoProcedimento + ' #btn-salvar').prop('disabled', false);
            //atualizarLista();
        });

        //$('#form-solicitacaoAutuacao #btn-salvar').prop('disabled', false);
        return false;
    }

    function bindData() {
        $(filtro + ' #DataInicial').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990",
            endDate: new Date()
        });

        $(filtro + ' #DataFinal').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990",
            endDate: new Date()
        });

        $(filtro + ' #DataInicial').on("dp.change", function (e) {
            $(filtro + ' #DataFinal').data("DateTimePicker").minDate(e.date);
        });

        $(filtro + ' #DataFinal').on("dp.change", function (e) {
            $(filtro + ' #DataInicial').data("DateTimePicker").maxDate(e.date);
        });
    }

    function montarPesquisaDocumento(id) {
        var _indice = parseInt(id);
        $('#pesquisa-protocolo-sec').hide();
        limparCamposSecundario();

        $('#pesquisa-protocolo-sec h4').text('');

        switch (_indice) {
            case 2:
                $('#pesquisa-protocolo-sec').show();
                $('#pesquisa-protocolo-sec h4').text('Documento a Apensar');
                break;
            case 3:
                $('#pesquisa-protocolo-sec').show();
                $('#pesquisa-protocolo-sec h4').text('Documento a Desapensar');
                break;
            case 4:
                $('#pesquisa-protocolo-sec').show();
                $('#pesquisa-protocolo-sec h4').text('Documento a Incorporar');
                break;
        }
    }

    function limparCamposSecundario() {
        $("#pesquisaProtocoloSec #pesquisaNrProtocoloSec").text('');
        $("#ProtocoloSecSelecionado").val('');
        $("#ProcessoSecSelecionado").val('');
        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").text('');
        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").hide();
        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").text('');
        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").hide();
        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").text('');
        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").hide();
    }

    function carregarPaginacao() {
        $('#table-solicitacao-procedimento').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"]
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"]
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function carregarCombo() {
        bindComboFiltroUaSolicitante();
        bindComboUaTramitacao();
        //bindComboFiltroSituacaoSolicitante();
    }

    function obterSolicitacaoProcedimento(id) {
        $.ajax({
            url: '/SolicitacaoProcedimento/ObterSolicitacao',
            type: 'POST',
            data: { codigo: id },
            cache: false,
            success: function (response, status, xhr) {

                if (response === "" || response.viewModel.Codigo === 0) {
                    return BASE.Mensagem.Mostrar("Solicitacao não encontrada", TipoMensagem.Alerta, "Alerta");
                }

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log('Não é json');
                }
                else {
                    posCarregar(response);
                };
                return false;
            },
            error: function () {
                console.log("Erro ao pesquisar documento");
            }
        });
    }

    function filtrarDocumentoPorTipoSolicitacaoProcedimento(tipoSolicitacaoProcedimento) {

        var objeto = obterNumeroDocumento(tipoSolicitacaoProcedimento);

        if (objeto.NrProcessoFormatado === "" && objeto.NrProtocoloFormatado === "") {
            return BASE.Mensagem.Mostrar("Preencha o campo número protocolo!", TipoMensagem.Alerta, "Alerta");
        }

        $.ajax({
            url: '/RegistrarProcesso/ObterProtocolo',
            type: 'POST',
            data: { filtro: objeto },
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson) {

                    if (response.erro !== null && response.erro !== undefined) {
                        limparCamposPesquisaDocumento();
                        console.log("Erro");
                    }
                    else if (response.retorno !== null && response.retorno !== undefined) {
                        exibirDocumentoPesquisado(tipoSolicitacaoProcedimento);
                        posCarregarProtocolo(tipoSolicitacaoProcedimento, response.retorno);
                    }
                    else {
                        BASE.Mensagem.Mostrar("Documento não encontrado", TipoMensagem.Alerta, "Alerta");
                    }
                }
            },
            error: function (response, status, xhr) {
                console.log(response);
            }
        });
        return false;
    };

    function posCarregar(response) {
        popularDadosSolicitacao(response.viewModel);
    }

    function posCarregarProtocolo(tipoSolicitacaoProcedimento, response) {

        if (verificarSeForNulo(response)) {
            switch (tipoSolicitacaoProcedimento) {
                case 1:
                    $("#pesquisaProtocolo #pesquisaNrProtocolo").show();
                    $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").show();
                    $("#pesquisaProtocolo #pesquisaInteressado").show();
                    $("#pesquisaProtocolo #pesquisaAssunto").show();

                    if (verificarSeForNulo(response.NrProtocoloFormatado)) {
                        $("#pesquisaProtocolo #pesquisaNrProtocolo").text('Nº do Procotolo: ' + response.NrProtocoloFormatado);
                        $("#ProtocoloSelecionado").val(response.NrProtocoloFormatado);
                        $('#IdDocumento').val(response.IdDocumento);
                    }
                    else {
                        $("#pesquisaProtocolo #pesquisaNrProtocolo").hide();
                        $("#ProtocoloSelecionado").val('');
                        $('#IdDocumento').val();
                    }

                    if (verificarSeForNulo(response.SerieDocumental))
                        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").text('Série Documental: ' + response.SerieDocumental);
                    else
                        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").hide();

                    if (verificarSeForNulo(response.NomeParteInteressada) && response.NomeParteInteressada.length > 0)
                        $("#pesquisaProtocolo #pesquisaInteressado").text('Interessado: ' + response.NomeParteInteressada);
                    else
                        $("#pesquisaProtocolo #pesquisaInteressado").hide();

                    if (verificarSeForNulo(response.AssuntoProtocolo))
                        $("#pesquisaProtocolo #pesquisaAssunto").text('Assunto: ' + response.AssuntoProtocolo);
                    else
                        $("#pesquisaProtocolo #pesquisaAssunto").hide();
                    break;
                case 2:
                    $("#pesquisaProtocoloSec #pesquisaNrProtocoloSec").show();
                    $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").show();
                    $("#pesquisaProtocoloSec #pesquisaInteressadoSec").show();
                    $("#pesquisaProtocoloSec #pesquisaAssuntoSec").show();

                    if (verificarSeForNulo(response.NrProtocoloFormatado)) {
                        $("#pesquisaProtocoloSec #pesquisaNrProtocoloSec").text('Nº do Procotolo: ' + response.NrProtocoloFormatado);
                        $("#ProtocoloSecSelecionado").val(response.NrProtocoloFormatado);
                        $('#IdDocumentoSecundario').val(response.IdDocumento);
                    }
                    else {
                        $("#pesquisaProtocoloSec #pesquisaNrProtocoloSec").hide();
                        $("#ProtocoloSecSelecionado").val('');
                        $('#IdDocumentoSecundario').val();
                    }

                    if (verificarSeForNulo(response.SerieDocumental))
                        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").text('Série Documental: ' + response.SerieDocumental);
                    else
                        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").hide();

                    if (verificarSeForNulo(response.NomeParteInteressada) && response.NomeParteInteressada.length > 0)
                        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").text('Interessado: ' + response.NomeParteInteressada);
                    else
                        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").hide();

                    if (verificarSeForNulo(response.AssuntoProtocolo))
                        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").text('Assunto: ' + response.AssuntoProtocolo);
                    else
                        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").hide();
                    break;


                default:
            }

            //if (tipoSolicitacaoProcedimento === 1) {


            //}

            //if (tipoSolicitacaoProcedimento === 2) {


            //}
        }
    }

    function verificarSeForNulo(valor) {

        if (valor === null || valor === '' || valor === undefined)
            return false;

        return true;
    }

    function popularDadosSolicitacao(dados) {

        montarPesquisaDocumento(dados.IdProcedimento);
        $("#pesquisaProtocolo").collapse('show');
        $(solicitacaoProcedimento + ' #IdProcedimento').val(dados.IdProcedimento);
        $(solicitacaoProcedimento + ' #IdUAProtocolo').val(dados.IdUAProtocolo);
        $(solicitacaoProcedimento + ' #NomeSolicitante').val(dados.NomeSolicitante);
        $(solicitacaoProcedimento + ' #CargoSolicitante').val(dados.CargoSolicitante);
        $(solicitacaoProcedimento + ' #Observacao').val(dados.Observacao);
        $(solicitacaoProcedimento + ' #Codigo').val(dados.Codigo);
        $(solicitacaoProcedimento + ' #IdDocumento').val(dados.IdDocumento);
        $(solicitacaoProcedimento + ' #IdSituacaoSolicitacao').val(dados.IdSituacaoSolicitacao);
        $(solicitacaoProcedimento + ' #NrProtocoloPrimario').val(dados.NrProtocoloPrimario);
        $('#pesquisaProtocolo #pesquisaNrProtocolo').show();
        $('#pesquisaProtocolo #pesquisaDescricaoSerieDocumental').show();
        $('#pesquisaProtocolo #pesquisaInteressado').show();
        $('#pesquisaProtocolo #pesquisaAssunto').show();
        if (verificarSeForNulo(dados.NrProtocoloFormatado)) {
            $('#pesquisaProtocolo #pesquisaNrProtocolo').text('Nº do Procotolo: ' + dados.NrProtocoloPrimario);
            $('#ProtocoloSelecionado').val(dados.NrProtocoloPrimario);
        }
        else {
            $('#pesquisaProtocolo #pesquisaNrProtocolo').hide();
            $('#ProtocoloSelecionado').val('');
        }
        if (verificarSeForNulo(dados.DescricaoSerieDocumental)) {
            $('#pesquisaProtocolo #pesquisaDescricaoSerieDocumental').text('Série Documental: ' + dados.DescricaoSerieDocumental);
        }
        else {
            $('#pesquisaProtocolo #pesquisaDescricaoSerieDocumental').hide();
        }
        if (verificarSeForNulo(dados.Interessado)) {
            $('#pesquisaProtocolo #pesquisaInteressado').text('Interessado: ' + dados.Interessado);
        }
        else {
            $('#pesquisaProtocolo #pesquisaInteressado').hide();
        }
        if (verificarSeForNulo(dados.Assunto)) {
            $('#pesquisaProtocolo #pesquisaAssunto').text('Assunto: ' + dados.Assunto);
        }
        else {
            $('#pesquisaProtocolo #pesquisaAssunto').hide();
        }

        if (dados.IdDocumentoSecundario != null && dados.IdDocumentoSecundario != undefined && dados.IdDocumentoSecundario > 0) {
            $('#pesquisa-protocolo-sec').show();
            $('#pesquisaProtocoloSec').collapse('show');
            $(solicitacaoProcedimento + ' #IdDocumentoSecundario').val(dados.IdDocumentoSecundario);
            $(solicitacaoProcedimento + ' #ProtocoloSecSelecionado').val(dados.NrProtocoloSec);
            $(solicitacaoProcedimento + ' #NrProtocoloSec').val(dados.NrProtocoloSec);

            $('#pesquisaProtocoloSec #pesquisaNrProtocoloSec').show();
            $('#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec').show();
            $('#pesquisaProtocoloSec #pesquisaInteressadoSec').show();
            $('#pesquisaProtocoloSec #pesquisaAssuntoSec').show();
            if (verificarSeForNulo(dados.NrProtocoloSec)) {
                $('#pesquisaProtocoloSec #pesquisaNrProtocoloSec').text('Nº do Procotolo: ' + dados.NrProtocoloSec);
                $('#ProtocoloSecSelecionado').val(dados.NrProtocoloSec);
            }
            else {
                $('#pesquisaProtocoloSec #pesquisaNrProtocoloSec').hide();
                $('#ProcessoSecSelecionado').val('');
            }
            if (verificarSeForNulo(dados.DescricaoSerieDocumentalSec)) {
                $('#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec').text('Série Documental: ' + dados.DescricaoSerieDocumentalSec);
            }
            else {
                $('#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec').hide();
            }
            if (verificarSeForNulo(dados.InteressadoSec)) {
                $('#pesquisaProtocoloSec #pesquisaInteressadoSec').text('Interessado: ' + dados.InteressadoSec);
            }
            else {
                $('#pesquisaProtocoloSec #pesquisaInteressadoSec').hide();
            }
            if (verificarSeForNulo(dados.AssuntoSec)) {
                $('#pesquisaProtocoloSec #pesquisaAssuntoSec').text('Assunto: ' + dados.AssuntoSec);
            }
            else {
                $('#pesquisaProtocoloSec #pesquisaAssuntoSec').hide();
            }
        }
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

    function salvarSolicitacao(solicitacao) {

        $.ajax({
            url: '/SolicitacaoProcedimento/Salvar',
            type: 'POST',
            data: { viewModel: solicitacao },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response);
                else {

                    atualizarLista(function () {
                        escondeModal();
                        bindControleBotao();
                        BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    });
                }
            },
            error: function () {
                console.log("Erro ao salvar Solicitacao Autuação");
            }
        });
    }

    function detalharSolicitacao(codigo) {
        $.ajax({
            url: '/SolicitacaoProcedimento/Detalhar',
            //type: 'POST',
            data: { codigo: codigo },
            success: function (response, status, xhr) {

                $("#detalheSolicitacaoProcedimento").html(response);
                $("#modalDetalhe").modal("show");

            },
            error: function () {

            }
        });
    }

    function renderHtml(view) {
        $('#table-solicitacao-procedimento').html(view);
        carregarPaginacao();
    }

    function atualizarSolicitacao(solicitacao) {
        $.ajax({
            url: '/SolicitacaoProcedimento/Atualizar',
            type: 'POST',
            data: { viewModel: solicitacao },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0)
                    BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response);
                else {

                    atualizarLista(function () {
                        escondeModal();
                        bindControleBotao();
                        BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    });
                }
            },
            error: function () {
                console.log("Erro ao atualizar Solicitacao Autuação");
            }
        });
    }

    function escondeModal() {
        $('#incluirSolicitacao').modal('hide');
    }

    function alterarSituacaoProcedimento(idSolicitacaoProcedimento, idSituacaoProcedimento) {
        $.ajax({
            url: "/SolicitacaoProcedimento/AlterarSituacaoProcedimento/",
            type: "POST",
            data: { idSolicitacaoProcedimento: idSolicitacaoProcedimento, idSituacaoProcedimento: idSituacaoProcedimento },
            success: function (response, status, xhr) {

                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (isJson) {
                    if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                        BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response);

                    else if (response.Erro !== null && response.Erro !== undefined)
                        BASE.Mensagem.Mostrar("Erro ao alterar a solicitação", TipoMensagem.Error, "Erro");

                    else {
                        BASE.Mensagem.Mostrar("Registro alterado com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    }

                    $(filtro + " #btn-filtrar").click();
                }
            },
            error: function () {
                console.log("erro ao alterar a solicitação.");
                BASE.Mensagem.Mostrar("Erro ao alterar a solicitação.", TipoMensagem.Error, "Erro");
            }
        });
    }

    function atualizarLista(callback) {
        $.ajax({
            url: '/SolicitacaoProcedimento/Listar',
            type: 'POST',
            data: {},
            cache: false,
            success: function (response, status, xhr) {

                var isJson = BASE.Util.ResponseIsJson(xhr);
                if (!isJson) {

                    $('#table-solicitacao-procedimento').html(response);

                    bindControleBotao();
                    carregarPaginacao();

                    if (callback != undefined)
                        callback();
                }
            },
            error: function () {
                console.log("Erro ao pesquisar processo");
            }
        });
    }

    function limparCampos(form) {
        $(':input', form).each(function () {
            var type = this.type;
            var tag = this.tagName.toLowerCase();
            var id = this.id;
            if (type === 'text' || tag === 'textarea' || type === 'hidden') {
                this.value = "";
            }
            else if (type === 'checkbox' || type === 'radio')
                this.checked = false;
            else if (tag === 'select')
                this.selectedIndex = 0;

            if ($(id).hasClass('input-validation-error'))
                $(id).removeClass('input-validation-error');
        });
    }

    function limparCamposPesquisaDocumento() {
        $("#pesquisaProtocolo").collapse('hide');
        $("#pesquisaProtocolo #pesquisaNrProtocolo").hide();
        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").hide();
        $("#pesquisaProtocolo #pesquisaInteressado").hide();
        $("#pesquisaProtocolo #pesquisaAssunto").hide();

        $("#pesquisaProtocoloSec").collapse('hide');
        $("#pesquisaProtocoloSec #pesquisaNrProtocoloSec").hide();
        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").hide();
        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").hide();
        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").hide();

        $("#pesquisaProtocolo #pesquisaNrProtocolo").text('');
        $("#ProtocoloSelecionado").val('');
        $("#ProcessoSelecionado").val('');
        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").text('');
        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").hide();
        $("#pesquisaProtocolo #pesquisaInteressado").text('');
        $("#pesquisaProtocolo #pesquisaInteressado").hide();
        $("#pesquisaProtocolo #pesquisaAssunto").text('');
        $("#pesquisaProtocolo #pesquisaAssunto").hide();

        $("#pesquisaProtocoloSec #pesquisaNrProtocoloSec").text('');
        $("#ProtocoloSecSelecionado").val('');
        $("#ProcessoSecSelecionado").val('');
        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").text('');
        $("#pesquisaProtocoloSec #pesquisaDescricaoSerieDocumentalSec").hide();
        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").text('');
        $("#pesquisaProtocoloSec #pesquisaInteressadoSec").hide();
        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").text('');
        $("#pesquisaProtocoloSec #pesquisaAssuntoSec").hide();
    }

    function exibirDocumentoPesquisado(tipoSolicitacaoProcedimento) {
        switch (tipoSolicitacaoProcedimento) {
            case 1:
                $("#pesquisaProtocolo").collapse('show');
                break;
            case 2:
                $("#pesquisaProtocoloSec").collapse('show');
                break;
        }
    }

    function obterNumeroDocumento(tipoSolicitacaoProcedimento) {
        var objeto = {};

        switch (tipoSolicitacaoProcedimento) {
            case 1:
                objeto.NrProtocoloFormatado = $('#form-solicitacao-procedimento #NrProtocoloPrimario').val();
                objeto.NrProcessoFormatado = $('#form-solicitacao-procedimento #NrProcessoPrimario').val();
                break;
            case 2:
                objeto.NrProtocoloFormatado = $('#form-solicitacao-procedimento #NrProtocoloSec').val();
                objeto.NrProcessoFormatado = $('#form-solicitacao-procedimento #NrProcessoSec').val();
                break;
        }
        return objeto;
    }

    function setarSituacaoFiltro() {
        $("#IdSituacao option:eq(" + SituacaoSolicitacaoProcedimento.Aberta + ")").prop('selected', true);
    }

    function tituloSolicitacaoProcedimento(acao) {

        switch (acao) {
            case 1:
                $("#tituloSolicitacaoProcedimento").text("Incluir Solicitação de Procedimento");
                break;
            case 2:
                $("#tituloSolicitacaoProcedimento").text("Alterar Solicitação de Procedimento");
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
        }
    }

}());

$(function () {
    SOLICITACAOPROCEDIMENTO.Init();
});
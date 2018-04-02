var SituacaoSolicitacaoProcedimento = {
    Aberta: 1,
    Atendida: 2,
    Cancelada: 3
}

var TipoaAcao = {
    Inclusao: 1,
    Alteracao: 2
}

var SOLICITACAOAUTUACAO = (function () {
    var filtro = '#filtro-solicitacaoAutuacao',
        solicitacaoAutuacao = '#form-solicitacaoAutuacao';

    function init() {
        bindAll();
    }

    function bindAll() {
        bindMascara();
        bindData();
        bindControleBotao();
        carregarPaginacao();
        carregarCombo();
        setarSituacaoFiltro();
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

    function bindMascara() {
        $(filtro + ' #NrProtocoloFormatado').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $(solicitacaoAutuacao + ' #NrProtocolo').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');

        $(filtro + ' #DataInicial').mask('00/00/0000').attr('maxlength', '10');
        $(filtro + ' #DataFinal').mask('00/00/0000').attr('maxlength', '10');

        $(filtro + ' #NrProtocoloFormatado').change(function () {
            $(filtro + ' #NrProtocoloFormatado').val(BASE.AdicionarQtdCaracterAEsquerda($(filtro + ' #NrProtocoloFormatado').val(), 11, 0));
            if ($(filtro + ' #NrProtocoloFormatado').val().indexOf('000000') >= 0) {
                $(filtro + ' #NrProtocoloFormatado').val('');
            }
        });

        $(solicitacaoAutuacao + ' #NrProtocolo').change(function () {
            $(solicitacaoAutuacao + ' #NrProtocolo').val(BASE.AdicionarQtdCaracterAEsquerda($(solicitacaoAutuacao + ' #NrProtocolo').val(), 11, 0));
            if ($(solicitacaoAutuacao + ' #NrProtocolo').val().indexOf('000000') >= 0) {
                $(solicitacaoAutuacao + ' #NrProtocolo').val('');
            }
        });
    }

    function bindControleBotao() {
        bindBtnPesquisarDocumento();
        bindBtnTermoSolicitacao();
        bindBtnFiltrar();
        bindBtnIncluir();
        bindBtnEditarSolicitacao();
        bindDetalharSolicitacao();
        bindBtnAtenderSolicitacao();
        bindBtnCancelarSolicitacao();
        bindBtnCancelar();
        bindBtnLimpar();
        bindBtnSalvar();
    }

    function AutoCompleteSerieDocumental() {
        $("#DescricaoSerieDocumental").blur(function () {
            if ($('#IdSerieDocumental').val() == '0' || $('#IdSerieDocumental').val() == '')
                $('#DescricaoSerieDocumental').val('');
        });

        $("#DescricaoSerieDocumental").typeahead({
            onSelect: function (item) {
                $("#DescricaoSerieDocumental").val(item.value);
                $("#IdSerieDocumental").val(item.value);
            },
            ajax: {
                url: '/Documento/RetornaSerieDocumentalPorTipo',
                triggerLength: 4,
                dataType: "json",
                displayField: "DescricaoSerie",
                valueField: "IdSerieDocumental",
                preDispatch: function (query) {
                    return {
                        query: query,
                        tipo:1
                    }
                },
                preProcess: function (data) {
                    var listaSerie = [];
                    if (data.lista.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                        $("#DescricaoSerieDocumental").val('');
                        return false;
                    }

                    return data.lista;
                }
            }
        });
    }

    function bindComboFiltroUaSolicitante() {
        CONTROLES.DropDown.Preencher('#UaSolicitante', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function bindComboUaDestino() {
        CONTROLES.DropDown.Preencher('#IdUaDestinatario', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function bindComboUaProtocolo() {
        CONTROLES.DropDown.Preencher('#IdUaProtocolo', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativaAtribuicaoProtocolo', null, true);
    }

    function bindComboUaAutoridade() {
        CONTROLES.DropDown.Preencher('#IdUaAutoridade', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true);
    }

    function bindBtnFiltrar() {
        $("#btn-filtrar").off('click');
        $("#btn-filtrar").on('click', function () {
            var form = $(filtro);
            var obj = $(form).serializeObject();

            $.ajax({
                url: '/SolicitacaoAutuacao/Filtrar',               
                data: { filtro: obj },
                type: "POST",               
                success: function (response, status, xhr) {
                    if (response === "" || response.Codigo === 0) {
                        return BASE.Mensagem.Mostrar("Documento não encontrado", TipoMensagem.Alerta, "Alerta");
                    }

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (!isJson) {
                        renderHtml(response);
                        posFiltrar();
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log("Erro ao pesquisar documento");
                }
            });
        });
    }

    function bindBtnIncluir() {
        $("#btn-incluir").off('click');
        $("#btn-incluir").on('click', function () {

            var nomeUaUsuarioLogado = $($('#form-solicitacaoAutuacao #NomeUaAutoridade')[0]).attr('value');
            var idUaUsuarioLogado = $($('#form-solicitacaoAutuacao #IdUaAutoridade')[0]).attr('value');


            limparCampos($(solicitacaoAutuacao));
            limparCamposPesquisaDocumento();
            AutoCompleteSerieDocumental();
            tituloSolicitacaoProcedimento(TipoaAcao.Inclusao);
            $("#pesquisaProtocolo").hide();           

            $('#form-solicitacaoAutuacao #NomeUaAutoridade').val(nomeUaUsuarioLogado);

            $('#form-solicitacaoAutuacao #IdUaDestinatario').val(idUaUsuarioLogado);

            $('#form-solicitacaoAutuacao #IdUaAutoridade').val(idUaUsuarioLogado);

        });
    }

    function bindBtnAtenderSolicitacao() {
        $('#div-lista-solicitacao-procedimento, #table-solicitacaoAutuacao tbody').off('click', '.btn-atender');
        $('#div-lista-solicitacao-procedimento, #table-solicitacaoAutuacao tbody').on('click', '.btn-atender', function () {
            var id = $(this).data('id'),
                idSituacaoAutuacao = SituacaoSolicitacaoProcedimento.Atendida;

            BASE.Modal.ExibirModalConfirmacao(
                'Atender Solicitação de Autuação', 'Deseja mesmo alterar a Solicitação para atendida?',
                'small',
                '<i class="fa fa-close margR5"></i>Não',
                'btn-primary',
                '<i class="fa fa-check margR5"></i>Sim',
                'btn-danger',
                function () {
                    console.log(idSituacaoAutuacao);
                    alterarSituacaoAutuacao(id, idSituacaoAutuacao);
                },
                null);
        });
    }

    function bindBtnCancelarSolicitacao() {
        $('#table-solicitacaoAutuacao tbody').off('click', '.btn-cancelar');
        $('#table-solicitacaoAutuacao tbody').on('click', '.btn-cancelar', function () {
            var id = $(this).data('id'),
                idSituacaoAutuacao = SituacaoSolicitacaoProcedimento.Cancelada;

            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Solicitação de Autuação', 'Deseja mesmo cancelar a Solicitação?',
                'small',
                '<i class="fa fa-close margR5"></i>Não',
                'btn-primary',
                '<i class="fa fa-check margR5"></i>Sim',
                'btn-danger',
                function () {
                    alterarSituacaoAutuacao(id, idSituacaoAutuacao);
                },
                null);
        });
    }

    function bindBtnEditarSolicitacao() {
        $('#table-solicitacaoAutuacao tbody').off('click', '.btn-editar');
        $('#table-solicitacaoAutuacao tbody').on('click', '.btn-editar', function () {
            tituloSolicitacaoProcedimento(TipoaAcao.Alteracao);
            $('#incluirSolicitacao').modal('show');
            var codigo = $(this).data('id');
            limparCampos($(solicitacaoAutuacao));
            limparCamposPesquisaDocumento();

            AutoCompleteSerieDocumental();
            obterSolicitacaoAutuacao(codigo);
        });
    }

    function bindDetalharSolicitacao() {
        $('#div-lista-solicitacao-autuacao').off('click', 'tbody tr td.exibir-detalhe');
        $('#div-lista-solicitacao-autuacao').on('click', 'tbody tr td.exibir-detalhe', function () {
            var codigo = $(this).parent().data("id");
            detalharSolicitacao(codigo);
        });
    }

    function bindBtnCancelar() {
        $("#btn-cancelar").off('click');
        $("#btn-cancelar").on('click', function () {
            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
                'small',
                'Sim',
                'btn-primary',
                'Não',
                'btn-danger',
                null,
                function () {
                    limparCampos($(solicitacaoAutuacao));
                    limparCampos($(filtro));
                    $(solicitacaoAutuacao).removeData("validator");
                    $(filtro).removeData("validator");
                    $('#incluirSolicitacao').modal('hide');
                });
        });
    }

    function bindBtnPesquisarDocumento() {
        $("#btn-pesquisar-protocolo").off('click');
        $("#btn-pesquisar-protocolo").on('click', function () {
            filtrarPorProtocolo();
        });
    }

    function bindBtnTermoSolicitacao() {
        $(".btn-termo-solicitacao").off('click');
        $(".btn-termo-solicitacao").on('click', function () {
            var codigo = $(this).data("id");
            if (parseInt(codigo) > 0)
                window.open('/SolicitacaoAutuacao/GerarPDF?id=' + codigo, '_blank');
        });
    }

    function bindBtnLimpar() {
        $("#btn-limpar").off('click');
        $("#btn-limpar").on('click', function () {
            limparCampos($(solicitacaoAutuacao));
            limparCampos($(filtro));
            $(solicitacaoAutuacao).removeData("validator");
            $(filtro).removeData("validator");
            limparCamposPesquisaDocumento();
        });
    }

    function bindBtnSalvar() {
        $('#btn-salvar').off('click');
        $('#btn-salvar').on('click', function () {
            var solicitacaoAutuacao = '#form-solicitacaoAutuacao';

            $(solicitacaoAutuacao).removeData("validator");

            var form = $(solicitacaoAutuacao);
            var valido = validarDados(form);

            var filtroProtocolo = $("#NrProtocolo").val();
            var protocoloSelecionado = $("#ProtocoloSelecionado").val();

            if (filtroProtocolo !== protocoloSelecionado) {
                BASE.Mensagem.Mostrar("O campo Nº Protocolo do filtro esta divergente do Protocolo Selecionado!", TipoMensagem.Alerta, "Atenção");
                $(solicitacaoAutuacao + ' #btn-salvar').prop('disabled', false);
                return false;
            }

            if (valido) {
                solicitacaoAutuacao = form.serializeObject();

                if (solicitacaoAutuacao.IdSolicitacaoAutuacao === "0" || solicitacaoAutuacao.IdSolicitacaoAutuacao === "" || solicitacaoAutuacao.IdSolicitacaoAutuacao === null)
                    salvarSolicitacaoAutuacao(solicitacaoAutuacao);
                else
                    atualizarSolicitacaoAutuacao(solicitacaoAutuacao);
            } else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }
            atualizarLista();
            return false;
        });

        $('#form-solicitacaoAutuacao #btn-salvar').prop('disabled', false);
        return false;
    }

    function carregarPaginacao() {
        $('#table-solicitacaoAutuacao').dataTable({
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
            "order": [[0, "desc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function carregarCombo() {
        bindComboFiltroUaSolicitante();
        bindComboUaDestino();
        bindComboUaProtocolo();
        bindComboUaAutoridade();
    }

    function obterSolicitacaoAutuacao(id) {
        $.ajax({
            url: '/SolicitacaoAutuacao/ObterSolicitacao',
            type: 'POST',
            data: { codigo: id },
            cache: false,
            success: function (response, status, xhr) {

                if (response === "" || response.Codigo === 0) {
                    return BASE.Mensagem.Mostrar("Solicitacao não encontrada", TipoMensagem.Alerta, "Alerta");
                }

                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log('Não é json');
                }
                else {
                    posCarregar(response);
                }
            },
            error: function () {
                console.log("Erro ao pesquisar documento");
            }
        });
    }

    function filtrarPorProtocolo() {
        var numeroProcolo = $("#NrProtocolo").val();

        if (numeroProcolo !== '') {
            $.ajax({
                url: '/Documento/ObterProtocoloParaSolicitacaoAutuacao',
                type: 'GET',
                data: { protocolo: numeroProcolo },
                cache: false,
                success: function (response, status, xhr) {
                    if (response === "" || response.Codigo === 0) {
                        $("#pesquisaProtocolo").hide();
                        $('#btn-salvar').attr('disabled', 'disabled');
                        BASE.Mensagem.Mostrar("Documento não encontrado", TipoMensagem.Alerta, "Alerta");
                        return;
                    }

                    if (response != "" && response.Situacao === 1) {
                        $("#pesquisaProtocolo").hide();
                        $('#btn-salvar').attr('disabled', 'disabled');
                        BASE.Mensagem.Mostrar("Documento não cadastrado", TipoMensagem.Alerta, "Alerta");
                        return;
                    }

                    if (response != "" && (response.SerieDocumento == 0 || response.SerieDocumento == null)) {
                        $("#pesquisaProtocolo").hide();
                        $('#btn-salvar').attr('disabled', 'disabled');
                        BASE.Mensagem.Mostrar("Documento não possui série documental", TipoMensagem.Alerta, "Alerta");
                        return;
                    }

                    $('#btn-salvar').removeAttr('disabled');

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        posCarregarProtocolo(response);
                    }
                    return false;
                },
                error: function (response, status, xhr) {
                    $('#btn-salvar').removeAttr('disabled');
                    return BASE.Mensagem.Mostrar("Protocolo não encontrado", TipoMensagem.Alerta, "Alerta");
                }
            });
        }
        else {
            $('#btn-salvar').removeAttr('disabled');
            return BASE.Mensagem.Mostrar("Preencha o campo número protocolo!", TipoMensagem.Alerta, "Alerta");
        }
    };

    function posCarregar(response) {
        popularDadosSolicitacaoAutuacao(response.viewModel);
    }

    function popularDadosSolicitacaoAutuacao(dados) {

        $(solicitacaoAutuacao + ' #IdSolicitacaoAutuacao').val(dados.IdSolicitacaoAutuacao);
        $(solicitacaoAutuacao + ' #IdDocumento').val(dados.IdDocumento);
        $(solicitacaoAutuacao + ' #IdSituacaoSolicitacao').val(dados.IdSituacaoSolicitacao);
        $(solicitacaoAutuacao + ' #NomeSolicitante').val(dados.NomeSolicitante);
        $(solicitacaoAutuacao + ' #CargoSolicitante').val(dados.CargoSolicitante);
        $(solicitacaoAutuacao + ' #Observacao').val(dados.Observacao);

        $(solicitacaoAutuacao + ' #NomeInteressado').val(dados.NomeInteressado);
        $(solicitacaoAutuacao + ' #DescricaoSerieDocumental').val(dados.DescricaoSerieDocumental);
        $(solicitacaoAutuacao + ' #DescricaoAssunto').val(dados.DescricaoAssunto);
        $(solicitacaoAutuacao + ' #IdSerieDocumental').val(parseInt(dados.IdSerieDocumental));
        $(solicitacaoAutuacao + ' #NomeUaAutoridade').val(dados.NomeUaAutoridade);

        if (dados.Sigilo)
            $(solicitacaoAutuacao + ' #Sigilo').prop('checked', true);
        else
            $(solicitacaoAutuacao + ' #Sigilo').prop('checked', false);

        $(solicitacaoAutuacao + ' #IdUaDestinatario').val(dados.IdUaDestinatario);
        $(solicitacaoAutuacao + ' #IdUaProtocolo').val(dados.IdUaProtocolo);

        if (dados.NrProtocolo != '000000/0') {
            $(solicitacaoAutuacao + ' #NrProtocolo').val(dados.NrProtocolo);
        }

        $("#pesquisaProtocolo #pesquisaNrProtocolo").show();
        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").show();
        $("#pesquisaProtocolo #pesquisaInteressado").show();
        $("#pesquisaProtocolo #pesquisaAssunto").show();

        if (dados.NrProtocolo != '000000/0') {
            $("#pesquisaProtocolo #pesquisaNrProtocolo").text('Nº do Procotolo: ' + dados.NrProtocolo);
            $("#pesquisaProtocolo #pesquisaInteressado").text('Interessado: ' + dados.NomeInteressado);
            $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").text('Série Documental: ' + dados.DescricaoSerieDocumental);
            $("#ProtocoloSelecionado").val(dados.NrProtocolo);
            $('#pesquisaProtocolo').show();
        }
        else {
            $('#pesquisaProtocolo').hide();
            $("#ProtocoloSelecionado").val('');
        }

        if (verificarSeForNulo(dados.Assunto))
            $("#pesquisaProtocolo #pesquisaAssunto").text('Assunto: ' + dados.Assunto);
        else
            $("#pesquisaProtocolo #pesquisaAssunto").hide();
    }

    function posFiltrar() {
        bindBtnEditarSolicitacao();
        bindBtnAtenderSolicitacao();
        bindBtnCancelarSolicitacao();
        bindBtnTermoSolicitacao();
        carregarPaginacao();
    }

    function posCarregarProtocolo(response) {
        if (verificarSeForNulo(response)) {
            $("#pesquisaProtocolo #pesquisaNrProtocolo").show();
            $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").show();
            $("#pesquisaProtocolo #pesquisaInteressado").show();
            $("#pesquisaProtocolo #pesquisaAssunto").show();

            $("#IdDocumento").val(response.Codigo);

            if (response.NumeroProtocolo != '000000/0') {
                $("#pesquisaProtocolo #pesquisaNrProtocolo").text('Nº do Procotolo: ' + response.NumeroProtocolo);
                $("#ProtocoloSelecionado").val(response.NumeroProtocolo);
                $('#pesquisaProtocolo').show();
            }
            else {
                $('#pesquisaProtocolo').hide();
                $("#ProtocoloSelecionado").val('');
            }

            if (verificarSeForNulo(response.ObjetoSerieDocumentos) && verificarSeForNulo(response.ObjetoSerieDocumentos.DescricaoSerie))
                $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").text('Série Documental: ' + response.ObjetoSerieDocumentos.DescricaoSerie);
            else
                $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").hide();

            if (verificarSeForNulo(response.Interessado) && response.Interessado.length > 0)
                $("#pesquisaProtocolo #pesquisaInteressado").text('Interessado: ' + response.Interessado[0].NomeRazaoSocial);
            else
                $("#pesquisaProtocolo #pesquisaInteressado").hide();

            if (verificarSeForNulo(response.DescricaoAssunto))
                $("#pesquisaProtocolo #pesquisaAssunto").text('Assunto: ' + response.DescricaoAssunto);
            else
                $("#pesquisaProtocolo #pesquisaAssunto").hide();
        }
    }

    function verificarSeForNulo(valor) {
        if (valor === null || valor === '' || valor === undefined)
            return false;

        return true;
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

    function salvarSolicitacaoAutuacao(solicitacaoAutuacao) {
        $.ajax({
            url: '/SolicitacaoAutuacao/Salvar',
            type: 'POST',
            data: { viewModel: solicitacaoAutuacao },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                    BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response);
                }
                else {
                    if (response.viewModel.IdSolicitacaoAutuacao > 0) {
                        escondeModal();
                        BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                        atualizarLista(function () {
                            bindControleBotao();
                            window.open('/SolicitacaoAutuacao/GerarPDF?id=' + response.viewModel.IdSolicitacaoAutuacao, '_blank');
                        });
                    }
                }
            },
            error: function () {
                console.log("Erro ao salvar Solicitacao Autuação");
            }
        });
    }

    function atualizarSolicitacaoAutuacao(solicitacaoAutuacao) {
        $.ajax({
            url: '/SolicitacaoAutuacao/Atualizar',
            type: 'POST',
            data: { viewModel: solicitacaoAutuacao },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                    BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response);
                }
                else {
                    escondeModal();
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    atualizarLista(function () { bindControleBotao(); });
                }
            },
            error: function () {
                console.log("Erro ao atualizar Solicitacao Autuação");
            }
        });
    }

    function alterarSituacaoAutuacao(idSolicitacaoAutuacao, idSituacaoAutuacao) {
        $.ajax({
            url: "/SolicitacaoAutuacao/AlterarSituacaoCriarNovoDocumento/",
            type: "POST",
            data: { idSolicitacaoAutuacao: idSolicitacaoAutuacao, idSituacaoAutuacao: idSituacaoAutuacao },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                    BASE.Mensagem.MostrarListaMensagem.MensagensAlerta(response);
                }
                else if (response.Erro !== null && response.Erro !== undefined) {
                    BASE.Mensagem.Mostrar("Erro ao excluir a solicitação", TipoMensagem.Error, "Erro");
                }
                else {
                    if (idSituacaoAutuacao == 3) {
                        BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                        atualizarLista(function () { bindControleBotao(); });
                        return;
                    }
                    else if (idSituacaoAutuacao == 2) {
                        BASE.Mensagem.Mostrar("Registro atendido com sucesso", TipoMensagem.Sucesso, "Sucesso");
                        atualizarLista(function () { bindControleBotao(); });
                        window.location = '/Autuarprocesso';
                        return;
                    }
                }
            },
            error: function () {
                console.log("erro ao excluir o solicitante.");
                BASE.Mensagem.Mostrar("Erro ao excluir a solicitação.", TipoMensagem.Error, "Erro");
            }
        });
    }

    function detalharSolicitacao(codigo) {
        $.ajax({
            url: '/SolicitacaoAutuacao/Detalhar',
            //type: 'POST',
            data: { codigo: codigo },
            success: function (response, status, xhr) {
                $("#detalheSolicitacaoAutuacao").html(response);
                $("#modalDetalhe").modal("show");
            },
            error: function () {
            }
        });
    }

    function renderHtml(view) {
        $('#div-lista-solicitacao-autuacao').html(view);
    }

    function escondeModal() {
        $('#incluirSolicitacao').modal('hide');
    }

    function atualizarLista(callback) {
        $.ajax({
            url: '/SolicitacaoAutuacao/Listar',
            type: 'POST',
            data: {},
            cache: false,
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    $('#table-solicitacaoAutuacao').html(response);

                    posFiltrar();

                    if (callback !== undefined)
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
            if (type == 'text' || tag == 'textarea' || type == 'hidden') {
                this.value = "";
            }
            else if (type === 'checkbox' || type == 'radio')
                this.checked = false;
            else if (tag === 'select')
                this.selectedIndex = 0;

            if ($(id).hasClass('input-validation-error'))
                $(id).removeClass('input-validation-error');
        });
    }

    function limparCamposPesquisaDocumento() {
        ocultarInformacaoDocumento();
        limparInformacaoDocumento();
    }

    function ocultarInformacaoDocumento() {
        $("#pesquisaProtocolo").collapse('hide');
        $("#pesquisaProtocolo #pesquisaNrProtocolo").hide();
        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").hide();
        $("#pesquisaProtocolo #pesquisaInteressado").hide();
        $("#pesquisaProtocolo #pesquisaAssunto").hide();
    }

    function limparInformacaoDocumento() {
        $("#pesquisaProtocolo #pesquisaNrProtocolo").text('');
        $("#ProtocoloSelecionado").val('');
        $("#pesquisaProtocolo #pesquisaDescricaoSerieDocumental").text('');
        $("#pesquisaProtocolo #pesquisaInteressado").text('');
        $("#pesquisaProtocolo #pesquisaAssunto").text('');
    }

    function setarSituacaoFiltro() {
        $("#IdSituacao option:eq(" + SituacaoSolicitacaoProcedimento.Aberta + ")").prop('selected', true);
    }

    function tituloSolicitacaoProcedimento(acao) {
        switch (acao) {
            case 1:
                $("#tituloSolicitacaoAutuacao").text("Incluir Solicitação de Autuação");
                break;
            case 2:
                $("#tituloSolicitacaoAutuacao").text("Alterar Solicitação de Autuação");
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
    SOLICITACAOAUTUACAO.Init();
});
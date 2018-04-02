PROPOSTAELIMINACAO = (function () {
    var nomeLista = 'ItemsProposta';

    var SituacaoPropostaItem = {
        Proposto: 1,
        Aprovado: 2,
        Recusado: 3,
    };

    function init() {
        CRUDFILTRO.Evento.PosListar = paginar;
        bindAll();
    }

    function carregarBotoes() {
        var listaArmazenada = CLIENTSTORAGE.Lista.Obter(nomeLista);
        var itensTela = $('#divLista table tbody tr');

        for (var i = 0; i < itensTela.length; i++) {
            var tr = $(itensTela[i]);

            var itemListaArmazenada = listaArmazenada.filter(function (x) {
                return tr.data('id') === x.Id;
            });

            var botaoAprovar = tr.find('.acoes .btn-acao-aprovar');
            var botaoReprovar = tr.find('.acoes .btn-acao-reprovar');

            if (itemListaArmazenada.length > 0) {
                tr.data('situacao', itemListaArmazenada[0].Situacao);
            }

            switch (tr.data('situacao')) {
                case SituacaoPropostaItem.Proposto:
                    botaoReprovar.removeClass('btn-danger');
                    botaoAprovar.removeClass('btn-success');
                    definirItemProposto(tr, SituacaoPropostaItem.Proposto);
                    break;
                case SituacaoPropostaItem.Recusado:
                    botaoReprovar.addClass('btn-danger');
                    clickBotaoAprovarReprovar(botaoReprovar, SituacaoPropostaItem.Recusado);
                    break;
                case SituacaoPropostaItem.Aprovado:
                    botaoAprovar.addClass('btn-success');
                    clickBotaoAprovarReprovar(botaoAprovar, SituacaoPropostaItem.Aprovado);
                    break;
                default:
                    break;
            }
        }
    }

    function bindAll() {
        bindAprovar();
        bindReprovar();
        bindContinuar();
        bindGerarConsolidada();
        bindFiltro();
    }

    function paginar() {
        $('#grupo_lista_relacionar').DataTable();
    }

    function bindFiltro() {
        $('#frmFiltroPropostaEliminacao').on('change', '#Situacao', function () {
            var filtroSituacao = $(this).val();
            var uaAtual = $('#frmFiltroPropostaEliminacao #IdUA').val();

            CRUDFILTRO.Filtrar();
        });

        $('.frm-filtro').off('click');
        $('.frm-filtro').on('click', '.acoes #btnFiltrar', function () {
            var filtroSituacao = $(this).val();
            var uaAtual = $('#frmFiltroPropostaEliminacao #IdUA').val();

            CRUDFILTRO.Filtrar();
        });
    }

    function renderHtml(html) {
        $('#divLista').html(html);
    }

    function bindAprovar() {
        $('#divLista').on('click', 'tbody tr td.acoes .btn-acao-aprovar', function () {
            BASE.Debug('aprovar');
            var btn = $(this);

            var botaoReprovarFoiSelecionado = ($($(btn).closest('td').find('button')[1]).closest('button[class*=btn-danger]').length == 1);

            clickBotaoAprovarReprovar(btn, SituacaoPropostaItem.Aprovado);

            if (botaoReprovarFoiSelecionado && $(btn).closest('button[class*=btn-success]').length === 1) {
                btn.removeClass('btn-success');
            }

            return false;
        });
    }

    function bindReprovar() {
        $('#divLista').on('click', 'tbody tr td.acoes .btn-acao-reprovar', function () {
            BASE.Debug('reprovar');
            var btn = $(this);

            var botaoAprovarFoiSelecionado = ($($(btn).closest('td').find('button')[0]).closest('button[class*=btn-success]').length == 1);

            clickBotaoAprovarReprovar(btn, SituacaoPropostaItem.Recusado);

            return false;
        });
    }

    function bindContinuar() {
        $('#divBarraInferior').on('click', 'div.acoes #btnContinuar', function () {
            BASE.Debug('continuar');

            var listaArmazenada = new Array(); // retornaArmazenamento();

            var total = $('#grupo_lista_relacionar tbody tr').length;

            $('#grupo_lista_relacionar tbody tr .btn-success').closest('tr').each(function () {
                if ($($(this).find('button')).attr('disabled') == undefined) {
                    var id = $(this).data('id');
                    var situacao = $(this).data('situacao');

                    var obj = criarObj(id, situacao);

                    obj.IdProposta = $($(this).find('#IdProposta')).val();
                    obj.NrAno = $($(this).find('#NrAno')).val();
                    obj.IdSerieDocumental = $($(this).find('#IdSerieDocumental')).val();

                    listaArmazenada.push(obj);
                }
            });

            $('#grupo_lista_relacionar tr .btn-danger').closest('tr').each(function () {
                if ($($(this).find('button')).attr('disabled') == undefined) {
                    var id = $(this).data('id');
                    var situacao = $(this).data('situacao');

                    var obj = criarObj(id, situacao);

                    obj.IdProposta = $($(this).find('#IdProposta')).val();
                    obj.NrAno = $($(this).find('#NrAno')).val();
                    obj.IdSerieDocumental = $($(this).find('#IdSerieDocumental')).val();

                    listaArmazenada.push(obj);
                }
            });

            if (listaArmazenada.length < total) {
                BASE.Mensagem.Mostrar('Indique uma ação para todos os itens para continuar', TipoMensagem.Alerta);

                return;
            }

            var btn = $(this);
            var url = btn.data('url');

            $.post(url, { itens: listaArmazenada })
            .done(function (response) {
                $('#conteudo_principal').hide().html(response).fadeIn();
            })
            .fail(function (xhr) {
                BASE.Debug(xhr);
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson && response.Sucesso === false) {
                    BASE.Util.TratarRespostaJson(response);
                }
            });

            return false;
        });
    }

    function retornaArmazenamento() {
        var listaArmazenada;
        var filtroSituacao = $('#Situacao').val();

        if (filtroSituacao === '') {
            listaArmazenada = CLIENTSTORAGE.Lista.Obter(nomeLista);
        }
        else {
            listaArmazenada = CLIENTSTORAGE.Lista.Filtrar(nomeLista, filtroSituacao);
        }

        return listaArmazenada;
    }

    function bindGerarConsolidada() {
        console.log('bindGerarConsolidada');
        $('#conteudo_principal').on('click', '#divBarraInferior div.acoes #btnGerarConsolidada', function () {
            BASE.Debug('gerar consolidada');

            var listaArmazenada = new Array(); // CLIENTSTORAGE.Lista.Obter(nomeLista);

            var btn = $(this);
            var url = btn.data('url');

            var listaArmazenada = new Array(); // retornaArmazenamento();

            var total = $('#grupo_lista_relacionar tbody tr').length;

            $('#grupo_lista_relacionar tbody tr').each(function () {
                var id = $(this).data('id');
                var situacao = $(this).data('situacao');

                var obj = criarObj(id, situacao);

                obj.ItensAprovados = $($(this).find('#ItensAprovados')).val().toString().split(",");
                obj.ItensRecusados = $($(this).find('#ItensRecusados')).val().toString().split(",");
                obj.IdProposta = $($(this).find('#IdProposta')).val();
                obj.IdSerieDocumental = $($(this).find('#IdSerieDocumental')).val();
                obj.Situacao = $($(this).find('#Situacao')).val();

                listaArmazenada.push(obj);
            });

            $.post(url, { itens: listaArmazenada })
            .done(function (response) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                    BASE.Mensagem.Mostrar(response, TipoMensagem.Alerta);
                }
                else {
                    var codigo = response.retorno.Id;
                    if (codigo !== '' && codigo !== null && codigo !== undefined && response.retorno.ItensAprovados.length > 0) {
                        window.open('/PropostaEliminacao/Consolidar', '_self');
                        window.open('/PropostaEliminacao/Imprimir?id=' + codigo, '_blank');
                    }
                    else {
                        window.open('/PropostaEliminacao/Consolidar', '_self');
                    }

                    CLIENTSTORAGE.Lista.RemoverObjeto(nomeLista);
                }
            })
            .fail(function (xhr) {
                BASE.Debug(xhr);
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (isJson && response.Sucesso === false) {
                    BASE.Util.TratarRespostaJson(response);
                }

                CLIENTSTORAGE.Lista.RemoverObjeto(nomeLista);
            });

            return false;
        });
    }

    function clickBotaoAprovarReprovar(btn, novaSituacao) {
        var classe = btn.data('situacao-classe');
        var outros = btn.siblings('.btn-acaounica');

        outros.removeClass('btn-success').removeClass('btn-danger');
        btn.removeClass('btn-success').removeClass('btn-danger');

        var tr = btn.closest('tr');
        var id = tr.data('id');

        var obj = criarObj(id, SituacaoPropostaItem.Proposto);

        btn.addClass(classe);
        tr.attr('data-situacao', novaSituacao);
        obj = criarObj(id, novaSituacao);

        CLIENTSTORAGE.Lista.RemoverObjeto(nomeLista, 'Id', obj.Id);
        CLIENTSTORAGE.Lista.AdicionarObjetoUnico(nomeLista, obj);
    }

    function definirItemProposto(tr, novaSituacao) {
        var id = tr.data('id');
        var obj = criarObj(id, SituacaoPropostaItem.Proposto);

        tr.attr('data-situacao', novaSituacao);
        obj = criarObj(id, novaSituacao);

        CLIENTSTORAGE.Lista.RemoverObjeto(nomeLista, 'Id', obj.Id);
        CLIENTSTORAGE.Lista.AdicionarObjetoUnico(nomeLista, obj);
    }

    function criarObj(id, situacao) {
        var obj = {
            Id: id,
            Situacao: situacao
        };

        return obj;
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    PROPOSTAELIMINACAO.Init();
    CRUDFILTRO.Carregar();
    CRUDFILTRO.Filtrar();
});
CANDIDATAELIMINACAO = (function () {
    var keyLocalStorage = "CandidataEliminacao",
        paginaAtual = "#PaginaAtual",
        form = "#form-gera-eliminacao",
        qtdItensPagina = "#QtdItensPorPagina";

    function init() {
        BASE.Debug("propostaeliminacaoinit");
        CRUDFILTRO.Evento.PosListar = bindPosListar;
        bindData();
    }

    function bindPosListar() {
        bindSelecionarAprovacao();
        bindASelecionarTodos();
        bindContinuar();
        carregarListaCaixaEliminacao();
    }

    function bindData() {
        $('#frmFiltroCandidataEliminacao #PeriodoInicio').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990"
        });

        $('#frmFiltroCandidataEliminacao #PeriodoFim').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true,
            startDate: "01/01/1990"
        });
    }

    function bindPosCarregarListaItensEliminacao(parameters) {
        bindBtnIncluirObservacao();
        bindBtnVoltar();
        bindBtnGerarProposta();
    }

    function bindSelecionarAprovacao() {
        $('.btn-incluir-aprovacao').off('click');
        $('.btn-incluir-aprovacao').on('click', function () {
            var elemento = $(this),
                id = elemento.data('id'),
                idSerieDocumental = elemento.data('id-serie-documental'),

                caixaEliminacao = criarObjetoCaixaEliminacao(id, idSerieDocumental),
                possuiClasseBtnDefault = elemento.hasClass('btn-default');

            if (possuiClasseBtnDefault) {
                adicionarClasseAprovacao(elemento);
                CLIENTSTORAGE.Lista.AdicionarObjetoUnico(keyLocalStorage, caixaEliminacao);
                verificaTodosItensDaPaginaAtualSelecionados(CLIENTSTORAGE.Lista.Obter(keyLocalStorage));
            }
            else {
                removerClasseAprovacao(elemento);
                CLIENTSTORAGE.Lista.RemoverObjeto(keyLocalStorage, "Id", caixaEliminacao.Id);
                verificaTodosItensDaPaginaAtualSelecionados(CLIENTSTORAGE.Lista.Obter(keyLocalStorage));
            }
        });
    }

    function bindASelecionarTodos() {
        $('.btn-incluir-aprovacao-todos').off('click');
        $('.btn-incluir-aprovacao-todos').on('click', function () {
            var elementoPai = $(this),
                listaBotao = retornarListaBotao(),
                possuiClasseBtnSuccess = listaBotao.hasClass('btn-success');

            if (possuiClasseBtnSuccess) {
                adicionarClasseAprovacao(elementoPai);
                adicionarClasseAprovacao(listaBotao);

                $.each(listaBotao, function (index, item) {
                    var id = $(item).data('id'),
                        idSerieDocumental = $(item).data('id-serie-documental'),
                        caixaEliminacao = criarObjetoCaixaEliminacao(id, idSerieDocumental);

                    CLIENTSTORAGE.Lista.AdicionarObjetoUnico(keyLocalStorage, caixaEliminacao);
                });
            }
            else {
                removerClasseAprovacao(elementoPai);
                removerClasseAprovacao(listaBotao);

                $.each(listaBotao, function (index, item) {
                    var id = $(item).data('id'),
                        idSerieDocumental = $(item).data('id-serie-documental'),
                        caixaEliminacao = criarObjetoCaixaEliminacao(id, idSerieDocumental);

                    CLIENTSTORAGE.Lista.RemoverObjeto(keyLocalStorage, "Id", caixaEliminacao.Id);
                });
            }
        });
    }

    function bindContinuar() {
        $('#btn-continuar').off('click');
        $('#btn-continuar').on('click', function () {
            geraListaCaixaCandidataEliminacao();
        });
    }

    function bindBtnIncluirObservacao() {
        $('#form-gera-eliminacao .btn-incluir-observacao').off('click');
        $('#form-gera-eliminacao .btn-incluir-observacao').on('click', function () {
            var btn = $(this);

            var valueObservacao = obterObservacao(btn);

            BASE.Modal.ExibirModalPrompt("Incluir Observação",
                TipoInput.Textarea,
                undefined,
                "Sucesso",
                TamanhoModal.Grande,
                valueObservacao,
                '<i class="fa fa-close margR5"></i>Cancelar',
                "btn-danger",
                '<i class="fa fa-save margR5"></i>Inclui',
                "btn-primary",
                function (value) {
                    adicionarObservacao(btn, value);
                }, null);
        });
    }

    function bindBtnVoltar() {
        $('#form-gera-eliminacao #btn-voltar').off('click');
        $('#form-gera-eliminacao #btn-voltar').on('click', function () {
            window.location = "/CandidataEliminacao";
        });
    }

    function bindBtnGerarProposta() {
        $('#form-gera-eliminacao #btn-gerar-proposta').off('click');
        $('#form-gera-eliminacao #btn-gerar-proposta').on('click', function () {
            gerarPropostaEliminacao();
        });
    }

    function adicionarClasseAprovacao(elemento) {
        $(elemento).prop('title', 'Remover').removeClass('btn-default').addClass('btn-success');
    }

    function removerClasseAprovacao(elemento) {
        $(elemento).prop('title', 'Incluir').addClass('btn-default').removeClass('btn-success');
    }

    function criarObjetoCaixaEliminacao(id, idSerieDocumental) {
        var caixaEliminacao = {
            paginaAtual: 1,
            Id: id,
            IdSerieDocumental: idSerieDocumental
        };
        return caixaEliminacao;
    }

    function carregarListaCaixaEliminacao() {
        marcarItensSelecionados();
    }

    function retornarListaBotao() {
        var listaBotao = $('#tbEliminacao tbody tr td:last-child').find('button').toggleClass('btn-success');
        return listaBotao;
    }

    function marcarItensSelecionados() {
        var listaBotao = retornarListaBotao();

        removerClasseAprovacao(listaBotao);

        if (CLIENTSTORAGE.ObterObjeto(keyLocalStorage) !== null) {
            $.each(CLIENTSTORAGE.ObterObjeto(keyLocalStorage), function (index, value) {
                $.each(listaBotao, function (key, item) {
                    if ($(item).data('id') === value.Id)
                        adicionarClasseAprovacao(item);
                });
            });
            verificaTodosItensDaPaginaAtualSelecionados(CLIENTSTORAGE.Lista.Obter(keyLocalStorage));
        }
    }

    function geraListaCaixaCandidataEliminacao() {
        var listaCaixaEliminacao = new Array(); // CLIENTSTORAGE.Lista.Obter(keyLocalStorage);

        $('#tbEliminacao tbody tr .btn-success').closest('tr').each(function () {
            var id = $($(this).find('button')).data('id');
            var idSerieDocumental = $($(this).find('button')).data('id-serie-documental');

            var obj = criarObjetoCaixaEliminacao(id, idSerieDocumental);

            listaCaixaEliminacao.push(obj);
        });

        if (listaCaixaEliminacao.length == 0) {
            BASE.Mensagem.Mostrar('Nenhuma Caixa Selecionada para Gerar Proposta de Eliminação', TipoMensagem.Alerta);

            return;
        }

        $.ajax({
            url: "/PropostaEliminacao/Gerar",
            type: "POST",
            data: { listaCaixaEliminacao: listaCaixaEliminacao },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    $('#conteudo_principal').hide().html(response).fadeIn();
                    bindPosCarregarListaItensEliminacao();
                }
                else {
                    BASE.Debug(response);
                }
            },
            error: function () {
                BASE.Debug("error ao salvar listaCandidataEliminacao");
            }
        });
    }

    function gerarPropostaEliminacao() {
        console.log(JSON.stringify($(form).serializeObject()));

        $.ajax({
            url: "/PropostaEliminacao/GerarProposta",
            type: "POST",
            data: $(form).serializeObject(),
            dataType: 'json',
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length > 0) {
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);
                }
                else {
                    var codigo = response.retorno.Id;
                    if (codigo !== '' && codigo !== null && codigo !== undefined) {
                        window.open('/CandidataEliminacao', '_self');
                        window.open('/PropostaEliminacao/Imprimir?id=' + codigo, '_blank');
                    }
                }
            },
            error: function () {
                BASE.Debug("error ao gerar proposta");
            }
        });
    }

    function verificaTodosItensDaPaginaAtualSelecionados(listaCaixaEliminacao) {
        var pagAtual = 1,
            qtdItensPorPagina = 3,
            totalItensPagina = 0;

        if (listaCaixaEliminacao !== undefined && listaCaixaEliminacao !== null) {
            $.each(listaCaixaEliminacao, function (index, value) {
                if (value.paginaAtual === pagAtual) {
                    totalItensPagina++;
                }
            });
        }

        if (qtdItensPorPagina === totalItensPagina) {
            adicionarClasseAprovacao($('.btn-incluir-aprovacao-todos'));
        } else {
            removerClasseAprovacao($('.btn-incluir-aprovacao-todos'));
        }
    }

    function adicionarObservacao(btn, text) {
        btn.closest('tr').find('td.observacao span').text(text);
        btn.closest('tr').find('td.observacao input.observacao').val(text);
    }

    function obterObservacao(btn) {
        var observacao = btn.closest('tr').find('td.observacao input.observacao').val();
        return observacao;
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
    };
}());

$(function () {
    CRUDFILTRO.Carregar();

    CRUDFILTRO.Filtrar();

    CANDIDATAELIMINACAO.Init();
});
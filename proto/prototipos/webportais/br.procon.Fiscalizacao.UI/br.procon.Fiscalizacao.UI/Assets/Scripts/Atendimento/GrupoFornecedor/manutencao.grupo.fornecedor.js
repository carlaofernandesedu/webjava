var MANUTENCAOGRUPOFORNECEDOR = (function () {
    var moduleName = "MANUTENCAOGRUPOFORNECEDOR";
    
    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        CRUDBASE.Eventos.PosCarregarEditar = posCriarEditar;
        CRUDBASE.Eventos.ModalPosCriar = posCriarEditar;
        CRUDBASE.Eventos.PosSalvar = posSalvar;
        CRUDFILTRO.Evento.PreListar = defineCodigoGrupoFornecedor;

        CONTROLES.Tabela.Configurar();
        CRUDBASE.Eventos.PosCarregarEditar();

        ajustarTela();

        bindAll();
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindBtnHistorico();
    }

    function bindBtnHistorico() {
        BASE.LogFunction(arguments.callee, moduleName);

        $(".btn-justificativa-historico").off('click');
        $(".btn-justificativa-historico").on('click', function (e) {
            BASE.LogEvent(e, moduleName);

            if ($('#JustificativaHistorico').val() == '' || $('#JustificativaHistorico').val() == undefined || $('#JustificativaHistorico').val() == null) {
                BASE.Mensagem.Mostrar('O campo Justificativa é obrigatorio', TipoMensagem.Error);
                $('#JustificativaHistorico').focus();
            } else {
                var parametro = BASE.Util.GetQuerystringParameterByName('id');
                var obj = { CodigoGrupo: parametro, Justificativa: $('#JustificativaHistorico').val() };

                $.ajax({
                    type: "POST",
                    url: '/ManutencaoGrupoFornecedor/SalvarHistorico',
                    data: obj,
                    success: function (response) {

                        if (response.Sucesso === false) {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Alerta);
                        }
                        else if (response.Sucesso === true) {
                            BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                            carregarHistorico();
                            CRUDFILTRO.Filtrar();
                            $('#JustificativaHistorico').val('');
                        }
                    },
                    error: function (e) {
                        BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
                    }
                });
            }
        });
    }

    function bindTextArea(elemento) {
        BASE.LogFunction(arguments.callee, moduleName);

        $(elemento).keyup(function () {
            var total = 500;
            var tamanho = (500 - parseInt($(elemento).val().length));
            $(".qtd-caracteres").html(tamanho);
        })
    };

    function bindObterFornecedorAutoComplete() {
        BASE.LogFunction(arguments.callee, moduleName);

        var txt = $("#CNPJ", "body");
        txt.typeahead({
            onSelect: function (item) {
                console.log(item);
                definirFornecedor(item.value, item.text, item.cnpj);

            },
            matcher: function (item) {
                return true;
              
            },
            ajax: {
                url: '/Fornecedor/ObterFornecedorAutoComplete/',
                triggerLength: 2,
                dataType: "json",
                displayField: "Html",
                valueField: "Id",
                preDispatch: function (query) {
                    return {
                        filtro: query
                    }
                },
                preProcess: function (data) {
                    console.log(data);
                    return data;
                }
            }
        });
    }

    function definirFornecedor(codigo, text, cnpj) {
        BASE.LogFunction(arguments.callee, moduleName);

        $('#div-fornecedor').show();
        $('input[name="CodigoFornecedor"]').val(codigo);
        $('#nome-empresa').html(text);
        $('#cnpj-empresa').html(cnpj);
    }

    function defineCodigoGrupoFornecedor() {
        BASE.LogFunction(arguments.callee, moduleName);

        var parametro = BASE.Util.GetQuerystringParameterByName('id');
        $('#CodigoGrupoFornecedor').val(parametro);
    }

    function posCriarEditar() {
        carregarHistorico();

        bindObterFornecedorAutoComplete();
        bindTextArea('#Observacao');
        CRUDFILTRO.Filtrar();
    }

    function posSalvar() {
        carregarHistorico();
    }

    function ajustarTela() {
        $('#btnFiltroAvancado').hide();
        $('#divToolbar #btnNovo span').text("Adicionar Fornecedor");
    }

    function carregarHistorico(idGrupo) {
        BASE.LogFunction(arguments.callee, moduleName);

        idGrupo = BASE.Util.GetQuerystringParameterByName('id');

        $.ajax({
            type: "GET",
            url: "/ManutencaoGrupoFornecedor/ListarHistorico",
            data: { idGrupo: idGrupo },
            success: function (data) {
                $('#div-listar-historico').html(data);

                //chamar datatables?

            },
            error: function (data) {
                BASE.Mensagem.Mostrar("Erro ao carregar historico!", TipoMensagem.Alerta);
            }
        });

        bindBtnHistorico();
        bindTextArea('#JustificativaHistorico');
    };

    return {
        Init: init,
        Evento: {
            Carregar: function () { return false; }
        }
    };

}());

$(function () {
    MANUTENCAOGRUPOFORNECEDOR.Init();
    CRUDFILTRO.Carregar();
    //CRUDFILTRO.Filtrar();
});
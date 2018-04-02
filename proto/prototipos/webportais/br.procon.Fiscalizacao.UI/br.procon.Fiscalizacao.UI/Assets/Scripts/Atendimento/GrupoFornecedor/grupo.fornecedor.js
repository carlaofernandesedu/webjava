var GRUPOFORNECEDOR = (function () {
    var moduleName = "GRUPOFORNECEDOR";

    function init() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindAll();
        CRUDBASE.Eventos.ModalPosCriar = atualizaGrid;
        CRUDBASE.Eventos.PosSalvar = atualizaGrid;
        CRUDBASE.Eventos.PosCarregarEditar = carregarModal;

        CONTROLES.Tabela.Configurar();

        $('#btnFiltroAvancado').hide();
    }

    function bindAll() {
        BASE.LogFunction(arguments.callee, moduleName);

        bindBtnManutencao();
    }

    function bindBtnManutencao() {
        BASE.LogFunction(arguments.callee, moduleName);
        $("#divLista").off("click", ".btn-manutencao");
        $("#divLista").on("click", ".btn-manutencao", function (e) {
            BASE.LogEvent(e, moduleName);
            var idManutencao = $(this).data("id");
            window.location = "/ManutencaoGrupoFornecedor?id=" + idManutencao;
        })
    }

    function atualizaGrid() {
        BASE.LogFunction(arguments.callee, moduleName);

        window.location = '/GrupoFornecedor';
    };

    function carregarModal() {
        BASE.LogFunction(arguments.callee, moduleName);

        CONTROLES.DropDown.Preencher('#TipoGrupo', 'GrupoFornecedor', 'ObterTipoGrupoFornecedor', null, false);

        if ($('#Codigo').val() == '0')
            $(".modal-title").text('Manter Grupo de Fornecedores');
        else
            $(".modal-title").text('Editar Grupo de Fornecedores');

        verificacaoStatusGruposParaFornecedores();
    }

    function verificacaoStatusGruposParaFornecedores() {
        BASE.LogFunction(arguments.callee, moduleName);

        $("#Situacao").off("click");
        $("#Situacao").on("click", function (e) {
            BASE.LogEvent(e, moduleName);
            //e.preventDefault();
            
            if ($('#Situacao').is(':checked') == false) {
                var parametro = parseInt($('#Codigo').val());

                if (parametro > 0) {
                    verificarGrupoQueSeraoDesativados();
                }
            }
        });
    }

    function verificarGrupoQueSeraoDesativados() {
        BASE.LogFunction(arguments.callee, moduleName);

        var parametro = $('#Codigo').val();

        $.ajax({
            type: "GET",
            url: "/ManutencaoGrupoFornecedor/ListarFornecedoresPorGrupo/",
            data: { idGrupo: parametro, somenteLeitura: true  },
            success: function (data) {
                if ($("#grupo_lista_relacionar.tblFornecedor > tbody > tr").length > 0) {

                    BASE.Modal.ExibirModalConfirmacao(
                     'Fornecedore(s) Vinculado(s) ao Grupo', 'A Inativação deste grupo, também inativará todos os Fornecedores associados a este grupo, deseja continuar?' + data,
                     'large',
                     'Sim',
                     'btn-primary',
                     'Não',
                     'btn-danger',
                      function () {
                          $('#Situacao').prop('checked', true);
                      },
                     null);
                }

            },
            error: function (data) {
                BASE.Mensagem.Mostrar("Erro ao carregar Grupo!", TipoMensagem.Alerta);
            }
        });
    }

    //function carregarPaginacao() {
    //    BASE.LogFunction(arguments.callee, moduleName);

    //    //$('#grid-grupo-fornecedor').dataTable({
    //    //    /*Coluna que não permite ordenação, partindo do array 0*/
    //    //    "aoColumnDefs": [
    //    //        {
    //    //            "bSortable": false,
    //    //            "aTargets": ["no-sort"],
    //    //        },
    //    //        {
    //    //            "word-wrap": "break-word",
    //    //            "aTargets": ["col-wrap"],
    //    //        }],

    //    //    /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
    //    //    "order": [[0, "asc"]],

    //    //    /*Resposividade da tabela*/
    //    //    responsive: false,
    //    //    destroy: true,
    //    //    bAutoWidth: false,
    //    //});
    //}

    return {
        Init: init
    };

}());

$(function () {
    GRUPOFORNECEDOR.Init();
    CRUDFILTRO.Carregar();
    CRUDFILTRO.Filtrar();
});
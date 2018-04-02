var FORNECEDOR = (function () {

    function init() {
        bindAll();

        CONTROLES.Tabela.Configurar();
    }
    function bindAll() {
        bindFiltrarPaginado();
    }

    function bindFiltrarPaginado() {
        $('.frm-filtro').off('click', '.acoes #btnFiltrarPaginado');
        $('.frm-filtro').on('click', '.acoes #btnFiltrarPaginado', function () {
            var tabela = $('table.dataTable').DataTable();
            tabela.page(1).draw();

            return false;
        });
    }


    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    FORNECEDOR.Init();
});


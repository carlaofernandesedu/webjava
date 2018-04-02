var USUARIO = (function () {

    function init() {       
        bindAll();

    }

    function bindAll() {
        bindFiltrar();
        bindLimpar();
    }

    function bindFiltrar() {
        $('#form-filtro .acoes #btnFiltrarPaginado').off('click');
        $('#form-filtro .acoes #btnFiltrarPaginado').on('click', function () {
            var tabela = $('table.dataTable').DataTable();
            tabela.page(1).draw();

            return false;
        });
    }

    function bindLimpar() {
        $('#form-filtro .acoes #btnLimparPaginado').off('click');
        $('#form-filtro .acoes #btnLimparPaginado').on('click', function () {
            var form = $('.frm-filtro');

            console.log(form);;
            form[0].reset();
            form.find("input").not('.fixo').val('');
        });
    }

    return {
        Init: init
    }
})();

$(function () {
    USUARIO.Init();
    CONTROLES.Tabela.Configurar();
});
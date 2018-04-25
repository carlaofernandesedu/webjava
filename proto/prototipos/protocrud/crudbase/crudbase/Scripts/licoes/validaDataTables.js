var DATATABLESNET = (function () {

    function init() {
        bindAll();
    }

    function bindAll() {
        bindDataTable();
    }

    function bindDataTable() {
        $("#tabela01").DataTable();
    }

    return {
        Init:init
    }

}());

$(function () {
    DATATABLESNET.Init();
});
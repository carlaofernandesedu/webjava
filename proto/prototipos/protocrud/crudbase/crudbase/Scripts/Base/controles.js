var CONTROLES = (function () {

    function init() {

    }
    //https://malot.fr/bootstrap-datetimepicker/
    function configurarDatePicker(seletorObjeto) {
        $(seletorObjeto).datetimepicker({
            minView: 2,
            language: 'pt-BR',
            format: 'dd/mm/yyyy',
            autoClose:true
        });
    }

    return {
        Init: init,
        Configurar:
        {
                DatePicker: configurarDatePicker
        }
    }
})();

$(function () {
    CONTROLES.Init();
});
SETORFISCALIZACAO = (function () {

    function Init() {
        bindAll();
    }


    function bindAll() {
        bindAcaoBotao();
    }

    function bindAcaoBotao() {
        return false;
    }


    function validarDados() {


        var form = $('#form_setorfiscalizacao');

        if ($.validator != undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            console.warn('problema no jQuery validator');
        }

        return form.valid();
    }

    function voltarIndex() {
        window.location.replace('/Setor/Index');
    }


    return {
        Init: function () {
            Init();
        }
    }


}());

$(function () {
    SETORFISCALIZACAO.Init();
});



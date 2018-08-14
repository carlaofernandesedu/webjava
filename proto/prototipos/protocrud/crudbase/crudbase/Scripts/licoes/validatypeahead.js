'use strict';
var VALIDATYPEAHEAD = (function () {
    function init() {
        bindAll();
    }

    function bindAll()
    {
        bindTypeAhead();
    }

    function bindTypeAhead() {
        CONTROLES.Typeahead.Configurar();
        $("#type02").typeahead({
            onSelect: function (item) {
                $("#hidtype02").val(item.value);
            },
            ajax: {
                url: '/Home/ObterDadosAhead',
                triggerLength: 4,
                dataType: "json",
                displayField: "Text",
                valueField: "Value",
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    var listaSerie = [];
                    if (data.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta);
                        return false;
                    }

                    return data;
                }
            }
        });
    }

    return {
        Init: init 
    }
}());

$(function () {
    VALIDATYPEAHEAD.Init();
});
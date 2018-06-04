var VALIDACHECKRADIO = (function () {
    'use strict';

    var controleCheck = '.chkitens';
    var controleCheckSelecionados = '.chkitens:checked';
    var controleRadio = 'input[name=radioitens]';
    var controleCheckSelecionaTodos = '#chkselectall';

    function init() {
        bindAll();
    }

    function bindAll() {
        bindCheckSelecionarTodos();
        bindSelecionarRadio();
    }

    function bindCheckSelecionarTodos() {
        $(controleCheckSelecionaTodos).off('change');
        $(controleCheckSelecionaTodos).on('change', function () {  //"select all" change 
            $(controleCheck).prop('checked', $(this).prop("checked")); //change all ".checkbox" checked status
        });

        //".checkbox" change
        $(controleCheck).off('change');
        $(controleCheck).on('change', function () {
            //uncheck "select all", if one of the listed checkbox item is unchecked
            if (false == $(this).prop("checked") && $(controleCheckSelecionaTodos).length > 0) { //if this item is unchecked
                $(controleCheckSelecionaTodos).prop('checked', false); //change "select all" checked status to false
            }
            //else {
            //    var id = $(this).data('id');
            //    var radio = $(controleRadio);
            //    if (radio.data('id') == id) {
            //        $(this).prop('checked', false);
            //    }
            //}
            //check "select all" if all checkbox items are checked
            if ($(controleCheckSelecionados).length == $(controleCheck).length && $(controleCheckSelecionaTodos).length > 0) {
                $(controleCheckSelecionaTodos).prop('checked', true);
            }
        });
    }

    function bindSelecionarRadio() {
        $(controleRadio).off('change');
        $(controleRadio).on('change', function () {
            if ($(this).prop("checked") && $(controleCheckSelecionados).length > 0) {
                var id = $(this).data('id');
                $(controleCheckSelecionados).each(function () {
                    if ($(this).attr('data-id') == id) {
                        $(this).click();
                    }
                });
            }
        });
    }

    return {
        Init: init
    }
}());
$(function () {
    VALIDACHECKRADIO.Init();
});


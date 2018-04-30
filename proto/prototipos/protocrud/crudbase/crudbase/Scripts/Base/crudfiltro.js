var CRUDFILTRO = (function () {
    var moduleName = "CRUDFILTRO";

    function init() {
      //  BASE.LogFunction(arguments.callee, moduleName);

        CRUDFILTRO.ElementoResultado = $("#divLista");
        bindAll();
        //CRUDFILTRO.Carregar = function () { BASE.Debug('funcao Carregar nao definida'); return false; };

        var carregarLista = CRUDFILTRO.ElementoResultado.data('carregar-lista');

        if (carregarLista) {
            CRUDFILTRO.Filtrar();
        }
    }

    function bindAll() {
        bindFiltrar();
        bindLimparFiltro();
    }

    function bindLimparFiltro() {
        BASE.LogFunction(arguments.callee, moduleName);

        $('.frm-filtro').off('click', '.acoes #btnLimpar');
        $('.frm-filtro').on('click', '.acoes #btnLimpar', function () {
            console.log("bindLimparFiltro - click");

            var form = $('.frm-filtro');

            form[0].reset();

            CONTROLES.DropDown.Desabilitar('.frm-filtro .ddl-chain-filho', true);

            return false;
        });

        $('.frm-filtro input').keypress(function (e) {
            if (e.keyCode === 13) {
                filtrar(true);

                return false;
            }
        });
    }

    function bindFiltrar() {

    }

    function filtrar() {

    }

    return {
        Init: init,
        ElementoResultado: null,
        Carregar: function () {// BASE.Debug('funcao CRUDFILTRO Carregar nao definida'); 
            return false;
        },
        Evento: {
            PreListar: function () { //BASE.Debug('funcao CRUDFILTRO PreListar nao definida'); 
                return false;
            },
            PosListar: function () { //BASE.Debug('funcao CRUDFILTRO PosListar nao definida'); 
                return false;
            },
            PosFitrarErro: function () { //BASE.Debug('funcao CRUDFILTRO PosFitrarErro nao definida'); 
                return false;
            }
        },
        Filtrar: filtrar
    };

}());


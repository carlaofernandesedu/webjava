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
        //BASE.LogFunction(arguments.callee, moduleName);

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
        //BASE.LogFunction(arguments.callee, moduleName);

        $('.frm-filtro').off('click', '.acoes #btnFiltrarPaginado');
        $('.frm-filtro').on('click', '.acoes #btnFiltrarPaginado', function (e) {
            //BASE.LogEvent(e, moduleName);

            var tabela = $('table.dataTable').DataTable();
            tabela.page(1).draw();

            return false;
        });

        $('.frm-filtro').off('click', '.acoes #btnFiltrar');
        $('.frm-filtro').on('click', '.acoes #btnFiltrar', function (e) {
            //BASE.LogEvent(e, moduleName);

            filtrar(true);

            return false;
        });

        $('.frm-filtro input').keypress(function (e) {
            if (e.keyCode === 13) {
                filtrar(true);

                return false;
            }
        });
    }

    function filtrar(filtrado, limpar) {
       // BASE.LogFunction(arguments.callee, moduleName);

        var data = CRUDFILTRO.Evento.PreListar();

        //if ($('table.dataTable').attr('id') !== "grupo_lista_relacionar") {
        //    var tabela = $('table.dataTable').DataTable();
        //    tabela.page(1).draw();
        //    return false;
        //}
      

        var form = $('.frm-filtro');
        var url = form.attr('action');
        var method = form.attr('method');

        if (form.length === 0) {
           // BASE.Debug(".frm-filtro não encontrado!");
        }

        var div = form.closest('.divFiltro');
        if (div.length === 0) {
            div = form.find('.divFiltro');
        }

        var campos = div.find("input:visible, select:visible").not('[readonly]');
        var camposVazios = div.find("input:visible, select:visible").not('[readonly]').filter(function () { return $(this).val() === '' || $(this).val() === null; });

        var existeFiltro = campos.length !== camposVazios.length;
        if (filtrado && existeFiltro === false && (limpar === false || limpar === undefined)) {
            BASE.Mensagem.Mostrar("Favor preencher um dos campos para efetuar a pesquisa!", TipoMensagem.Alerta);
            return false;
        }

        //BASE.Mensagem.Mostrar("Pesquisa", TipoMensagem.Informativa);
        if (url !== undefined || filtrado === false || (filtrado === true && existeFiltro)) {
            //BASE.Debug("filtrar - ajax request", DebugAction.Info);

            CRUDFILTRO.ElementoResultado.html('<div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i></div>');

            $.ajax({
                url: url,
                data: (data !== false && data !== undefined) ? data : form.serialize(),
                type: method,
                cache: false,
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);
                    if (isJson) {
                        BASE.Util.TratarRespostaJson(response);
                        CRUDFILTRO.Evento.PosFitrarErro();
                    }
                    else {
                        carregarLista(response);
                        CRUDFILTRO.Evento.PosListar();
                        CONTROLES.Tabela.Configurar();
                    }
                },
                error: function (xhr) {
                    console.log('err');
                    BASE.Util.TratarErroAjax(xhr, true);
                },
                complete: function () {
                    //BASE.SpinnerOff("#divLista");
                }
            });
        }

        function carregarLista(html) {
            CRUDFILTRO.ElementoResultado.html(html);
            CRUDFILTRO.ElementoResultado.fadeIn();
        }

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


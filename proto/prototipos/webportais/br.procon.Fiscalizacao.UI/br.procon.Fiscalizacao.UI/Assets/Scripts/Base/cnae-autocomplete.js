(function (window, document, $, undefined) {
 
    window.cnaeAutocomplete = {};

    cnaeAutocomplete.init = function () {
        cnaeAutocomplete.find();
    }

    cnaeAutocomplete.find = function () {
        $("#CNAE_Descricao").typeahead({
            onSelect: function (item) {
                $("#CNAE_Codigo").val(item.value);
            },
            ajax: {
                url: "/CNAE/RetornarCnaeComRamoDeAtividade",
                triggerLength: 3,
                dataType: "json",
                displayField: "Descricao",
                valueField: "Codigo",                
                preDispatch: function (query) {
                    return { query: query, ehCombustivel: /Registro/i.test(window.location.pathname) }
                },
                preProcess: function (data) {
                    if (data.lista.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                        return false;
                    }
                    return data.lista;
                }
            }
        });
    }
   
    $(document).on("ready", cnaeAutocomplete.init);

})(window, document, jQuery);
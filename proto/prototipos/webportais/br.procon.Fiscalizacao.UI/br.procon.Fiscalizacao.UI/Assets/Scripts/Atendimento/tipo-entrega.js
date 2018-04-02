var TIPOENTREGA = function () {
    var moduleName = "TIPOENTREGA";

    "use strict";

    var divComponente = "#componente-tipo-entrega #lista-tipo-entrega";

    function init() {
    }

    function obterParametrosTipoEntrega(idFichaAtendimento, callback) {
        BASE.LogFunction(arguments.callee, moduleName);
        $("#componente-tipo-entrega").hide();

        if (idFichaAtendimento > 0) {

            $.ajax({
                url: "/Cip/DefinirTipoDeEntrega",
                type: "GET",
                cache: false,
                data: { idFichaAtendimento: idFichaAtendimento },
                success: function (response, status, xhr) {

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson) {
                        if (response.length > 0) {
                            percorrerListaTipoAlerta(response);
                            $("#componente-tipo-entrega").show();
                        }
                    }

                    if (callback !== undefined)
                        callback();
                },
                error: function (response, status, xhr) {
                    console.log("erro ao criar lista");
                }
            });
        }
        else {
            console.log("erro ao gerar parametros de tipo de entrega");
        }
    }

    function percorrerListaTipoAlerta(listaTipoEntrega) {
        BASE.LogFunction(arguments.callee, moduleName);
        $(divComponente).empty();
        $.each(listaTipoEntrega, function (key, item) {
            criarOptionsTipoAlerta(item.Value, item.Text, item.Selected);
        });
    }

    function criarOptionsTipoAlerta(value, titulo, selected) {
        BASE.LogFunction(arguments.callee, moduleName);
        var label = $("<label class='list-group-item' />");
        var radioBtn = $("<input />", { type: "radio", name: "IdTipoAtendimentoEnvioCIP", value: value, checked: selected });

        radioBtn.appendTo(label);
        radioBtn.after(" ".concat(titulo));
        label.appendTo(divComponente);
    }

    return {
        Init: init,
        ObterParametrosTipoEntrega: obterParametrosTipoEntrega
    };
}();

$(function () {
    TIPOENTREGA.Init();
});
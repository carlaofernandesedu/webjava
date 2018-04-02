MONITORARALERTA = (function () {

    function init() {
        bindAll();
    }

    function bindAll() {
        bindPesquisarAlertaGerado();
        bindComboTipoAlertaDaoc();
    }

    function bindComboTipoAlertaDaoc() {
        CONTROLES.DropDown.Preencher("#frmFiltroMonitorarAlerta #IdTipoAlertaDaoc", "ManterAlertadaDaoc", "ComboTipoAlertaDaoc", null, true, null, null, null);
    }

    function bindPesquisarAlertaGerado(parameters) {
        $("#frmFiltroMonitorarAlerta #btn-pesquisar").off("click");
        $("#frmFiltroMonitorarAlerta #btn-pesquisar").on("click", function () {
            
            var form = $("#frmFiltroMonitorarAlerta").serializeObject();
            pesquisarAlertaGerado(form);
        });
    }

    function pesquisarAlertaGerado(filtro) {

        $.ajax({
            url: "/MonitorarAlerta/Listar",
            type: "GET",
            data: filtro,
            cache: false,
            success: function (response, status, xhr) {
              
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    BASE.Util.RenderHtml("divLista", response, posFiltrar);
                }

            },
            error: function () {

            }
        });
    }

    function posFiltrar(parameters) {
        CONTROLES.Tabela.Configurar();
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    MONITORARALERTA.Init();
    CRUDFILTRO.Filtrar();
});
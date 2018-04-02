var ATENDIMENTOFISCALIZACAO = (function () {
    function init() {
        bindAll();
    }

    //function bindComboTipoAtendimento() {
    //    CONTROLES.DropDown.Preencher("#frmFiltroMonitorarAlerta #IdTipoAlertaDaoc", "ManterAlertadaDaoc", "ComboTipoAlertaDaoc", null, true, null, null, null);
    //}

    function bindAll() {
        bindEncerrarAtendimentoFiscalizao();
        bindPesquisar();
    }

    function bindPesquisar() {
        $("#btnFiltrar").off("click");
        $("#btnFiltrar").on("click", function () {

            var obj = $('#frmFiltroAtendimentoFiscalizacao').serializeObject();

            $.ajax({
                url: "/AtendimentoFiscalizacao/Pesquisar",
                data: obj,
                type: "POST",
                success: function (response, status, xhr) {               

                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (!isJson) {
                        renderHtml(response);
                       
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log("Erro ao pesquisar documento");
                }
            });

        });
    }

    function bindEncerrarAtendimentoFiscalizao() {
        $("#atendimentoFiscalizacao #encerrarConsulta").off("click");
        $("#atendimentoFiscalizacao #encerrarConsulta").on("click", function () {
            console.log("executando encerramento de consulta");
            var idFichaAtendimento = $(this).data("id-ficha-atendimento");
            ATENDIMENTOBASE.Evento.PosSalvar = exibirModalAlerta;
            ATENDIMENTOBASE.Acao.EncerrarAtendimento(idFichaAtendimento);
        });
    }

    function renderHtml(view) {
        $('#divLista').html(view);
    }

    function exibirModalAlerta() {
        BASE.Modal.ExibirModalAlerta("Atendimento Encerrado!",
                       "Atendimento encerrado com sucesso!<br>" +
                       "Estaremos redirecionando para fila de atendimento.",
                       "small", "OK",
                       "btn-primary",
                       function () {
                           window.location = "/AtendimentoFiscalizacao";
                       });
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
    ATENDIMENTOFISCALIZACAO.Init();
    CRUDFILTRO.Filtrar();
});
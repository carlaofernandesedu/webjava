var RECLASSIFICAR = (function () {
    function init() {
        console.log('RECLASSIFICAR - init');
        bindAll();
    }
    function bindAll() {
        reclassificar();
        preencherDadosReclassificacao();

        var ddl = $("#ddlTipoPedidoConsumidorAtual");
        var hdn = $("#hdnIdTipoPedidoConsumidor");

        var callBackCarregaPedidoConsumidor = function () {
            carregaDescricaoPedido('#ddlTipoPedidoConsumidorAtual');

            bindChangePedido();
        };

        ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor($("#IdClassificacao").val(), callBackCarregaPedidoConsumidor, ddl, hdn);

        var ddl = $("#ddlTipoPedidoConsumidor");
        ATENDIMENTOBASE.Dropdown.CarregarPedidoConsumidor($("#IdClassificacao").val(), null, ddl, hdn);

        ddl = $("#ddlMeioAquisicaoAtual");

        var callBackCarregaMeioAquisicao = function () {
            var aquisicao = $('#hdnIdMeioAquisicao').val();
            $('#ddlMeioAquisicaoAtual').val(aquisicao);
        };       

        ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao($("#IdClassificacao").val(), callBackCarregaMeioAquisicao, ddl);

        ddl = $("#ddlMeioAquisicao");

        ATENDIMENTOBASE.Dropdown.CarregarMeioAquisicao($("#IdClassificacao").val(), null, ddl);

        $("#divPedidoAbatimentoOuCancelamento").toggle(false);
        $("#divOutroPedido").toggle(false);
    }

    function bindChangePedido() {
        console.log('bindChangePedido');

        $("body").off("change", "#ddlTipoPedidoConsumidor");
        $("body").on("change", "#ddlTipoPedidoConsumidor", function () {
            console.log('bindChangePedido - change');

            var abatimento = $("#ddlTipoPedidoConsumidor option:contains('abatimento'):selected").length > 0;
            var cancelamento = $("#ddlTipoPedidoConsumidor option:contains('cancelamento'):selected").length > 0;
            var outros = $("#ddlTipoPedidoConsumidor option:contains('outros'):selected").length > 0;
            //var descricaoPedido = $('#DescricaoPedido').val();

            var exibir = abatimento || cancelamento;

            if (exibir) {
                $("#div_editar #divPedidoAbatimentoOuCancelamento").toggle(exibir);
            }
            else {
                $("#div_editar #divPedidoAbatimentoOuCancelamento").toggle(false);
                $("#div_editar #divOutroPedido").toggle(false);

                $('#div_editar #divPedidoAbatimentoOuCancelamento #divBanco #Banco').val('');
                $('#div_editar #divPedidoAbatimentoOuCancelamento #divAgencia #Agencia').val('');
                $('#div_editar #divPedidoAbatimentoOuCancelamento #divConta #Conta').val('');
            }

            if (outros) {
                $("#div_editar #divOutroPedido #OutroPedido").val('');
            }
            /*
            else {
                $("#div_editar #divOutroPedido #OutroPedido").val('');
            }

            */

            $("#div_editar #divOutroPedido").toggle(outros);
        });
    }

    function carregaDescricaoPedido(nomeCombo) {
        var tipoPedido = $('#hdnIdTipoPedidoConsumidor').val(),
            descricaoPedido = $('#DescricaoPedido').val();

        if (tipoPedido == "" || tipoPedido == undefined) {
            return;
        }

        if ($(nomeCombo + " option[value='" + tipoPedido + "']").length > 0) {
            $('#ddlTipoPedidoConsumidor').val(tipoPedido);
        }
        else {
            if (tipoPedido == "39" && descricaoPedido != undefined && descricaoPedido != "") {
                $(nomeCombo).val(tipoPedido); // OUTROS
                $('#OutroPedido').val(descricaoPedido);
            }
            else {
                $(nomeCombo).val("");
            }
        }

        var outros = $(nomeCombo + " option:contains('outros'):selected").length > 0;

        if (outros) {
            $("#divOutroPedido #OutroPedido").val(descricaoPedido);
        }
        else {
            $("#divOutroPedido #OutroPedido").val('');
        }

        $("#divPedidoAbatimentoOuCancelamento").toggle(false);
        $("#divOutroPedido").toggle(outros);
    }

    function reclassificar() {
        console.log('reclassificar');

        $("#reclassificar").off("click");
        $("#reclassificar").on("click", function () {
            console.log('reclassificar - click');

            var form = $("#form-reclassificar"),
               valido = validarDados(form);

            if (valido) {
                var descricao = $('select[Name="IdFormaPagamento"] option:selected').text();
                $("#DescricaoFormaPagamento").val(descricao);              

                var obj = $("#form-reclassificar").serializeObject();

                $.ajax({
                    url: "/Classificacao/Reclassificar/",
                    data: obj,
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            window.location.href = "../AtendimentoTecnico/AtendimentoSolicitacaoRealizarAnalisePerfilTecnico?idFicha=" + parseInt($("#IdFichaAtendimento").val()) + "&verificarDuplicidade=false";
                        }
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log('erro !');
                        console.log(xmlHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
            else {
                form.validate();
            }
        });
    }

    function preencherDadosReclassificacao() {
        console.log('preencherDadosReclassificacao');

        $("#alterarClassificacao").off("click");
        $("#alterarClassificacao").on("click", function () {
            console.log('preencherDadosReclassificacao - click');

            if ($("#hdClassificacaoAnterior").val() > 0 && $("#IdClassificacao").val() == '') {
                $("#IdClassificacao").val($("#hdClassificacaoAnterior").val());
            }
            if ($("#IdClassificacao").val() > 0) {
                if ($("#hdClassificacaoAnterior").val() === $("#IdClassificacao").val()) {
                    BASE.MostrarMensagem("Classificação não existe ou não foi alterada.", TipoMensagem.Error, "Aviso");
                    return false;
                }
                window.location = "/AtendimentoTecnico/Reclassificar?idficha=" + $("#IdFichaAtendimento").val() + "&" + "idClassificacao=" + $("#IdClassificacao").val();
            }
            else {
                BASE.MostrarMensagem("Favor Preenche a Classificação.", TipoMensagem.Alerta, "Aviso");
            }
        });
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') === 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb !== null) {
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

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    RECLASSIFICAR.Init();
});
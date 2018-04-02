var DADOSCOMPRA = (function () {
    function init() {
        bindAll();
    }
    function bindAll() {
        alterarDadosCompra();
    }

    function alterarDadosCompra() {
        $("#alterarDadosCompra").off('click');
        $("#alterarDadosCompra").on('click', function () {
            var form = $("#form-dados-compra"),
               valido = validarDados(form);
           
            var obj = $('#form-dados-compra').serializeObject();            

            obj.DescricaoFormaPagamento = $('#IdFormaPagamento option:selected').text();

            if (valido) {
                var descricao = $('select[Name="IdFormaPagamento"] option:selected').text();
                $('#DescricaoFormaPagamento').val(descricao);
                $.ajax({
                    url: '/AtendimentoTecnico/AlterarDadosCompra/',
                    data: obj,
                    type: 'post',
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            window.location = "/AtendimentoTecnico/AtendimentoSolicitacaoRealizarAnalisePerfilTecnico?idficha=" + $('#IdFichaAtendimento').val() + '&verificarDuplicidade=false';
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('erro !');
                        console.log(XMLHttpRequest);
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

    $.fn.serializeObject = function () {
        var o = {};
       
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
    DADOSCOMPRA.Init();
});
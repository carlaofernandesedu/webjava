var PREVISUALIZARCIP = (function () {
    function init() {
        bindAll();
    }

    function bindAll() {
        bindSalvarCip();
        bindbtnVoltarEdicaoFicha();
      
        PESQUISAR_MENSAGENS.Init(
           "Pesquisar em Texto Padrão",
           "#modal-resposta-padrao",
           "#Resposta",
           "button#incluir-resposta-padrao",
           ""
        );

        $("#Resposta").rules("remove", "required");

        carregaPreviaDocumento();

    };

    function bindbtnVoltarEdicaoFicha() {
        $('#btnVoltarEdicaoFicha').off('click');
        $('#btnVoltarEdicaoFicha').on('click', function () {                   

            var idFicha = $("#IdFichaAtendimento").val();
            var tipoDeAtendimento = $("#TipoAtendimento").val();
            var idConsumidor = $("#IdConsumidor").val();
            var idFornecedor = $("#IdFornecedor").val();
            var documento = 'gerado';           

            localStorage.removeItem('form_cip');
            
            if(getUrlParameter('urlref') == "pesquisa"){
                window.location = '/PesquisarAtendimento/EditarAtendimento?idFicha=' + idFicha;

            }
            else{
                window.location = '/AtendimentoConsumidor?idConsumidor=' + idConsumidor + '&idFornecedor=' + idFornecedor + '&doc=' + documento + '&tipoAtendimento=' + tipoDeAtendimento + '&idFicha=' + idFicha + '&etapa=ficha_edicao';

            }

        });
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function bindSalvarCip() {
        $("#form-cip #btnSalvarCip").on("click", function (e) {
            var form = $(this).closest('form');

            if (form.valid()) { 
            
                var data = $('#form-cip').serializeObject();   

                data.Resposta = $(' .Editor-editor').html();       

                var model = JSON.stringify(data);

                localStorage.setItem('form_cip', model);

                form.submit();
            }
            else {
                console.log('invalido');
            }

            return false;
        });
    }

    function carregaPreviaDocumento(){

        var form  = '#form_cip';
        var data = localStorage.getItem('form_cip');
        
        if(data != null && data != undefined){

            data = JSON.parse(data);            
            $(' .Editor-editor').html(data.Resposta);

        }

    }

    function populaForm(form, data) {
        $.each(data, function (name, val) {
            var formId = '#' + $(form).prop('id');
            var $el = $(formId + ' [name="' + name + '"]'),
                type = $el.attr('type');

            switch (type) {
                case 'checkbox':
                    val === 'true' ? $el.attr('checked', true) : $el.attr('checked', false);
                    break;
                case 'radio':
                    $el.filter('[value="' + val + '"]').attr('checked', 'checked');
                    if ($el.filter('[value="' + val + '"]').parent().hasClass('btn'))
                        $el.filter('[value="' + val + '"]').parent().addClass('btn-primary active');
                    break;
                default:
                    $el.val(val);
            }
        });
    }

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], textarea, input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function () {
            if ($(this).attr('type') == 'hidden') {
                //if checkbox is checked do not take the hidden field                
                var $parent = $(this).parent(); var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(elemValue || '');
            }
            else {
                o[this.name] = elemValue || '';
            }
        }); return o;
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    PREVISUALIZARCIP.Init();
});
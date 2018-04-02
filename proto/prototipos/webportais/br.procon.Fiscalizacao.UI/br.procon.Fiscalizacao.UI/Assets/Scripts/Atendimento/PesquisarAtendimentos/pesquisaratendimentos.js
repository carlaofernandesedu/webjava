var PESQUISARATENDIMENTOS = (function () {

    var form  = '#filtrar';

    var filtro = "";

    function init() {       

        var url  = ATENDIMENTOBASE.Redirect.Obter();

        if(url != undefined && url.split('filtro=').length > 1){
            filtro = ATENDIMENTOBASE.Redirect.Obter().split('filtro=')[1];

        }

        if(filtro != undefined && filtro != ""){
                
            var data = JSON.parse(atob(unescape(encodeURIComponent(filtro))));

            populaForm(form, data);

        }       

        CONTROLES.Tabela.Configurar();
        bindAll();

    }

    function bindAll() {
        bindBtnFiltrarPaginado();
        bindBtnLimpar();

    }
  

    function bindBtnFiltrarPaginado() {
        $('#frmFiltroPesquisarAtendimento #btnFiltrarPaginado').off('click');
        $('#frmFiltroPesquisarAtendimento #btnFiltrarPaginado').on('click', function (e) {

            var model = $('#filtrar').serializeObject();

            var filtroBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(model))));
            
            ATENDIMENTOBASE.Redirect.Definir('/PesquisarAtendimento?filtro=' + filtroBase64);           
           

        });
    }

    function bindBtnLimpar() {
        $('#frmFiltroPesquisarAtendimento #btnLimpar').off('click');
        $('#frmFiltroPesquisarAtendimento #btnLimpar').on('click', function (e) {
            
            ATENDIMENTOBASE.Redirect.Definir('/PesquisarAtendimento');

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

   
    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    PESQUISARATENDIMENTOS.Init();
    CRUDFILTRO.Carregar();
});
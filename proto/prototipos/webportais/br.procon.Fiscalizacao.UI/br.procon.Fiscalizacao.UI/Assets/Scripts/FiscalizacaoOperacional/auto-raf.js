AUTORAF = (function () {
      
    var tbAutoRaf = "tbAutoRaf_S456FH734FH";

    function init() {
        $('#divLocalFiscalizadoRaf').show();

        bindAll();
    }

    function bindAll() {
        formatarMascara();
        MENUAUTO.BindControlesTela();

        $('input[type="radio"], input[type="checkbox"], input[type="text"], input[type="checkbox"], select').on('change', function () {
            FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #tipoAutuacao');
        });
    }

    function formatarMascara() {
        formatarMascaras($('.tipo-documento-responsavel:checked').val());
        $('.tipo-documento-responsavel').change(function () {
            formatarMascaras($(this).val());
        });
    }

    function formatarMascaras(object) {            
        $('#NumeroDocumentoResponsavelFornecedor').removeAttr('placeholder');
        $("#NumeroDocumentoResponsavelFornecedor").attr('maxlength', '14');

        if (object === "CPF") {          
            $("#NumeroDocumentoResponsavelFornecedor").mask('000.000.000-00', { placeholder: '___.___.___-__' });
        }
        else {
           
            $("#NumeroDocumentoResponsavelFornecedor").unmask();
        }
    }

    return {
        Init: init,
        TblLocalStorageItensRaf: tbAutoRaf
    };

}());

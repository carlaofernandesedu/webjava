AUTOAPREENSAO = (function () {

    var tbItensApreensao = "tbItensApreensao_S456FH734FH";

    function init() {
        $('#divLocalFiscalizadoRaf').hide();
     
        formatarMascara();
        MENUAUTO.BindControlesTela();

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
        TblLocalStorageItensApreensao: tbItensApreensao
    }

}());
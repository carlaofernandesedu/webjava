  
AUTOCONSTATACAO = (function () {
    var tbAutoConstatacao = "tbAutoConst_KJHKHJKJHJKH";
    function init() {
        $('#divLocalFiscalizadoRaf').hide();

        bindAll();
    }
     
    function bindAll() {
        formatarMascara();
        MENUAUTO.BindControlesTela();
    }
    /*-------------------- ITENS DE APREENSÃO (AUTO NOTIFICAÇÃO) ---------------------*/
    function binHideItens() {
        $('#incluiApreensaoNotif').prop('checked', false);
        $('#itensApreensaoNotif').hide();
        //$('#itensApreensaoNotif table').hide();
    }
    /*--- INCLUI / EDITA ITEM APREENSÃO ---*/
    function bindIncluirItemApreensaoNotif() {
        var incluirItemApreensaoNotif = function () {
            $('#modalIncluirItemApreendidoNotif').modal();
            $('#modalIncluirItemApreendidoNotif textarea').val('');
        }
    }
    function bindEditarItemApreendidoNotif() {
        var editarItemApreendidoNotif = function () {
            $('#modalEditarItemApreendidoNotif').modal()
        }
    }

    function bindModalIncluirItemCancelar() {
        $('#modalIncluirItemApreendidoNotif .btn-danger').click(function () {
            if ($('#modalIncluirItemApreendidoNotif input').val() == '') {
                $('#incluiApreensaoNotif').prop('checked', false);
            }
        });
    }

    function bindModalIncluirItemConfirmar() {
        $('#modalIncluirItemApreendidoNotif .btn-primary').click(function () {
            $('#itensApreensaoNotif table').show();
        });
    }

    function bindModalIncluirItemEditar() {
        $('#modalEditarItemApreendidoNotif .btn-primary').click(function () {
            $('#itensApreensaoNotif table').show();
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
        TblLocalStorageItensConstatacao: tbAutoConstatacao
    }


   
}());

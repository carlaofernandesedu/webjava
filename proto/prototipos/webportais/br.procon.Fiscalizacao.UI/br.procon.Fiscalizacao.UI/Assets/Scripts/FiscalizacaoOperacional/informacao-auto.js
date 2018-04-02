INFORMACAOAUTO = (function () {

    var hierarquiaSeletores = '#formInfoAuto';
    var _observacoesRAF = 'O PRESENTE DOCUMENTO APENAS ATESTA QUE, NO DIA E HORA ABAIXO INDICADOS, A EQUIPE DE FISCALIZAÇÃO DA FUNDAÇÃO PROCON-SP REALIZOU UM ATO FISCALIZATÓRIO NAS INSTALAÇÕES COMERCIAIS DO FORNECEDOR EM QUESTÃO, NÃO TENDO SIDO LAVRADO, DURANTE A REFERIDA FISCALIZAÇÃO, NENHUM AUTO DE INFRAÇÃO. ESTE REGISTRO DE ATO FISCALIZATÓRIO NÃO PODE SER USADO COMO CERTIDÃO OU QUALQUER OUTRO DOCUMENTO QUE ATESTE A AUSÊNCIA DE INFRAÇÕES OU IRREGULARIDADES ÀS LEIS DE DEFESA DO CONSUMIDOR, ESPECIALMENTE AO CÓDIGO DE DEFESA DO CONSUMIDOR.';

    function init() {
        bindAll();
    }

    function carregaObsRAF() {
        return _observacoesRAF;
    }

    function bindAll() {
        REGISTRARAUTO.TratamentosEspecificos = tratamentosEspecificos;
        REGISTRARAUTO.PreCarregar = function () { return false };
        REGISTRARAUTO.Buscar();
        bindValidacaoCampos();
        validarRegras();
        bindClickContinuar();
        bindClickVoltar();
        tipoDocumentoChange();
        bindRadioButtons();
        bindCarregaObsRAF();

    }

    function bindCarregaObsRAF() {      

        var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));
        if (autoManual.TipoAuto === "5") {
            $('#inputInformacoesAuto').val(INFORMACAOAUTO.CarregaObsRAF());
        }
        else {
            $('#inputInformacoesAuto').val('');
        }
    }

    function bindRadioButtons() {
        $('input[name="tipoDocumento"]').off('click');
        $('input[name="tipoDocumento"]').on('click', function () { tipoDocumentoChange(); });
    }

    function bindValidacaoCampos() {

        $(hierarquiaSeletores).validate({
            rules: {
                InformacoesAuto: "required",
                NomeResponsavel: "required",
                NumeroDocumentoFornecedor: "required"
            },
            messages: {
                InformacoesAuto: "Campo obrigatório",
                NomeResponsavel: "Campo obrigatório",
                NumeroDocumentoFornecedor: "Campo obrigatório",
            }
        });
    }

    function bindClickContinuar() {
        $("#btnContinuar").off('click');
        $("#btnContinuar").on('click', function () {
            var form = $("#formInfoAuto");

            var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));           

            if (autoManual.TipoAuto == "1" || autoManual.TipoAuto == "4") {
                $('#inputNomeResponsavel').rules('remove');
                $('#inputNumeroDocumentoFornecedor').rules('remove');
            }

            var valido = REGISTRARAUTO.ValidarDados(form);

            if (valido) {

                salvarOpcaoRecusaAssinatura();
                salvar();

                REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #infAuto');
                REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #previaAuto');
                REGISTRARAUTO.ControlesMenu.ChecarOpcao('.vertical_nav #infAuto');

                REGISTRARAUTO.AbreFrame(5);
                BASE.Mensagem.Mostrar("Sucesso", TipoMensagem.Sucesso);
            }
            else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Error);
                form.validate();
            }
        });
    }

    function tratamentosEspecificos() {
        checkRecusaAssinatura();
    }

    function bindClickVoltar() {
        $("#btnVoltar").off('click');
        $("#btnVoltar").on('click', function () {            

            var indice = $(this).data('indice');
            REGISTRARAUTO.AbreFrame(indice);

            REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #infAuto');
            REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #diligencia');
        });
    }

    function validarRegras() {
        var regraInfoAuto1 = null,
            regraInfoAuto2 = null;

        regraInfoAuto1 = validarRegraSerie();
        regraInfoAuto2 = validarRegraNumeroSerie();

        if (regraInfoAuto1 == true && regraInfoAuto2 == true)
            REGISTRARAUTO.LiberarBotaoContinuar(true);
        else
            REGISTRARAUTO.LiberarBotaoContinuar(false);
    }

    function validarRegraSerie() {
        return true;
    }

    function salvar(callback) {

        var obj = $("#formInfoAuto").serializeObject(),
            autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));

        var tipoDocumento = $('input[name="tipoDocumento"]:checked').val();

        if (tipoDocumento == "1") {
            tipoDocumento = "RG";

        }
        else {
            tipoDocumento = "CPF";

        }

        autoManual.TipoDocumento = tipoDocumento;

        var diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        if (diligencia != null && diligencia != undefined && diligencia.CepEndereco != "") {
            autoManual.Diligencia = diligencia;          

        }

        autoManual = REGISTRARAUTO.CopiarPropriedades(obj, autoManual);
        REGISTRARAUTO.Salvar(autoManual);
    }

    function validarRegraNumeroSerie() {
        return true;
    }

    function tipoDocumentoChange() {

        $val = $(hierarquiaSeletores).validate();

        if ($(hierarquiaSeletores + ' #cpf').is(':checked')) {
            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').attr('maxlength', '14');
            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').mask('000.000.000-00');
            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').rules('remove');

            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').rules('add', {
                cpf: true,
                required: true,
                messages: {
                    required: "Campo obrigatório",
                    cpf: "O campo deve ser um CPF válido."
                }
            });

        } else {
            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').attr('maxlength', '14');
            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').unmask();

            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').rules("remove", "cpf");
            $('.field-validation-error[data-valmsg-for="NumeroDocumentoFornecedor"]').html('');
            $(hierarquiaSeletores + ' #inputNumeroDocumentoFornecedor').removeData("ruleCpf");
        }

        $val.resetForm();

    }

    function salvarOpcaoRecusaAssinatura() {
        if ($('#checkRecusaAssinatura').is(':checked')) {
            $('#inputRecusaAssinatura').val(true);
        } else {
            $('#inputRecusaAssinatura').val(false);
        }
    }

    function checkRecusaAssinatura() {
        var autoManual = JSON.parse(localStorage.getItem(REGISTRARAUTO.TblLocalStorageAutoManual));

        if (autoManual.RecusaAssinatura === 'true')
            $('#checkRecusaAssinatura').prop('checked', true);
        else
            $('#checkRecusaAssinatura').prop('checked', false);
    }

    return {
        Init: init,
        CarregaObsRAF: carregaObsRAF
    }
}());
DADOSFORNECEDOR = (function () {

    var formFornecedor = $("#formDadosFornecedor"),
        validate = null;

    function init() {
        REGISTRARAUTO.PreCarregar = preCarregar;
        REGISTRARAUTO.TratamentosEspecificos = posCarregar;
        bindAll();
        ENDERECOFISCALIZACAO.InitFuncoesModalFiscalizacao();       
    }

    function bindAll() {
        REGISTRARAUTO.Buscar();
        bindMascaraCnpj();
        bindMascara();     
        bindChangeTipoDoc();
        bindTipoDocumento();
        bindClickDocForn();
        bindKeyUpCnpjCpf();
        bindChangeCnae();      
        bindChangeCep();
        bindClickContinuar();
        bindClickVoltar();
        bindValidacaoCampos();       
        bindIniciarNumDocumento();
        bindFormulario();
        $('#formDadosFornecedor #inputNumeroEndereco').attr('maxlength', '5');

    }

    function bindFormulario() {
        bindValidacaoCampos();
        REGISTRARAUTO.LiberarBotaoContinuar(validate.checkForm());

        $('#formDadosFornecedor').off('keyup change', 'input, select, textarea');
        $('#formDadosFornecedor').on('keyup change', 'input, select, textarea', function () {
            REGISTRARAUTO.LiberarBotaoContinuar(validate.checkForm());
            console.log(validate);
            console.log(validate.checkForm());

        });

    }

    function bindValidacaoCampos() {       
        var tipoFornecedor = $('input[name="TipoFornecedor"]:checked').val();

        tipoFornecedor = (tipoFornecedor != null && tipoFornecedor != undefined) ? parseInt(tipoFornecedor) : tipoFornecedor;

        if (validate != null) { console.log("caindo no destroy"); validate.destroy(); }

        validate = $("#formDadosFornecedor").validate({
            rules: {
                NumeroCpfCnpj: {
                    required: true,
                    cnpj: true
                },
                CNAE_Codigo: { required: true },
                CNAE_Descricao: { required: true },
                NomeFornecedor: { required: true },
                NomeFantasia: { required: true },
                NumeroDocumento: { required: false },
                Telefone: {
                    //required: true,
                    //telefone: true
                },
                Fax: {
                    //required: true,
                    //telefone: true
                },
                NumeroCep: { required: true },
                Endereco: { required: true },
                NumeroEndereco: { required: true },
                NomeBairro: { required: true },
                NomeMunicipio: { required: true },
                Estado: { required: true },
                NomeEstado: { required: true }
            },
            messages: {
                NumeroCpfCnpj: {
                    required: "Campo obrigatório",
                    cnpj: "CNPJ Inválido"
                },
                CNAE_Codigo: "Campo obrigatório",
                CNAE_Descricao: "Campo obrigatório",
                NomeFornecedor: "Campo obrigatório",
                NomeFantasia: "Campo obrigatório",
                NumeroDocumento: "Campo obrigatório",
                Telefone: {
                    required: "Campo obrigatório"
                },
                Fax: {
                    required: "Campo obrigatório"
                },
                NumeroCep: "Campo obrigatório",
                Endereco: "Campo obrigatório",
                NumeroEndereco: "Campo obrigatório",
                NomeBairro: "Campo obrigatório",
                NomeMunicipio: "Campo obrigatório",
                Estado: "Campo obrigatório",
                NomeEstado: "Campo obrigatório"
            }
        });

        if (tipoFornecedor === 1) {
            $('#CPF_CNPJ').rules("remove", "cpf");
            $('#CPF_CNPJ').rules("add", { cnpj: true, messages: { cnpj: "CNPJ inválido" } });
        } else {
            $('#CPF_CNPJ').rules("remove", "cnpj");
            $('#CPF_CNPJ').rules("add", { cpf: true, messages: { cpf: "CPF inválido" } });
        }
    }

    function bindIniciarNumDocumento() {
        $('input[name="NumeroDocumento"]').prop("maxlength", 15);
        $('input[name="NumeroDocumento"]').mask('999.999.999.999');
    }

    function bindValidarTelefone() {
        $(hierarquiaSeletores + ' #inputTelefone').off('blur');
        $(hierarquiaSeletores + ' #inputTelefone').on('blur', function () {
            var tamanho = $(hierarquiaSeletores + ' #inputTelefone').val().length;
            if (tamanho > 0 && (tamanho !== 11 && tamanho !== 14)) {
                BASE.MostrarMensagemErro('Telefone inválido');
                $(this).focus();
            }
        });
    }

    function bindMascaraCnpj() {
        $('#CPF_CNPJ').mask('99.999.999/9999-99');
    }

    var maskBehaviorTel = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
        options = {
            onKeyPress: function (val, e, field, options) {
                field.mask(maskBehaviorTel.apply({}, arguments), options);
            }
        };


    function bindMascara() {
        $('.cnae').mask('99.99-9-99');
        $('.dataCNPJ input, .dataCPF input').mask('99/99/9999');
        $('.tel, .fax').mask(maskBehaviorTel, options);
        $('.cep').mask('99999-999');
        $('.num').mask('99999');

    }

    function unbindMascara() {
        $('.cnae').unmask();
        $('.dataCNPJ input, .dataCPF input').unmask();
        $('.tel, .fax').unmask();
        $('.cep').unmask();
        $('.num').unmask();
    }

    function bindChangeTipoDoc() {
        $('input[name="TipoFornecedor"]').off('click');
        $('input[name="TipoFornecedor"]').on('click', function () {
            validacaoPorTipoFornecedor($('input[name="TipoFornecedor"]:checked').val());
            validacaoPorTipoDocumento($('input[name="TipoFornecedor"]:checked').val());

            if ($('input[name="TipoFornecedor"]:checked').val() == 1) {
                $('#CPF_CNPJ').mask('99.999.999/9999-99');
                $('#CPF_CNPJ').val('');
                limparDadosFornecedor();
            } else {
                $('#CPF_CNPJ').mask('999.999.999-99');
                $('#CPF_CNPJ').val('');
                limparDadosFornecedor();
            }
        });

        validacaoPorTipoFornecedor($('input[name="TipoFornecedor"]:checked').val());
        validacaoPorTipoDocumento($('input[name="TipoFornecedor"]:checked').val());
    }

    function bindTipoDocumento() {
        $('input[name="TipoDocumento"]').off('click');
        $('input[name="TipoDocumento"]').on('click', function () {
            $('input[name="NumeroDocumento"]').val('');

            if ($(this).val() == 1) {
                $('input[name="NumeroDocumento"]').prop("maxlength", 15);
                $('input[name="NumeroDocumento"]').mask('999.999.999.999');

            } else if ($(this).val() == 2) {
                $('input[name="NumeroDocumento"]').removeAttr("maxlength");
                $('input[name="NumeroDocumento"]').unmask('999.999.999.999');

            } else if ($(this).val() == 3) {
                $('input[name="NumeroDocumento"]').prop("maxlength", 8);
                $('input[name="NumeroDocumento"]').unmask('999.999.999.999');
            }
        });
    }

    function validacaoPorTipoFornecedor(tipoFornecedor) {
        console.log($.validator.format("Tipo: {0} e valor: {1}", tipoFornecedor, $('#NumeroCpfCnpj').val()));
        $.validator.unobtrusive.parse($("#formDadosFornecedor"));
             
        $('#CPF_CNPJ').unmask();

        if (tipoFornecedor == 1) {
            $('#CPF_CNPJ').rules("remove", "cpf");
            $('#CPF_CNPJ').rules("add", { cnpj: true, messages: { cnpj: "CNPJ inválido" } });
            $('#CPF_CNPJ').mask('99.999.999/9999-99');

        } else {
            $('#CPF_CNPJ').rules("remove", "cnpj");
            $('#CPF_CNPJ').rules("add", { cpf: true, messages: { cpf: "CPF inválido" } });
            $('#CPF_CNPJ').mask('999.999.999-99');
        }
    }

    function validacaoPorTipoDocumento(tipoFornecedor) {
        $('input:radio[name="TipoDocumento"]').removeProp('checked');

        if (tipoFornecedor == 1) {
            $('input[name="TipoDocumento"]').filter('[value="2"]').parent().hide(); // RG
            $('input[name="TipoDocumento"]').filter('[value="1"]').parent().show();

            $('input[name="TipoDocumento"]').filter('[value="1"]').prop('checked', true); // Inscrição Estadual

            $('input[name="NumeroDocumento"]').prop("maxlength", 15);   // NumeroDocumento Inscrição Estadual
            $('input[name="NumeroDocumento"]').mask("999.999.999.999"); // NumeroDocumento Inscrição Estadual
        } else {
            $('input[name="TipoDocumento"]').filter('[value="2"]').parent().show(); // RG
            $('input[name="TipoDocumento"]').filter('[value="1"]').parent().hide(); // Inscrição Estadual
            $('input[name="TipoDocumento"]').filter('[value="2"]').prop('checked', true); //RG

            $('input[name="NumeroDocumento"]').removeAttr("maxlength");// NumeroDocumento RG
            $('input[name="NumeroDocumento"]').unmask(); // NumeroDocumento  RG
        }
    }

    function bindKeyUpCnpjCpf() {
        $('#CPF_CNPJ').off('blur');
        $('#CPF_CNPJ').on('blur', function () {
            var _cnpjCpf = $(this).val();
     
            _cnpjCpf = _cnpjCpf.replace(/[^a-zA-Z 0-9]+/g, '');
            var tipoDocumento = $('input[name=TipoFornecedor]:checked').val();

            limparDadosFornecedor();

            if (tipoDocumento == 1 && _cnpjCpf.length == 14) {
                buscarDadosFornecedor(_cnpjCpf);
            }

            if (tipoDocumento == 2 && _cnpjCpf.length == 11)
                buscarDadosFornecedor(_cnpjCpf);
        });
    }

    function bindChangeDocFornecedor() {
        $('.docFornecedor input').off('change');
        $('.docFornecedor input').on('change', function () {
            $('#IE_RG').val('');
        });
    }

    function bindClickDocForn() {
        $('.docFornecedor label').off('click');
        $('.docFornecedor label').on('click', function () {
            $('#numDocumentoFornecedor').focus();
        });
    }

    function bindClickContinuar() {
        $("#btnContinuar").off('click');
        $("#btnContinuar").on('click', function () {      

            var form = $("#formDadosFornecedor");

            var valido = REGISTRARAUTO.ValidarDados(form);

            if (valido) {

                salvar();

                REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #cadastrarDadosFornecedor');
                REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #diligencia');
                REGISTRARAUTO.ControlesMenu.ChecarOpcao('.vertical_nav #cadastrarDadosFornecedor');
                REGISTRARAUTO.AbreFrame(3);
                BASE.Mensagem.Mostrar("Sucesso", TipoMensagem.Sucesso);

            }
            else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
                form.validate();
            }
        });
    }

    function bindClickVoltar() {
        $("#btnVoltar").off('click');
        $("#btnVoltar").on('click', function () {            

            var indice = $(this).data('indice');         
            REGISTRARAUTO.AbreFrame(indice);
            REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #cadastrarDadosFornecedor');
            REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #tipoAuto');

        });
    }

    function bindChangeCep() {
        $("#inputCep").off("change");
        $("#inputCep").on("change", function () {
            var _cep = $(this).val();
            buscaEnderecoPrincipal(_cep, preencheEnderecoPrincipal);
        });
    }

    function bindChangeCnae() {     
        //CNAE AUTOCOMPLETE
        window.cnaeAutocomplete.init();
    }

    function buscarDadosFornecedor(CpfCnpj) {
        if (CpfCnpj === null || CpfCnpj === undefined || CpfCnpj === '') {
            console.log('Informe o Cpf ou Cnpj para pesquisa');
            return false;
        }

        $.ajax({
            type: "GET",
            url: "/Fornecedor/GetFornecedorByCNPJ/",
            data: { cnpj: CpfCnpj },
            dataType: "json",
            success: function (data) {
                limparDadosFornecedor();
                preencherDadosFornecedor(data);
                bindFormulario();     

            },
            error: function (xhr, status, error) {
                console.log(error);
                limparDadosFornecedor();
                console.log('Erro ao carregar um fornecedor!');               
               
            }
        });

        var form = $("#formDadosFornecedor");
        var valido = REGISTRARAUTO.ValidarDados(form);
    }

    function buscaEnderecoPrincipal(cep, callback) {
        $.ajax({
            type: "GET",
            url: "/Cep/GetEnderecoByCep",
            cache: false,
            data: { cep: cep.replace(/[^\d]+/g, '') },
            success: function (data) {
                callback(data);
            },
            error: function () {
            }
        });
    }

    function buscarDescricaoCnae(cnae, callback) {
        if (cnae == null || cnae === "" || cnae == undefined) {
            apagarDescricaoCnae();
            return;
        }

        if (cnae.length === 10) {

            $.ajax({
                type: "GET",
                url: "/CNAE/BuscarCNAE/",
                data: { _criterio: cnae },
                success: function (data) {
                    if (data != "" && data != null && data != undefined) {
                        callback(data.Descricao);
                    }
                    else {
                        BASE.Mensagem.Mostrar("Informe um CNAE válido", TipoMensagem.Alerta, "CNAE Inválido");
                        apagarDescricaoCnae();
                        formFornecedor.validate();
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
    }

    function preencheEnderecoPrincipal(data) {
        var enderecoPrincipal = REGISTRARAUTO.ConverterObjJson(data);

        if (enderecoPrincipal === undefined || enderecoPrincipal === null) {
            $('#inputLogradouro').val('');
            $('#inputComplemento').val('');
            $('#inputNomeBairro').val('');
            $('#inputNomeMunicipio').val('');
            $('#inputNomeEstado').val('');
            $('#inputNumeroEndereco').val('');
            $('#inputLogradouro').focus();

        }
        else {

            $('#inputLogradouro').val(enderecoPrincipal[0].enderecoAbrev);
            $('#inputComplemento').val(enderecoPrincipal[0].complemento);
            $('#inputNomeBairro').val(enderecoPrincipal[0].bairro);
            $('#inputNomeMunicipio').val(enderecoPrincipal[0].municipio);
            $('#inputNomeEstado').val(enderecoPrincipal[0].uf);
            $('#inputNumeroEndereco').focus();
        }
    }

    function preencherDescricaoCnae(descricaoCnae) {
        $("#CNAE_Descricao").val(descricaoCnae);
    }

    function apagarDescricaoCnae() {
        $("#CNAE_Descricao").val("");
    }

    function preencherDadosFornecedor(dadosFornecedor) {
        console.log('preencherDadosFornecedor(dadosFornecedor)');

        if (dadosFornecedor === '' || dadosFornecedor === null || dadosFornecedor === undefined) {
            return;
        }

        var pj = (dadosFornecedor.PJ.CNPJ != '' && dadosFornecedor.PJ.CNPJ != null) ? true : false;        

        $('#inputTelefone').unmask();
        $('#inputFax').unmask();
        $('#inputCep').unmask();

        $('#inputNome').val(dadosFornecedor.Nome);
        $('#inputNomeFantasia').val(dadosFornecedor.NomeFantasia);

        $('#CNAE_Codigo').val(dadosFornecedor.CNAE.CNAEFormatado);
        $('#CNAE_Descricao').val(dadosFornecedor.CNAE.Descricao);

        $('#CodigoCnae').val(dadosFornecedor.CNAE.CNAEFormatado);
        $('#Descricao').val(dadosFornecedor.CNAE.Descricao);

        if (pj === true) {
            $('#IE_RG').val(dadosFornecedor.PJ.IE);
            $("#inputIe").prop("checked", true);
        }
        else {
            $('#IE_RG').val(dadosFornecedor.PF.RG);
            $("#inputRg").prop("checked", true);
        }

        $('#CCMID').val(dadosFornecedor.CCMID);

        $('#inptCodigo').val(dadosFornecedor.Codigo);
        $('#inputTelefone').val(dadosFornecedor.Telefone);
        $('#inputFax').val(dadosFornecedor.FAX);
        $('#inputEmail').val(dadosFornecedor.Email);

        if (dadosFornecedor.EnderecoSEFAZ !== '' && dadosFornecedor.EnderecoSEFAZ != null) {
            $('#inputCep').val(dadosFornecedor.EnderecoSEFAZ.CEP);
            $('#inputLogradouro').val(dadosFornecedor.EnderecoSEFAZ.Logradouro);
            $('#inputNumeroEndereco').val(dadosFornecedor.EnderecoSEFAZ.Numero);
            $('#inputComplemento').val(dadosFornecedor.EnderecoSEFAZ.Complemento);
            $('#inputNomeBairro').val(dadosFornecedor.EnderecoSEFAZ.Bairro);
            $('#inputNomeMunicipio').val(dadosFornecedor.EnderecoSEFAZ.Municipio.Descricao);
            $('#inputNomeEstado').val(dadosFornecedor.EnderecoSEFAZ.Municipio.UF);
        }

        $('#inputTelefone').mask('(00) 0000-0000');
        $('#inputFax').mask('(00) 0000-0000');
        $('#inputCep').mask('00000-000');
    }

    function salvar() {        

        var obj = $("#formDadosFornecedor").serializeObject(), autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));

        autoManual.IE_RG = obj.IE_RG;
        autoManual.CCM = obj.CCMID;
        autoManual.CPF_CNPJ = obj.CPF_CNPJ;
        obj.TipoAuto = autoManual.TipoAuto;

        autoManual = REGISTRARAUTO.CopiarPropriedades(obj, autoManual);
        REGISTRARAUTO.Salvar(autoManual);
    }
    
    function limparDadosFornecedor() {
        $('#CNAE_Codigo').val('');
        $('#CNAE_Descricao').val('');
        $('#inputNome').val('');
        $('#inputNomeFantasia').val('');
        $('#IE_RG').val('');
        $('#inputTelefone').val('');
        $('#inputFax').val('');
        $('#inputEmail').val('');
        $('#inputCep').val('');
        $('#inputLogradouro').val('');
        $('#inputNumeroEndereco').val('');
        $('#inputComplemento').val('');
        $('#inputNomeBairro').val('');
        $('#inputNomeMunicipio').val('');
        $('#inputNomeEstado').val('');        

        if ($('#docCNPJ').is(':checked'))
            $('#inputIe').prop('checked', true);
        else
            $('#inputRg').prop('checked', true);
    }

    function preCarregar() {
        unbindMascara();
    }

    function posCarregar() {

        validacaoPorTipoFornecedor($('input[name="TipoFornecedor"]:checked').val());
        validacaoPorTipoDocumento($('input[name="TipoFornecedor"]:checked').val());
        bindMascara();
    };

    return {
        Init: init,
        Validate: function () { return validate; }
    }
}());
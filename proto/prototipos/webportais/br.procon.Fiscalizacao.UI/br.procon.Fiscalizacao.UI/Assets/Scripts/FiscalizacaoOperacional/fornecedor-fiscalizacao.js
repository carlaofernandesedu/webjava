FORNECEDORFISCALIZACAO = (function () {
    var hierarquiaSeletores = '#frmContent #conteudoAutoNotificao ';
    var tblEnderecoFornecedor = 'tblEnderecoFornecedor_IH1836KNUHF';

    function init() {
        bindAll();
    };

    function bindAll() {
        bindCpfCnpj();
        bindDefinirMascara();
        bindBuscaPorCPFCNPJ();
        FISCALIZACAOOPERACIONAL.ObterDadosEspecifico = buscar;

        $('#modalInserirDados .btn-primary').off('click');
        $('#modalInserirDados .btn-primary').on('click', function () {
            carregarCadastroFornecedor();
        });

        validarCamposAdicionais();
        bindBtnSalvarDiligenciaDisabled(true);

        $('input[type="radio"], input[type="checkbox"], input[type="text"], input[type="checkbox"], select').on('change', function () {
            FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #dadosFornecedor');
        });       

        aplicaMascaraValorReceitaEstimada();

    };

    function aplicaMascaraValorReceitaEstimada() {
        $('#valorReceitaEstimada').maskMoney({ prefix: 'R$ ', allowNegative: false, thousands: '.', decimal: ',', affixesStay: true });
    }

    function bindAdicionarFornecedor() {
        //$('#btnAdicionarFornecedor').on('click', function () {
        //    var valorReceitaEstimada = $('#valorReceitaEstimada').maskMoney('unmasked')[0];
        //    if (valorReceitaEstimada != undefined) {
        //        localStorage.setItem(DILIGENCIA.ValorReceitaEstimada, valorReceitaEstimada);
        //    }
        //});

    }

    function carregarCnae(objeto) {
        buscarCnae($(objeto).val());
    }

    function bindBtnSalvarDiligenciaDisabled(value) {
        $("#btnSalvarDiligencia").prop('disabled', value);
    }

    function cadastrarFornecedor() {
        var validarConteudo;     

        if ($("#PJ_CNPJ").val().length > 0)
            validarConteudo = BASE.Validacoes.CNPJ($("#PJ_CNPJ").val());
        else
            validarConteudo = BASE.Validacoes.CPF($("#PF_CPF").val());

        if (validarConteudo == false) {
            BASE.Mensagem.Mostrar("Número CNPJ/CPF inválido!", TipoMensagem.Error);
            return false;
        }

        var form = $("#form-fornecedor"),
            valido = validarDados(form);

        if (valido) {
            var fornecedor = JSON.parse(JSON.stringify($(form).serializeObject()));
            var endereco = [];
            var municipio = [];                  

            municipio = {
                "Descricao": fornecedor.Municipio,
                "UF": fornecedor.UF
            }

            endereco = {
                "CEP": fornecedor.CEP,
                "Logradouro": fornecedor.Logradouro,
                "Numero": fornecedor.Numero,
                "Complemento": fornecedor.Complemento,
                "Bairro": fornecedor.Bairro,
                "Municipio": municipio
            }           

            var obj = fornecedor;

            obj['EnderecoSEFAZ'] = [];
            obj.EnderecoSEFAZ = endereco;

            if (fornecedor.IE_RG[0] != null && fornecedor.IE_RG[0] != "") {
                obj['PF.RG'] = fornecedor.IE_RG[0];
                obj.IE_RG = fornecedor.IE_RG[0];
            }
            else if (fornecedor.IE_RG[1] != null && fornecedor.IE_RG[1] != "") {
                obj['PF.RG'] = fornecedor.IE_RG[1];
                obj.IE_RG = fornecedor.IE_RG[1];
            }

            if (fornecedor['PF.CPF'] != null && fornecedor['PF.CPF'] != "") {
                obj.CPF_CNPJ = fornecedor['PF.CPF'];
            }
            else if (fornecedor['PJ.CNPJ'] != null && fornecedor['PJ.CNPJ'] != "") {
                obj.CPF_CNPJ = fornecedor['PJ.CNPJ'];
            }

            if (fornecedor.CCMID[0] != null && fornecedor.CCMID[0] != "") {         
                obj.CCMID = fornecedor.CCMID[0];
            }
            else if (fornecedor.CCMID[1] != null && fornecedor.CCMID[1] != "") {
                obj.CCMID = fornecedor.CCMID[1];
            }

            $.ajax({
                type: "POST",
                url: "/Fornecedor/SalvarFornecedorFiscalizacaoOperacional/",
                data: { obj: JSON.parse(JSON.stringify(obj)) },
                success: function (data) {
                    if (data.Sucesso) {
                        var criterio = null;                        

                        if (data.Resultado.PF.CPF != null)
                            criterio = data.Resultado.PF.CPF;
                        else
                            criterio = data.Resultado.PJ.CNPJ;

                        buscarDadosFornecedor(criterio);
                    }
                    else
                        BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error);

                    return false;
                },
                error: function (data) {
                    BASE.Mensagem.Mostrar("Erro ao cadastrar fornecedor!", TipoMensagem.Alerta);
                }
            });
        }
        else {
            BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Error);
            form.validate();
        }
    }

    function buscarDadosFornecedor(CpfCnpj) {
        if (CpfCnpj === null || CpfCnpj === undefined || CpfCnpj === '') {
            console.log('Informe o Cpf ou Cnpj para pesquisa');
            return false;
        }

        $.ajax({
            type: "GET",
            url: "/FornecedorOperacional/DadosFornecedor/",
            data: { documento: CpfCnpj },
            success: function (data) {
                alteraHtmlView(data);
                bindBuscaPorCPFCNPJIncluirFornecedor();
                return false;
            },
            error: function (data) {
                console.log(data);
                BASE.Mensagem.Mostrar("Erro ao carregar um fornecedor!", TipoMensagem.Alerta);
            }
        });
    }

    function alteraHtmlView(html) {
        var frmContent = $('#frmContent #conteudoAutoNotificao');
        frmContent.html(html);
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

    function buscarCnae(_valor) {
        if (_valor.length == 9) {
            $.ajax({
                type: "GET",
                url: "/CNAE/BuscarCNAE/",
                data: { _criterio: _valor },
                success: function (data) {
                    if (data === null || data === undefined || data === '') {
                        $('#CNAE_Descricao').val('');
                        $('#Id_CNAE').val('');
                        $('#CNAE_CodigoCNAE').val('');
                        BASE.Mensagem.Mostrar("Informe um CNAE válido!", TipoMensagem.Error);
                    } else {
                        $('#CNAE_Descricao').val(data.Descricao);
                        $('#Id_CNAE').val(data.Codigo);
                        $('span[data-valmsg-for="Id_CNAE"]').html('');
                        $('span[data-valmsg-for="CNAE_CodigoCNAE"]').html('');
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown, data) {
                    console.log('erro ao carregar validar CNAE', data);
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    }

    function carregarCadastroFornecedor() {
        $('#modalInserirDados').modal('hide');
        var elemento = hierarquiaSeletores + ' #NumDocumento'

        $.ajax({
            type: "GET",
            url: "/FornecedorOperacional/CadastroFornecedor/",
            data: { criterio: $(elemento).val() },
            success: function (data) {               

                FISCALIZACAOOPERACIONAL.AlteraHtmlView(data);

                $("#PJ_CNPJ").prop('disabled', true);
                $("#PF_CPF").prop('disabled', true);
                $('input[name="TipoFornecedor"]').prop('disabled', true);
                $("#form-fornecedor #Numero").attr('maxlength', '5');

                //CNAE AUTOCOMPLETE
                window.cnaeAutocomplete.init();

                $('.adicionar-fornecedor').off('click');
                $('.adicionar-fornecedor').on('click', function () {

                    var valorReceitaEstimada = $('#valorReceitaEstimada').maskMoney('unmasked')[0];
                    if (valorReceitaEstimada != undefined) {
                        localStorage.setItem(DILIGENCIA.ValorReceitaEstimada, valorReceitaEstimada);
                    }

                    cadastrarFornecedor();
                });        


                $('#PF_DataNascimento').datetimepicker({
                    minView: 2,
                    format: "dd/mm/yyyy",
                    minuteStep: 5,
                    language: 'pt-BR',
                    autoclose: true
                });

                $('.tipo-fornecedor').off('click');
                $('.tipo-fornecedor').on('click', function () {
                    var tipo = $(this).val();

                    if (tipo == 1)
                        inicializarTipoFornecedor('PF');

                    if (tipo == 2)
                        inicializarTipoFornecedor('PJ');
                });

                inicializarCamposCadastroFornecedor();
                bindChangeCep();

                BASE.RF.AdicionarBotao();

                return false;
            },
            error: function (data) {
                console.log(data);
                BASE.Mensagem.Mostrar("Erro ao carregar o cadastro fornecedor!", TipoMensagem.Alerta);
            }
        });

        false;
    }

    //function definirValorDocumento(_valor) {
    //    resetarHidden();
    //    elemento = $('.radio-fornecedor:checked').data('value');
    //    $("#" + elemento).val(_valor)
    //}

    function resetarHidden() {
        $("#IE").val('');
        $("#RG").val('');
        $("#CCMID").val('');
    }

    function inicializarCamposCadastroFornecedor() {
        $("#form-fornecedor").data("unobtrusiveValidation", null);
        $("#form-fornecedor").data("validator", null);
        $.validator.unobtrusive.parse($("#form-fornecedor"));
        var val = $.validator.setDefaults({ ignore: ':hidden:not(.ignore)' });

        aplicaMascaraValorReceitaEstimada();
        bindAdicionarFornecedor();

        
     
        var tamanho = 0;

        if ($("#PJ_CNPJ").val().length > 0)
            tamanho = $("#PJ_CNPJ").val().length;
        else
            tamanho = $("#PF_CPF").val().length;

        if (tamanho === 18) {

            $('#IE_RG').mask('000.000.000.000', { placeholder: '___.___.___.___' });
            $('#IE_RG').attr('maxlength', '15');

            $('#TipoFornecedor').val($('#TipoFornecedorPJ').val());
            $('#TipoFornecedorPJ').attr('checked', true);

            inicializarTipoFornecedor('PJ');
        }

        if (tamanho === 14) {
            $('#TipoFornecedor').val($('#TipoFornecedorPF').val());
            $('#TipoFornecedorPF').attr('checked', true);

            $('#IE_RG').unmask();
            $('#IE_RG').attr('maxlength', '21');

            inicializarTipoFornecedor('PF');
        }

        $('#Telefone').rules('add', { telefoneFixoCelular: true });
        $('#FAX').rules('add', { telefone: true });
    }

    function inicializarTipoFornecedor(tipo) {        

        if (tipo == "PJ") {
            $("#PJ_CNPJ").show();
            $("#PF_CPF").hide();
            
            $(".grupoPessoaFisica").hide();
            $("#PF_CPF").val('');

        }
        else {
            $("#PF_CPF").show();
            $("#PJ_CNPJ").hide();
          
            $(".grupoPessoaFisica").show();
            $("#PJ_CNPJ").val('');

        }

        resetarHidden();
        $("#IE_RG").val('');
    }

    function bindChangeCep() {
        $("#CEP").off("change");
        $("#CEP").on("change", function () {
            var _cep = $(this).val();
            buscaEnderecoPrincipal(_cep, preencheEnderecoPrincipal);
        });
    }

    function buscaEnderecoPrincipal(cep, callback) {
        $.ajax({
            type: "GET",
            url: "/Cep/GetEnderecoByCep",
            data: { cep: cep.replace(/[^\d]+/g, '') },
            cache: false,
            success: function (data) {
                if (data == "") {
                    //BASE.MostrarMensagemErro('CEP não localizado');
                    $('#form-fornecedor #Logradouro').val('');
                    $('#form-fornecedor #Complemento').val('');
                    $('#form-fornecedor #Bairro').val('');
                    $('#form-fornecedor #Municipio').val('');
                    $('#form-fornecedor #UF').val('');
                    //$('.adicionar-fornecedor').attr('disabled', true);

                    $('#form-fornecedor #Logradouro').attr('disabled', false);
                    $('#form-fornecedor #Bairro').attr('disabled', false);

                    $('#form-fornecedor #Logradouro').focus();
                }
                else {
                    //$('.adicionar-fornecedor').attr('disabled', false);
                    callback(data);
                }
            },
            error: function () {
                alert("cep não encontrado");
            }
        });
    }

    function preencheEnderecoPrincipal(data) {
        var enderecoPrincipal = FISCALIZACAOOPERACIONAL.ConverterObjJson(data);
        if (enderecoPrincipal === undefined || enderecoPrincipal === null)
            return;

        $('#Logradouro').val(enderecoPrincipal[0].enderecoAbrev);
        $('#Complemento').val(enderecoPrincipal[0].complemento);
        $('#Bairro').val(enderecoPrincipal[0].bairro);
        $('#Municipio').val(enderecoPrincipal[0].municipio);
        $('#UF').val(enderecoPrincipal[0].uf);

        var elementos =
            [
                'Logradouro',
                'Bairro'
            ];

        if (enderecoPrincipal[0].enderecoAbrev == "") {
            addRules(elementos);
        }
        else {
            removeRules(elementos);
        }

        $('#Numero').focus();
    }

    function addRules(elementos) {
        //sempre remover para adicionar;
        removeRules(elementos);

        $.each(elementos, function (index, value) {
            $('#' + value).prop('disabled', false);
            $('#' + value).rules('add', 'required');
        });
    }

    function removeRules(elementos) {
        $.each(elementos, function (index, value) {
            $('#' + value).prop('disabled', true);
            $('#' + value).rules('remove', 'required');
            $('#' + value).removeClass('input-validation-error');
        });
    }

    var maskBehaviorTel;
    var options;

    function bindDefinirMascara() {
        $val = $("#form-fornecedor").validate();

        $(hierarquiaSeletores + ' #NumDocumento').prop('disabled', true);

        $('input[name="tipoDocumento"]:radio').click(function () {

            $(hierarquiaSeletores + ' #NumDocumento').prop('disabled', false);
            $(hierarquiaSeletores + ' #NumDocumento').unmask();
            if ($(hierarquiaSeletores + ' #cnpj').is(':checked')) {
                $(hierarquiaSeletores + ' #NumDocumento').attr('maxlength', '18');
                $(hierarquiaSeletores + ' #NumDocumento').removeClass('cpf');
                $(hierarquiaSeletores + ' #NumDocumento').addClass('cnpj');

                tamanhoParaBuscaCpfCnpj = 18;
            }
            else {
                $(hierarquiaSeletores + ' #NumDocumento').removeClass('cnpj');
                $(hierarquiaSeletores + ' #NumDocumento').attr('maxlength', '14');
                $(hierarquiaSeletores + ' #NumDocumento').addClass('cpf');

                tamanhoParaBuscaCpfCnpj = 14;
            }

            $(hierarquiaSeletores + ' #NumDocumento').val('');

            if ($val !== null && $val !== undefined)
                $val.resetForm();

            $(hierarquiaSeletores + ' #NumDocumento').focus();

        });

        $(hierarquiaSeletores + ' #Website').prop('disabled', false);      

        if ($(hierarquiaSeletores + ' .tipoDocumento').is(':checked')) {
            $(hierarquiaSeletores + ' #NumDocumento').prop('disabled', false);

            if ($(hierarquiaSeletores + ' #cnpj').is(':checked')) {
                $(hierarquiaSeletores + ' #NumDocumento').attr('maxlength', '18');
                $(hierarquiaSeletores + ' #NumDocumento').mask('00.000.000/0000-00');
                tamanhoParaBuscaCpfCnpj = 18;
            }
            else {
                $(hierarquiaSeletores + ' #NumDocumento').attr('maxlength', '14');
                $(hierarquiaSeletores + ' #NumDocumento').mask('000.000.000-00');
                tamanhoParaBuscaCpfCnpj = 14;
            }
        }

        $(hierarquiaSeletores + ' .telefoneFornecedor').attr('maxlength', '15');
        $(hierarquiaSeletores + ' .telefoneFornecedor').mask(maskBehaviorTel, options);

        $(hierarquiaSeletores + ' .faxFornecedor').attr('maxlength', '14');
        $(hierarquiaSeletores + ' .faxFornecedor').mask('(00) 0000-0000');
    }

    maskBehaviorTel = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };
    options = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskBehaviorTel.apply({}, arguments), options);
        }
    };

    function validarCamposAdicionais() {
        liberarSalvarDiligencia(false);
        bindEmail();
        bindSite();
        validarTelefone();
        validarFax();
    }

    function validarTelefone() {
        $(hierarquiaSeletores + ' .telefoneFornecedor').change(function () {
            var tamanho = $(hierarquiaSeletores + ' .telefoneFornecedor').val().length;
            if (tamanho > 0 && tamanho < 14) {
                BASE.MostrarMensagemErro('Telefone inválido');
                liberarSalvarDiligencia(true);
                $(this).focus();
            }
            else if (tamanho == 0) {
                liberarSalvarDiligencia(false);
            }
            else {
                BASE.Mensagem.Mostrar("Telefone valido!", TipoMensagem.Sucesso);
                liberarSalvarDiligencia(false);
            }
        });
    }

    function validarFax() {
        $(hierarquiaSeletores + ' .faxFornecedor').change(function () {
            var tamanho = $(hierarquiaSeletores + ' .faxFornecedor').val().length;
            if (tamanho > 0 && tamanho < 14) {
                BASE.MostrarMensagemErro('Fax inválido');
                liberarSalvarDiligencia(true);
                $(this).focus();
            }
            else if (tamanho == 0) {
                liberarSalvarDiligencia(false);
            }
            else {
                BASE.Mensagem.Mostrar("Fax valido!", TipoMensagem.Sucesso);
                liberarSalvarDiligencia(false);
            }
        });
    }

    function bindEmail() {
        $(hierarquiaSeletores + ' .emailFornecedor').change(function () {
            var email = $(hierarquiaSeletores + ' .emailFornecedor').val();
            var filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (email.length > 0 && !filter.test(email)) {
                BASE.MostrarMensagemErro('Email inválido');
                liberarSalvarDiligencia(true);
                $(this).focus();
            }
            else if (site.length == 0) {
                liberarSalvarDiligencia(false);
            }
            else {
                BASE.Mensagem.Mostrar("Email valido!", TipoMensagem.Sucesso);
                liberarSalvarDiligencia(false);
            }
        });
    }

    function bindSite() {
        $(hierarquiaSeletores + ' .siteFornecedor').change(function () {
            var site = $(hierarquiaSeletores + ' .siteFornecedor').val();
            var filter = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (site.length > 0 && !filter.test(site)) {
                BASE.MostrarMensagemErro('Site inválido');
                liberarSalvarDiligencia(true);
                $(this).focus();
            }
            else if (site.length == 0) {
                liberarSalvarDiligencia(false);
            }
            else {
                BASE.Mensagem.Mostrar("Site valido!", TipoMensagem.Sucesso);
                liberarSalvarDiligencia(false);
            }
        });
    }

    function liberarSalvarDiligencia(valor) {
        $("#btnSalvarDiligencia").prop('disabled', valor);
    }

    function bindCpfCnpj() {
        $(hierarquiaSeletores + ' #NumDocumento').unmask();

        $(hierarquiaSeletores + ' #cnpj').off('blur');
        $(hierarquiaSeletores + ' #cnpj').on('blur', function () {

            if ($(this).is(':checked')) {
                $(hierarquiaSeletores + ' #NumDocumento').attr('maxlength', '18');
                $(hierarquiaSeletores + ' #NumDocumento').mask('00.000.000/0000-00');
                tamanhoParaBuscaCpfCnpj = 18;
                verificaTamanhoCampoCpfCnpj(true);
                inicializarCamposPjOuPf();               

            }
        });

        $(hierarquiaSeletores + ' #cpf').off('blur');
        $(hierarquiaSeletores + ' #cpf').on('blur', function () {            

            if ($(this).is(':checked')) {
                $(hierarquiaSeletores + ' #NumDocumento').attr('maxlength', '14');
                $(hierarquiaSeletores + ' #NumDocumento').mask('000.000.000-00');
                tamanhoParaBuscaCpfCnpj = 14;
                verificaTamanhoCampoCpfCnpj(false);
                inicializarCamposPjOuPf();
            }
        });
    }

    function bindBuscaPorCPFCNPJ() {
        var that = $(hierarquiaSeletores + ' #NumDocumento');

        BASE.RF.AdicionarBotao();

        that.keyup(function () {
            var tamanho = $(this).val().length;

            if ((tamanhoParaBuscaCpfCnpj === 18) && (tamanho === 18)) {
                if (BASE.Validacoes.CNPJ($(this).val())) {
                    pesquisaFornecedor($(this).val());
                    inicializarCamposPjOuPf();
                    $(this).next().focus();
                } else {
                    BASE.Mensagem.Mostrar("CNPJ Inválido!", TipoMensagem.Alerta);
                }
            }
            if ((tamanhoParaBuscaCpfCnpj === 14) && (tamanho === 14)) {
                if (BASE.Validacoes.CPF($(this).val())) {
                    pesquisaFornecedor($(this).val());
                    inicializarCamposPjOuPf();
                    $(this).next().focus();
                } else {
                    BASE.Mensagem.Mostrar("CPF Inválido!", TipoMensagem.Alerta);
                }
            }
        });
    }

    function bindBuscaPorCPFCNPJIncluirFornecedor() {
        var elemento = hierarquiaSeletores + ' #NumDocumento'
        var tamanho = $(elemento).val().length;

        if ((tamanhoParaBuscaCpfCnpj === 18) && (tamanho === 18)) {
            pesquisaFornecedor($(elemento).val());
            inicializarCamposPjOuPf();
            $(hierarquiaSeletores + ' #NumDocumento').prop('disabled', true);
            $('#cnpj').prop('disabled', true);
            $('#cnpj').prop('checked', true);
            $(elemento).next().focus();
        }
        if ((tamanhoParaBuscaCpfCnpj === 14) && (tamanho === 14)) {
            pesquisaFornecedor($(elemento).val());
            inicializarCamposPjOuPf();
            $('#cpf').prop('checked', true);
            $('#cpf').prop('disabled', true);
            $(elemento).next().focus();
        }
    }

    function verificaTamanhoCampoCpfCnpj(isCnpj) {
        var tamanho = $(hierarquiaSeletores + ' #NumDocumento').length;
        var cpfCnpj = $(hierarquiaSeletores + ' #NumDocumento').val();

        if (isCnpj === true) {
            if (tamanho === 18) {
                pesquisaFornecedor(valor);
            }
        }
        else {
            if (tamanho === 14) {
                pesquisaFornecedor(valor);
            }
        }
    }

    function pesquisaFornecedor(CpfCnpj) {
        if (CpfCnpj === null || CpfCnpj === undefined || CpfCnpj === '') {
            console.log('Informe o Cpf ou Cnpj para pesquisa');
            return false;
        }

        $.ajax({
            type: "GET",
            url: "/FornecedorOperacional/DadosFornecedor/",
            data: { 'documento': CpfCnpj },
            success: function (data, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {

                    $(' .telefoneFornecedor').unmask();
                    $(' .faxFornecedor').unmask();
                 
                    FISCALIZACAOOPERACIONAL.AlteraHtmlView(data);
                    $("#enderecoCarregado, #dadosCarregados").show();
                    FISCALIZACAOOPERACIONAL.InicializarJS(2);
                    criarObjetoEnderecoFornecedor();

                    $(' .telefoneFornecedor').attr('maxlength', '15');
                    $(' .telefoneFornecedor').mask(maskBehaviorTel, options);

                    $(' .faxFornecedor').attr('maxlength', '14');
                    $(' .faxFornecedor').mask('(00) 0000-0000');

                    //Convert a string HTML para um elemento HTML
                    var htmlData = $.parseHTML(data);
                    var idFornecedor = $(htmlData).find('#Codigo').val();
                    var NumDocumento = $(htmlData).find('#NumDocumento').val();
                    iniciarMascaraNumeroDoc(NumDocumento);
                    selecionarOpcaoDoc(NumDocumento);
                    bindBtnSalvarDiligenciaDisabled(false);

                    if (idFornecedor != null && idFornecedor != undefined) {
                        incluirFornecedorDiligenciaLocalStorage(idFornecedor, criarObjetoFornecedor);
                    }
                    else {
                        $("#enderecoCarregado, #dadosCarregados").hide();
                        BASE.Mensagem.Mostrar("Informe um fornecedor!", TipoMensagem.Alerta);
                    }
                }
                else {
                    $('#modalInserirDados').modal('show');
                }

                return false;
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }

                console.log(msg);
            }
        });
    }

    function inicializarCamposPjOuPf() {
        var $tipoDocumento = "";
        $tipoDocumento = parseInt($('#NumDocumento').val().length);
        $('#NumDocumento').focus();
        if ($tipoDocumento === 14 || $tipoDocumento === 18) {
            $(hierarquiaSeletores + ' #NumDocumento').prop('disabled', false);

            switch ($tipoDocumento) {
                case 18:
                    exibeCamposPJ();
                    break;
                case 14:
                    exibeCamposPF();
                    break;
            }
        }
    }

    function exibeCamposPJ() {
        var $elementosPJ = $(".PJ"),
            $elementosPF = $(".PF");

        $.each($elementosPJ, function () {
            $(this).hasClass("esconder") ? $(this).removeClass("esconder") : false;
            $(this).addClass("exibir");
        })

        $.each($elementosPF, function () {
            $(this).hasClass("exibir") ? $(this).removeClass("exibir") : false;
            $(this).addClass("esconder");
        })

        $('.dadosFornecedor .exibir').show();
        $('.dadosFornecedor .esconder').hide();
    }

    function exibeCamposPF() {
        var $elementosPF = $(".PF"),
            $elementosPJ = $(".PJ");

        $.each($elementosPF, function () {
            $(this).hasClass("esconder") ? $(this).removeClass("esconder") : false;
            $(this).addClass("exibir");
        })

        $.each($elementosPJ, function () {
            $(this).hasClass("exibir") ? $(this).removeClass("exibir") : false;
            $(this).addClass("esconder");
        })

        $('.dadosFornecedor .exibir').show();
        $('.dadosFornecedor .esconder').hide();
    }

    function incluirFornecedorDiligenciaLocalStorage(id, fornecedor) {
        var objDiligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));
        objDiligencia.IdFornecedor = id;
        objDiligencia.Fornecedor = fornecedor();
        DILIGENCIA.AtualizarDiligencia(objDiligencia);
    }

    function criarObjetoFornecedorLocalStorage(obj) {

        var fornecedor = {
            IdFornecedor: obj.Codigo,
            CPF_CNPJ: obj.CPF_CNPJ,
            CNAE: obj.CNAE.CNAEFormatado,
            CCMID: obj.CCMID,
            RamoAtividade: obj.DescricaoCNAE,
            RazaoSocial: obj.Nome,
            Nome: obj.Nome,
            Classificacao: obj.PJ.ClassificacaoFiscal,
            NomeFantasia: obj.NomeFantasia,
            //InscricaoEstadual: obj.PJ.IE,
            IE_RG: obj.IE_RG,
            DataAbertura: obj.DataCriacao,
            Telefone: obj.Telefone,
            Fax: obj.FAX,
            Website: obj.WebSite,
            Email: obj.Email,
        }

        return fornecedor;
    }

    function criarObjetoFornecedor() {
        var fornecedor = {
            IdFornecedor: null,
            CPF_CNPJ: null,
            CNAE: null,
            CCMID:null,
            RamoAtividade: null,
            RazaoSocial: null,
            Nome: null,
            Classificacao: null,
            NomeFantasia: null,
            InscricaoEstadual: null,
            IE_RG: null,
            DataAbertura: null,
            Telefone: null,
            Fax: null,
            Website: null,
            Email: null,

        }        

        fornecedor.IdFornecedor = $("#Codigo").val();
        fornecedor.CPF_CNPJ = $("#CPF_CNPJ").val();
        fornecedor.CNAE = $("#CNAE_CNAEFormatado").val();
        fornecedor.CCMID = $("#CCMID").val();
        fornecedor.RamoAtividade = $("#CNAE_Descricao").val();
        fornecedor.RazaoSocial = $("#Nome").val();
        fornecedor.Classificacao = $("#PJ_Classificacao_Descricao").val();
        fornecedor.NomeFantasia = $("#NomeFantasia").val();
        fornecedor.InscricaoEstadual = $("#PJ_IE").val();
        fornecedor.IE_RG = $("#IE_RG").val();
        fornecedor.DataAbertura = $("#DataCriacao").val();
        fornecedor.Telefone = $("#telefone").val();
        fornecedor.Fax = $("#fax").val();
        fornecedor.Website = $("#site").val();
        fornecedor.Email = $("#email").val();

        return fornecedor;
    }

    function criarObjetoEnderecoFornecedorLs(obj) {
        var $enderecoFornecedor =
            {
                Cep: obj.EnderecoSEFAZ.CEP,
                Logradouro: obj.EnderecoSEFAZ.Logradouro,
                Numero: obj.EnderecoSEFAZ.Numero,
                Complemento: obj.EnderecoSEFAZ.Complemento,
                Bairro: obj.EnderecoSEFAZ.Bairro,
                Municipio: obj.EnderecoSEFAZ.Municipio.Descricao,
                Estado: obj.EnderecoSEFAZ.Municipio.UF
            }

        return $enderecoFornecedor;
    }

    function criarObjetoEnderecoFornecedor() {
        var $enderecoFornecedor =
            {
                Cep: null,
                Logradouro: null,
                Numero: null,
                Complemento: null,
                Bairro: null,
                Municipio: null,
                Estado: null
            }

        $enderecoFornecedor.Cep = $("#EnderecoSEFAZ_CEP").val();
        $enderecoFornecedor.Logradouro = $("#EnderecoSEFAZ_Logradouro").val();
        $enderecoFornecedor.Numero = $("#EnderecoSEFAZ_Numero").val();
        $enderecoFornecedor.Complemento = $("#EnderecoSEFAZ_Complemento").val();
        $enderecoFornecedor.Bairro = $("#EnderecoSEFAZ_Bairro").val();
        $enderecoFornecedor.Municipio = $("#EnderecoSEFAZ_Municipio_Descricao").val();
        $enderecoFornecedor.Estado = $("#EnderecoSEFAZ_Municipio_UF").val();

        salvarEnderecoFornecedorLocalSotrage($enderecoFornecedor)
        return false;
    }

    function salvarEnderecoFornecedorLocalSotrage(obj) {
        var Diligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        Diligencia.EnderecoFornecedor = obj;
        DILIGENCIA.AtualizarDiligencia(Diligencia);
    }

    function buscar() {
        var diligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia));

        if (diligencia != null && diligencia.Fornecedor != null) {
            limparDadosFornecedor();
            $("#enderecoCarregado, #dadosCarregados").show();
            populaDadosFornecedor(diligencia);          
            bindBtnSalvarDiligenciaDisabled(false);

            if (diligencia.EhEnderecoFiscalizacao)
                ENDERECOFISCALIZACAO.BuscarEnderecoFiscalizacao();
        }

        DILIGENCIA.ObterReceitaEstimada();
        DILIGENCIA.ObterTelefoneFax();

    }

    function buscarFornecedorLS() {
        var obj = FISCALIZACAOOPERACIONAL.ConverterObjJson(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia));

        return obj != null ? obj.Fornecedor : null;
    }

    function buscarEnderecoFornecedorLS() {
        var obj = FISCALIZACAOOPERACIONAL.ConverterObjJson(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia));

        return obj != null ? obj.EnderecoFornecedor : null;
    }

    function salvar() {
    }

    function limparDadosFornecedor() {
        $("#cnae span").text("");
        $("#ramoAtividade span").text("");
        $("#razaoSocial span").text("");
        $("#classicacaoEmpPJ span").text("");
        $("#nome span").text("");
        $("#nomePJ span").text("");
        $("#iePJ span").text("");
        $("#rgPF span").text("");
        $("#dataAbertura span").text("");
        $("#telefone").text("");
        $("#fax").text("");
        $("#site").text("");
        $("#email").text("");
        $("#CCMID").text("");
        $("#enderecoEndFor").text("");
        $("#municipioEndFor").text("");
        $("#cepEndFor").text("");
    }

    function iniciarMascaraNumeroDoc(numDoc) {
        if (numDoc.replace(/[^\d]+/g, '').length >= 14) {
            $("#NumDocumento").removeClass('cpf');
            $("#NumDocumento").addClass('cnpj');
        }
        else {
            $("#NumDocumento").removeClass('cnpj');
            $("#NumDocumento").addClass('cpf');
        }
    }

    function selecionarOpcaoDoc(documento) {
        if (documento != null && documento != undefined && documento != "") {
            $("#cnpj").prop("disabled", true);
            $("#cpf").prop("disabled", true);
            if (documento.replace(/[^\d]+/g, '').length >= 14) {
                $("#cnpj").prop("checked", true);
            }
            else {
                $("#cpf").prop("checked", true);
            }
        }
    }

    function montarEnderecoFornecedor(endereco) {
        if (endereco != null) {
            $("#enderecoEndFor").append(endereco.Logradouro.concat(', ').concat(endereco.Numero));

            $("#municipioEndFor").append(endereco.Bairro.concat(' - ').concat(endereco.Municipio).concat(' - ').concat(endereco.Estado));

            $("#cepEndFor").append(String().concat("Cep: ").concat(endereco.Cep));
        }
    }

    function populaDadosFornecedor(diligencia) {
               
        $(hierarquiaSeletores + ' .telefoneFornecedor').unmask();
        $(hierarquiaSeletores + ' .faxFornecedor').unmask();
        $("#valorReceitaEstimada").unmask();

        $("#NumDocumento").val(diligencia.Fornecedor.CPF_CNPJ.replace(/\D/g, ''));
        $("#cnae span").append(diligencia.Fornecedor.CNAE + ' | ' + diligencia.Fornecedor.RamoAtividade);
        $("#ramoAtividade span").append(diligencia.Fornecedor.RamoAtividade);
        $("#razaoSocial span").append(diligencia.Fornecedor.RazaoSocial);
        $("#classicacaoEmpPJ span").append(diligencia.Fornecedor.Classificacao);
        $("#nome span").append(diligencia.Fornecedor.Nome);
        $("#nomePJ span").append(diligencia.Fornecedor.NomeFantasia);
        $("#iePJ span").append(diligencia.Fornecedor.InscricaoEstadual);
        $("#rgPF span").append(diligencia.Fornecedor.IE_RG);
        $("#dataAbertura span").append(converterDataPtBr(diligencia.Fornecedor.DataAbertura));
        $("#telefone").val(diligencia.Fornecedor.Telefone);
        $("#fax").val(diligencia.Fornecedor.Fax);
        $("#site").val(diligencia.Fornecedor.Website);
        $("#email").val(diligencia.Fornecedor.Email);
        $("#CCMID").val(diligencia.Fornecedor.CCMID);
        $("#valorReceitaEstimada").val(diligencia.ValorReceitaEstimada);

        $(hierarquiaSeletores + ' .telefoneFornecedor').attr('maxlength', '15');
        $(hierarquiaSeletores + ' .telefoneFornecedor').mask(maskBehaviorTel, options);

        $(hierarquiaSeletores + ' .faxFornecedor').attr('maxlength', '14');
        $(hierarquiaSeletores + ' .faxFornecedor').mask('(00) 0000-0000');

        aplicaMascaraValorReceitaEstimada();

        montarEnderecoFornecedor(diligencia.EnderecoFornecedor);
        iniciarMascaraNumeroDoc(diligencia.Fornecedor.CPF_CNPJ);
        selecionarOpcaoDoc(diligencia.Fornecedor.CPF_CNPJ);
    }

    function converterDataPtBr(dateString) {
        if (dateString != null && dateString !== "undefined") {
            if (dateString.search("Date") === 1) {
                var currentTime = new Date(parseInt(dateString.substr(6)));

                var month = currentTime.getMonth() + 1;
                var day = currentTime.getDate();
                var year = currentTime.getFullYear();
                var hours = currentTime.getHours();
                var minutes = currentTime.getMinutes();

                dateString = day + "/" + month + "/" + year + " " + hours + ":" + minutes;
            }
            return dateString;
        }

        return '';
    }

    return {
        Init: init,
        TblLocalStorageEnderecoFornecedor: tblEnderecoFornecedor,
        ControleTela: bindAll,
        CriarFornecedorLocalStorage: criarObjetoFornecedorLocalStorage,
        BuscarFornecedorLS: buscarFornecedorLS,
        BuscaEnderecoFornecedorLS: buscarEnderecoFornecedorLS,
        CriarObjEnderecoFornecedorLs: criarObjetoEnderecoFornecedorLs,
        DefinirMascara: bindDefinirMascara
    }
}());

DILIGENCIA = (function () {

    var tbDiligencia = "tbDiligencia_IH1836KNUHF";
    var hierarquiaSeletores = '#frmContent #conteudoAutoNotificao';
    var idDiligencia = "idDiligencia";
    var idFornecedor = "idFornecedor";
    var nrAp = "nrAp";
    var IdSetor = null;
    var IdConvenio = null;
   
    var listaFiscaisOk = false;
    var operacaoOk = false;
    var numeroAPOK = false;
    var valorReceitaEstimada = "ValorReceitaEstimada";
    var telefone = "Telefone";
    var fax = "Fax";
    var email = "Email";

    function init() {
        bindControles();
        definirMascara();
        bindBtnSalvarDiligencia();
        listaFiscaisOk = false;
        operacaoOk = false;
        numeroAPOK = false;
        FISCALIZACAOOPERACIONAL.ObterDadosEspecifico = buscarLocalStorage;
    }

    function bindControles() {

        $(hierarquiaSeletores + ' #adicionarTodos').click(function () {
            $(hierarquiaSeletores + ' #ddlNaoSelecionados option').detach().appendTo('#ddlSelecionados').prop('selected', false);
            verificarLiberacaoContinuar();
        });

        $(hierarquiaSeletores + ' #removerTodos').click(function () {
            $(hierarquiaSeletores + ' #ddlSelecionados option:not(:disabled)').detach().appendTo('#ddlNaoSelecionados').prop('selected', false);
            verificarLiberacaoContinuar();
        });

        $(hierarquiaSeletores + ' #continuarDiligencia').off('click');
        $(hierarquiaSeletores + ' #continuarDiligencia').on('click', function () {
            var equipeValida = validarEquipeFiscais();
            var operacaoNumeroAPValido = ValidarOperacaoNumeroAP();
            var operacaoFisc = ValidarOperacaoFiscalizacao();

            if (equipeValida === true && (operacaoFisc === true || operacaoNumeroAPValido === true)) {

                var salvou = salvarLocalStorage();

                if (salvou === true) {
                    var indice = $(this).attr('data-indice');

                    if (indice === "2") {
                        FISCALIZACAOOPERACIONAL.AbreFrame(indice);
                        FISCALIZACAOOPERACIONAL.DesabilitarOpcao('.vertical_nav #diligencia');
                        FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #dadosFornecedor');
                        FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #diligencia');
                    }
                }
                else {
                    BASE.Mensagem.Mostrar('Ocorreu um erro! Por favor repita a operação', TipoMensagem.Error);
                }
            }
        });


        $(hierarquiaSeletores + ' #ddlNaoSelecionados').click(function () {
            moverItem($(this).find('option:selected'));
            verificarLiberacaoContinuar();
        });

        $(hierarquiaSeletores + ' #ddlSelecionados').click(function () {
            moverItem($(this).find('option:selected:not([disabled])'));
            verificarLiberacaoContinuar();
        });

        $(hierarquiaSeletores + ' #ddlOperacao').change(function () {
            verificarLiberacaoContinuar();
            verificarLiberarNumeroAP(this);
        });

        $(hierarquiaSeletores + ' #numeroAP').keyup(function () {
            var tamanhoAP = $(hierarquiaSeletores + ' #numeroAP').val().length;
            if (tamanhoAP === 12) {
                verificarLiberacaoContinuar();
            }
            else {
                alterarBotaoContinuar(false);
            }
        });

        $(hierarquiaSeletores + ' #numeroAP').change(function () {
            var tamanhoAP = $(hierarquiaSeletores + ' #numeroAP').val().length;
            if (tamanhoAP === 12) {
                verificarLiberacaoContinuar();
            }
            else {
                alterarBotaoContinuar(false);
            }

        });

        carregarListas();
    }

    function bindBtnSalvarDiligencia() {
        $("#btnSalvarDiligencia").off('click');
        $("#btnSalvarDiligencia").on('click', function () {
            salvar();
        });
    }

    function verificarLiberarNumeroAP(elem) {
        var retorno = null;
        var value = $(elem).find(':selected').data('ap');

        $("#numeroAP").val("");

        if (value != 4) {
            $("#numeroAP").hide();

            retorno = false;
        }
        else {
            $("#numeroAP").show();
            retorno = true;
        }

        return retorno;
    }


    function verificarLiberacaoContinuar() {

        var qtdFiscaisSelecionados = null;
        var tamanhoAP = null;
        var tipoOperacao = null;

        try {
            qtdFiscaisSelecionados = $(hierarquiaSeletores + ' #ddlSelecionados option').size();
            tamanhoAP = $(hierarquiaSeletores + ' #numeroAP').val().length;
            tipoOperacao = $(hierarquiaSeletores + ' #ddlOperacao option:selected').data('ap');
        }
        catch (e) {
            return false;
        }


        if (qtdFiscaisSelecionados > 0) {
            listaFiscaisOk = true;
        }
        else {
            listaFiscaisOk = false;
        }

        if (tipoOperacao != undefined && tipoOperacao != null) {
            if (tipoOperacao != 4) {
                operacaoOk = true;
            }
            else if (tamanhoAP === 12) {
                var numeroApValido = ValidarOperacaoNumeroAP();
                if (numeroApValido === true) {
                    operacaoOk = true;
                } else {
                    operacaoOk = false;
                }
            }
            else {
                operacaoOk = false;
            }
        }
        else {
            operacaoOk = false;
        }


        if (listaFiscaisOk === true && operacaoOk === true) {
            alterarBotaoContinuar(true);
            return true;
        }
        else {
            alterarBotaoContinuar(false);
            return false;
        }
    }

    function alterarBotaoContinuar(liberado) {

        if (liberado === true) {
            //$(hierarquiaSeletores + ' #continuarDiligencia').removeClass('btn-default');
            //$(hierarquiaSeletores + ' #continuarDiligencia').addClass('btn-success');
            $(hierarquiaSeletores + ' #continuarDiligencia').prop('disabled', false);
        }
        else {
            $(hierarquiaSeletores + ' #continuarDiligencia').prop('disabled', true);
            //$(hierarquiaSeletores + ' #continuarDiligencia').removeClass('btn-success');
            //$(hierarquiaSeletores + ' #continuarDiligencia').addClass('btn-default');
        }
    }

    function definirMascara() {
        $(hierarquiaSeletores + ' #numeroAP').unmask();
        $(hierarquiaSeletores + ' #numeroAP').attr('maxlength', '12');
        $(hierarquiaSeletores + ' #numeroAP').mask('00.000.000-0', { reverse: true });
    }

    function carregarListas() {
        CONTROLES.DropDown.PreencherSimples(hierarquiaSeletores + ' #ddlSelecionados', 'Diligencia', 'BuscarFiscalLogado', '', carregarListaFiscais);

    }

    function carregarListaFiscais() {
        CONTROLES.DropDown.PreencherSimples(hierarquiaSeletores + ' #ddlNaoSelecionados', 'Diligencia', 'CarregarListaFiscaisAtivosDoSetor', '', '', carregarListaOperacoes);
        carregarListaOperacoes();
    }

    function carregarListaOperacoes() {
        CONTROLES.DropDown.PreencherSimples(hierarquiaSeletores + ' #ddlOperacao', 'Diligencia', 'BuscarListaOperacoes', '--Selecione--', FISCALIZACAOOPERACIONAL.ControleDeBuscaDeDados);
        retornaIdSetorFiscalizacaoUsuarioLogado();
        verificarLiberarNumeroAP(hierarquiaSeletores + ' #ddlOperacao');
    }

    function validarEquipeFiscais() {
        var qtdFiscaisSelecionados = $(hierarquiaSeletores + ' #ddlSelecionados option').size();
        var validacaoCarregamento = $(hierarquiaSeletores + ' #ddlSelecionados option').text();

        if (qtdFiscaisSelecionados === null || qtdFiscaisSelecionados === undefined || qtdFiscaisSelecionados < 1 || validacaoCarregamento == 'carregando...') {
            BASE.MostrarMensagem('Selecione um fiscal na lista', TipoMensagem.Error);
            return false;
        }
        return true;
    }

    function ValidarOperacaoNumeroAP() {

        var numeroAPInformado = $(hierarquiaSeletores + ' #numeroAP').val();
        var numAP = numeroAPInformado.replace(/[^0-9]/g, '');

        var apValido = FISCALIZACAOOPERACIONAL.ValidarDigitoAp(numAP);

        if (apValido === true) {
            return true;
        }
        else {
            return false;
        }
        return true;
    }

    function ValidarOperacaoFiscalizacao() {

        var opFiscalizacao = $(hierarquiaSeletores + ' #ddlOperacao').val();

        if (opFiscalizacao != null && opFiscalizacao != undefined && opFiscalizacao != "") {
            return true;
        }
        return false;
    }

    function moverItem(elem) {
        if ($(elem).parent().attr("id") === "ddlNaoSelecionados") {
            $(elem).detach().appendTo(hierarquiaSeletores + ' #ddlSelecionados').prop('selected', false);
        }
        else {
            $(elem).detach().appendTo(hierarquiaSeletores + ' #ddlNaoSelecionados').prop('selected', false);
        }
    }

    function salvarLocalStorage(idSetorFiscalizacao) {        
     
        var listaFiscaisSelecionados = [];
        var Operacao = null;
        var NumeroAP = null;
        var IdFornecedo = null;
        var idSetor = IdSetor;
        var idConvenio = IdConvenio;
        var valorReceitaEstimada = $(hierarquiaSeletores + ' #valorReceitaEstimada').maskMoney('unmasked')[0];
        var telefone = $(hierarquiaSeletores + ' #telefone').val();
        var fax = $(hierarquiaSeletores + ' #fax').val();
        var email = $(hierarquiaSeletores + ' #email').val();

        if (valorReceitaEstimada != undefined)
            valorReceitaEstimada = valorReceitaEstimada.toString().replace('.', ',');

        if (telefone != undefined && telefone !== null)
            telefone = telefone.replace(/[^0-9]/g, '');

        if (fax != undefined && fax !== null)
            fax = fax.replace(/[^0-9]/g, '');

        $(hierarquiaSeletores + ' #ddlSelecionados option').each(function () {
            listaFiscaisSelecionados.push($(this).val());
        });

        var indx = $(hierarquiaSeletores + ' #ddlOperacao option:selected').index();

        if (indx > 0) {
            Operacao = $(hierarquiaSeletores + ' #ddlOperacao option').eq(indx).val();

            var nrAP = $(hierarquiaSeletores + ' #ddlOperacao option').eq(indx).data('ap');
            if (nrAP == 4)
                NumeroAP = $(hierarquiaSeletores + ' #numeroAP').val();
        }
        else {
            NumeroAP = $(hierarquiaSeletores + ' #numeroAP').val();

        }

        var itensDiligencia = criarObjetoDiligencia(indx, idSetor, idConvenio, Operacao, NumeroAP, listaFiscaisSelecionados, valorReceitaEstimada, telefone, fax, email);
        localStorage.setItem(tbDiligencia, itensDiligencia);

        return true;
    }

    function buscarLocalStorage() {
        var objJson = null;
        objJson = localStorage.getItem(tbDiligencia);        

        var Tabela = $.parseJSON(objJson);

        if (Tabela != null && Tabela != undefined && Tabela != '') {

            var indexOperacao = Tabela['IndexOperacao'] != 0 ? Tabela['IndexOperacao'] : $(hierarquiaSeletores + ' #ddlOperacao').find('option[value="' + Tabela['IdOperacaoFiscalizacao'] + '"]').data('index');

            if (indexOperacao != null && indexOperacao != undefined && indexOperacao != '') {

                var opFisc = $(hierarquiaSeletores + ' #ddlOperacao');
                $(opFisc).prop('selectedIndex', indexOperacao);

                var nrAP = verificarLiberarNumeroAP(opFisc);

                if (nrAP == true) {
                    $(hierarquiaSeletores + ' #numeroAP').val(Tabela.NumeroAveriguacaoPreliminar);
                    definirMascara();
                }
                operacaoOk = true;
            }
            else {
                $(hierarquiaSeletores + ' #numeroAP').val(Tabela.NumeroAveriguacaoPreliminar);
                definirMascara();
                numeroAPOK = true;
            }

            var fiscais = Tabela['Componentes'];

            if (fiscais != null && fiscais != undefined && fiscais != '') {

                $(fiscais).each(function (index, value) {
                    var valor = value;
                    var elem = $(hierarquiaSeletores + ' #ddlNaoSelecionados option').filter(function () { return this.value == valor });
                    moverItem(elem);
                });

                listaFiscaisOk = true;
            }
        }
        verificarLiberacaoContinuar();
    }

    function salvar() {        

        var objDiligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia));

        objDiligencia.Componentes = criarListaFiscais();

        var valorReceitaEstimada = $(hierarquiaSeletores + ' #valorReceitaEstimada').maskMoney('unmasked')[0];
        var telefone = $(hierarquiaSeletores + ' #telefone').val();
        var fax = $(hierarquiaSeletores + ' #fax').val();
        var email = $(hierarquiaSeletores + ' #email').val();

        if (valorReceitaEstimada != undefined)
            objDiligencia.ValorReceitaEstimada = valorReceitaEstimada.toString().replace('.', ',');

        if (telefone != undefined && telefone !== null)
            objDiligencia.Telefone = telefone.replace(/[^0-9]/g, '');

        if (fax != undefined && fax !== null)
            objDiligencia.Fax = fax.replace(/[^0-9]/g, '');

        if (email != undefined && email !== null)
            objDiligencia.Email = email;

        var objLocalSt = [
            'tbDiligencia_IH1836KNUHF',
            'EnderecoFiscalizacao',
            'tbEnderecoFornecedor_IH1836KNUHF', ];

        if ($('#addEnderecoFiscalizacao').is(':checked') == false) {           

            objDiligencia.CepEndereco = null;
            objDiligencia.DescricaoEndereco = null;
            objDiligencia.NumeroEndereco = null;
            objDiligencia.ComplementoEndereco = null;
            objDiligencia.BairroEndereco = null;
            objDiligencia.MunicipioEndereco = null;
            objDiligencia.EstadoEndereco = null;

        }

        FISCALIZACAOOPERACIONAL.SalvarDiligencia(objDiligencia, objLocalSt);
    }

    function buscar(idDiligencia, callback) {     
        if (idDiligencia != undefined) {
            $.ajax({
                url: '/Diligencia/BuscarDiligencia/',
                type: "GET",
                data: { idDiligencia: idDiligencia },
                success: function (data) {
                    if (data != null) {
                        var retorno = criarObjetoDiligenciaLocalStorage(data);
                                              
                        valorReceitaEstimada = retorno.ValorReceitaEstimada;
                        telefone = retorno.Telefone;
                        fax = retorno.Fax;
                        email = retorno.Fornecedor.Email;

                        localStorage.setItem(DILIGENCIA.ValorReceitaEstimada, valorReceitaEstimada);                       

                        if (telefone !== null) {
                            localStorage.setItem(DILIGENCIA.Telefone, telefone);
                        }

                        if (fax !== null) {
                            localStorage.setItem(DILIGENCIA.Fax, fax);
                        }

                        if (email !== null) {
                            localStorage.setItem(DILIGENCIA.Email, email);
                        }

                        FISCALIZACAOOPERACIONAL.SetLocalSotorage(DILIGENCIA.TblLocalStorageDiligencia, FISCALIZACAOOPERACIONAL.ConverterObjStringJson(retorno));

                        if (callback != null && callback != undefined)
                            callback();
                    }
                    else {
                        BASE.Mensagem.Mostrar("Erro ao recuperar os dados salvos da Diligencia, " + data.Mensagem, TipoMensagem.Error);
                    }

                    return false;
                },
                error: function (data) {
                    BASE.Mensagem.Mostrar("Erro ao recuperar os dados salvos da Diligencia", TipoMensagem.Error);
                }
            });
        }
    }

    function getValorReceitaEstimada() {     
        var valorReceitaEstimada = localStorage.getItem(DILIGENCIA.ValorReceitaEstimada);

        if (valorReceitaEstimada != null) {
            valorReceitaEstimada = parseFloat(valorReceitaEstimada).toFixed(2).replace('.', ',');
            $('#valorReceitaEstimada').val(valorReceitaEstimada);
        }
    }

    function getTelefoneFax() {

        $(' .telefoneFornecedor').unmask();
        $(' .faxFornecedor').unmask();

        var telefone = localStorage.getItem(DILIGENCIA.Telefone);
        if (telefone != null) {
            $(' .telefoneFornecedor').val(telefone);
        }

        var fax = localStorage.getItem(DILIGENCIA.Fax);
        if (fax != null) {
            $(' .faxFornecedor').val(fax);
        }     

        $(' .telefoneFornecedor').attr('maxlength', '15');
        $(' .telefoneFornecedor').mask(maskBehaviorTel, options);

        $(' .faxFornecedor').attr('maxlength', '14');
        $(' .faxFornecedor').mask('(00) 0000-0000');
    }

    var maskBehaviorTel = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    options = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskBehaviorTel.apply({}, arguments), options);
        }
    };

    function criarObjetoDiligenciaLocalStorage(obj) {
        var diligecia = {
            IndexOperacao: 0,
            Codigo: obj.Codigo,
            IdFiscalLogado: null,
            IdSetorFiscalizacao: obj.IdSetorFiscalizacao,
            IdConvenio: obj.IdConvenio,
            IdOperacaoFiscalizacao: obj.IdOperacaoFiscalizacao,
            NumeroAveriguacaoPreliminar: obj.NumeroAveriguacaoPreliminar,
            Componentes: criarListaFiscaisLocalStorage(obj.Componentes),
            IdFornecedor: obj.IdFornecedor,
            Fornecedor: FORNECEDORFISCALIZACAO.CriarFornecedorLocalStorage(obj.Fornecedor),
            EnderecoFornecedor: FORNECEDORFISCALIZACAO.CriarObjEnderecoFornecedorLs(obj.Fornecedor),
            CepEndereco: obj.CepEndereco,
            DescricaoEndereco: obj.DescricaoEndereco,
            NumeroEndereco: obj.NumeroEndereco,
            ComplementoEndereco: obj.ComplementoEndereco,
            BairroEndereco: obj.BairroEndereco,
            MunicipioEndereco: obj.MunicipioEndereco,
            EstadoEndereco: obj.EstadoEndereco,
            EhEnderecoFiscalizacao: obj.EhEnderecoFiscalizacao,
            ValorReceitaEstimada: obj.ValorReceitaEstimada,
            Fax: obj.Fax !== null ? obj.Fax : '',
            Telefone: obj.Telefone !== null ? obj.Telefone : ''
        };

        return diligecia;
    }

    function criarObjetoDiligencia(indx, idSetor, idConvenio, Operacao, NumeroAP, listaFiscaisSelecionados, valorReceitaEstimada, telefone, fax) {
        fornecedor = FORNECEDORFISCALIZACAO.BuscarFornecedorLS();
        enderecoFornecedor = FORNECEDORFISCALIZACAO.BuscaEnderecoFornecedorLS();
        enderecoFiscalizacao = ENDERECOFISCALIZACAO.BuscaEnderecoFiscalizacaoLS();

        var diligencia = JSON.stringify({
            IndexOperacao: indx,
            Codigo: FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.IdDiligencia),
            IdFiscalLogado: null,
            IdSetorFiscalizacao: idSetor,
            IdConvenio: idConvenio,
            IdOperacaoFiscalizacao: Operacao,
            NumeroAveriguacaoPreliminar: NumeroAP,
            Componentes: listaFiscaisSelecionados,
            IdFornecedor: fornecedor != null ? fornecedor.IdFornecedor : null,
            Fornecedor: fornecedor,
            EnderecoFornecedor: enderecoFornecedor,

            CepEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Cep : null,
            DescricaoEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Logradouro : null,
            NumeroEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Numero : null,
            ComplementoEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Complemento : null,
            BairroEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Bairro : null,
            MunicipioEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Municipio : null,
            EstadoEndereco: enderecoFiscalizacao != null ? enderecoFiscalizacao.Estado : null,
            EhEnderecoFiscalizacao: enderecoFiscalizacao != null ? enderecoFiscalizacao.EhEnderecofiscalizacao : null,
            ValorReceitaEstimada: valorReceitaEstimada,
            Telefone: telefone,
            Fax: fax,
            Email: email

        });

        return diligencia;
    }

    function criarListaFiscaisLocalStorage(listaFiscais) {
        var listFicais = [];

        $.each(listaFiscais, function (index, value) {
            listFicais.push(value.idFiscal);
        });

        return listFicais;
    }


    function criarListaFiscais() {
        var
        $objArrayFiscal = [],
        $objDiligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia));

        $.each($objDiligencia.Componentes, function (index, value) {
            $objArrayFiscal.push({ "idFiscal": value });
        });

        return $objArrayFiscal;
    }

    function retornaIdSetorFiscalizacaoUsuarioLogado() {
        $.ajax({
            url: "/Diligencia/RetornaFiscalLogado",
            cache: false,
            success: function (data) {
                IdSetor = data.SetorFiscalizacao;
                IdConvenio = data.IdConvenio;
            },
            error: function (error) {
                BASE.Mensagem.Mostrar("Erro ao buscar Fiscal Logado", TipoMensagem.Error);
            }
        });
    }

    function voltar() {
        FISCALIZACAOOPERACIONAL.AbreFrame();
    }

    function atualizarDiligenciaLocalStorage(obj) {     
        localStorage.removeItem(DILIGENCIA.TblLocalStorageDiligencia);
        localStorage.setItem(DILIGENCIA.TblLocalStorageDiligencia, FISCALIZACAOOPERACIONAL.ConverterObjStringJson(obj));
        localStorage.setItem(DILIGENCIA.IdFornecedor, parseInt(obj.IdFornecedor));
        localStorage.setItem(DILIGENCIA.NrAP, obj.NumeroAveriguacaoPreliminar);       
    }

    return {
        Init: init,
        Moveritem: moverItem,
        SalvarLocalStorage: salvarLocalStorage,
        BuscarLocalStorage: buscarLocalStorage,
        Salvar: salvar,
        Buscar: buscar,
        Voltar: voltar,
        TblLocalStorageDiligencia: tbDiligencia,
        BindSalvarDiligencia: bindBtnSalvarDiligencia,
        AtualizarDiligencia: atualizarDiligenciaLocalStorage,
        BuscarEspecifico: function () { return false; },
        IdDiligencia: idDiligencia,
        IdFornecedor: idFornecedor,
        NrAP: nrAp,
        ValorReceitaEstimada: valorReceitaEstimada,
        ObterReceitaEstimada: getValorReceitaEstimada,
        ObterTelefoneFax: getTelefoneFax,
        Telefone: telefone,
        Fax: fax,
        Email: email
    };

}());


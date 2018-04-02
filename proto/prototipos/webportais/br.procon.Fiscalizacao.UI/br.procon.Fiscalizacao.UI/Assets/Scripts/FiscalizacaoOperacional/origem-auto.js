ORIGEMAUTO = (function () {

    var hierarquiaSeletores = '#conteudoRegistrarAuto';

    function init() {
        REGISTRARAUTO.TratamentosEspecificos = function () { return false };
        REGISTRARAUTO.PreCarregar = preCarregarDados;
        bindAll();
    }

    function bindAll() {
        REGISTRARAUTO.TratamentosEspecificos = tratamentosEspecificos;

        verificaSetorConvenioUsuarioLogado();
        bindClickOptionSetorConvenio();
        bindChangeSetorConvenio();
        //carregarListaFiscais();
        bindValidacaoCampos();
        bindAdicionaTodos();
        bindRemoveTodos();
        bindClickContinuar();
        bindClickVoltar();
        bindChangeMotivoFiscalizacao();
        preencheResponsavelRegistro();
        validarRegras();
        exibirAveriguacaoPreliminar();
    }


    function bindChangeSetorConvenio() {

        $(hierarquiaSeletores + ' #inputOrigem').off('change');
        $(hierarquiaSeletores + ' #inputOrigem').on('change',
            function () {
                removeTodos();
                carregarListaFiscais();
            });
    }

    function verificaSetorConvenioUsuarioLogado() {
        var fiscalLogado = REGISTRARAUTO.FiscalLogado();
        if (fiscalLogado.IdConvenio != null && fiscalLogado.IdConvenio > 0) {
            $("input[name=TipoOrigem][value='1']").prop("checked", false);
            $("input[name=TipoOrigem][value='2']").prop("checked", true);           

            var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(REGISTRARAUTO.TblLocalStorageAutoManual));

            CONTROLES.DropDown.Preencher(hierarquiaSeletores + ' #inputOrigem', 'Convenio', 'ObterConveniosVigenciaValida', null, true, null, { DataEmissao: autoManual.DataEmissao }, function () {
                if (fiscalLogado.IdConvenio != null && fiscalLogado.IdConvenio > 0) {
                    $(hierarquiaSeletores + ' #inputOrigem').val(fiscalLogado.IdConvenio.toString());
                }
                else {
                    $(hierarquiaSeletores + ' #inputOrigem').prop('selectedIndex', 0);
                }
                desabilitaOrigemAuto();
                carregarListaFiscais();
            });


        } else {

            $("input[name=TipoOrigem][value='1']").prop("checked", true);
            $("input[name=TipoOrigem][value='2']").prop("checked", false);
            CONTROLES.DropDown.Preencher(hierarquiaSeletores + ' #inputOrigem', 'Setor', 'SelectList', null, true, null, null, function () {
                $(hierarquiaSeletores + ' #inputOrigem').val(fiscalLogado.SetorFiscalizacao.toString());
                desabilitaOrigemAuto();
                carregarListaFiscais();
            });
        }
    }


    function desabilitaOrigemAuto() {
        var fiscalLogado = REGISTRARAUTO.FiscalLogado();
        if (fiscalLogado.SetorFiscalizacao !== 5) {
            $(hierarquiaSeletores + ' #inputOrigem').attr("disabled", 'disabled');
            $(hierarquiaSeletores + ' #inputOrigem').prop("disabled", true);

            $(hierarquiaSeletores + ' input[name=TipoOrigem]').attr("disabled", 'disabled');
            $(hierarquiaSeletores + ' input[name=TipoOrigem]').prop("disabled", true);
        }
    }

    function bindClickOptionSetorConvenio() {
        var fiscalLogado = REGISTRARAUTO.FiscalLogado();
        if (fiscalLogado.SetorFiscalizacao === 5) {
            $("input[name=TipoOrigem]").off('click');
            $("input[name=TipoOrigem]").on('click', function () {
                removeTodos();
                var fiscalLogado = REGISTRARAUTO.FiscalLogado();
                CONTROLES.DropDown.Inicializar(hierarquiaSeletores + ' #inputOrigem', null);
                if (this.value === '2') {
             
                    var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(REGISTRARAUTO.TblLocalStorageAutoManual));

                    CONTROLES.DropDown.Preencher(hierarquiaSeletores + ' #inputOrigem', 'Convenio', 'ObterConveniosVigenciaValida', null, true, null, { DataEmissao: autoManual.DataEmissao }, function () {
                        if (fiscalLogado.IdConvenio != null && fiscalLogado.IdConvenio > 0) {
                            $(hierarquiaSeletores + ' #inputOrigem').val(fiscalLogado.IdConvenio.toString());
                        }
                        else {
                            $(hierarquiaSeletores + ' #inputOrigem').prop('selectedIndex', 0);
                        }
                        $(hierarquiaSeletores + ' #inputOrigem').trigger('change');
                    });
                }
                else if (this.value === '1') {
                    CONTROLES.DropDown.Preencher(hierarquiaSeletores + ' #inputOrigem', 'Setor', 'SelectList', null, true, null, null, function () {
                        if (fiscalLogado.IdConvenio != null && fiscalLogado.IdConvenio > 0) {
                            $(hierarquiaSeletores + ' #inputOrigem').prop('selectedIndex', 0);
                        }
                        else {
                            $(hierarquiaSeletores + ' #inputOrigem').val(fiscalLogado.SetorFiscalizacao.toString());
                        }
                        $(hierarquiaSeletores + ' #inputOrigem').trigger('change');
                    });
                }
            });
        } else {
            desabilitaOrigemAuto();
        }
    }

    function definirMascaraAP() {
        $(hierarquiaSeletores + ' #inputNumeroAveriguacaoPreliminar').unmask();
        $(hierarquiaSeletores + ' #inputNumeroAveriguacaoPreliminar').attr('maxlength', '12');
        $(hierarquiaSeletores + ' #inputNumeroAveriguacaoPreliminar').mask('00.000.000-0', { reverse: true });
    }

    function tratamentosEspecificos() {
        fiscaisSelecionados();
        validarRegras();
        exibirAveriguacaoPreliminar();
    }

    function preCarregarDados() {
        bindClickMoveEquipePorvez();
    }

    function carregarListaFiscais() {
        var tipoPesquisa = $('input[name=TipoOrigem]:checked', hierarquiaSeletores).val();
        var codSetorConvenio = $(hierarquiaSeletores + ' #inputOrigem').val();
        if (codSetorConvenio == '') {
            codSetorConvenio = '9999999';
        }

        var dataEmissao = '';
        var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));

        if (autoManual != null && autoManual != undefined) {
            dataEmissao = autoManual.DataEmissao;
        }
        REGISTRARAUTO.DropDown.PreencherComFiscalLogado(hierarquiaSeletores + ' #ddlNaoSelecionados', 'Diligencia', 'CarregarListaFiscaisAtivosDoSetor', true, tipoPesquisa + '|' + codSetorConvenio + '|' + dataEmissao, '', carregarListaOperacoes);
    }

    function carregarListaOperacoes() {

        var obj = $("#formOrigemAuto").serializeObject();
        var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));

        obj.Componentes = obterFiscaisSelecionados();

        autoManual = REGISTRARAUTO.CopiarPropriedades(obj, autoManual);
        REGISTRARAUTO.Salvar(autoManual);

        var tipoPesquisa = $('input[name=TipoOrigem]:checked', hierarquiaSeletores).val();
        var codSetorConvenio = $(hierarquiaSeletores + ' #inputOrigem').val();
        if (codSetorConvenio === '') {
            codSetorConvenio = '9999999';
        }

        REGISTRARAUTO.DropDown.PreencherMotivoFiscalizacao(hierarquiaSeletores + ' #inputMotivoFiscalização', 'Diligencia', 'BuscarListaOperacoes', tipoPesquisa + '|' + codSetorConvenio, '--Selecione--', REGISTRARAUTO.Buscar);

        //CONTROLES.DropDown.PreencherSimples(hierarquiaSeletores + ' #inputMotivoFiscalização', 'Diligencia', 'BuscarListaOperacoes', '--Selecione--', REGISTRARAUTO.Buscar);
        //CONTROLES.DropDown.PreencherSimples(hierarquiaSeletores + ' #inputMotivoFiscalização', 'Diligencia', 'BuscarListaOperacoes', '--Selecione--', null);
        //retornaIdSetorFiscalizacaoUsuarioLogado();
        //verificarLiberarNumeroAP(hierarquiaSeletores + ' #ddlOperacao');
    }

    function fiscaisSelecionados() {
        var autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(REGISTRARAUTO.TblLocalStorageAutoManual));

        if (autoManual.Componentes === null || autoManual.Componentes === undefined)
            return;
        $.each(autoManual.Componentes, function (index, value) {
            var valor = value;
            var elem = $(hierarquiaSeletores + ' #ddlNaoSelecionados option').filter(function () { return this.value == valor });
            moverItem(elem);
            //validarRegras();
        })
    }

    function moverItem(elem) {
        if ($(elem).parent().attr("id") === "ddlNaoSelecionados") {
            $(elem).detach().appendTo(hierarquiaSeletores + ' #ddlSelecionados').prop('selected', false);
            $('#ddlSelecionados option:first-child').addClass('bg-success text-success');
            $('#ddlNaoSelecionados option').removeClass('bg-success text-success');
        }
        else {
            $(elem).detach().appendTo(hierarquiaSeletores + ' #ddlNaoSelecionados').prop('selected', false);
        }
    }

    function bindValidacaoCampos() {

        $("#formOrigemAuto").validate({
            rules: {
                Origem: "required",
                IdEvento: "required",
                //NumeroAveriguacaoPreliminar: "required"
            },
            messages: {
                Origem: "Campo obrigatório",
                IdEvento: "Campo obrigatório",
                //NumeroAveriguacaoPreliminar: "Campo obrigatório"
            }
        });
    }

    function bindAdicionaTodos() {
        $('#addAll').off('click');
        $('#addAll').on('click', function () {
            adicionaTodos();
            validarRegras();
        });
    }

    function bindRemoveTodos() {
        $('#remAll').off('click');
        $('#remAll').on('click', function () {
            removeTodos();
            validarRegras();
        });
    }

    function bindClickMoveEquipePorvez() {
        $('#ddlNaoSelecionados option').off('click');
        $('#ddlNaoSelecionados option').on('click', function () {
            if ($(this).html().indexOf('Nenhum item') == -1) {
                moveEquipe(this);
                validarRegras();
            }
        });
    }

    function bindClickContinuar() {
        $("#btnContinuar").off('click');
        $("#btnContinuar").on('click', function () {
            var form = $("#formOrigemAuto");

            var valido = REGISTRARAUTO.ValidarDados(form),
                componentesValidos = validarQtdComponentesSelecionados(),
                tipoAP = retornarTipoAp(),
                operacaoNumeroAPValido = validarOperacaoNumeroAP();

            if (tipoAP === 4) {
                if (!operacaoNumeroAPValido) {
                    BASE.Mensagem.Mostrar("Número da Averiguação Preliminar inválido.", TipoMensagem.Error, "Averiguação Preliminar");
                    return;
                }
            }

            if (valido) {

                preencherFiscalAutuante();
                salvar();

                REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #diligencia');
                REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #infAuto');
                REGISTRARAUTO.ControlesMenu.ChecarOpcao('.vertical_nav #diligencia');
                REGISTRARAUTO.AbreFrame(4);
                BASE.Mensagem.Mostrar("Sucesso", TipoMensagem.Sucesso);

            }
            else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Error);
                form.validate();
            }
        });
    }

    function bindClickVoltar() {
        $("#btnVoltar").off('click');
        $("#btnVoltar").on('click', function () {


            var indice = $(this).data('indice');
            REGISTRARAUTO.AbreFrame(indice);

            REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #diligencia');
            REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #cadastrarDadosFornecedor');
            //REGISTRARAUTO.ControlesMenu.Deschecar('.vertical_nav #diligencia');
        });
    }

    function bindChangeMotivoFiscalizacao() {
        $('#inputMotivoFiscalização').off('change');
        $('#inputMotivoFiscalização').on('change', function () {
            exibirAveriguacaoPreliminar();
        });
    }

    function adicionaTodos() {
        $('#ddlNaoSelecionados option').detach().appendTo('#ddlSelecionados').prop('selected', false);
        $('#ddlSelecionados option:first-child').addClass('bg-success text-success');
        $('#ddlNaoSelecionados option').removeClass('bg-success text-success');
    }

    function removeTodos() {
        $('#ddlSelecionados option:not(:disabled)').detach().appendTo('#ddlNaoSelecionados').prop('selected', false);
        $('#ddlSelecionados option:first-child').addClass('bg-success text-success');
        $('#ddlNaoSelecionados option').removeClass('bg-success text-success');
    }

    function moveEquipe(elem) {
        if ($(elem).parent().attr("id") == "ddlNaoSelecionados") {
            $(elem).detach().appendTo('#ddlSelecionados').prop('selected', false);
            $('#ddlSelecionados option:first-child').addClass('bg-success text-success');
            $('#ddlNaoSelecionados option').removeClass('bg-success text-success');
        }
        else {
            $(elem).detach().appendTo('#ddlNaoSelecionados').prop('selected', false);
            $('#ddlSelecionados option:first-child').addClass('bg-success text-success');
            $('#ddlNaoSelecionados option').removeClass('bg-success text-success');
        }
    }

    function salvar() {
        var obj = $("#formOrigemAuto").serializeObject(),
            autoManual = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));
        obj.Componentes = obterFiscaisSelecionados();

        autoManual = REGISTRARAUTO.CopiarPropriedades(obj, autoManual);
        REGISTRARAUTO.Salvar(autoManual);
    }

    function obterFiscaisSelecionados() {
        var listaFiscaisSelecionados = [];

        $(hierarquiaSeletores + ' #ddlSelecionados option').each(function () {
            listaFiscaisSelecionados.push($(this).val());
        });

        return listaFiscaisSelecionados;
    }

    function preencheResponsavelRegistro() {
        var fiscalLogado = REGISTRARAUTO.FiscalLogado();
        $('#responsavelReg').text(fiscalLogado.CIF + ' - ' + fiscalLogado.Nome);
    }

    function validarRegras() {
        var regraQtdComponentes = null,

            regraQtdComponentes = validarQtdComponentesSelecionados();

        if (regraQtdComponentes == true)
            REGISTRARAUTO.LiberarBotaoContinuar(true);
        else
            REGISTRARAUTO.LiberarBotaoContinuar(false);
    }

    function obterFiscalAutuante() {
        var fiscalAutuante = {
            IdFiscalAutuante: null,
            NomeFiscalAutuante: null
        }

        fiscalAutuante.IdFiscalAutuante = $("#ddlSelecionados option").first().val();
        fiscalAutuante.NomeFiscalAutuante = $("#ddlSelecionados option").first().text();

        return fiscalAutuante;
    }

    function preencherFiscalAutuante() {
        var fiscalAutuante = obterFiscalAutuante();

        $("#inputIdFiscalAutuante").val(fiscalAutuante.IdFiscalAutuante);
        $("#inputNomeFiscalAutuante").val(fiscalAutuante.NomeFiscalAutuante);
    }

    function validarQtdComponentesSelecionados() {
        var valido = null,
            qtdComponentes = $('#ddlSelecionados option').length;

        if (qtdComponentes > 0) {
            valido = true;
        }
        else
            valido = false;

        return valido;
    }

    function exibirAveriguacaoPreliminar() {
        var index = $('#inputMotivoFiscalização option:selected').index(),
            ap = $('#inputMotivoFiscalização option').eq(index).data('ap');

        if (ap === 4) {
            $("#inputNumeroAveriguacaoPreliminar").show();
            definirMascaraAP();
            adicionarValidacaoAveriguacaoPreliminar();
        } else {
            $("#inputNumeroAveriguacaoPreliminar").hide();
            removerValidacaoAveriguacaoPreliminar();
            limparNrAP();
        }
    }

    function adicionarValidacaoAveriguacaoPreliminar() {
        $("#inputNumeroAveriguacaoPreliminar").rules("add", { required: true, messages: { required: "Campo obrigatório" } });
    }

    function removerValidacaoAveriguacaoPreliminar() {
        $(".error[for='inputNumeroAveriguacaoPreliminar']").html('');
        $("#inputNumeroAveriguacaoPreliminar").rules("remove", 'required');
    }

    function limparNrAP() {
        $('#inputNumeroAveriguacaoPreliminar').val('');
    }

    function validarOperacaoNumeroAP() {

        var numeroAPInformado = $(hierarquiaSeletores + ' #inputNumeroAveriguacaoPreliminar').val();
        var numAP = numeroAPInformado.replace(/[^0-9]/g, '');

        var apValido = validarDigitoAP(numAP);

        if (apValido === true) {
            return true;
        }
        else {
            return false;
        }
        return true;
    }

    function validarDigitoAP(numeroAP) {

        var tamanhoTotal = numeroAP.length;
        var digito = 0;

        if (numeroAP === '000000000') {
            return false;
        }

        if (tamanhoTotal === 9) {
            digito = parseInt(numeroAP.substr(8, 1));
        }
        else if (tamanhoTotal === 10) {
            //Sem pontuação
            digito = parseInt(numeroAP.substr(9, 1));
        }
        else if (tamanhoTotal === 12) {
            //Com pontuação
            digito = parseInt(numeroAP.substr(11, 1));
        }

        var valido = retornarDigitoApValido(numeroAP);

        if (digito === valido) {
            return true;
        }
        else {
            return false;
        }
    }

    function retornarDigitoApValido(apuracao) {

        var coef = "23456789";
        var k = 0;
        var r = 0;
        var T = 0;

        apuracao = apuracao.substring(0, 2) + parseInt(apuracao.substring(2, 8));

        for (k = 1; k <= 8; k++) {
            T = T + apuracao.substr(k - 1, 1) * coef.substr(k - 1, 1);
        }
        r = T % 11
        if (r < 2) {
            return 0;
        }
        else {
            return 11 - r;
        }
    }

    function retornarTipoAp() {
        var index = $('#inputMotivoFiscalização option:selected').index(),
            ap = $('#inputMotivoFiscalização option').eq(index).data('ap');

        return ap;
    }

    return {
        Init: init
    }
}());
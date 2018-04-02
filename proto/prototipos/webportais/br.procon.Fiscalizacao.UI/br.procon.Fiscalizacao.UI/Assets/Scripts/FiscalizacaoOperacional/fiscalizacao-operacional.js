
FISCALIZACAOOPERACIONAL = (function () {

    var idDiligencia = null;

    function init() {
        bindOpcoesAbas();
        inicializarPaginas();
    }    

    function bindOpcoesAbas() {

        $('#diligencia').off('click');
        $('#dadosFornecedor').off('click');
        $('#tipoAutuacao').off('click');
        $('#previaAuto').off('click');

        $('#diligencia').on('click', function () {
            transitoAbas($(this), 1);
        });

        $('#dadosFornecedor').on('click', function () {
            transitoAbas($(this), 2);
        });

        $('#tipoAutuacao').on('click', function () {
            transitoAbas($(this), 3);
        });

    }

    function bindVoltar() {
        $("#btnVoltar").off('click');
        $("#btnVoltar").on('click', function () {            

            var _indice = $(this).data("indice");
            FISCALIZACAOOPERACIONAL.DesabilitarOpcao('.vertical_nav #dadosFornecedor');
            FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #diligencia');
            FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #dadosFornecedor');
            abreFrame(_indice);
        });
    }

    function transitoAbas(elem, indiceFrame) {
        var ativo = $(elem).parent().hasClass('active');
        var habilitado = $(elem).parent().hasClass('filled');

        if (ativo === true || habilitado === true) {
            FISCALIZACAOOPERACIONAL.DesabilitarOpcao('.vertical_nav ul li a');
            FISCALIZACAOOPERACIONAL.AbreFrame(indiceFrame);
            FISCALIZACAOOPERACIONAL.HabilitarOpcao(elem);
        }
    }    

    function inicializarPaginas() {

        var divPaginas = null;

        try {
            divPaginas = $('#frmContent #conteudoAutoNotificao').html();
            divPaginas = divPaginas.trim();
        }
        catch (e) {
        }

        if (divPaginas === null || divPaginas === undefined || divPaginas === '') {
            abreFrame(1);
        }
        return false;
    }

    function abreFrame(indice, callback) {       
        if (indice === null || indice === undefined || (indice <= 0)) {
            BASE.MostrarMensagemErro('Índice inválido');
            return false;
        }       

        $.ajax({
            url: "/FiscalizacaoOperacional/AbreFrame",
            data: { id: indice },
            cache: false,
            success: function (result) {
                if (result === null || result === undefined) {
                    BASE.MostrarMensagem('Ocorreu um erro ao tentar abrir a página solitada', TipoMensagem.Error);
                    return false;
                }
                alteraHtmlView(result);
                inicializarJS(indice);               

                if (callback != undefined)
                    callback(1);

            },
            error: function (result) {

                if (result === null || result === undefined) {
                    BASE.MostrarMensagem('Ocorreu um erro ao tentar abrir a página solitada', TipoMensagem.Error);
                    return false;
                }

                BASE.MostrarMensagem(result.Mensagem, TipoMensagem.Error);
            }
        });      

    }

    function controleDeBuscaDeDados(idDiligencia) {        
        var tabelaDiligencia = FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia),
            idDiligencia = FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.IdDiligencia)

        if (tabelaDiligencia != null && tabelaDiligencia != undefined && tabelaDiligencia != 'undefined') {
            FISCALIZACAOOPERACIONAL.ObterDadosEspecifico();

        }
        else {
            if (idDiligencia != null && idDiligencia != undefined) {
                DILIGENCIA.Buscar(idDiligencia, FISCALIZACAOOPERACIONAL.ObterDadosEspecifico);
            }
        }

        // CHECAR COMPONENTES CASO DADOS SEJAM IGUAIS AO DO LOCAL STORAGE
        function carregaDadosDiligencia() {
            var equipeSelecionada = $("select#ddlSelecionados option").map(function () { return $(this).val(); }).get();

            var tbdiligencia = JSON.parse(localStorage.getItem("tbDiligencia_IH1836KNUHF"));

            if (tbdiligencia != null) {
                var fiscaisSelecionados = tbdiligencia.Componentes
                var numeroAPLS = tbdiligencia.NumeroAveriguacaoPreliminar

                var atual = fiscaisSelecionados.sort();
                var novo = equipeSelecionada.sort();

                var is_same = (atual.length == novo.length) && atual.every(function (element, index) {
                    return parseInt(element) === parseInt(novo[index]);
                });

                return is_same;
            }
        }

        function carregaDadosAP() {
            var numeroAP = $('#numeroAP').val();

            var tbdiligencia = JSON.parse(localStorage.getItem("tbDiligencia_IH1836KNUHF"));

            if (tbdiligencia != null) {
                var numeroAPLS = tbdiligencia.NumeroAveriguacaoPreliminar

                var comparaAP = (numeroAP == numeroAPLS)
                return comparaAP;
            }

        }

        function carregaDadosMotivo() {
            var motivoFisc = $('#ddlOperacao').val();

            var tbdiligencia = JSON.parse(localStorage.getItem("tbDiligencia_IH1836KNUHF"));

            if (tbdiligencia != null) {
                var motivoFiscLS = tbdiligencia.IdOperacaoFiscalizacao

                var comparaMotivo = (motivoFisc == motivoFiscLS)
                return comparaMotivo;
            }

        }

        $('#numeroAP').focusout(function () {
            var comparaMotivo = carregaDadosMotivo();
            var comparaAP = carregaDadosAP();
            var is_same = carregaDadosDiligencia();
            var tbdiligencia = JSON.parse(localStorage.getItem("tbDiligencia_IH1836KNUHF"));
            if (tbdiligencia != null) {
                if (comparaAP == false || is_same == false || comparaMotivo == false) {
                    FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #diligencia');
                }
                else {
                    FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #diligencia');
                    FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #diligencia');
                }
            }

        })

        $('#ddlOperacao').change(function () {
            var comparaMotivo = carregaDadosMotivo();
            var comparaAP = carregaDadosAP();
            var is_same = carregaDadosDiligencia();
            var tbdiligencia = JSON.parse(localStorage.getItem("tbDiligencia_IH1836KNUHF"));
            if (tbdiligencia != null) {
                if (comparaAP == false || is_same == false || comparaMotivo == false) {
                    FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #diligencia');
                }
                else {
                    FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #diligencia');
                    FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #diligencia');
                }
            }

        })
        

        if (window.performance) {
        }

        if (performance.navigation.type == 1) {
            var comparaMotivo = carregaDadosMotivo();
            var is_same = carregaDadosDiligencia();
            var comparaAP = carregaDadosAP();

            if (is_same == true || comparaAP == true || comparaMotivo == false) {
                FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #diligencia');
                // FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #dadosFornecedor');
                // FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #diligencia');
                // FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #dadosFornecedor');
                // FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #tipoAutuacao');
                // FISCALIZACAOOPERACIONAL.LiberarOpcao('.vertical_nav #dadosFornecedor');
                // FISCALIZACAOOPERACIONAL.LiberarOpcao('.vertical_nav #tipoAutuacao');
            }
        } 

        $('#ddlSelecionados, #ddlNaoSelecionados').click(function () {
            var is_same = carregaDadosDiligencia();
            var comparaMotivo = carregaDadosMotivo();
            var comparaAP = carregaDadosAP();
            var tbdiligencia = JSON.parse(localStorage.getItem("tbDiligencia_IH1836KNUHF"));
            if (tbdiligencia != null) {
                if (is_same == false || comparaAP == false || comparaMotivo == false) {
                    FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #diligencia');
                }
                else {
                    FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #diligencia');
                    FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #diligencia');
                }
            }
        })

    }

    function inicializarJS(indice) {
        var index = parseInt(indice);

        switch (index) {
            case 1: DILIGENCIA.Init(); break;
            case 2: ENDERECOFISCALIZACAO.Init(); break;
            case 3: MENUAUTO.Init(); break;
            default: DILIGENCIA.Init(); break;
        }
    }

    function alteraHtmlView(html) {
        var frmContent = $('#frmContent #conteudoAutoNotificao');
        frmContent.html(html);
    }

    function habilitarOpcao(seletor) {

        var contemClasse = $(seletor).parent().hasClass('active');
        if (contemClasse === false) {
            $(seletor).parent().removeClass('inactive');
            $(seletor).parent().addClass('active');
        }
    }

    function liberarOpcao(seletor) {
        var contemClasse = $(seletor).parent().hasClass('active');
        if (contemClasse === false) {
            $(seletor).parent().addClass('js-menu-active');
        }
    }

    function desabilitarOpcao(seletor) {
        var contemClasse = $(seletor).parent().hasClass("active");
        if (contemClasse === true) {
            $(seletor).parent().removeClass('active');
            $(seletor).parent().addClass('inactive');
        }
    }

    function checarOpcao(seletor) {

        var contemClasse = $(seletor).parent().hasClass('filled');

        if (contemClasse === false) {
            $(seletor).parent().removeClass('active');
            $(seletor).parent().addClass('inactive');
            $(seletor).parent().addClass('filled');
        }
    }

    function deschecar(seletor) {

        var contemClasse = $(seletor).parent().hasClass('filled');

        if (contemClasse === true) {
            $(seletor).parent().removeClass('filled');
        }

    }

    function formToJSON(selector) {
        var form = {};
        $(selector).find(':input[name]:enabled').each(function () {
            var self = $(this);
            var name = self.attr('name');
            if (form[name]) {
                form[name] = form[name] + ',' + self.val();
            }
            else {
                form[name] = self.val();
            }
        });

        return form;
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

    function salvar(url, model, msgErro, msgSucesso, callBackSucesso) {
        $.ajax({
            url: url,
            type: "POST",
            data: { model: model },
            success: function (data) {

                if (data.Sucesso) {

                    if (data.Resultado != null && data.Resultado != undefined) {
                        if (data.Resultado.Codigo != null && data.Resultado.Codigo != undefined) {                           
                            idDiligencia = data.Resultado.Codigo;
                            valorReceitaEstimada = data.Resultado.ValorReceitaEstimada;
                            telefone = data.Resultado.Telefone;
                            fax = data.Resultado.Fax;
                            email = data.Resultado.Email;
                            setLocalStorage(DILIGENCIA.IdDiligencia, idDiligencia);
                            setLocalStorage(DILIGENCIA.ValorReceitaEstimada, valorReceitaEstimada);
                            setLocalStorage(DILIGENCIA.Telefone, telefone);
                            setLocalStorage(DILIGENCIA.Fax, fax);
                            setLocalStorage(DILIGENCIA.Email, email);
                        }
                    }

                    BASE.Mensagem.Mostrar(msgSucesso, TipoMensagem.Sucesso);
                    if (callBackSucesso != null && callBackSucesso != undefined) {
                        callBackSucesso();
                    }
                }
                else {
                    BASE.Mensagem.Mostrar(msgErro + " - " + data.Mensagem, TipoMensagem.Error);
                }
            },
            error: function (data) {
                BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error);
            }
        });
    }

    function salvarDiligencia(model, objArrayLocalStorage) {
    
        salvar('/Diligencia/SalvarDiligencia', model, 'Ocorreu um erro ao tentar salvar a Diligência.', 'Diligência salva com sucesso.', function () {
                      
            //localStorage.removeItem(objArrayLocalStorage[0]);
            localStorage.removeItem(objArrayLocalStorage[1]);
            localStorage.removeItem(objArrayLocalStorage[2]);

            abreFrame(3);

            FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #tipoAutuacao');
            FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #dadosFornecedor');

        });

    }

    function lavrarAutoNotificacao(model, objArrayLocalStorage) {
        salvar('AutoFiscalizacao/LavrarAuto', model, 'Erro ao tentar lavrar o Auto', 'Auto lavrado com sucesso.', function () {
            //TODO:
            //Visualizar documento?
            //Imprimir documento ?
        });
    }

    function converterObjJson(obj) {

        var objConvertido = null;

        try {
            objConvertido = JSON.parse(obj);
        } catch (e) {
        }

        return objConvertido
    }

    function converterObjStringJson(obj) {
        var objConvertido = null;

        try {
            objConvertido = JSON.stringify(obj);
        } catch (e) {
        }

        return objConvertido
    }

    function getLocalStrorage(tabela) {
        return localStorage.getItem(tabela);
    }

    function setLocalStorage(tabela, value) {
        localStorage.setItem(tabela, value);
    }

    return {
        Init: init,
        AbreFrame: abreFrame,
        LiberarOpcao: liberarOpcao,
        HabilitarOpcao: habilitarOpcao,
        DesabilitarOpcao: desabilitarOpcao,
        ChecarOpcao: checarOpcao,
        Deschecar: deschecar,
        AlteraHtmlView: alteraHtmlView,
        ValidarDigitoAp: validarDigitoAP,
        InicializarJS: inicializarJS,
        FormToJson: formToJSON,
        SalvarDiligencia: salvarDiligencia,
        LavrarAutoNotificacao: lavrarAutoNotificacao,
        BindVoltar: bindVoltar,
        ConverterObjJson: converterObjJson,
        ConverterObjStringJson: converterObjStringJson,
        GetLocalStorage: getLocalStrorage,
        SetLocalSotorage: setLocalStorage,
        ControleDeBuscaDeDados: controleDeBuscaDeDados,
        ObterDadosEspecifico: function () { return false }
    };

}());

$(function () {
    FISCALIZACAOOPERACIONAL.Init();
});
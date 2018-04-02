MENUAUTO = (function () {
    var $hierarquiaSeletores = $("#frmContent #conteudoAutoNotificao"),
        IDMenuAuto = null,
        IDItemLista = null,
        AUTOCOMPLEXO = "tbAuto_D343FDZXH1",
        idDiligencia = "idDiligencia",
        fiscalLogado = null;

    function init() {
        bindAll();
    }

    function bindAll() {
        bindBtnMenuAutos();
        clearSession();
        esconderTipoAutoFiscalLogado();
        $('.rg').unmask();
        $('.cpf').mask('000.000.000-00', { placeholder: '___.___.___-__' });
    }

    function clearSession() {
        var clearSession = $('input[name="clearSession"]').val();

        if (clearSession == "1") {
            deletarDiligenciaLocalStorage();

            var autos =
            [
                "tbAutosAssociados"

            ];

            $.each(autos, function (index, value) {
                localStorage.removeItem(value);
            });

            $('input[name="clearSession"]').val('');
        }
    }

    //Função é chamada nos JS de cada Auto após renderizar as Views
    function bindControlesTela() {
        bindBotaoNovoItem();
        bindBtnVoltar();
        bindBtnPreVisualizarAuto();
        bindBtnLavrarAuto();
        bindBotaoNovoItemApreensao();
        bindCheckBox();

        $('#itensApreensaoNotif').hide();
        $('#itensApreensaoNotif table').hide();

        var tblMenu = identificarTbItensLocalStorage();
        loadTbItens(tblMenu, true);
    }

    /* Botões */
    function bindBtnVoltar() {
        $('#btnVoltar').off('click');
        $('#btnVoltar').on('click', function () {
            var _indice = $(this).data('indice'),
                _seletorMenuHabilita = $(this).data('menu-habilita'),
                _seletorMenuDesabilita = $(this).data('menu-desabilita'),
                _previsualizacao = $(this).data('pre-visualizacao');

            if (_previsualizacao != true)
                _indice = parseInt(_indice) - 1;

            if (_indice === 0)
                _indice = 1;

            FISCALIZACAOOPERACIONAL.HabilitarOpcao(_seletorMenuHabilita);
            FISCALIZACAOOPERACIONAL.DesabilitarOpcao(_seletorMenuDesabilita);
            if (_indice === 3)
                FISCALIZACAOOPERACIONAL.AbreFrame(3);
            else
                FISCALIZACAOOPERACIONAL.AbreFrame(_indice, abreFrame);
        });
    }

    function bindBtnMenuAutos() {
        $('.autos').off('click');
        $('.autos').on('click', function () {
            var naocheck = $('.blocosItem').find('input').not(':checked');
            $(this).parent().addClass('btn-primary');
            $(naocheck).parent().removeClass('btn-primary');
            IDMenuAuto = $(this).data('id');
            abreFrame(IDMenuAuto);
        });
    }

    function bindBtnPreVisualizarAuto() {
        $('#btnPreVisualizarAuto').off('click');
        $('#btnPreVisualizarAuto').on('click', function () {
            var indice = $(this).data('indice'),
                form = $(this).parents('form:first');

            FISCALIZACAOOPERACIONAL.DesabilitarOpcao('.vertical_nav #tipoAutuacao');
            FISCALIZACAOOPERACIONAL.HabilitarOpcao('.vertical_nav #previaAuto');
            FISCALIZACAOOPERACIONAL.ChecarOpcao('.vertical_nav #tipoAutuacao');

            var obj = MENUAUTO.ModelAutoNotificacao(form);

            if (obj.Documento === "CPF") {
                obj.NumeroDocumentoResponsavelFornecedor = obj.NumeroDocumentoResponsavelFornecedor.replace(/[^\d]+/g, '');
            }

            obj.TipoDocumento = $('label [name=Documento]:checked').val();

            //REGRAS DE COMBINADOS DE AUTOS PARA OBRIATORIEDADE DO ENDEREÇO DE FISCALIZACAO
            var diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

            //RECUPERA DADOS DO FORNECEDOR PARA VERIFICAR DE ENDEREÇO: UF DE SP NÃO É OBRIGATÓRIO ENDEREÇO DE FISCALIZAÇÃO
            var dadosAuto = FISCALIZACAOOPERACIONAL.ConverterObjJson(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.TblLocalStorageDiligencia));

            var autoApreensaoMarcado = $('#incluiApreensaoNotif').is(':checked');

            var tipoAuto = $('.btn-primary').find('input[name=TipoAuto]').val();

            var mensagem = "Endereço de Fiscalização é obrigatório";

            var enderecoSP = false;

            if (dadosAuto.EnderecoFornecedor != null && dadosAuto.EnderecoFornecedor != undefined && dadosAuto.EnderecoFornecedor.Estado == "SP") {
                enderecoSP = true;
            }

            if ((tipoAuto == "5" || tipoAuto == "2" || tipoAuto == "3") && diligencia.CepEndereco == null && enderecoSP == false) {
                BASE.MostrarMensagem(mensagem, TipoMensagem.Alerta);
                return;
            }
            else if ((tipoAuto == "4" || tipoAuto == "1") && autoApreensaoMarcado == true && diligencia.CepEndereco == null  && enderecoSP == false) {
                BASE.MostrarMensagem(mensagem, TipoMensagem.Alerta);
                return;
            }

            obj.CidadeLocalCumprimento = diligencia.CidadeLocalCumprimento;
            visualizar(indice, obj, 'Erro ao tentar visualizar o arquivo de Auto', 'Visualização concluída com sucesso');
        });
    }

    function bindBtnLavrarAuto() {
        $('#btnLavarAuto').off('click');
        $('#btnLavarAuto').on('click', function () {
            $("#btnLavarAuto").prop('disabled', true);
            lavrarAuto();
        });
    }

    function bindBotaoNovoItem() {
        $('.btn-inserir-modal').off('click');
        $('.btn-inserir-modal').click(function () {
            $('#txt-inserir-itens').val('');
            $('#modalIncluirItem').modal();
            return false;
        });

        $('#modalIncluirItem').on('shown.bs.modal', function (e) {
            $('#modalIncluirItem textarea').focus();
        });
    }
    //Apreensão
    function bindBotaoNovoItemApreensao() {
        $('.btn-inserir-modal-apreensao').click(function () {
            $('#txt-inserir-itens-apreensao').val('');
            $('#modalIncluirItemApreendidoNotif').modal();
            return false;
        });
    }

    function bindCheckBox() {
        $('#incluiApreensaoNotif').change(function () {
            if ($(this).is(':checked')) {
                $('#modalIncluirItemApreendidoNotif').modal();
                $('#modalIncluirItemApreendidoNotif textarea').val('');
                $('#itensApreensaoNotif').show();
                $('#modalIncluirItemApreendidoNotif textarea').focus();
            }
            else {
                $(this).prop('checked', true);
                //$('.enderecoCorrespondencia').hide();
                $('#modalCancelaApreensaoNotif').modal();
                $('#modalCancelaApreensaoNotif .btn-primary').click(function () {
                    $('#incluiApreensaoNotif').prop('checked', false);
                    $('#itensApreensaoNotif').hide();
                    $('#itensApreensaoNotif table').hide();
                    limpaListaItensApreensao();
                })
            }
        });

        $('#modalIncluirItemApreendidoNotif').on('shown.bs.modal', function (e) {
            $('#modalIncluirItemApreendidoNotif textarea').focus();
        });
    }
    function limpaListaItensApreensao() {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);

        if (tbItens == null) {
            tbItens = [];
            localStorage.setItem(tblMenu, JSON.stringify(tbItens));
        }
        else {
            var result = [];
            for (i = 0; i < tbItens.length; i++) {
                var itm = tbItens[i];
                try {
                    itm = JSON.parse(tbItens[i]);
                }
                catch (e) {
                }

                if (itm.tipo != 1) {
                    result.push(tbItens[i]);
                }
            }
            localStorage.setItem(tblMenu, JSON.stringify(result));
        }
        loadTbItens(tblMenu, true);
        IDItemLista = null;
        return true;
    }

    function bindBotoesAcaoLista() {
        $('#modalIncluirItem .btn-salvar-item').off('click');
        $('#modalIncluirItem .btn-salvar-item').on('click', function () {
            adicionar();
            var tblMenu = identificarTbItensLocalStorage();
            loadTbItens(tblMenu, true);
            $('#modalIncluirItem').modal(false);
        });

        $('#modalIncluirItemApreendidoNotif .btn-salvar-item-apreensao').off('click');
        $('#modalIncluirItemApreendidoNotif .btn-salvar-item-apreensao').on('click', function () {
            adicionarApreensao();
            var tblMenu = identificarTbItensLocalStorage();
            $('#itensApreensaoNotif').show();
            $('#itensApreensaoNotif table').show();
            loadTbItens(tblMenu, true);
            $('#modalIncluirItemApreendidoNotif').modal(false);
        });

        $('#modalIncluirItemApreendidoNotif .btn-cancelar-item-apreensao').off('click');
        $('#modalIncluirItemApreendidoNotif .btn-cancelar-item-apreensao').on('click', function () {
            $('#txt-inserir-itens-apreensao').val('');
            FecharApreensao();
        });

        $('.btn-editar-modal').off('click');
        $('.btn-editar-modal').on('click', function () {
            IDItemLista = $(this).data('id');
            var descricaoItem = $(this).data('descricao');

            $("#txt-editar-itens").val(descricaoItem);
            $("#txt-editar-itens").focus();
            $('#modalEditarItem').modal();

            bindAcoesModalEditar();
        });

        $('.btn-excluir-modal').off('click');
        $('.btn-excluir-modal').on('click', function () {
            IDItemLista = $(this).data('id');
            $('#modalExcluir').modal();
            bindAcoesModalExcluir();
        });
    }

    function FecharApreensao() {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);

        if (tbItens == null) {
            tbItens = [];
            localStorage.setItem(tblMenu, JSON.stringify(tbItens));
        }
        if (tbItens.length > 0) {
            var tpApreensao = 0;
            for (var i = 0; i < tbItens.length; i++) {
                if (tbItens[i].tipo === 1)
                    tpApreensao += 1;
            }

            if (tpApreensao === 0) {
                $('#itensApreensaoNotif').hide();
                $('#incluiApreensaoNotif').prop('checked', false);
            }
        }
        else {
            $('#itensApreensaoNotif').hide();
            $('#incluiApreensaoNotif').prop('checked', false);
        }
    }

    function bindAcoesModalEditar() {
        $('#modalEditarItem .btn-salvar-item').off('click');
        $('#modalEditarItem .btn-salvar-item').on('click', function () {
            Editar(IDItemLista);
            $('#modalEditarItem').modal(false);
        });
    }

    function bindAcoesModalExcluir() {
        $('#modalExcluir .btn-excluir-sim').off('click');
        $('#modalExcluir .btn-excluir-sim').on('click', function () {
            var $excluido = Excluir(IDItemLista, true);
            if ($excluido === true) {
                $('#modalExcluir').modal(false);
                FecharApreensao();
            }
        });

        $('#modalExcluir .btn-excluir-nao').off('click');
        $('#modalExcluir .btn-excluir-nao').on('click', function () {
            $('#modalExcluir').modal(false);
        });
    }

    function montaLayoutAuto(indice, objeto) {
        var _indice = parseInt(indice),
            _elTitAuto = $("#tituloAuto"),
            _corpoAuto_1 = $('#corpoAuto1'),
            _corpoAuto_2 = $('#corpoAuto2');

        _corpoAuto_3 = $('#corpoAuto3');
        _corpoAuto_4 = $('#corpoAuto4');
        _elTitAutoApreensao = $("#tituloAutoApreensao");

        switch (_indice) {
            case 1:
                _elTitAuto.text("AUTO DE NOTIFICAÇÃO Nº XXXXX SÉRIE XX");
                _corpoAuto_1.text('COM FULCRO NO ARTIGO 55, §4º DA LEI Nº 8078/90 – CÓDIGO DE DEFESA DO CONSUMIDOR, NOTIFICO A EMPRESA ACIMA QUALIFICADA A APRESENTAR NO LOCAL, DATA E HORA ABAIXO INDICADOS, ATRAVÉS DE SEU PREPOSTO OU REPRESENTANTE LEGAL DEVIDAMENTE QUALIFICADO, ESCLARECIMENTOS POR ESCRITO ACOMPANHADOS DOS RESPECTIVOS DOCUMENTOS COMPROBATÓRIOS DO(S) SEGUINTE(S) ITEM(NS):');
                _corpoAuto_2.text('TAIS INFORMAÇÕES SÃO NECESSÁRIAS PARA INSTRUIR PROCEDIMENTO ADMINISTRATIVO EM CURSO NA DIRETORIA DE FISCALIZAÇÃO NO PROCON/SP.');
                _corpoAuto_3.html('<p>LOCAL E DATA PARA CUMPRIMENTO DESTA NOTIFICAÇÃO:<br />' + objeto.EnderecoLocalCumprimento + ', ATÉ O DIA ' + objeto.DataCumprimentoNotificacao + '</p>');

                break;

            case 2:
                _elTitAuto.text("AUTO DE CONSTATAÇÃO Nº XXXXX SÉRIE XX");
                _corpoAuto_1.text(
                    'CONSTATO NESTE ATO FISCALIZATÓRIO QUE A EMPRESA ACIMA QUALIFICADA PRATICA A(S) CONDUTA(S) DESCRITA(S) A SEGUIR:');

                break;

            case 3:
                _elTitAuto.text("AUTO DE APREENSÃO Nº XXXXX SÉRIE XX");
                _corpoAuto_1.text("APREENDO NESTE ATO FISCALIZATÓRIO, OS ITENS DESCRITOS A SEGUIR:");
                break;

            case 4:
                break;

            case 5:
                _elTitAuto.text("REGISTRO DE ATO FISCALIZATÓRIO Nº XXXXX SÉRIE XX");
                _corpoAuto_1.html("<fieldset><FONT SIZE='1'>(PREENCHER NO CASO DE SHOPPING, TERMINAL RODOVIÁRIO, EVENTOS CULTURAIS, OUTROS)<BR>LOCAL FISCALIZADO: " + objeto.LocalFiscalizado + "</FONT></fieldset><BR><CENTER>OBSERVAÇÕES</CENTER><fieldset>O PRESENTE DOCUMENTO APENAS ATESTA QUE, NO DIA E HORA ABAIXO INDICADOS, A EQUIPE DE FISCALIZAÇÃO DA FUNDAÇÃO PROCON-SP REALIZOU UM ATO FISCALIZATÓRIO NAS INSTALAÇÕES COMERCIAIS DO FORNECEDOR EM QUESTÃO, NÃO TENDO SIDO LAVRADO, DURANTE A REFERIDA FISCALIZAÇÃO, NENHUM AUTO DE INFRAÇÃO. ESTE REGISTRO DE ATO FISCALIZATÓRIO NÃO PODE SER USADO COMO CERTIDÃO OU QUALQUER OUTRO DOCUMENTO QUE ATESTE A AUSÊNCIA DE INFRAÇÕES OU IRREGULARIDADES ÀS LEIS DE DEFESA DO CONSUMIDOR, ESPECIALMENTE AO CÓDIGO DE DEFESA DO CONSUMIDOR.</fieldset>");

                break;
        }
    }

    /* Chamada das Views dos Autos */
    function abreFrame(indice) {
        if (indice === null || indice === undefined) {
            BASE.MostrarMensagemErro('Índice inválido');
            return false;
        }

        $.ajax({
            url: "/MenuAuto/AbreFrame",
            type: "GET",
            data: { id: indice },
            cache: false,
            success: function (result) {
                if (result === null || result === undefined) {
                    BASE.MostrarMensagem('Ocorreu um erro ao tentar abrir a página solitada', TipoMensagem.Error);
                    return false;
                }

                if (indice == 4) {
                    var valorReceitaEstimada = localStorage.getItem(DILIGENCIA.ValorReceitaEstimada);

                    if (valorReceitaEstimada == null) {
                        alteraHtmlView('', function () { inicializarJS(indice); });
                        BASE.MostrarMensagem('Valor Obrigatório! Receita Mensal Bruta Estimada deve ser informada para o Auto de Infração', TipoMensagem.Alerta);
                        return;
                    }
                    else if (valorReceitaEstimada == 0) {
                        alteraHtmlView('', function () { inicializarJS(indice); });
                        BASE.MostrarMensagem('Valor Obrigatório! Receita Mensal Bruta Estimada deve ser informada para o Auto de Infração', TipoMensagem.Alerta);
                        return;
                    }
                }

                alteraHtmlView(result, function () { inicializarJS(indice); });
            },
            error: function (result) {
                if (result === null || result === undefined) {
                    BASE.MostrarMensagem('Ocorreu um erro ao tentar abrir a página solitada', TipoMensagem.Error);
                    return false;
                }

                BASE.MostrarMensagem(result.Mensagem, TipoMensagem.Error);
            }
        });
        return false;
    }

    function inicializarJS(indice) {
        var index = parseInt(indice);

        switch (index) {
            case 1: AUTONOTIFICACAO.Init(); break;
            case 2: AUTOCONSTATACAO.Init(); break;
            case 3: AUTOAPREENSAO.Init(); break;
            case 4: AUTOINFRACAO.Init(); break;
            case 5: AUTORAF.Init(); break;
            default: MENUAUTO.Init(); break;
        }
    }

    function alteraHtmlView(html, callback) {
        var frmContent = $('#frmContent #conteudoAutoNotificao #form-lavrar-auto #autoNotificacao');
        if (frmContent.children().first().hasClass('collapse in')) {
            frmContent.children().first().collapse('hide');
            frmContent.children().first().on('hidden.bs.collapse', function () {
                frmContent.html(html);
                frmContent.children().first().collapse('show');
                bindControlesTela();
                callback();
            });
        }
        else {
            frmContent.html(html);
            frmContent.children().first().collapse('show');
            bindControlesTela();
            callback();
        }
    }

    function imprimirAutos(idAuto, idApreensao) {
        imprimirPDF(idAuto);
        if (idApreensao != undefined && idApreensao > 0) {
            imprimirPDF(idApreensao);
        }
    }

    function imprimirPDF(_idAuto) {
        //window.open('/AutoFiscalizacao/Imprimir?idAuto=' + _idAuto, '_blank');
        $.ajax({
            url: '/AutoFiscalizacao/Imprimir',
            type: 'GET',
            data: { idAuto: _idAuto },
            success: function (data) {
                if (data) {
                    window.open('/AutoFiscalizacao/Imprimir?idAuto=' + _idAuto, '_blank');
                } else {
                    BASE.Mensagem.Mostrar("Erro ao gerar PDF. Contate o administrador!", TipoMensagem.Error);
                }
            },
            error: function (data) {
                BASE.Mensagem.Mostrar("Erro ao gerar PDF. Contate o administrador!", TipoMensagem.Error);
            }
        });
    }

    function salvarAuto(objeto, autosAssociados) {
        $.ajax({
            url: "/AutoFiscalizacao/LavrarAutos",
            data: { model: objeto },
            type: "POST",
            success: function (result) {
                if (result != null && result.Sucesso == true) {
                    FISCALIZACAOOPERACIONAL.AbreFrame(3);

                    var idAuto = result.Resultado.Codigo;
                    var numero = result.Resultado.Numero
                    var idApreensao = result.Resultado.CodigoApreensao;
                    var serie = result.Resultado.Serie;
                    var nomeAuto = null;

                    switch (result.Resultado.TipoAuto) {
                        case 1:
                            nomeAuto = "Auto de Notificação";
                            break;

                        case 2:
                            nomeAuto = "Auto de Constatação";
                            break;

                        case 3:
                            nomeAuto = "Auto de Apreensão";
                            break;

                        case 4:
                            nomeAuto = "Auto de Infração";
                            break;

                        case 5:
                            nomeAuto = "Auto RAF";
                            break;

                        default:
                    }

                    BASE.Modal.ExibirModalConfirmacao('Lavratura Finalizada!',
                        nomeAuto + ' lavrado com sucesso!<p>Nº ' + numero + ' Série: ' + serie + '</p>',
                        TamanhoModal.Pequeno,
                        "Cancelar",
                        "btn btn-danger",
                        "<i class='fa fa-print margR5'></i>Imprimir",
                        "btn btn-primary",
                        function () {
                            console.log('impressao ' + nomeAuto + ' nº: ' + idAuto + ',AA: ' + idApreensao);
                            imprimirAutos(idAuto, idApreensao);
                        }, null);

                    deletarAutosLocalStorage();
                }
                else {
                    BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
    }

    function criarObjetoAuto(form) {
        var tbItens = new Array();
        var autosAssociados = new Array();
        var itensLocalStorage = JSON.parse(localStorage.getItem(identificarTbItensLocalStorage()));
        var autosAssociadosLocalStorage = AUTOSASSOCIADOS.RecuperarAutosAssociados();

        localStorage.removeItem(AUTOCOMPLEXO);

        var auto = JSON.stringify($(form).serializeCustom());

        if (itensLocalStorage != null) {
            $.each(itensLocalStorage, function (idx, obj) {
                var item = obj;
                try {
                    item = JSON.parse(obj);
                }
                catch (e) {
                }

                tbItens.push(item);
            });
        }

        var obj = JSON.parse(auto);

        obj['Itens'] = [];
        obj['IdDiligencia'] = localStorage.getItem(DILIGENCIA.IdDiligencia);
        obj['IdFornecedor'] = localStorage.getItem(DILIGENCIA.IdFornecedor);
        obj['NumeroAveriguacaoPreliminar'] = localStorage.getItem(DILIGENCIA.NrAP);
        obj.Itens = tbItens;
        obj.AutosAssociados = autosAssociadosLocalStorage;

        localStorage.setItem(AUTOCOMPLEXO, JSON.stringify(obj));
        return obj;
    }

    function obterObjetoAuto() {
        var objAuto = null;

        try {
            objAuto = JSON.parse(localStorage.getItem(AUTOCOMPLEXO));
            objAuto.Telefone = $(' .telefone').html();
            objAuto.Fax = $(' .fax').html();
            objAuto.Email = $(' .email').html();
            objAuto.CCM = $(' .ccm').html();
            objAuto.IeRG = $(' .ie_rg').html();
        } catch (e) {
        }

        var diligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        if (diligencia != null && diligencia.CidadeLocalCumprimento != null) {
            objAuto.CidadeLocalCumprimento = diligencia.CidadeLocalCumprimento;
        }

        return objAuto;
    }

    function lavrarAuto() {
        salvarAuto(obterObjetoAuto());
    }

    function deletarAutosLocalStorage() {
        var autos =
            [
                AUTOCOMPLEXO,
                AUTONOTIFICACAO.TblLocalStorageItensNotificacao,
                AUTOAPREENSAO.TblLocalStorageItensApreensao,
                AUTOCONSTATACAO.TblLocalStorageItensConstatacao,
                AUTOINFRACAO.TblLocalStorageItensAutoInfracao,
                AUTORAF.TblLocalStorageItensRaf

            ];

        $.each(autos, function (index, value) {
            localStorage.removeItem(value);
        });
    }

    function deletarDiligenciaLocalStorage() {
        deletarAutosLocalStorage();
        var diligencia =
            [
                DILIGENCIA.TblLocalStorageDiligencia,
                'idDiligencia',
                'idFornecedor',
                'nrAp'
            ];

        $.each(diligencia, function (index, value) {
            localStorage.removeItem(value);
        });

        localStorage.removeItem(DILIGENCIA.ValorReceitaEstimada);
        localStorage.removeItem(DILIGENCIA.Telefone);
        localStorage.removeItem(DILIGENCIA.Fax);
        localStorage.removeItem(DILIGENCIA.Email);
    }

    function visualizar(indice, objeto, msgErro, msgSucesso, callBackSucesso) {
        var idDiligenc = localStorage.getItem("idDiligencia");

        var retornoValidacao = validarCamposObrigatorios(objeto);

        if (retornoValidacao.Valido) {
            $.ajax({
                url: '/MenuAuto/PreVisualizar',
                type: "POST",
                data: { id: indice, idDiligencia: idDiligenc, model: objeto },
                success: function (data) {
                    $hierarquiaSeletores.html(data);
                    montaLayoutAuto(indice, objeto);
                    bindAll();
                    bindControlesTela();
                },
                error: function (data) {
                    BASE.Mensagem.Mostrar(msgErro, TipoMensagem.Error);
                    return false;
                },
            });
        }
        else {
            $.each(retornoValidacao.MensagensErros, function (index, value) {
                BASE.Mensagem.Mostrar(value, TipoMensagem.Error);
            })
        }
        return false;
    }

    function validarCamposObrigatorios(objeto) {
        var RetornoResult = { Valido: null, MensagensErros: [] }
        var valido = null;

        $.each(objeto, function (index, value) {
            if (index != "IdentificadorGlobal" && index != "filtroCodigoConduta" && index != "LocalFiscalizado") {
                if (!value != "" && !value != undefined && !value != null) {
                    grifarDesgrifarCampoComErro(index, value, objeto);
                    RetornoResult.Valido = false;
                }
                else {
                    grifarDesgrifarCampoComErro(index, value, objeto);
                }
            }
        });

        if (objeto.Documento == 'CPF' && objeto.NumeroDocumentoResponsavelFornecedor.length == 14) {
            var retorno = BASE.Validacoes.CPF(objeto.NumeroDocumentoResponsavelFornecedor);
            if (!retorno) {
                RetornoResult.Valido = false;
                RetornoResult.MensagensErros.push("CPF inválido.");
            }
        }

        if (objeto.Itens <= 0 && objeto.TipoAuto != 5) {
            RetornoResult.Valido = false;
            RetornoResult.MensagensErros.push("Deve cadastrar pelo menos um item no Auto");
        }
        else {
            if (objeto.TipoAuto != 3 && objeto.TipoAuto != 5) {
                //var tpApreensao = 0;
                var tpAuto = 0;
                //var tpInfracao = 0;
                for (var i = 0; i < objeto.Itens.length; i++) {
                    if (objeto.Itens[i].tipo === 0 || objeto.Itens[i].tipo === 2) // se o tipo nao for infração
                        tpAuto += 1;
                }
                if (tpAuto == 0) {
                    RetornoResult.Valido = false;
                    RetornoResult.MensagensErros.push("Deve cadastrar pelo menos um item no Auto.");
                }
            }
        }

        if (objeto.TipoAuto == "1" && $("#DataCumprimentoNotificacao").val() == "") {
            RetornoResult.MensagensErros.push("Informe uma data de cumprimento.");
        }

        if (objeto.TipoAuto == "1" && $("#EnderecoLocalCumprimento").val() == "") {
            RetornoResult.MensagensErros.push("Informe um local.");
        }

        if (objeto.TipoAuto == "1" && ($("#NomeResponsavelFornecedor").val() == "" || $("#NumeroDocumentoResponsavelFornecedor").val() == "")) {
            for (var i = 0; i < objeto.Itens.length; i++) {
                if (objeto.Itens[i].tipo == 1) {
                    RetornoResult.MensagensErros.push("Deve cadastrar pelo menos um item de apreensão no Auto.");
                    RetornoResult.Valido = false;
                    break;
                }
            }
        }

        if ((objeto.TipoAuto == "2" || objeto.TipoAuto == "3" || objeto.TipoAuto == "5") && $("#NomeResponsavelFornecedor").val() == "") {
            RetornoResult.MensagensErros.push("Informe um nome do responsável.");
            RetornoResult.Valido = false;
        }

        if ((objeto.TipoAuto == "2" || objeto.TipoAuto == "3" || objeto.TipoAuto == "5") && $("#NumeroDocumentoResponsavelFornecedor").val() == "") {
            RetornoResult.MensagensErros.push("Informe um número de documento do responsável.");
            RetornoResult.Valido = false;
        }

        if (RetornoResult.MensagensErros.length <= 0)
            RetornoResult.Valido = true;

        return RetornoResult;
    }

    function retornarMensagemErro(index) {
        var msgErro = null;

        switch (index) {
            case "DataCumprimentoNotificacao":
                msgErro = "Informe uma data de cumprimento";
                break;
            case "EnderecoLocalCumprimento":
                msgErro = "Informe um local";
                break;
            case "NomeResponsavelFornecedor":
                msgErro = "Informe um nome do responsável";
                break;
            case "NumeroDocumentoResponsavelFornecedor":
                msgErro = "Informe um número de documento do responsável";
                break;
        }
        return msgErro;
    }

    function grifarDesgrifarCampoComErro(index, value, obj) {
        if ((obj.TipoAuto == "1" || obj.TipoAuto == "4") && (index == "NomeResponsavelFornecedor" || index == "NumeroDocumentoResponsavelFornecedor")) {
            for (var i = 0; i < obj.Itens.length; i++) {
                if (obj.Itens[i].tipo == 1) {
                    $("#" + index).addClass('borda-vermelha');
                    $("#spanError" + index).remove();
                    $("#" + index).after("<span id='spanError" + index + "'  class='field-validation-error' data-valmsg-replace='true'><span for='' class=''>Campo é obrigatorio!</span></span>")
                }
            }

            if (obj.Itens.length == 0) {
                $("#" + index).removeClass('borda-vermelha');
                $("#spanError" + index).remove();
            }
        }
        else {
            if (value != "" && value != null && value != undefined) {
                $("#" + index).removeClass('borda-vermelha');
                $("#spanError" + index).remove();
            }
            else {
                $("#" + index).addClass('borda-vermelha');
                $("#spanError" + index).remove();
                $("#" + index).after("<span id='spanError" + index + "'  class='field-validation-error' data-valmsg-replace='true'><span for='' class=''>Campo é obrigatorio!</span></span>")
            }
        }
    }

    function imprimir() {
    }

    /*  Modal  dos Autos  */
    function identificarTbItensLocalStorage() {
        var tbItens = null;
        switch (IDMenuAuto) {
            case 1: {
                tbItens = AUTONOTIFICACAO.TblLocalStorageItensNotificacao;
                break;
            }
            case 2: {
                tbItens = AUTOCONSTATACAO.TblLocalStorageItensConstatacao;
                break;
            }
            case 3: {
                tbItens = AUTOAPREENSAO.TblLocalStorageItensApreensao;
                break;
            }
            case 4: {
                tbItens = AUTOINFRACAO.TblLocalStorageItensAutoInfracao;
                break;
            }
            case 5: {
                tbItens = null;
                break;
            }

            default: {
                BASE.Mensagem.Mostrar('Nenhum Auto foi selecionado', TipoMensagem.Alerta);
                return null;
            }
        }
        return tbItens;
    }

    function listarItens(tbItens) {
        $("#tblListar").html("");
        $("#tblListar").html(
            "<thead>" +
            "   <tr>" +
            "   <th>Informações do Item</th>" +
            "   <th class='col-md-1'>Ações</th>" +
            "   </tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>"
            );

        var count = 0;
        for (var i in tbItens) {
            var item = tbItens[i];

            try {
                item = JSON.parse(item);
            } catch (e) {
            }

            $("#tblListar tbody").append(
                "<tr>" +
                "   <td>" + item["descricao"] + "</td>" +
                "   <td class='text-right'>" +
                "       <button type='button' class='btn btn-xs btn-primary btn-editar-modal' data-id=" + item["codigo"] + " data-descricao='" + item["descricao"] + "' data-toggle='tooltip' data-placement='top' title='Editar'><i class='fa fa-edit'></i></button>&nbsp;&nbsp;" +
                "       <button type='button' class='btn btn-xs btn-danger btn-excluir-modal' data-id=" + item["codigo"] + " data-descricao='" + item["descricao"] + "' data-toggle='tooltip' data-placement='top' title='Excluir'><i class='fa fa-close'></i></button>" +
                "   </td>" +
                "</tr>");
            count++;
        }

        bindBotoesAcaoLista();
    }

    function listarItensApreensao(tbItens) {
        $("#tblListarApreensao").html("");
        $("#tblListarApreensao").html(
            "<thead>" +
            "   <tr>" +
            "   <th>Informações do Item</th>" +
            "   <th class='col-md-1'>Ações</th>" +
            "   </tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>"
            );

        var count = 0;
        for (var i in tbItens) {
            var item = tbItens[i];

            try {
                item = JSON.parse(item);
            } catch (e) {
            }

            $("#tblListarApreensao tbody").append(
                "<tr>" +
                "   <td>" + item["descricao"] + "</td>" +
                "   <td class='text-right'>" +
                "       <button type='button' class='btn btn-xs btn-primary btn-editar-modal' data-id=" + item["codigo"] + " data-descricao='" + item["descricao"] + "' data-toggle='tooltip' data-placement='top' title='Editar'><i class='fa fa-edit'></i></button>&nbsp;&nbsp;" +
                "       <button type='button' class='btn btn-xs btn-danger btn-excluir-modal' data-id=" + item["codigo"] + " data-descricao='" + item["descricao"] + "' data-toggle='tooltip' data-placement='top' title='Excluir'><i class='fa fa-close'></i></button>" +
                "   </td>" +
                "</tr>");
            count++;
        }
        if (count > 0) {
            bindExibeListaApreencao();
            $('#itensApreensaoNotif').show();
            $('#itensApreensaoNotif table').show();
        }
        bindBotoesAcaoLista();
    }

    function listarItensInfracao(tbItens) {
        //$(".infracaoCadastrada").remove();
        //$("#dadosConduta").hide();

        //if (tbItens.length > 0) {
        //    $("#infracoes").show();

        //}
        //for (var i in tbItens) {
        //    var item = tbItens[i];

        //    try {
        //        item = JSON.parse(item);
        //    } catch (e) {
        //    }

        //    var conteudo = "<div class='input-group infracaoCadastrada form-group' data-excluir-localStorage='" + i + "'><div class='form-control custom-control jumbotron'>" + item.descricao + "</div><span id='excluirInfracao' class='input-group-addon btn btn-danger'><i class='fa fa-trash'></i></span></div>";
        //    $("#infracoes .row .col-md-12").append(conteudo)
        //}
    }

    function bindExibeListaApreencao() {
        $('#incluiApreensaoNotif').prop('checked', true);
        $('#itensApreensaoNotif').show();
    }

    function loadTbItens(tbItensDoLocalStorage, carregarLista) {
        tbItens = localStorage.getItem(tbItensDoLocalStorage);
        var result = JSON.parse(tbItens);
        var retornoItensTotal = [];
        var retorno = [];
        var retornoApreensao = [];
        var retornoInfracao = [];

        if (result === null || result === undefined || result === '') {
            result = [];
        }

        for (var i in result) {
            var item = result[i];

            try {
                item = JSON.parse(item);
            }
            catch (e) {
            }

            if (item != null && item != undefined && item != '') {
                retornoItensTotal.push(item);
                switch (item.tipo) {
                    case 0:
                        retorno.push(item);
                        break;
                    case 1:
                        retornoApreensao.push(item);
                        break;
                    case 2:
                        retornoInfracao.push(item);
                        break;
                }
            }
        }

        if (carregarLista === true) {
            listarItens(retorno);
            listarItensApreensao(retornoApreensao);
            listarItensInfracao(retornoInfracao);
        }

        return retornoItensTotal;
    }

    function adicionarInfracao(conteudo, enquadramento, condutaID) {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);
        var descricao = conteudo.replace(/"/g, "'");
        var tipo = 2;
        var valor = tbItens.length;

        if (descricao === null || descricao === undefined || descricao === '') {
            BASE.Mensagem.Mostrar('Nenhum item foi adicionado', TipoMensagem.Alerta);
            return false;
        }

        var item = JSON.stringify({
            codigo: condutaID,
            descricao: descricao,
            enquadramento: enquadramento,
            tipo: tipo
        });

        tbItens.push(item);
        localStorage.setItem(tblMenu, JSON.stringify(tbItens));

        return valor;
    }

    function infracaoTotal() {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);
        return tbItens.length;
    }

    function carregaItens() {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);
        return tbItens;
    }

    function adicionarApreensao() {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);
        var descricao = $("#txt-inserir-itens-apreensao").val();
        var tipo = 1;
        if (descricao === null || descricao === undefined || descricao === '') {
            BASE.Mensagem.Mostrar('Nenhum item foi adicionado', TipoMensagem.Alerta);
            return false;
        }

        var item = JSON.stringify({
            codigo: tbItens.length,
            descricao: descricao,
            tipo: tipo
        });

        tbItens.push(item);
        localStorage.setItem(tblMenu, JSON.stringify(tbItens));
        return false;
    }

    function adicionar() {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);
        var descricao = $("#txt-inserir-itens").val();
        var tipo = 0;

        if (descricao === null || descricao === undefined || descricao === '') {
            BASE.Mensagem.Mostrar('Nenhum item foi adicionado', TipoMensagem.Alerta);
            return false;
        }

        var item = JSON.stringify({
            codigo: tbItens.length,
            descricao: descricao,
            tipo: tipo
        });

        tbItens.push(item);
        localStorage.setItem(tblMenu, JSON.stringify(tbItens));

        return false;
    }

    function verificaSeExiste(tbItens, itemAVerificar) {
        //TODO: Concluir
        return false;
    }

    function Excluir(IDItemLista, flagListar) {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);

        if (tbItens == null) {
            tbItens = [];
            localStorage.setItem(tblMenu, JSON.stringify(tbItens));
        }
        else {
            var result = [];
            for (i = 0; i < tbItens.length; i++) {
                var itm = tbItens[i];
                try {
                    itm = JSON.parse(tbItens[i]);
                }
                catch (e) {
                }

                if (itm.codigo != IDItemLista) {
                    result.push(itm);
                }
            }
            localStorage.setItem(tblMenu, JSON.stringify(result));
        }

        loadTbItens(tblMenu, flagListar);
        IDItemLista = null;
        return true;
    }

    function Editar(idItemLista) {
        var tblMenu = identificarTbItensLocalStorage();
        var tbItens = loadTbItens(tblMenu, false);
        var novoItem = "";
        for (var i = 0; i < tbItens.length; i++) {
            if (tbItens[i].codigo == idItemLista)
                novoItem = tbItens[i];
        }
        var result = [];
        var novaDesc = $("#txt-editar-itens").val();
        var novaDescApreensao = $("#txt-inserir-itens-apreensao").val();

        novoItem.Descricao = novaDesc;

        for (i = 0; i < tbItens.length; i++) {
            var item = tbItens[i];
            try {
                item = JSON.parse(tbItens[i]);
            }
            catch (e) {
            }

            if (item.codigo === novoItem.codigo) {
                if (item.Tipo == 1) {
                    if (novaDescApreensao === null || novaDescApreensao === undefined || novaDescApreensao === '') {
                        BASE.Mensagem.Mostrar('Nenhum item de apreensão foi editado', TipoMensagem.Alerta);
                        return false;
                    }
                }
                else {
                    if (novaDesc === null || novaDesc === undefined || novaDesc === '') {
                        BASE.Mensagem.Mostrar('Nenhum item foi editado', TipoMensagem.Alerta);
                        return false;
                    }
                }
                item.descricao = novaDesc;
                result.push(item);
            } else {
                result.push(item);
            }
        }

        try {
            localStorage.removeItem(tblMenu);
        }
        catch (e) {
        }

        localStorage.setItem(tblMenu, JSON.stringify(result));
        loadTbItens(tblMenu, true);
        IDItemLista = null;
        return false;
    }

    //deveria estar em um módulo global da aplicação
    function buscarFiscalLogado() {
        $.ajax({
            url: '/AutoFiscalizacao/CarregarFiscalLogado',
            type: 'GET',
            success: function (data) {
                fiscalLogado = data
            },
            error: function () {
                console.log('Erro ao buscar o fiscal logado do sistema.')
            }
        })
    }

    function esconderTipoAutoFiscalLogado() {
        buscarFiscalLogado();

        if (fiscalLogado) {
            if (fiscalLogado.IdConvenio != null && fiscalLogado.IdConvenio > 0 && fiscalLogado.IdConvenio != undefined) {
                $("#form-lavrar-auto #labelRaf").hide();
                $("#form-lavrar-auto #labelApreensao").hide();
                $("#form-lavrar-auto #labelConstatacao").hide();
            }
            else {
                $("#form-lavrar-auto #labelRaf").show();
                $("#form-lavrar-auto #labelApreensao").show();
                $("#form-lavrar-auto #labelConstatacao").show();
            }
        }
    }

    return {
        Init: init,
        Imprimir: imprimir,
        PreVisualizar: visualizar,
        CarregarTbItens: loadTbItens,
        CarregaItens: carregaItens,
        BindControlesTela: bindControlesTela,
        ModelAutoNotificacao: criarObjetoAuto,
        Voltar: bindBtnVoltar,
        AdicionarInfracao: adicionarInfracao,
        ExcluirInfracao: Excluir,
        InfracaoTotal: infracaoTotal,
        TbAuto: AUTOCOMPLEXO
    };
}());

$(function () {
    MENUAUTO.Init();
});

/*----------- AUTO: SE ABRE UM, FECHA OUTROS -----------*/
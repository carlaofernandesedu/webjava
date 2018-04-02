REGISTRARAUTO = (function () {

    var frmContent = $('#frmContent #conteudoRegistrarAuto');
    hierarquiaSeletores = '#conteudoRegistrarAuto',
    tbAutoManual = "tbAutoManual_JD3497YTDSW",
    fiscalLogado = null,
    nomeAuto = null;

    function init() {
        limpaLocalStorage();
        buscarFiscalLogado();
        inicializarPaginas();
        bindTipoAuto();
        bindCadastrarFornecedor();
        bindOrigemAuto();
        bindInformacoesAuto();
        bindPreviaAuto();
        resetarMenuAuto();
    }

    function bindTipoAuto() {
        $("#tipoAuto").off('click');
        $("#tipoAuto").on('click', function () {
            var indice = $(this).data("indice");
            transitoAbas(this, indice);
        });
    }

    function bindCadastrarFornecedor() {
        $("#cadastrarDadosFornecedor").off('click');
        $("#cadastrarDadosFornecedor").on('click', function () {
            var indice = $(this).data("indice");
            transitoAbas(this, indice);
        });
    }

    function bindOrigemAuto() {
        $("#diligencia").off('click');
        $("#diligencia").on('click', function () {
            var indice = $(this).data("indice");
            transitoAbas(this, indice);
        });
    }

    function bindInformacoesAuto() {
        $("#infAuto").off('click');
        $("#infAuto").on('click', function () {
            var indice = $(this).data("indice");
            transitoAbas(this, indice);
        });
    }

    function bindPreviaAuto() {
        $("#previaAuto").off('click');
        $("#previaAuto").on('click', function () {
            var indice = $(this).data("indice");
            transitoAbas(this, indice); data
        });
    }

    function transitoAbas(elem, indiceFrame) {

        var ativo = $(elem).parent().hasClass('active');
        var habilitado = $(elem).parent().hasClass('filled');

        if (ativo === true || habilitado === true) {
            REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav ul li a');
            REGISTRARAUTO.AbreFrame(indiceFrame);
            REGISTRARAUTO.ControlesMenu.HabilitarOpcao(elem);
        }
    }

    function alteraHtmlView(html) {
        frmContent.html(html);
    }

    function abreFrame(indice, callback) {
        if (indice === null || indice === undefined || (indice <= 0)) {
            BASE.Mensagem.Mostrar('Índice inválido', TipoMensagem.Alerta);
            return false;
        }

        $.ajax({
            url: "/RegistrarAuto/AbreFrame",
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
                    callback();

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

    function inicializarJS(indice) {
        var index = parseInt(indice);

        switch (index) {
            case 1: TIPOAUTO.Init(); break;
            case 2: DADOSFORNECEDOR.Init(); break;
            case 3: ORIGEMAUTO.Init(); break;
            case 4: INFORMACAOAUTO.Init(); break;
            case 5: PREVISUALIZARAUTO.Init(); break;
            default: TIPOAUTO.Init(); break;
        }
    }

    function inicializarPaginas() {
        var divPaginas = null;

        try {
            divPaginas = $('#frmContent #conteudoRegistrarAuto').html();
            divPaginas = divPaginas.trim();
        }
        catch (e) {
        }

        if (divPaginas === null || divPaginas === undefined || divPaginas === '') {
            abreFrame(1);
        }
        return false;
    }

    function liberacaoBotaoContinuar(liberar) {
        var liberado = liberar

        if (liberado) {
            alterarBotaoContinuar(true);
        }
        else {
            alterarBotaoContinuar(false);
        }
    }

    function alterarBotaoContinuar(liberado) {

        if (liberado === true) {
            //$(hierarquiaSeletores + ' #continuarDiligencia').removeClass('btn-default');
            //$(hierarquiaSeletores + ' #continuarDiligencia').addClass('btn-success');
            $(hierarquiaSeletores + ' #btnContinuar').prop('disabled', false);
        }
        else {
            $(hierarquiaSeletores + ' #btnContinuar').prop('disabled', true);
            //$(hierarquiaSeletores + ' #continuarDiligencia').removeClass('btn-success');
            //$(hierarquiaSeletores + ' #continuarDiligencia').addClass('btn-default');
        }
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

    function createAutoManual(fiscalLogado) {

        var AutoManual = {
            FiscalLogado: fiscalLogado,
            IdFornecedor: null,
            TipoAuto: null,
            Numero: null,
            Serie: null,
            DataEmissao: null,
            Hora: null,
            TipoFornecedor: null,
            NumeroCpfCnpj: null,
            CodigoCnae: null,
            Cnae: null,
            NomeFornecedor: null,
            NomeFantasia: null,
            TipoDocumento: null,
            NumeroDocumento: null,
            Telefone: null,
            Fax: null,
            Email: null,
            NumeroCep: null,
            Endereco: null,
            NumeroEndereco: null,
            Complemento: null,
            NomeBairro: null,
            NomeMunicipio: null,
            NomeEstado: null,
            IdFiscalResponsavel: null,
            NomeFiscalResponsavel: null,
            TipoOrigem: null,
            Origem: null,
            Componentes: null,
            IdEvento: null,
            NumeroAveriguacaoPreliminar: null,
            InformacoesAuto: null,
            RecusaAssinatura: false,
            NomeResponsavel: null,
            NumeroDocumentoFornecedor: null,
            IdDiligencia: null,
            CNAE_Codigo: null,
            CNAE_Descricao: null
        }

        return AutoManual;
    }

    function copiarPropriedades(objDe, objPara) {
        if ((objDe === null || objDe === undefined) && (objPara === null || objPara === undefined))
            return;

        $.each(objDe, function (index, value) {
            $.each(objPara, function (index2, value2) {
                if (index2 === index)
                    objPara[index2] = value;
            });
        });

        return objPara;
    }

    function popularForm(form, data) {
        $.each(data, function (name, val) {
            var formId = '#' + $(form).prop('id');
            var $el = $(formId + ' [name="' + name + '"]'),
                type = $el.attr('type');

            switch (type) {
                case 'checkbox':
                    val === 'true' ? $el.attr('checked', true) : $el.attr('checked', false);
                    break;
                case 'radio':
                    $el.filter('[value="' + val + '"]').attr('checked', 'checked');
                    if ($el.filter('[value="' + val + '"]').parent().hasClass('btn'))
                        $el.filter('[value="' + val + '"]').parent().addClass('btn-primary active');
                    break;
                default:
                    $el.val(val);
            }
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

    function salvar(autoManual) {
        localStorage.setItem(tbAutoManual, converterObjStringJson(autoManual));
    }

    function buscar() {

        REGISTRARAUTO.PreCarregar();

        var objAutoManual = converterObjJson(localStorage.getItem(tbAutoManual));
        var form = $('#conteudoRegistrarAuto > form');

        if (objAutoManual === null || objAutoManual === undefined)
            return;

        REGISTRARAUTO.PopularForm(form, objAutoManual);
        REGISTRARAUTO.TratamentosEspecificos();

        var diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        if (diligencia != null && diligencia != undefined && diligencia.CepEndereco != null && diligencia.CepEndereco != undefined) {

            $('#addEnderecoFiscalizacao').attr('checked', 'true');
            ENDERECOFISCALIZACAO.ExibeEnderecoFiscalizacao();

        }

    }

    function buscarFiscalLogado() {
        $.ajax({
            url: 'RegistrarAuto/RetornaFiscalLogado/',
            type: 'GET',
            success: function (data) {
                fiscalLogado = data
            },
            error: function () {
                console.log('Erro ao buscar o fiscal logado do sistema.')
            }
        })
    }

    function limpaLocalStorage() {
        localStorage.removeItem(tbAutoManual);
    }

    function persistirAutoMAnual(autoManual) {
        $.ajax({
            url: 'RegistrarAuto/Registrar/',
            type: 'POST',
            data: { viewModel: autoManual },
            success: function (data) {
                if (data.Sucesso == true) {

                    var numero = parseInt(data.Mensagem);

                    if (numero + '' != "NaN" && numero != undefined) {
                        BASE.Modal.ExibirModalAlerta("RAF Finalizada",
                            "RAF finalizada com sucesso. Anote o número: Nº " + data.Mensagem + " SÉRIE R9",
                            "small", "OK",
                            'btn-primary',
                            null);

                    }
                    else {
                        BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Sucesso);

                    }
                    limpaLocalStorage();
                    resetarMenuAuto();
                    REGISTRARAUTO.ResetaRegras();
                    abreFrame(1, null);
                }
                else {
                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error);
                }
            },
            error: function (error) {

                console.log(error)
            }
        });
    }

    function criarListaFiscais(autoManual) {

        var autoManualArray = [];
        $.each(autoManual.Componentes, function (index, value) {
            autoManualArray.push({ "idFiscal": value });
        });

        return autoManualArray;
    }

    var dropdownPreencherComFiscalLogado = function (seletor, controller, action, id, valorSetorConvenio, textoVazio, callback) {

        action = BASE.Util.MontarUrl(controller, action);
        var controles = CONTROLES.DropDown.ConfigurarSeletor(seletor);

        CONTROLES.DropDown.Inicializar(controles, 'carregando...');

        $.ajax({
            url: action,
            type: 'post',
            data: { idFiscalLogado: id, codigoSetorConvenio: valorSetorConvenio },
            cache: false,
            success: function (result) {
                if (result.Sucesso) {
                    controles.each(function (index, element) {
                        var $ddl = $(this);
                        $ddl.empty();

                        var criarItemDefault = true;
                        if (textoVazio === true || textoVazio === undefined) {
                            criarItemDefault = true;
                            textoVazio = "Selecione";
                        }
                        else if (textoVazio === false) {
                            criarItemDefault = false;
                        }

                        if (result.Resultado.length === 0) {
                            CONTROLES.DropDown.Desabilitar($ddl, true, 'Nenhum item para selecionar');
                        }
                        else {
                            CONTROLES.DropDown.PopularDropDown(result.Resultado, $ddl, criarItemDefault, '', textoVazio);
                            CONTROLES.DropDown.Habilitar(seletor);
                        }
                    });

                    if (callback)
                        callback();
                } else {
                    if (result != null && result.Mensagem.length > 0) {
                        if (result.Sucesso === false) {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                        }
                        else {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Info);
                        }
                    }
                }
            },
            error: function (xhr, err) {
                console.log(xhr);
                console.log(err);
                BASE.Mensagem.Mostrar("Erro ao carregar dropdown " + controller, TipoMensagem.Error);
            }
        });
    };

    var dropdownPreencherMotivoFiscalizacao = function (seletor, controller, action, valorSetorConvenio, textoVazio, callback) {

        action = BASE.Util.MontarUrl(controller, action);
        var controles = CONTROLES.DropDown.ConfigurarSeletor(seletor);

        CONTROLES.DropDown.Inicializar(controles, 'carregando...');

        $.ajax({
            url: action,
            type: 'post',
            data: {
                operacaoSetorConvenio: valorSetorConvenio
            },
            cache: false,
            success: function (result) {
                if (result.Sucesso) {
                    controles.each(function (index, element) {
                        var $ddl = $(this);
                        $ddl.empty();

                        var criarItemDefault = true;
                        if (textoVazio === true || textoVazio === undefined) {
                            criarItemDefault = true;
                            textoVazio = "Selecione";
                        }
                        else if (textoVazio === false) {
                            criarItemDefault = false;
                        }

                        if (result.Resultado.length === 0) {
                            CONTROLES.DropDown.Desabilitar($ddl, true, 'Nenhum item para selecionar');
                        }
                        else {
                            CONTROLES.DropDown.PopularDropDown(result.Resultado, $ddl, criarItemDefault, '', textoVazio);
                            CONTROLES.DropDown.Habilitar(seletor);
                        }
                    });

                    if (callback)
                        callback();
                } else {
                    if (result != null && result.Mensagem.length > 0) {
                        if (result.Sucesso === false) {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                        }
                        else {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Info);
                        }
                    }
                }
            },
            error: function (xhr, err) {
                console.log(xhr);
                console.log(err);
                BASE.Mensagem.Mostrar("Erro ao carregar dropdown " + controller, TipoMensagem.Error);
            }
        });
    };

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

    function checarOpcao(seletor) {

        var contemClasse = $(seletor).parent().hasClass('filled');

        if (contemClasse === false) {
            $(seletor).parent().removeClass('active');
            $(seletor).parent().addClass('inactive');
            $(seletor).parent().addClass('filled');
        }
    }

    function desabilitarOpcao(seletor) {
        var contemClasse = $(seletor).parent().hasClass("active");
        if (contemClasse === true) {
            $(seletor).parent().removeClass('active');
            $(seletor).parent().addClass('inactive');
        }
    }

    function deschecar(seletor) {

        var contemClasse = $(seletor).parent().hasClass('filled');

        if (contemClasse === true) {
            $(seletor).parent().removeClass('filled');
        }

    }

    function resetarMenuAuto() {
        REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #tipoAuto');
        REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #cadastrarDadosFornecedor');
        REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #diligencia');
        REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #infAuto');
        REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #previaAuto');

        REGISTRARAUTO.ControlesMenu.Deschecar('.vertical_nav #tipoAuto');
        REGISTRARAUTO.ControlesMenu.Deschecar('.vertical_nav #cadastrarDadosFornecedor');
        REGISTRARAUTO.ControlesMenu.Deschecar('.vertical_nav #diligencia');
        REGISTRARAUTO.ControlesMenu.Deschecar('.vertical_nav #infAuto');
        REGISTRARAUTO.ControlesMenu.Deschecar('.vertical_nav #previaAuto');

    }

    function enumTipoAuto(tipoAuto) {

        switch (tipoAuto) {
            case '1':
                return nomeAuto = "AUTO DE NOTIFICAÇÃO"; break;
            case '2':
                return nomeAuto = "AUTO DE APREENSÃO"; break;
            case '3':
                return nomeAuto = "AUTO DE CONSTATAÇÃO"; break;
            case '4':
                return nomeAuto = "AUTO DE INFRAÇÃO"; break;
            case '5':
                return nomeAuto = "REGISTRO DE ATO FISCALIZATÓRIO"; break;
            default:
                return nomeAuto = "AUTO DE NOTIFICAÇÃO"; break;
        }
    }

    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="checkbox"]:checked, input[type="radio"]:checked, textarea, select').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select'))
                elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }

    return {
        Init: init,
        AbreFrame: abreFrame,
        LiberarBotaoContinuar: liberacaoBotaoContinuar,
        Salvar: salvar,
        Buscar: buscar,
        ValidarDados: validarDados,
        TblLocalStorageAutoManual: tbAutoManual,
        ObjetoCompletoAutoManual: createAutoManual,
        CopiarPropriedades: copiarPropriedades,
        PopularForm: popularForm,
        TratamentosEspecificos: function () { return false },
        ConverterObjJson: converterObjJson,
        ConverterObjStringJson: converterObjStringJson,
        PersistirAutoMAnual: persistirAutoMAnual,
        CriaListaFiscais: criarListaFiscais,
        FiscalLogado: function () { return fiscalLogado; },
        EnumTipoAuto: enumTipoAuto,
        DropDown: {
            PreencherComFiscalLogado: dropdownPreencherComFiscalLogado,
            PreencherMotivoFiscalizacao: dropdownPreencherMotivoFiscalizacao
        },
        PreCarregar: function () { return false; },
        PosCarregar: function () { return false; },
        ControlesMenu: {
            HabilitarOpcao: habilitarOpcao,
            LiberarOcao: liberarOpcao,
            ChecarOpcao: checarOpcao,
            DesabilitarOpcao: desabilitarOpcao,
            Deschecar: deschecar
        },
        ResetaRegras: function () { return false }
    }
}());

$(function () {
    REGISTRARAUTO.Init();
});

var HouveAlteracoes = false;

$(document).ready(function () {
    HouveAlteracoes = false;
    InicializarForms(parseInt($('#RedirectRFC').val()));

    CheckMenuRFC();

    $('#DocumentoResponsavel').attr('maxlength', '21');
    $('#ObservacaoResponsavelAutoApreensao_RGResponsavel').attr('maxlength', '21');

    $(document).on('click', 'form button[type=submit]', function (e) {

        $('.inteiro_curto').each(function () {
            if ($(this).val('')) {
                $(this).val('0');
            }
        });

        var form = $(e.target).parent().parent().parent('form');
        var isValid = form.valid();

        var valor = $('#TermoColeta_QuantidadeCombustivel').val();
        $('#TermoColeta_QuantidadeCombustivel').val(valor.replace(".", ""));

        if (!isValid) {
            e.preventDefault();
        }
        else {
            if (!HouveAlteracoes) {
                BASE.MostrarMensagem('Não foi realizado nenhuma Alteração.');
                //e.preventDefault();
            }

            if ($(form).prop('id') == 'frmDadosBasicos') {
                if ($("#listFiscais :selected").length < 2 || $("#listFiscais option:selected[value=" + jQuery("#txtFiscalResponsavel").val() + "]").length == 0) {
                    BASE.MostrarMensagem('O mínimo de participantes da equipe de fiscalização é de dois Fiscais incluindo o Responsável, por favor selecionar!');
                    e.preventDefault();
                }
            }

            if ($(form).prop('id') == 'frmTermoColeta') {
                if (ValidadaDuplicidadeLacre($("#TermoColeta_AmostraColetadaProva_LacreTampa").val(), $("#TermoColeta_AmostraColetadaTestemunha_LacreTampa").val(), $("#TermoColeta_AmostraColetadaContraprova_LacreTampa").val())) {
                    BASE.MostrarMensagem('O Número do Lacre informado já foi utilizado! Favor verificar.');
                    e.preventDefault();
                } else {
                    if (ValidadaDuplicidadeLacre($("#TermoColeta_AmostraColetadaProva_LacreInvolucro").val(), $("#TermoColeta_AmostraColetadaTestemunha_LacreInvolucro").val(), $("#TermoColeta_AmostraColetadaContraprova_LacreInvolucro").val())) {
                        BASE.MostrarMensagem('O Número do Lacre informado já foi utilizado! Favor verificar.');
                        e.preventDefault();
                    }
                }
            }
        }
    });
});

function desabilitaMenu() {
    var situacao = $('#desabilitaMenu').val();

    try {
        situacao = (situacao === 'True');
    } catch (e) {
    }

    if (situacao) {
        $("#autoapreensao").removeAttr('onclick')
        $("#autoapreensao").css('cursor', 'not-allowed')
    }
}

function CheckMenuRFC() {
    var classCheck = "fa fa-check text-success";
    var redirect = $('#RedirectRFC').val();

    $('.menu--item,.sub_menu--item').removeClass('js-menu-active');
    $('.menu-rfc-' + redirect).addClass('js-menu-active');

    $.ajax({
        url: "/Registro/VerificaFormulariosPreenchidos",
        data: { rfc: $("#Codigo").val() },
        cache: false,
        success: function (result) {
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('.check-' + result[i]).addClass(classCheck);
                }
            }
        }
    });
}

function confirmaFinalizarRFC(cod) {

    if ($('#btnFinalizarRFC').attr('disabled') != 'disabled') {
        BASE.MostrarModalConfirmacao('Inclusão de Registro', 'Antes de finalizar, verifique se todos os documentos foram emitidos e assinados. Confirma a finalização do RFC ?', function () {
            window.location.href = '/Registro/FinalizarRFC/' + cod;
        },
        null);
    }
}

function FinalizarRFC() {
    var form = $('#frmAutoApreensao');
    var isValid = form.valid();

    if (!isValid) {
        return;
    } else {
        if ($('#Codigo').val() != undefined) {
            location.href('/Registro/FinalizarRFC?id=' + $('#Codigo').val());
        } else {
            location.href('/Registro');
        }
    }
}

function ValidaAlteracoes() {
    $('input, select, textarea').unbind('change').change(function () {
        HouveAlteracoes = true;
    });

    $('.data').unbind('change').change(function () {
        HouveAlteracoes = true;
    });
}

function InicializarDadosBasicos() {

    $('#TipoOperacao').ready(MostraCampoManualInloco());
    $('#OrigemFiscalizacao').ready(MudaRotinaOperacao());
    $('#NumeroAP').ready(HabilitaOrigemFiscalizacao());

    $(".validaAP").blur(function () {
        if ($(".validaAP").val() != "") {
            var digito = $(".validaAP").val().substring(11, 12);
            var valido = ValidaVerificador($(".validaAP").val().replace('.', '').replace('.', ''));
            if (digito == valido) {
                //$("[#DigitoInvalidoLabel]").hide();
            }
            else {
                BASE.MostrarMensagem("Digito verificador de AP inválido.")
                $(".validaAP").focus();
            }
        }
        //else {
        //    $("[#DigitoInvalidoLabel]").hide();
        //}
    });


    $(document).on("change", "#frmDadosBasicos input[type=radio][name=TipoCadastro]", function () {
        if ($("input[name=TipoCadastro]").is(':enabled')) {
            var opcao = $('input[name=TipoCadastro]:checked', 'form').val();
            if (opcao == 'Manual') {
                BASE.MostrarModalConfirmacao(
                    'Tipo de Cadastro',
                    'Você tem certeza que deseja registrar um ato já realizado?',
                    function () {
                        CadastroManual();
                    },
                    function () {
                        CadastroInLoco();
                    },
                    null
                );
            }
            else {
                CadastroInLoco();
            }
            FiscalResponsavelChange();
        }
    });
    DataMinimaRFC();
    DesabilitarFinalizado();
}


function DataMinimaRFC() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var hoursDisabled = [];

    while (hour <= 23) {
        hoursDisabled.push(hour);
        hour++;
    }

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    $('.data').datetimepicker({
        language: 'pt-BR',
        format: 'dd/mm/yyyy',
        autoclose: true,
        minView: 2,
        pickTime: false,
        inline: true,
        endDate: new Date()
    });

    DataMinima();
}

function InicializarDadosFornecedor() {
    $('#BandeiraPosto').ready(PegaNomeBandeira());
    $('#UnidadeExecutante').ready(MudaUnidadeExecutante());
    $('#ckIncluirEnderecoFiscalizacao').ready(HabilitaEnderecoFiscalizacao());
    $('#RecusaAssinatura').ready(MostrarDadosResponsavel());

    //CNAE AUTOCOMPLETE
    window.cnaeAutocomplete.init();

    $('#CNPJ, .loadCNPJ').on('blur', function () {
        CarregaCNPJ();

    });

    $(".loadCEPFornecedor").blur(function (evt) {
        if ($(".loadCEPFornecedor").val() != "") {
            var errorArray = {};
            var $this = $(this);
            //$this.spinner();
            $.ajax({
                url: "/Cep/GetEnderecoByCep",
                data: { cep: $(".loadCEPFornecedor").val().replace(/[^\d]+/g, '') },
                cache: false,
                success: function (result) {
                    if (result != null && result != "") {
                        var enderecoPesquisado = jQuery.parseJSON(result);
                        if (enderecoPesquisado[0].numeroIBGE != null) {
                            $('#Endereco').val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                            $('#Cidade').val(enderecoPesquisado[0].municipio);
                            $('#UFFornecedor').val(enderecoPesquisado[0].uf);
                        }
                        else {
                            BASE.MostrarMensagem('CEP não cadastrado na base de dados. Favor preencher os campos!');
                            return false;
                        }
                    }
                    else {
                        BASE.MostrarMensagem('CEP não cadastrado na base de dados. Favor preencher os campos!');
                        return false;
                    }
                }
            });
        }
    });

    $(".loadCEPFiscal").blur(function (evt) {
        if ($(".loadCEPFiscal").val() != "") {
            var errorArray = {};
            var $this = $(this);
            //$this.spinner();
            $.ajax({
                url: "/Cep/GetEnderecoByCep",
                data: { cep: $(".loadCEPFiscal").val().replace(/[^\d]+/g, '') },
                cache: false,
                success: function (result) {
                    if (result != null && result != "") {
                        var enderecoPesquisado = jQuery.parseJSON(result);
                        if (enderecoPesquisado[0].numeroIBGE != null) {
                            $('#EnderecoFiscalizacao_Endereco').val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                            $('#EnderecoFiscalizacao_Cidade').val(enderecoPesquisado[0].municipio);
                            $('#EnderecoFiscalizacao_UF').val(enderecoPesquisado[0].uf);
                        }
                        else {
                            BASE.MostrarMensagem('CEP não cadastrado na base de dados. Favor preencher os campos!');
                            return false;
                        }
                    }
                    else {
                        BASE.MostrarMensagem('CEP não cadastrado na base de dados. Favor preencher os campos!');
                        return false;
                    }
                }
            });
        }
    });

    DesabilitarFinalizado();
}

function InicializarDadosCombustivel() {
    $('#txtTotalBicos').ready(calculaBicos());
    $('#txtTotalTanques').ready(calculaTanques());

    DesabilitarFinalizado();
}

function InicializarTermoColeta() {
    $('#RecusaDistribuidor').ready(HabilitaUltimoFornecedor());

    CarregarUltimoFornecedor();

    DesabilitarFinalizado();

}

function InicializarFolhaObservacao() {
    $('.imprimir-folha-observacao').click(function () {
        ImprimirFolhaObservacao();
    });
}

function InicializarTestePreliminar() {
    //desabilitaMenu();
    DesabilitarFinalizado();
}

function InicializarAutoApreensao() {
    //desabilitaMenu();
    $('.validaCPFCNPJ').unbind('blur').blur(ValidaDocumentoResponsavel);
    $('.lacre-bomba').unbind('blur').blur(AlterarAutoApreensaoLacre);
    CEPHELPER.Init();
    DesabilitarFinalizado();
}

function InicializarAutoInterdicao() {
    AutoInterdicao.Init();
    AutoInterdicao.MostraCampoManualInloco();
    $('.validaCPFCNPJ').unbind('blur').blur(ValidaDocumentoResponsavel);
    $('.incluirLacracao').bind('click', AutoInterdicao.IncluirLacre);
    $("input[name='AutoInterdicao.TipoCadastro']").bind('click', AutoInterdicao.MostraCampoManualInloco);
    $('#ObservacaoResponsavelAutoInterdicao_RecusaAssinatura').bind('click', AutoInterdicao.RecusaAssinaturaChange);
    AutoInterdicao.GetFiscaisCombustivel();
    //bindRecusaInformar();
    //RecusaInformarClick();
    AdicionarObrigatoriedadeResponsavel();
    CEPHELPER.Init();
    DataMinimaRFC();
}

function InicializarAutoDeslacracao() {
    //DESLACRACAO.Init();
    //DESLACRACAO.MostraCampoManualInloco();
    $('.incluirLacracao').bind('click', AutoInterdicao.IncluirLacre);
    $("input[name='AutoInterdicao.TipoCadastro']").bind('click', AutoInterdicao.MostraCampoManualInloco);
    //$('#ObservacaoResponsavelAutoInterdicao_RecusaAssinatura').bind('click', AutoInterdicao.RecusaAssinaturaChange);
    AdicionarObrigatoriedadeResponsavel();
    AutoInterdicao.GetFiscaisCombustivel();
    LoadCEP();
    DataMinimaRFC();
    $('.validaCPFCNPJ').unbind('blur').blur(ValidaDocumentoResponsavel);
    OcultaDescricaoMotivoDeslacracao();
}

function InicializarTermoCircunstanciado() {
    $('.validaCPFCNPJ').unbind('blur').blur(ValidaDocumentoResponsavel);
    $('.lacre-bomba').unbind('blur').blur(AlterarAutoApreensaoLacre);
    //bindRecusaInformar();
    //RecusaInformarClick();
    AdicionarObrigatoriedadeResponsavel();
    CEPHELPER.Init();
}

function AdicionarObrigatoriedadeResponsavel() {
    RESPONSAVEL.Init();
    RESPONSAVEL.AdicionarObrigatoriedade();
}

function CarregarUltimoFornecedor()
{
    $(".loadUltimoFornecedor").unbind('blur').blur(function (evt) {
        var cnpj = $(".loadUltimoFornecedor").val();
        if (cnpj != "") {
            if (!validarCNPJ(cnpj)) {
                BASE.MostrarMensagem('Número do CNPJ inválido, favor verificar!');
                return;
            }

            var $this = $(this);
            $.ajax({
                url: "/Fornecedor/GetFornecedorByCNPJ",
                data: { cnpj: cnpj.replace(/[^\d]+/g, '') },
                cache: false,
                success: function (result) {
                    if (result != null && result != "" && result.PJ != null) {
                        $('.distribuidorRazaoSocial').val(result.Nome);
                        $('.distribuidorIE').val(result.PJ.IE);
                    }
                    else {
                        BASE.MostrarMensagem('O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.');
                    }
                },
                error: function () {
                    BASE.MostrarMensagem('O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.');
                }
            });
        }
    });
}

function bindRecusaInformar() {
    $('.recusa-informar-responsavel').click(RecusaInformarClick);
}

function RecusaInformarClick() {
    var option = $(".recusa-informar-responsavel:checked", 'form').val()
    RESPONSAVEL.Init();
    if (option == 'False') {
        RESPONSAVEL.AdicionarObrigatoriedade();
    }
    else {
        RESPONSAVEL.RemoverObrigatoriedade();
    }
}

function ValidaDocumentoResponsavel() {
    var valido = true;
    var msg = '';

    var doclength = $(this).val().length;

    var doc = $(this).val().replace(/[^\d]+/g, '');

    if ( ( doc === "" || doc === undefined || doc === null ) &&  doclength === 0 ) {
        valido = false;
        msg = 'Documento inválido';
    }
    else {
        if (doc != undefined && doc.length == 11 && !validarCPF(doc)) {
            valido = false;
            msg = 'CPF inválido';
        }

        if (doc != undefined && doc.length == 14) {
            if (!validarCNPJ($(this).val())) {
                valido = false;
                msg = 'CNPJ inválido'
            } else {
                valido = true;
                CarregarCNPJResponsavel($(this).val());
            }
        }
    }

    if (!valido) {
        BASE.MostrarMensagem(msg);
    }
}

function CarregarCNPJResponsavel(cnpj) {
    $.ajax({
        url: "/Fornecedor/GetFornecedorByCNPJ",
        data: { cnpj: cnpj.replace(/[^\d]+/g, '') },
        cache: false,
        success: function (result) {
            if (result != null && result != "" && result.PJ != null) {

                $('.cep, .responsavel-cep').unmask();
                $('.tel, .responsavel-tel').unmask();
                $('.fonecel').unmask();

                $('.Responsavel, .responsavel-nome').val(result.Nome);
                $('.tel, .responsavel-tel, .fonecel').val(result.Telefone);
                if (result.CNAE != null)
                    $('#RamoAtividade').val(result.CNAE.Descricao);

                if (result.EnderecoSEFAZ != null) {
                    RetirarReadOnly($("#UF, .loadUF"));
                    $('.cep, .responsavel-cep').val(result.EnderecoSEFAZ.CEP);
                    $('.Endereco, .responsavel-endereco').val(result.EnderecoSEFAZ.Logradouro);
                    $('.Cidade, .responsavel-cidade').val(result.EnderecoSEFAZ.Municipio.Descricao);
                    $('.UF option, .UFResponsavel option, .responsavel-uf option').filter(function () {
                        return this.text == result.EnderecoSEFAZ.Municipio.UF;
                    }).attr('selected', true);
                    TornarReadOnly($("#UF, .loadUF"));
                }

                $('.tel, .responsavel-tel').mask('(00) 0000-0000');
                $('.fonecel').mask('(00) 00000-0000');
                $('.cep, .responsavel-cep').mask('00000-000');


            }
            else {
                BASE.MostrarMensagem('O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.');
            }
        },
        error: function () {
            BASE.MostrarMensagem('O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.');
        }
    });
}

function ExibeCampoAlcool(ddl, id) {
    var selected = $(ddl).val
    $('.divTeorAlcoolico_' + i).toggle(selected == 'Etanol');
    $('.divPercentualAlcool_' + i).toggle(selected == 'Gasolina');
}

function ChangeChkTerceiro() {
    $('#divFormTesteTerceiro').toggle($('#chkTesteTerceiro').is(':checked'))
}

function ValidadaDuplicidadeLacre(lc1, lc2, lc3) {
    return lc1 == lc2 || lc2 == lc3 || lc1 == lc3;
}

function HabilitaEnderecoFiscalizacao() {
    var check = !$('#ckIncluirEnderecoFiscalizacao').prop('checked');
    $('#EnderecoFiscalizacao_Cep').attr('readonly', check);
    $('#EnderecoFiscalizacao_Endereco').attr('readonly', check);
    $('#EnderecoFiscalizacao_Cidade').attr('readonly', check);
    $('#EnderecoFiscalizacao_UF').attr('readonly', check);
    $('.divEnderecoFiscalizacao').toggle(!check);
}

function HabilitaOrigemFiscalizacao() {
    if ($('#NumeroAP').val() != null && $('#NumeroAP').val().length > 0) {
        $(".OrigemFiscalizacao").toggle(false);
        $("#OrigemFiscalizacao").val("");
        $("#OrigemFiscalizacao").attr('readonly', true);
        $('#OrigemFiscalizacao option:not(:selected)').attr('disabled', true);
    }
    else {
        $(".OrigemFiscalizacao").toggle(true);
        $("#OrigemFiscalizacao").attr('readonly', false);
        $('#OrigemFiscalizacao option:not(:selected)').attr('disabled', false);
    }
}

function FiscalResponsavelChange() {
    var value = $('#txtFiscalResponsavel').val();
    var text = $('#txtFiscalResponsavel').text();

    $.ajax({
        url: "/Fiscal/GetFiscaisByRfc",
        data: { id: $('#Codigo').val() },
        cache: false,
        success: function (result) {
            $('#listFiscais').children().remove().end();
            $.each(result, function (i, field) {
                if (value != field.Codigo) {
                    if (field.Associado == true) {
                        $('#listFiscais').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome,
                            selected: "selected"
                        }));
                    }
                    else {
                        $('#listFiscais').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome
                        }));
                    }
                }
                else {
                    $('#listFiscais').append($('<option>', {
                        value: field.Codigo,
                        text: field.Nome,
                        selected: "selected",
                        disabled: true
                    }));
                }
            });
            var listFiscais = $('select[name="listFiscais"]').bootstrapDualListbox({
                showFilterInputs: false,
                //infoText: 'Fiscais Combustível {0}',
                infoText: false,
                infoTextEmpty: 'Vazio'
            }).bootstrapDualListbox('refresh', true);
        }
    });
}

function HabilitaUltimoFornecedor() {
    $('.divUltimoFornecedorNovo').toggle(!$('#TermoColeta_RecusaDistribuidor').prop('checked'));
}

function GetCNAEById() {
    $.ajax({
        url: "/CNAE/GetCNAEById",
        data: { id: $('#CNAE').val() },
        success: function (result) {
            if (result != null) {
                $('#RamoAtividade').val(result.Descricao)
            }
        }
    });
}

function CarregaTermoColeta(idtc) {
    $.ajax({
        url: "/TermoColeta/GetById",
        data: { id: idtc },
        cache: false,
        success: function (result) {
            if (result != null) {
                AplicarMascaras();

                $('#btnIncluirColeta').html('Salvar Coleta');
                $('#TermoColeta_Codigo').val(result.Codigo)
                $('#TermoColeta_AmostraColetadaProva_Codigo').val(result.AmostraColetadaProva.Codigo)
                $('#TermoColeta_AmostraColetadaTestemunha_Codigo').val(result.AmostraColetadaTestemunha.Codigo)
                $('#TermoColeta_AmostraColetadaContraprova_Codigo').val(result.AmostraColetadaContraprova.Codigo)
                $('#TermoColeta_AmostraColetadaProva_LacreTampa').val(result.AmostraColetadaProva.LacreTampa)
                $('#TermoColeta_AmostraColetadaProva_LacreTampa').attr('data-id-lacre', result.AmostraColetadaProva.Codigo)
                $('#TermoColeta_AmostraColetadaTestemunha_LacreTampa').val(result.AmostraColetadaTestemunha.LacreTampa)
                $('#TermoColeta_AmostraColetadaTestemunha_LacreTampa').attr('data-id-lacre', result.AmostraColetadaTestemunha.Codigo)
                $('#TermoColeta_AmostraColetadaContraprova_LacreTampa').val(result.AmostraColetadaContraprova.LacreTampa)
                $('#TermoColeta_AmostraColetadaContraprova_LacreTampa').attr('data-id-lacre', result.AmostraColetadaContraprova.Codigo)
                $('#TermoColeta_AmostraColetadaProva_LacreInvolucro').val(result.AmostraColetadaProva.LacreInvolucro)
                $('#TermoColeta_AmostraColetadaProva_LacreInvolucro').attr('data-id-lacre', result.AmostraColetadaProva.Codigo)
                $('#TermoColeta_AmostraColetadaTestemunha_LacreInvolucro').val(result.AmostraColetadaTestemunha.LacreInvolucro)
                $('#TermoColeta_AmostraColetadaTestemunha_LacreInvolucro').attr('data-id-lacre', result.AmostraColetadaTestemunha.Codigo)
                $('#TermoColeta_AmostraColetadaContraprova_LacreInvolucro').val(result.AmostraColetadaContraprova.LacreInvolucro)
                $('#TermoColeta_AmostraColetadaContraprova_LacreInvolucro').attr('data-id-lacre', result.AmostraColetadaContraprova.Codigo)
                $('#TermoColeta_TipoCombustivel').val(result.TipoCombustivel)
                $('#TermoColeta_NumeroTanque').val(result.NumeroTanque)
                $('#TermoColeta_DescricaoCombustivel').val(result.DescricaoCombustivel)
                $('#TermoColeta_SerieBombaBico').val(result.SerieBombaBico)
                $('#TermoColeta_SerieBomba').val(result.SerieBomba)
                $('#TermoColeta_NumeroBombaBico').val(result.NumeroBombaBico)
                $('#TermoColeta_NotaFiscal').val(result.NotaFiscalMask);

                if (result.DataNotaFiscal != '' && result.DataNotaFiscal != null) {
                    var data = new Date(result.DataNotaFiscal);
                    $('#TermoColeta_DataNotaFiscal').val(data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear());
                }

                $('#TermoColeta_PrecoBomba').val(result.PrecoBomba !== null ? ((result.PrecoBomba * 100) / 100).toFixed(3).toString().replace('.', ',') : '');
                $('#TermoColeta_RecusaDistribuidor').prop('checked', result.RecusaDistribuidor);
                $('#TermoColeta_CNPJ').attr('value', result.CNPJMask);
                $('#TermoColeta_InscricaoEstadual').attr('value', result.InscricaoEstadualMask);
                $('#TermoColeta_RazaoSocial').val(result.RazaoSocial);
                $('#TermoColeta_QuantidadeCombustivel').val(result.QuantidadeCombustivel);
                $('#TermoColeta_NormaConformidade').attr('checked', result.NormaConformidade);

                MostraDescricaoCombustivel($('#TermoColeta_TipoCombustivel'));
                HabilitaUltimoFornecedor();

                $('.field-validation-error').hide();
            }
        }
    });
}

function NovoTermoColeta() {
    InicializarForms(99);
}

function MostrarDadosResponsavel() {
    var exibir = !$('#ObservacaoResponsavelRFC_RecusaAssinatura').prop('checked');
    RESPONSAVEL.Init();
    if (!exibir) {
        RESPONSAVEL.RemoverObrigatoriedade();
    }
    else {
        RESPONSAVEL.AdicionarObrigatoriedade();
    }
}

function MostraCampoManualInloco(radio) {
    var opcao = $('input[name=TipoCadastro]:checked', 'form').val();
    $('.divDataHoraRfc').toggle(opcao == 'Manual');
    if (opcao == 'Manual') {
        $('#txtFiscalResponsavel').attr('readonly', false);
        $('#txtFiscalResponsavel option:not(:selected)').attr('disabled', false);
    }
    else {
        $('#txtFiscalResponsavel').attr('readonly', true);
        $("#txtFiscalResponsavel").val($('#hdFiscalLogado').val());
        $('#txtFiscalResponsavel option:not(:selected)').attr('disabled', true);
    }
    FiscalResponsavelChange();
}

function CadastroManual() {
    $('.divDataHoraRfc').toggle(true);
    $('#txtFiscalResponsavel').attr('readonly', false);
    $('#txtFiscalResponsavel option:not(:selected)').attr('disabled', false);
}

function CadastroInLoco() {
    $('.divDataHoraRfc').toggle(false);
    $('#txtFiscalResponsavel').attr('readonly', true);
    $("#txtFiscalResponsavel").val($('#hdFiscalLogado').val());
    $('#txtFiscalResponsavel option:not(:selected)').attr('disabled', true);

    $("input[name=TipoCadastro][value='InLoco']").prop("checked", true);
}

function MudaRotinaOperacao(sel) {
    var opcao = $('#OrigemFiscalizacao').val() != "";

    $('.divOperacaoRotina').toggle(opcao);
    if (opcao) {
        $('#NumeroAP').val("");
        $.ajax({
            url: "/Evento/GetEventoByTipo",
            data: { tipo: $('#OrigemFiscalizacao').val(), equipeFiscaisCombustivel: true },
            success: function (result) {
                var select = $('#Evento').val();
                $('#Evento').children().remove().end().append($('<option value>--Selecione--</option>'))
                $.each(result, function (i, field) {
                    if (select == field.Codigo) {
                        $('#Evento').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome,
                            selected: "selected"
                        }));
                    } else {
                        $('#Evento').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome
                        }));
                    }
                });
            }
        });
    }

    $('#NumeroAP').attr('readonly', opcao);
    $('.NumeroAP').toggle(!opcao);
}

function PegaNomeBandeira() {
    var opcao = $('#BandeiraPosto').val();
    $('#divDescBandeira').toggle(opcao == '1'); //OUTROS
}

function MudaUnidadeExecutante() {
    var opcao = $('input[name=UnidadeExecutante]:checked', '#frmDadosFornecedor').val();
    $('#divEnderecoDRT').toggle(opcao == 'SEFAZ');

    if (opcao == 'PROCONSP') {
        $('#Delegacia').val('');
        $('#EnderecoUnidade').val('Rua Barra Funda, 930, 4º and. Sala 415, CEP 01152-000, São Paulo - SP');
    }
}

function calculaTanques() {
    var total = 0;
    $('.somatanque').each(function (i) {
        var valor = parseInt($(this).val());
        if (!isNaN(valor)) {
            total += valor;
        }
    });

    $('#txtTotalTanques').val(total);
}

function calculaBicos() {
    var total = 0;
    $('.somabico').each(function (i) {
        var valor = parseInt($(this).val());
        if (!isNaN(valor)) {
            total += valor;
        }
    });

    $('#txtTotalBicos').val(total);
}

function CadastrarRfc() {
    $('#js-menu li:nth-child(1)').addClass('menu--subitens__opened')
    $('.sub_menu li:nth-child(1)').addClass('js-menu-active')
    MudaPaginaRFC('db')
}

function GetDelegacia(sender) {
    $.ajax({
        url: "/Delegacia/GetDelegaciaById",
        data: { id: jQuery(sender).val() },
        method: "POST",
        success: function (result) {
            if (result != "") {
                $('#EnderecoUnidade').val(result.Endereco + ", " + result.Numero + ", " + result.Complemento + " CEP:" + result.Cep + " - "
                    + result.Bairro + " - " + result.Municipio);
            }
        },
        error: function () {
            BASE.MostrarMensagem('Erro ao consultar delegacia.')
        }
    })
};

function GoToPage1() {
    MudaPaginaRFC('db');

    $('.sub_menu li:nth-child(1)').addClass('js-menu-active')
    $('.sub_menu li:nth-child(2)').removeClass('js-menu-active')
    $('.sub_menu li:nth-child(3)').removeClass('js-menu-active')
}

function GoToPage2(obj) {
    MudaPaginaRFC('df');

    $('.sub_menu li:nth-child(1)').removeClass('js-menu-active')
    $('.sub_menu li:nth-child(2)').addClass('js-menu-active')
    $('.sub_menu li:nth-child(3)').removeClass('js-menu-active')
}

function GoToPage3() {
    MudaPaginaRFC('dc');

    $('.sub_menu li:nth-child(1)').removeClass('js-menu-active')
    $('.sub_menu li:nth-child(2)').removeClass('js-menu-active')
    $('.sub_menu li:nth-child(3)').addClass('js-menu-active')
}

function HabilitaCampoOutros(sender, idDiv) {
    $('#' + idDiv).toggle($(sender).val() == '5');
}

function MostrarDescricao(sender) {
    if ($(sender).val() == '5') {
        $('#divCombustivelOutros').show();
    }
    else {
        $('#divCombustivelOutros').hide();
    }
}

function AbreFrame(indice) {
    InicializarForms(indice);
}

function criaLinkVoltar() {

    if ($('.breadcrumb').html().indexOf('<a href="/Registro"') < 0) {
        $('.breadcrumb').html($('.breadcrumb').html() + '/ <a href="/Registro" >Voltar</a>');

    }

}


function InicializarForms(indice) {
    BASE.SpinnerOn('#frmContent #conteudo');
    var url = '';
    var id = jQuery('#Codigo').val();

    if (id == null) {
        id = 0;
    }

    switch (indice) {
        case 1: url = "/Registro/DadosBasicos"; break;
        case 2: url = "/Registro/DadosFornecedor"; break;
        case 3: url = "/Registro/DadosCombustivel"; break;
        case 4: url = "/Registro/TermoColeta"; break;
        case 5: url = "/Registro/TestePreliminar"; break;
        case 7: url = "/Registro/AutoApreensao"; break;
        case 8: url = "/Registro/TermoCircunstanciado"; break;
        case 9: url = "/AutoInterdicao/AutoInterdicao/"; break;
        case 10: url = "/AutoDeslacracao/Index"; break;
        case 11: url = "/TermoRetirada/Index"; break;
        case 12: url = "/Registro/FolhaObservacao"; break;
        case 99: url = "/Registro/NovoTermoColeta"; break;
        default: url = "/Registro/DadosBasicos"; break;

    }

    $.ajax({
        url: url,
        data: { cod: id },
        cache: false,
        success: function (result, status, xhr) {
            var isJson = BASE.Util.ResponseIsJson(xhr);

            if (!isJson) {
                if (result != "") {
                    var frmContent = $('#frmContent #conteudo');
                    frmContent.html(result);
                    frmContent.children('form').removeData("validator");
                    frmContent.children('form').removeData("unobtrusiveValidation");
                    $.validator.unobtrusive.parse("form");

                    switch (indice) {
                        case 1: frmContent.ready(InicializarDadosBasicos()); break;
                        case 2: frmContent.ready(InicializarDadosFornecedor()); break;
                        case 3: frmContent.ready(InicializarDadosCombustivel()); break;
                        case 4: case 99: frmContent.ready(InicializarTermoColeta()); break;
                        case 5: frmContent.ready(InicializarTestePreliminar()); break;
                        case 7: frmContent.ready(InicializarAutoApreensao()); break;
                        case 9: frmContent.ready(InicializarAutoInterdicao()); break;
                        case 8: frmContent.ready(InicializarTermoCircunstanciado()); break;
                        case 10: frmContent.ready(InicializarAutoDeslacracao()); break;
                        case 11: frmContent.ready(InicializarTermoRetirada()); break;
                        case 12: frmContent.ready(InicializarFolhaObservacao()); break;
                        default: frmContent.ready(InicializarDadosBasicos()); break;

                    }

                    ValidaAlteracoes();
                    HouveAlteracoes = indice == 1 || indice == 2;
                    IniciarDateTimePicker();
                    criaLinkVoltar();

                    BASE.SpinnerOff('#frmContent #conteudo');

                    //AUTO TABULACAO E BLOQUEIO DE SUBMIT
                    switch (indice) {
                        case 4:
                            var campos = $('#frmTermoColeta input[type=text]:visible');
                            $(campos).keydown(function (e) {
                                if (e.which === 13) {
                                    var index = $(campos).index(this) + 1;
                                    $(campos).eq(index).focus();
                                    e.preventDefault();
                                }
                            });

                            var situacao = $('#Situacao').val();

                            if (situacao != "Finalizado") {
                                $(' .btn-danger').removeAttr('disabled');
                            }

                            break;

                        case 7:
                            var campos = $('#frmAutoApreensao input[type=text]:visible');
                            $(campos).keydown(function (e) {
                                if (e.which === 13) {
                                    var index = $(campos).index(this) + 1;
                                    $(campos).eq(index).focus();
                                    e.preventDefault();
                                }
                            });
                            break;

                        case 9:
                            var campos = $('#frmListaLacre input[type=text]:visible');
                            $(campos).keydown(function (e) {
                                if (e.which === 13) {
                                    var index = $(campos).index(this) + 1;
                                    $(campos).eq(index).focus();
                                    e.preventDefault();
                                }
                            });
                            break;
                    }

                }
            }
            else {
                BASE.Mensagem.Mostrar(result.msgErro, TipoMensagem.Error);
                BASE.SpinnerOff('#frmContent #conteudo');
            }
        },
        error: function (result) {
            BASE.SpinnerOff('#frmContent #conteudo');
        }
    })
}

function RemoverColeta(idRFC, idRFCColeta) {

    var situacao = $('#Situacao').val();

    if (situacao != "Finalizado") {

        BASE.MostrarModalConfirmacao('Exclusão de Coleta', 'Confirma a exclusão da coleta?', function () {

            $.ajax(
            {
                url: "/Registro/RemoverColeta",
                type: "POST",
                data: { id_rfc: idRFC, id_rfc_coleta: idRFCColeta },
                success: function (result) {
                    AbreFrame(4);                 
                },
                error: function (result) {
                    return false;
                }
            });

        },
	    null);

    }

}

function VerificarObservacao() {

    $('.operacao-rfc .panel-body').each(function () {
        if ($(this).html() == "") {
            $(this).prev().remove();
            $(this).remove();
        }
    });

}

function DesabilitarCampos() {
    $('#frmContent').find('input, textarea, button, select, a').attr('disabled', true);
    $('#frmContent').find('input, textarea, button, select').attr('disabled', true);
    $('.hidedetails').remove();
    $('.enabledetails').attr('disabled', false);
}

function DesabilitarFinalizado() {
    var status = $('#hdSituacaoRFC').val();

    if (status === "6" || status === "8" || status === "9" || status === "10" || status === "11") {
        DesabilitarCampos();
    }
}

function MostraDescricaoCombustivel(sel) {
    var opcao = sel.val() == '5';
    $('#divCombustivelOutrosNovo').toggle(opcao);
}

function MostraDescricaoCombustivelTP(sel) {
    var opcao = sel.value;
    $('#divTstPrmCombustivelOutros0').toggle(opcao == 'Outros');
}

function AtendeConformidade(radio, id) {
    var opcao = radio.value;
    $('#divFormTstPrmNaoConformidade' + id).slideToggle(opcao == 'nao');
}

function AtendeConformidade(radio, id) {
    var opcao = radio.value;
    $('#divFormTstPrmNaoConformidade_' + id).slideToggle(opcao == 'False');
    
    if (opcao == 'False') { // Amostras  atendem às normas de Conformidade: Não.
        $('#TestesPreliminares_' + id + '__TermoColeta_ApreenderColeta').prop('checked', true);
        $('#TestesPreliminares_' + id + '__TermoColeta_ApreenderColeta').prop('disabled', true);

        var inputs = document.getElementsByName('TestesPreliminares[' + id + '].TermoColeta.ApreenderColeta');

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "hidden") {
                inputs[i].value = true;
            }
        }
    }
    else {
        $('#TestesPreliminares_' + id + '__TermoColeta_ApreenderColeta').prop('checked', false);
        $('#TestesPreliminares_' + id + '__TermoColeta_ApreenderColeta').prop('disabled', false);

        var inputs = document.getElementsByName('TestesPreliminares[' + id + '].TermoColeta.ApreenderColeta');

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "hidden") {
                inputs[i].value = false;
            }
        }
    }
}

function ImprimirTodosFormularios() {
    ImprimirRFC();
    ImprimirTermoColeta();
    ImprimirTestePreliminar();
    ImprimirFolhaObservacao();
}

function ImprimirTodosFormulariosApreensao() {
    ImprimirRFC();
    ImprimirTermoColeta();
    ImprimirTestePreliminar();
    ImprimirAutoApreensao();
    ImprimirFolhaObservacao();
}

function ImprimirRFC() {
    setTimeout(function () {
        window.open("/Registro/Imprimir?id=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirTermoColeta() {
    setTimeout(function () {
        window.open("/TermoColeta/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirTermoRascunho() {
    setTimeout(function () {
        window.open("/TermoColeta/ImprimirRascunho?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href) || [];
    return results[1];
}

function ImprimirTestePreliminar() {
    if ($("#frmTestePreliminar :radio[value=False][checked=checked]").length > 0 || urlParam("redirect") !== "TestePreliminar") {
        setTimeout(function () {
            window.open("/TestePreliminar/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
        }, 1000);
    }
}

function ImprimirAutoApreensao() {
    setTimeout(function () {
        window.open("/AutoApreensao/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirTermoCircunstanciado() {
    setTimeout(function () {
        window.open("/TermoCircunstanciado/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirTermoCircunstanciadoRascunho() {
    setTimeout(function () {
        window.open("/TermoCircunstanciado/ImprimirRascunho?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirAutoInterdicao() {
    setTimeout(function () {
        window.open("/AutoInterdicao/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirAutoInterdicaoRascunho() {
    setTimeout(function () {
        window.open("/AutoInterdicao/ImprimirRascunho?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirAutoDeslacracao() {
    setTimeout(function () {
        window.open("/AutoDeslacracao/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirDeslacracaoRascunho() {
    setTimeout(function () {
        window.open("/AutoDeslacracao/ImprimirRascunho?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ImprimirFolhaObservacao() {
    setTimeout(function () {
        window.open("/Observacao/Imprimir?idRFC=" + $("#Codigo").val(), '_blank').print();
    }, 1000);
}

function ValidaVerificador(apuracao) {
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

function EditarRfc(cod) {
    window.open("/Registro/Edit?cod=" + cod, '_self');
}

function DetalharRfc(cod) {
    window.open("/Registro/Details?cod=" + cod, '_self');
}

AutoInterdicao = (function () {
    function init() {
        bindSalvarAutoInterdicao();
        AplicarMascaras();
    }

    function bindSalvarAutoInterdicao() {
        $('#frmAutoInterdicao').off('click', '#btnSalvarAutoInterdicao');
        $('#frmAutoInterdicao').on('click', '#btnSalvarAutoInterdicao', function () {
            salvaAutoInterdicao();

            return false;
        });
    }

    function mostraCampoManualInloco() {
        var opcao = $("input[name='AutoInterdicao.TipoCadastro']:checked", 'form').val();
        $('.divDataHoraRfc').toggle(opcao == 'Manual');
    }

    function recusaAssinatura() {
        var opcao = $("#ObservacaoResponsavelAutoInterdicao_RecusaAssinatura").prop('checked');
        $('.divReposanvelAutoInfracao').toggle(!opcao);
    }

    function alterarAutoInterdicaoLacre(campo) {
        var linha = jQuery(campo).closest("tr");
     
        var numeroSerieBomba = jQuery(".numeroSerieBomba", linha).val();
        var numeroBombaBico = jQuery(".numeroBombaBico", linha).val();      
        var numerotanque = jQuery(".numeroTanque", linha).val();

        var codigolacre = jQuery(".codigo", linha).val();
        var quantidadeCombustivel = jQuery(".qtdeCombustivel", linha).val();

        var txtLacreTanque = $(".lacreTanque", linha);
        var lacreTanqueSomenteLeitura = txtLacreTanque.prop('readonly');
        var lacreTanque = txtLacreTanque.val();


        var txtLacreBomba = $(".lacreBomba", linha);
        var lacreBombaSomenteLeitura = txtLacreBomba.prop('readonly');
        var lacreBomba = txtLacreBomba.val();

        var tipocombustivel = jQuery(".tipoCombustivel", linha).val();
        var leituraEncerramentoBico = jQuery(".leituraEncerramentoBico", linha).val();

        var descricaoCombustivel = jQuery(".descricaoCombustivel", linha).val();


        //console.log(lacreTanqueSomenteLeitura);
        //console.log(lacreBombaSomenteLeitura);


        $.ajax({
            url: "/AutoInterdicao/AlteraAutoInterdicaoLacre",
            type: "POST",
            data: {
                idRFC: $('#Codigo').val(), numeroSerieBomba: numeroSerieBomba, numeroBombaBico: numeroBombaBico,
                quantidadeCombustivel: quantidadeCombustivel, lacreTanque: lacreTanque,
                lacreBomba: lacreBomba, codigolacre: codigolacre,
                tipocombustivel: tipocombustivel, numerotanque: numerotanque,
                leituraEncerramentoBico: leituraEncerramentoBico, descricaoCombustivel: descricaoCombustivel
            },
            success: function (result) {
                if (result.msg != "")
                    BASE.MostrarMensagemErro(result.msg);
                return;
            },
            error: function (result) {
                BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
            }
        });
    }

    function salvaAutoInterdicao() {
        var formListLacre = $('#frmListaLacre');
        var formAutoInterdicao = $('#frmAutoInterdicao');
        var url = formAutoInterdicao.prop('action');

        var isValid = formAutoInterdicao.valid();

        if (isValid) {
            var ajaxData = $('#frmListaLacre, #frmAutoInterdicao').serialize();

            $.ajax({
                url: url,
                type: "POST",
                data: ajaxData,
                success: function (data, status, xhr) {

                    var isJSON = BASE.Util.ResponseIsJson(xhr);

                    console.log(data);
                    if (isJSON) {

                        if (data.Sucesso) {
                            var url = data.RedirectTo;
                            window.location = url;
                        }
                        else {
                            BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Error);
                        }
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
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

    function incluirLacre() {
        var error = '';
        var valid = true;

        var form = $("#frmListaLacre"),
        valid = validarDados(form);

        if (!valid) return;

        if ($('#Lacre_TipoCombustivel').val() === '') {
            error = "O Campo Tipo Combustível Apreendido é de preenchimento obrigatório";
            valid = false;
        }
        if ($('#Lacre_DescricaoCombustivel').val() === '') {
            error = "O Campo Descrição Combutível é de preenchimento obrigatório";
            valid = false;
        }          

        if (!valid) {
            BASE.MostrarMensagemErro(error);
            return;
        }

        var interdicaoLacre = JSON.stringify({
            TipoCombustivel: $('#Lacre_TipoCombustivel').val(),
            DescricaoComsbutivel: $('#txtDescricao').val(),
            QtdeCombustivel: $('#Lacre_QtdeCombustivel').val(),
            NumeroTanque: $('#Lacre_NumeroTanque').val(),
            NumeroSerieBomba: $('#Lacre_NumeroSerieBomba').val(),
            NumeroBombaBico: $('#Lacre_NumeroBombaBico').val(),
            LacreBomba: $('#Lacre_LacreBomba').val(),
            LacreTanque: $('#Lacre_LacreTanque').val(),
            LeituraEncerramentoBico: $('#Lacre_LeituraEncerramentoBico').val(),
            LacreIncluido: $('#Lacre_LacreIncluido').val()
        })

        $.ajax({
            url: "/AutoInterdicao/IncluirLacre",
            data: { idRFC: $('#Codigo').val(), Lacre: interdicaoLacre },
            cache: false,
            success: function (result) {
                if (result != null) {
                    $('#divLacres').html(result);
                    InicializarAutoInterdicao();
                }
            },
            error: function (result) {
                BASE.MostrarMensagemErro(result);
            }
        });
    }

    function getFiscaisCombustivel() {
        $.ajax({
            url: "/Fiscal/GetFiscaisCombustivel",
            success: function (result) {
                $('.ddlFiscalAutoInterdicao').children().remove().end();
                $.each(result, function (i, field) {
                    if (field.Codigo == $('#hdFiscal').val()) {
                        $('.ddlFiscalAutoInterdicao').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome
                        }));
                    } else {
                        $('.ddlFiscalAutoInterdicao').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome,
                            selected: true
                        }));
                    }
                });
            }
        });
    }

    return {
        Init: init,
        MostraCampoManualInloco: mostraCampoManualInloco,
        RecusaAssinaturaChange: recusaAssinatura,
        IncluirLacre: incluirLacre,
        GetFiscaisCombustivel: getFiscaisCombustivel,
        AlterarAutoInterdicaoLacre: alterarAutoInterdicaoLacre,
        SalvaAutoInterdicao: salvaAutoInterdicao
    };

}());

function SalvarColeta(frm) {

    var vazio = true;
    $(frm).serializeArray().forEach(function (obj, value) {

        if (obj.name.indexOf('TermoColeta.') != -1) {
            if (obj.value != 0 & obj.value != "" & obj.value != "false")
                vazio = false;
        }
    });


    var valid = true;

    if (!vazio) {
        valid = $(frm).valid();
    }
    else {
        return true;
    }

    if (valid) {

        var postData = $(frm).serializeArray();
        var formURL = $(frm).attr("action");

        $.ajax(
        {
            url: formURL,
            type: "POST",
            data: postData,
            success: function (data, textStatus, jqXHR) {
                return true;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return false;
            }
        });
    }
    else {
        return false;
    }
}

function HabilitaUltimoFornecedorApreensao() {
    $('.divUltimoFornecedorNovoApreensao').toggle(!$('#AutoApreensaoItem_RecusaDistribuidor').prop('checked'));

    if ($('#AutoApreensaoItem_RecusaDistribuidor').prop('checked'))
    {
        $('#AutoApreensaoItem_NotaFiscal').val('');
        $('#AutoApreensaoItem_DataNotaFiscal').val('');
        $('#AutoApreensaoItem_CNPJ').val('');
        $('#AutoApreensaoItem_InscricaoEstadual').val('');
        $('#AutoApreensaoItem_RazaoSocial').val('');
    }
}

function AdicionarObrigatoriedadeApreensao() {
    $("#frmApreensaoItem").validate({
        onkeyup: false,
        onclick: false,
        focusInvalid: false,
        rules: {
            "AutoApreensaoItem.TipoCombustivel": { required: true },
            "AutoApreensaoItem.DescricaoCombustivel": { required: true },
            "AutoApreensaoItem.NumeroTanque": { required: true },
            "AutoApreensaoItem.NotaFiscal": { required: true },
            "AutoApreensaoItem.DataNotaFiscal": { required: true, date: true },
            "AutoApreensaoItem.CNPJ": { required: true },
            "AutoApreensaoItem.InscricaoEstadual": { required: true },
            "AutoApreensaoItem.RazaoSocial": { required: true },
            "AutoApreensaoItem.QuantidadeCombustivel": { required: true },
            "AutoApreensaoItem.PrecoBomba": { required: true }
        },
        messages: {
            "AutoApreensaoItem.TipoCombustivel": { required: "Campo obrigatório" },
            "AutoApreensaoItem.DescricaoCombustivel": { required: "Campo obrigatório" },
            "AutoApreensaoItem.NumeroTanque": { required: "Campo obrigatório" },
            "AutoApreensaoItem.NotaFiscal": { required: "Campo obrigatório" },
            "AutoApreensaoItem.DataNotaFiscal": { required: "Campo obrigatório", date: "Formato da Data Inválido" },
            "AutoApreensaoItem.CNPJ": { required: "Campo obrigatório" },
            "AutoApreensaoItem.InscricaoEstadual": { required: "Campo obrigatório" },
            "AutoApreensaoItem.RazaoSocial": { required: "Campo obrigatório" },
            "AutoApreensaoItem.QuantidadeCombustivel": { required: "Campo obrigatório" },
            "AutoApreensaoItem.PrecoBomba": { required: "Campo obrigatório" }
        }
    });
}

function IncluirApreensao() {

    $.ajax({
        url: "/Registro/IncluirApreensao",
        type: 'GET',
        cache: false,
        data: { cod: parseInt($('#Codigo').val()) },
        success: function (data) {

             $("#cadastrarApreensao").html(data);
             $("#cadastrarApreensao").modal();

             AdicionarObrigatoriedadeApreensao();
             IniciarDateTimePicker();
             CarregarUltimoFornecedor();
             HabilitaUltimoFornecedorApreensao();
        }
    });
}

function EditarApreensao(idRFC, idRFCApreensaoItem) {
    $.ajax({
        url: "/Registro/EditarApreensao",
        type: 'GET',
        cache: false,
        data: { id_rfc: idRFC, id_rfc_apreensao_Item: idRFCApreensaoItem },
        success: function (data) {

            $("#cadastrarApreensao").html(data);
            $("#cadastrarApreensao").modal();

            AdicionarObrigatoriedadeApreensao();
            IniciarDateTimePicker();
            CarregarUltimoFornecedor();
            HabilitaUltimoFornecedorApreensao();
        }
    });
}

function SalvarApreensao() {

    var form = $('#frmApreensaoItem');

    var isValid = form.valid();

    var valor = $('#AutoApreensaoItem_QuantidadeCombustivel').val();
    $('#AutoApreensaoItem_QuantidadeCombustivel').val(valor.replace(".", ""));

    if (isValid) {

        $("#cadastrarApreensao").modal('hide');

        $.ajax({
            url: "/Registro/SalvarApreensao",
            type: 'POST',
            cache: false,
            data: form.serialize(),
            success: function (data) {
                AbreFrame(7);
            }
        });
    }
};

function RemoverApreensao(idRFC, idRFCApreensaoItem) {

    var situacao = $('#Situacao').val();

    if (situacao != "Finalizado") {
        BASE.MostrarModalConfirmacao('Exclusão de Apreensão', 'Confirma a exclusão da apreensão?', function () {
            $.ajax(
            {
                url: "/Registro/RemoverApreensao",
                type: "POST",
                data: { id_rfc: idRFC, id_rfc_apreensao_Item: idRFCApreensaoItem },
                success: function (result) {
                    AbreFrame(7);
                },
                error: function (result) {
                    return false;
                }
            });
        },
	    null);
    }
}

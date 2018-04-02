
DESLACRACAO = (function () {

    function init() {
        bindAll();

        //verificarObrigatoiedadeResponsavel();
    }

    function bindAll() {


        bindFormataHora();
        // bindFuncoesExtras();
        bindManualInLoco();
        getFiscaisCombustivel();
        bindDescricaoCombustivel();
        habilitaDescricaoTipoCombustivel(false);
        //bindRecusouInformarDadosResponsavel();
        bindIncluirLacracao();
        bindValidaCPFCNPJ();
        bindAlterarAutoDeslacracaoLacre();
        bindSalvarDeslacracao();
        validarBotaoImprimir();
    }

    function validarBotaoImprimir() {
        var imprimir = $('#hdSituacaoRFC').val();
        if (imprimir != undefined && imprimir != '') {
            $('#IdImprimirDeslacracao').removeAttr('style')
        }
    }

    function bindAlterarAutoDeslacracaoLacre() {
        $('.lacre-alterar').blur(function () { AlterarAutoDeslacracaoLacre(this) });
    }

    function bindValidaCPFCNPJ() {
        $('.validaCPFCNPJ').unbind('blur').blur(ValidaDocumentoResponsavel);
    }

    function bindFormataHora() {
        var horaMinuto = dataFormatada();
        $("#horaSistema").val(horaMinuto);
    }

    function bindFuncoesExtras() {
        CONTROLES.FuncoesExtras.DropDownHabilita('#divMotivo', '#ddlMotivoDeslacracao', '4', '.divDeslacracao');
    }

    function bindManualInLoco() {
        $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').hide();
        $('.localDeslacracao').attr('readonly', 'readonly');
        $("#manualInLoco").off("click", ".manualInlocoRadio");
        $("#manualInLoco").on("click", ".manualInlocoRadio", function () {

            var btn = $(this);

            if ($(btn).is(':checked')) {
                $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').show();
                $('.localDeslacracao').removeAttr('disabled');
                $('#AutoDeslacracao_FiscalResponsavel').show();
            }
            else if ($('#inlocoDeslacracao').is(':checked')) {
                $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').hide();
                $('.localDeslacracao').attr('disabled', 'disabled');
                $('#AutoDeslacracao_FiscalResponsavel').show();
                $('#AutoDeslacracao_FiscalResponsavel').attr('disabled', 'disabled');
            }

        });
    }

    function bindDescricaoCombustivel() {
        $("#ddltipoCombustivel").off("click");
        $("#ddltipoCombustivel").on("click", function () {
            var indexTipoCombustivel = $(this).val();
            if (indexTipoCombustivel > 0) {
                var textoCombustivel = $("#ddltipoCombustivel option:selected").text();
                if (textoCombustivel.toLowerCase() === "outro") {
                    habilitaDescricaoTipoCombustivel(true);
                } else {
                    habilitaDescricaoTipoCombustivel(false);
                }
            } else {
                habilitaDescricaoTipoCombustivel(false);
                $("#descricaoTipoCombustivel").val('');
            }
        });
    }

    function bindRecusouInformarDadosResponsavel() {
        var ctrl = $('.recusouInformarDadosReponsavel input[type=checkbox]');
        
        ctrl.click(function () {
            verificarObrigatoiedadeResponsavel(ctrl);
        });
    }

    function verificarObrigatoiedadeResponsavel(ctrl) {

        if (ctrl === undefined) {
            ctrl = $('.recusouInformarDadosReponsavel input[type=checkbox]');
        }


        RESPONSAVEL.Init();
        var labels = $('.div-responsavel-obrigatorio-condicional .label-obrigatorio');

        var recusou = ctrl.is(':checked');

        if (!recusou) {
            RESPONSAVEL.AdicionarObrigatoriedade();
            labels.show();
        }
        else {
            RESPONSAVEL.RemoverObrigatoriedade();
            labels.hide();
        }
    }

    function bindIncluirLacracao() {

        $(".incluirDeslacracao").off("click");
        $(".incluirDeslacracao").on("click", function () {
            incluirLacracao();
        });
    }

    function bindSalvarDeslacracao() {
        $('#btnCadastrar').off('click');
        $('#btnCadastrar').on('click', function () {
          
            SalvarAutoDeslacracao();

            return false;
        });
    }

    function incluirLacracao() {
        
        var msgErro = validarIncluirLacracao();
        if (msgErro != null) {
            BASE.MostrarMensagemErro(msgErro);
            return;
        }

        var inclusaoLacracao = JSON.stringify({

            TipoCombustivel: $("#ddltipoCombustivel").val(),
            DescricaoCombustivel: $("#descricaoTipoCombustivel").val(),
            NumeroTanque: $("#numeroDoTanque").val(),
            NumeroLacreTanque: $("#numeroLacreDoTanque").val(),
            NumeroSerieBomba: $("#numeroSerieBomba").val(),
            NumeroLacreBomba: $("#numeroDoLacreDaBomba").val(),
            LeituraEncerramentoBico: $("#numeroEncerramentoBomba").val(),
            SituacaoLacreTanque: $("#ddlSituacaoLacreTanque").val(),
            SituacaoLacreBomba: $("#ddlSituacaoLacreBomba").val()

        })

        $.ajax({
            url: "/AutoDeslacracao/IncluirLacre",
            data: { idRFC: $('#Codigo').val(), Lacre: inclusaoLacracao },
            cache: false,
            success: function (result) {
                if (result != null) {
                    $('#Deslacres').html(result);


                    $("#ddltipoCombustivel").val("");
                    $("#descricaoTipoCombustivel").val("");
                    $("#numeroDoTanque").val("");
                    $("#numeroLacreDoTanque").val("");
                    $("#numeroSerieBomba").val("");
                    $("#numeroDoLacreDaBomba").val("");
                    $("#numeroEncerramentoBomba").val("");
                    $("#ddlSituacaoLacreTanque").val("");
                    $("#ddlSituacaoLacreBomba").val("");
                }
            },
            error: function (result) {
                BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
            }
        });


    }

    function validarIncluirLacracao() {
       
        var error = '';

        var indexTipoCombustivel = $("#ddltipoCombustivel").prop('selectedIndex');
        var textoTipoCombustivel = $("#ddltipoCombustivel option:selected").text();
        var textoDescTipoCombustivel = $("#descricaoTipoCombustivel").val();
        var numeroTanque = $("#numeroDoTanque").val();
        var numeroLacreTanque = $("#numeroLacreDoTanque").val();
        var numeroSerieBomba = $("#numeroSerieBomba").val();
        var numeroDoLacreDaBomba = $("#numeroDoLacreDaBomba").val();
        var numeroEncerramentoBomba = $("#numeroEncerramentoBomba").val();
        var situacaoLacreTanque = $("#ddlSituacaoLacreTanque").prop('selectedIndex');
        var situacaoLacreBomba = $("#ddlSituacaoLacreBomba").prop('selectedIndex');

        if (indexTipoCombustivel === 0) {
            error = "O Campo Tipo Combustível é de preenchimento obrigatório";
            return error;
        }

        if (textoTipoCombustivel.toLowerCase() === "outros") {
            if (textoDescTipoCombustivel.length <= 0) {
                error = "O Campo Descrição do Combustível é de preenchimento obrigatório";
                return error;
            }
        }

        if (numeroTanque.length <= 0) {
            error = "O Campo Número do Tanque é de preenchimento obrigatório";
            return error;
        }

        if (numeroLacreTanque.length <= 0) {
            error = "O Campo Número do Lacre do Tanque é de preenchimento obrigatório";
            return error;
        }

        if (numeroSerieBomba.length <= 0) {
            error = "O Campo Número de Série da Bomba é de preenchimento obrigatório";
            return error;
        }

        if (numeroDoLacreDaBomba.length <= 0) {
            error = "O Campo Número do Lacre da Bomba é de preenchimento obrigatório";
            return error;
        }

        if (numeroEncerramentoBomba.length <= 0) {
            error = "O Campo Leitura do encerrante da Bomba é de preenchimento obrigatório";
            return error;
        }


        if (situacaoLacreTanque === 0) {
            error = "O Campo Situação Lacre do Tanque é de preenchimento obrigatório";
            return error;
        }


        if (situacaoLacreBomba === 0) {
            error = "O Campo Situação Lacre da Bomba é de preenchimento obrigatório";
            return error;
        }

        if (numeroDoLacreDaBomba === numeroSerieBomba || numeroDoLacreDaBomba === numeroTanque ||
            numeroDoLacreDaBomba === numeroLacreTanque ||
            numeroLacreTanque === numeroSerieBomba || numeroLacreTanque === numeroTanque) {
            error = "Os dados de lacração informados estão duplicados, favor verificar!";
            return error;
        }

        return null;
    }

    function limparControles() {
        //Para cada input text
        $(".dadosResponsavel input:text").val('');
        $('.dadosResponsavel .selectpicker').prop('selectedIndex', 0);
    }

    function habilitaDescricaoTipoCombustivel(habilitar) {
        if (habilitar === true) {
            $(".tipoCombustivel").show();
        } else {
            $(".tipoCombustivel").hide();
        }
    }

    function dataFormatada(d) {
        var data = new Date(),
            hora = data.getHours(),
            minutos = data.getMinutes();

        var minutoParaCima = arredondaParaCima(minutos);
        var horaDoisDigitos = formataDoisDigitos(hora);
        var minutoDoisDigitos = formataDoisDigitos(minutoParaCima);

        return [horaDoisDigitos, minutoDoisDigitos].join(':');
    }

    function arredondaParaCima(valor) {

        var minI = valor.toString().substring(0, 1);
        if (valor.toString().length >= 2) {
            var min = valor.toString().substring(1, 1);
            if (min < 3) {
                return minI + "0";
            } else if (min >= 3 && min <= 7) {
                return minI + "5";
            } else if (min > 7) {
                minI++;
                return minI + "0";
            }
        } else {
            if (min < 3) {
                return minI + "0";
            } else if (min >= 3 && min <= 7) {
                return minI + "5";
            } else if (min > 7) {
                minI++;
                return minI + "0";
            }
        }
    }

    function formataDoisDigitos(valor) {
        return ("0" + valor).slice(-2);
    }

    function novoAutoApreensaoLacre(id, div, e) {
        var error = '';
        var valid = true;
        if ($('#AutosApreensao_' + div + '__Lacre_SerieBombaBico').val() === '') {
            error = "O Campo 'Série Bomba Bico' é de preenchimento obrigatório";
            valid = false;
        }
        if ($('#AutosApreensao_' + div + '__Lacre_LacreBomba').val() === '') {
            error = "O Campo 'Lacre Bomba Bico' é de preenchimento obrigatório";
            valid = false;
        }
        //if ($('#AutosApreensao_' + div + '__Lacre_LeituraEncerramentoBico').val() === '') {
        //    error = "O Campo 'Leitura do Encerrante Bomba Bico' é de preenchimento obrigatório";
        //    valid = false;
        //}

        if (!valid) {
            BASE.MostrarMensagemErro(error);
            return;
        }

        var serie = $('#AutosApreensao_' + div + '__Lacre_SerieBombaBico').val();
        var lacre = $('#AutosApreensao_' + div + '__Lacre_LacreBomba').val();
        var encerrante = $('#AutosApreensao_' + div + '__Lacre_LeituraEncerramentoBico').val();
        var lacretanque = $('#AutosApreensao_' + div + '__Lacre_LacreTanque').val();
        var tanque = $('#AutosApreensao_' + div + '__NumeroTanque').val();
        var qtde = $('#AutosApreensao_' + div + '__QtdeCombustivelApreendida').val();
              

        $.ajax({
            url: "/AutoApreensao/NovoAutoApreensaoLacre",
            data: { idRFC: $('#Codigo').val(), idTC: id, Lacre: JSON.stringify({ SerieBombaBico: serie, LacreBomba: lacre, LacreTanque: lacretanque, LeituraEncerramentoBico: encerrante, NumeroTanque: tanque, Qtde: qtde }) },
            success: function (result) {
                if (result != null) {
                    $('#divLacres_' + div).html(result);
                    $('#AutosApreensao_' + div + '__Lacre_SerieBombaBico').val('');
                    $('#AutosApreensao_' + div + '__Lacre_SerieBombaBico').prop('readonly', false);
                    $('#AutosApreensao_' + div + '__Lacre_LacreBomba').val('');
                    $('#AutosApreensao_' + div + '__Lacre_LeituraEncerramentoBico').val('');
                }
            },
            error: function (result) {
                BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
            }
        });
    }

    function novoTermoCircunstanciadoLacre(id, div, e) {
        var error = '';
        var valid = true;

        if ($('#TermosCircunstanciados_' + div + '__Lacre_LacreBomba').val() === '') {
            error = "O Campo 'Lacre Bomba Bico' é de preenchimento obrigatório";
            valid = false;
        }
        if ($('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreTanque').val() === '') {
            error = "O Campo 'Situação Lacre Tanque' é de preenchimento obrigatório";
            valid = false;
        }
        if ($('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreBomba').val() === '') {
            error = "O Campo 'Situação Lacre Bomba' é de preenchimento obrigatório";
            valid = false;
        }
        //if ($('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val() === '') {
        //    error = "O Campo 'Leitura do Encerrante Bomba Bico' é de preenchimento obrigatório";
        //    valid = false;
        //}

        var regex = new RegExp("^\\d{1,7}\\,\\d{1,3}$");
        var leitura = $('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val();
        if (!regex.test(leitura)) {
            error = "O campo Leitura do Encerrante Bomba (Bico) tem um valor inválido";
            valid = false;
        }

        if (!valid) {
            BASE.MostrarMensagemErro(error);
            return;
        }

        var numeroTanque = $('#TermosCircunstanciados_' + div + '__NumeroTanque').val();
        var tipoCombustivel = $('#TermosCircunstanciados_' + div + '__TipoCombustivel').val();
        var descCombustivel = $('#TermosCircunstanciados_' + div + '__DescricaoCombustivel').val();
        var serie = $('#TermosCircunstanciados_' + div + '__Lacre_SerieBombaBico').val();
        var lacre = $('#TermosCircunstanciados_' + div + '__Lacre_LacreBomba').val();
        var encerrante = $('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val();
        var lacretanque = $('#TermosCircunstanciados_' + div + '__Lacre_LacreTanque').val();
        var situacaoTanque = $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreTanque').val();
        var situacaoBomba = $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreBomba').val();

        if (serie === null || serie === undefined) {
            serie = $('#TermosCircunstanciados_' + div + '__SerieBombaBico').val();

        }        

        $.ajax({
            url: "/TermoCircunstanciado/NovoTermoCircunstanciadoLacre",
            data: { idRFC: $('#Codigo').val(), idAuto: id, Lacre: JSON.stringify({ NumeroTanque: numeroTanque, TipoCombustivel: tipoCombustivel, DescricaoCombustivel: descCombustivel, SerieBombaBico: serie, LacreBomba: lacre, LacreTanque: lacretanque, LeituraEncerramentoBico: encerrante, SituacaoLacreTanque: situacaoTanque, SituacaoLacreBomba: situacaoBomba }) },
            success: function (result) {
                if (result != null) {
                    $('#divLacres_' + div).html(result);
                    $('#TermosCircunstanciados_' + div + '__Lacre_SerieBombaBico').val('');
                    $('#TermosCircunstanciados_' + div + '__Lacre_SerieBombaBico').prop('readonly', false);
                    $('#TermosCircunstanciados_' + div + '__Lacre_LacreBomba').val('');
                    $('#TermosCircunstanciados_' + div + '__Lacre_LacreTanque').val('');
                    $('#TermosCircunstanciados_' + div + '__Lacre_LeituraEncerramentoBico').val('');
                    $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreTanque').val('');
                    $('#TermosCircunstanciados_' + div + '__Lacre_SituacaoLacreBomba').val('');
                }
            },
            error: function (result) {
                BASE.MostrarMensagemErro('Os dados de lacração informados estão duplicados, favor verificar!');
            }
        });
    }

    function recusaAssinaturaAutoInfracao() {
        $('.divResponsavelTermoCircunstanciado').toggle($('#ObservacaoResponsavelTermoCircunstanciado_RecusaAssinatura').prop('checked') == false);
    }

    function mostraCampoManualInloco() {

        $('.radio-inline').click(function () {
            if ($("input[name='AutoDeslacracao.TipoCadastro']:checked", 'form').val() === 'Manual') {
                $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').show();
                $('.localDeslacracao').removeAttr('readonly');
            }
            else {
                $('.dataDeslacracao, .horaDeslacracao, .fiscalDeslacracao').hide();
                $('.localDeslacracao').attr('readonly', 'readonly');
            }
        })

    }

    function getFiscaisCombustivel() {
        $.ajax({
            url: "/Fiscal/GetFiscaisCombustivel",
            success: function (result) {
                $('.ddlFiscalAutoDeslacracao').children().remove().end().append('<option value="">--Selecione--</option>');
                $.each(result, function (i, field) {
                    if (field.Codigo == $('#hdFiscal').val()) {
                        $('.ddlFiscalAutoDeslacracao').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome,
                            selected: true
                        }));
                    } else {
                        $('.ddlFiscalAutoDeslacracao').append($('<option>', {
                            value: field.Codigo,
                            text: field.Nome
                        }));
                    }
                });
            }
        });
    }

    function SalvarAutoDeslacracao() {
             
        var isValid = $('#frmAutoDeslacracao').valid();

        if (isValid) {
            var registro = $('#frmAutoDeslacracao').serializeObject();

            var lacres = [];
            $('#Deslacres table').find('tr').each(function () {

                var row = {};
                $(this).find('input,select,textarea').each(function () {
                    row[$(this).attr('name').replace('item.', '')] = $(this).val();
                });

                if (!($.isEmptyObject(row)))
                    lacres.push(row);
            });

            var ajaxData = { ListLacres: lacres, obj: registro };

            $.ajax({
                url: "/AutoDeslacracao/SalvaDeslacracao",
                type: "POST",
                data: ajaxData,
                success: function (result) {
                    if (result != null) {
                        $('#IdImprimirDeslacracao').removeAttr('style');
                        BASE.MostrarMensagem("Registro Salvo/Alterado com sucesso!", TipoMensagem.Sucesso);
                        CheckMenuRFC();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    BASE.MostrarMensagem(JSON.parse(xhr.responseText), TipoMensagem.Error);
                }

            });
        }
    }

    function AlterarAutoDeslacracaoLacre(campo) {
        var linha = $(campo).closest("tr");
        var tipoCombustivel = $("#item_TipoCombustivel", linha).val();
        var numeroTanque = $("#item_NumeroDoTanque", linha).val();
        var serieBomba = $("#item_NumeroDeSerieDaBomba", linha).val();
        var codigolacre = $("#item_IdRFCAutoDeslacracaoLacre", linha).val();
        var lacreTanque = $("#item_NumeroDoLacreDoTanque", linha).val();
        var lacreBomba = $("#item_NumeroDoLacreBomba", linha).val();
        var situacaoTanque = $("#item_SituacaoLacreDoTanque", linha).val();
        var situacaoBomba = $("#item_SituacaoLacreDaBomba", linha).val();
        var leituraEncerramentoBico = $("#item_LeituraDoEncerranteNaBomba", linha).val();        

        $.ajax({
            url: "/AutoDeslacracao/AlterarAutoDeslacracaoLacre",
            type: "POST",
            data: {
                idRFC: $('#Codigo').val(), serieBomba: serieBomba, tipoCombustivel: tipoCombustivel, numeroTanque: numeroTanque,
                lacreTanque: lacreTanque, lacreBomba: lacreBomba, codigolacre: codigolacre, situacaoTanque: situacaoTanque,
                situacaoBomba: situacaoBomba, leituraEncerramentoBico: leituraEncerramentoBico
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

    return {
        Init: function () {
            init();
        },
        MostraCampoManualInloco: mostraCampoManualInloco,
        NovoAutoApreensaoLacre: novoAutoApreensaoLacre,
        NovoTermoCircunstanciadoLacre: novoTermoCircunstanciadoLacre,
        RecusaAssinaturaAutoInfracao: recusaAssinaturaAutoInfracao,
        GetFiscaisCombustivel: getFiscaisCombustivel
    };

}());


$(function () {
    DESLACRACAO.Init();
});

$.fn.serializeObject = function () {        
    var o = {};        
    var a = this.serializeArray();       
    $(this).find('input[type="hidden"], input[type="text"], textarea, input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function () { 
        if ($(this).attr('type') == 'hidden') { 
            //if checkbox is checked do not take the hidden field                
            var $parent = $(this).parent(); var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
            if ($chb != null) {
                if ($chb.prop('checked')) return;
            }
        }
        if (this.name === null || this.name === undefined || this.name === '')
            return;
        var elemValue = null;
        if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
        else elemValue = this.value;
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(elemValue || '');
        }
        else {
            o[this.name] = elemValue || '';
        }
    }); return o;
}

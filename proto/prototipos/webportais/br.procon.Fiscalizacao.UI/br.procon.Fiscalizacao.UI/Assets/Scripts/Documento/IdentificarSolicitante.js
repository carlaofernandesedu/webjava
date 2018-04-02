$(function () {

    $("#IdDocumento").val($("#Numero").val());
    $("#IdSolicitante").val("0");
    $("#AnoSolicitante").val($("#Ano").val());
    $("#Nome").val("");

    $("#formSolicitante select[id=TipoDocumento]").change(function () {
        $('#divDocumentoPessoalSol').css('display', 'none');
        $("#divFormRgSolic").css("display", "none");
        //$("#divFormCpfSolic").css("display", "none");
        //$("#divFormCnpjSolic").css("display", "none");

        //LimparCamposSoliRG();
        //LimparCamposSoliCPF();
        //LimparCamposSoliCNPJ();

        IdentificaCamposSolicitacao($("#TipoDocumento").val())
    });

    $("#IdentificadorExterior").change(function () {
        if ($(this).is(":checked")) {
            $("#divFormSolNomePais").css("display", "block");
        }
        else
            $("#divFormSolNomePais").css("display", "none");
    });

    $("#formSolicitante").on("submit", function (event) {

        var retorno = "";

        switch ($("#TipoDocumento").val()) {
            case "2":
                retorno = validarCPF($("#formSolicitante #DocumentoPessoal").val());
                if (retorno === false)
                    BASE.MostrarMensagem("CPF inválido!", TipoMensagem.Error);
                break;
            case "3":
                retorno = validarCNPJ($("#formSolicitante #DocumentoPessoal").val());
                if (retorno === false)
                    BASE.MostrarMensagem("CNPJ inválido!", TipoMensagem.Error);
                break;
        }

        if (retorno === false)
            event.preventDefault();
    });

    LoadTabelaSolicitante();
});

var IdentificaCamposSolicitacao = function (tipoDocumento, tipoFuncao, obj) {
    $("#formSolicitante #DocumentoPessoal").val('');
    $('#formSolicitante #DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
    switch (parseInt(tipoDocumento)) {
        case 0:
            $("#divFormRgSolic").css("display", "none");
            $('#divDocumentoPessoalSol').css('display', 'none');
            //$("#divFormCpfSolic").css("display", "none");
            //$("#divFormCnpjSolic").css("display", "none");
            $("#TipoDocumento").val("0");
            $('#formSolicitante #DocumentoPessoal').val('');
            LimparCamposSoliRG();
            //LimparCamposSoliCPF();
            //LimparCamposSoliCNPJ();
            break;
        case 1:
            $("#TipoDocumento").val("1");
            $('#divDocumentoPessoalSol').css("display", "block");
            $('#formSolicitante #DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
            $('#DescricaoOrgaoExpeditor').mask('SSSSS').attr('maxlength', '5');
            $("#divFormRgSolic").css("display", "block");
            //$("#divFormCpfSolic").css("display", "none");
            //$("#divFormCnpjSolic").css("display", "none");
            if (tipoFuncao == "Alterar") {
                //$("#DescricaoRg").val(obj.DescricaoRg);
                //LimparCamposSoliCPF();
                //LimparCamposSoliCNPJ();
                $('#formSolicitante #DocumentoPessoal').val(obj.DocumentoPessoal);
                $("#DescricaoOrgaoExpeditor").val(obj.DescricaoOrgaoExpeditor);
                $("#DescricaoUfExpeditor").val(obj.DescricaoUfExpeditor);
            }
            break;
        case 2:
            $("#TipoDocumento").val("2");
            $('#divDocumentoPessoalSol').css("display", "block");
            $('#formSolicitante #DocumentoPessoal').mask('000.000.000-00', { placeholder: '___.___.___-__' }).attr('maxlength', '14');
            $("#divFormRgSolic").css("display", "none");
            //$("#divFormCpfSolic").css("display", "block");
            //$("#divFormCnpjSolic").css("display", "none");
            if (tipoFuncao == "Alterar") {
                //$("#DescricaoCPF").unmask();
                //$("#DescricaoCPF").val(obj.DescricaoCPF);
                //$(".cpf").mask("000.000.000-00")
                //LimparCamposSoliRG();
                //LimparCamposSoliCNPJ();
                $('#formSolicitante #DocumentoPessoal').val(obj.DocumentoPessoal);
                //$('#DocumentoPessoal').unmask();
                //$('#DocumentoPessoal').mask("000.000.000-00");
            }
            break;
        case 3:
            $("#TipoDocumento").val("3");
            $("#divFormRgSolic").css("display", "none");
            $('#divDocumentoPessoalSol').css("display", "block");
            $('#formSolicitante #DocumentoPessoal').mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' }).attr('maxlength', '18');
            //$("#divFormCnpjSolic").css("display", "block");
            //$("#divFormCpfSolic").css("display", "none");
            if (tipoFuncao == "Alterar") {
                //$("#DescricaoCNPJ").unmask();
                //$("#DescricaoCNPJ").val(obj.DescricaoCNPJ);
                //$(".cnpj").mask("00.000.000/0000-00")
                //LimparCamposSoliRG();
                //LimparCamposSoliCPF();
                $('#formSolicitante #DocumentoPessoal').val(obj.DocumentoPessoal);
                //$('#DocumentoPessoal').unmask();
                //$('#DocumentoPessoal').mask("00.000.000/0000-00");
            }
            break;
    }
}

var EditarSolicitante = function (item) {

    $("#Nome").val(item.Nome);
    $("#IdSolicitante").val(item.IdSolicitante);
    $("#NomePais").val(item.NomePais);

    if (item.Solicitante)
        $("#SolicitanteExterno").prop("checked", true)
    else
        $("#SolicitanteInterno").prop("checked", true)

    if (item.IdentificadorExterior) {
        $("#IdentificadorExterior").prop("checked", true);
        $("#divFormSolNomePais").css("display", "block");
    }
    else {
        $("#IdentificadorExterior").prop("checked", false);
        $("#divFormSolNomePais").css("display", "none");
    }

    IdentificaCamposSolicitacao(item.TipoDocumento, "Alterar", item);
}

var ExcluirSolicitante = function (element) {
   
    var idSolicitante = $(element).data("id");
    var numDoc = $(element).data("doc");
    var situacaoDoc = $(element).data("situacao");
    var idDocumento = $(element).data("id_documento");

    $.ajax({
        url: "/Documento/ExcluirSolicitante",
        data: { idSolicitante: idSolicitante, numDoc: numDoc, situacao: situacaoDoc, idDoc: idDocumento },
        method: "POST",
        success: function (result) {

            if (result.tipoMsg == 2) {
                BASE.EscondeModalConfirmacao();
                BASE.MostrarMensagem(result.msg, TipoMensagem.Error);
            }
            else if (result.id > 0) {
                var row = $('#tblSolicitante').find('tr[data-key=' + result.id + ']');
                $('#tblSolicitante').dataTable().fnDeleteRow(row);

                $.each(result.solicitante, function (index, value) {

                    if (result.solicitante.length > 1) {
                        $("#solicitantesConcluir").text(this.Nome + " e outros");
                        switch (this.TipoDocumento) {
                            case 1:
                                $("#solicitanteDescricaoDocumento").html("<b>RG:</b>");
                                $("#solicitanteDocumento").html("<span  class='rg'>" + this.DocumentoPessoal + "<span>");
                                break;
                            case 2:
                                $("#solicitanteDescricaoDocumento").html("<b>CPF:</b>");
                                $("#solicitanteDocumento").html("<span class='cpf'>" + this.DocumentoPessoal + "<span>");
                                break;
                            case 3:
                                $("#solicitanteDescricaoDocumento").html("<b>CNPJ:</b>");
                                $("#solicitanteDocumento").html("<span class='cnpj'>" + this.DocumentoPessoal + "<span>");
                                break;
                        }
                    }
                    else {
                        $("#solicitantesConcluir").text(this.Nome);
                        switch (this.TipoDocumento) {
                            case 1:
                                $("#solicitanteDescricaoDocumento").html("<b>RG:</b>");
                                $("#solicitanteDocumento").html("<span  class='rg'>" + this.DocumentoPessoal + "<span>");
                                break;
                            case 2:
                                $("#solicitanteDescricaoDocumento").html("<b>CPF:</b>");
                                $("#solicitanteDocumento").html("<span  class='cpf'>" + this.DocumentoPessoal + "<span>");
                                break;
                            case 3:
                                $("#solicitanteDescricaoDocumento").html("<b>CNPJ:</b>");
                                $("#solicitanteDocumento").html("<span class='cnpj'>" + this.DocumentoPessoal + "<span>");
                                break;
                        }
                    }

                })

                LimpaCamposSolicitacao();
                BASE.EscondeModalConfirmacao();
                BASE.MostrarMensagem(result.msg, TipoMensagem.Sucesso);
            }
        }
    });
}

var LimpaCamposSolicitacao = function () {

    $("#Nome").val("");
    $("#TipoDocumento").val("0");
    $("#Nome").val("");
    LimparCamposSoliRG();
    //LimparCamposSoliCPF();
    //LimparCamposSoliCNPJ();
    $("#NomePais").val("0");
    $("#divFormRgSolic").css("display", "none");
    //$("#divFormCpfSolic").css("display", "none");
    //$("#divFormCnpjSolic").css("display", "none");

    $("#IdentificadorExterior").prop("checked", false);
    $("#divFormSolNomePais").css("display", "none");
};

var LimparCamposSoliRG = function () {
    //$("#DescricaoRg").val("");
    //$('#DocumentoPessoal').val("");
    $("#DescricaoOrgaoExpeditor").val("");
    $("#DescricaoUfExpeditor").val("");
};

//var LimparCamposSoliCPF = function () {
//    //$("#DescricaoCPF").val("");
//    $('#DocumentoPessoal').val("");
//};

//var LimparCamposSoliCNPJ = function () {
//    //$("#DescricaoCNPJ").val("");
//    $('#DocumentoPessoal').val("");
//}

var CancelarOperacaoSolicitante = function () {
    $("#IdSolicitante").val("0");
    LimpaCamposSolicitacao();
    BASE.MostrarMensagem("Operação cancelada com sucesso!", TipoMensagem.Sucesso);
}
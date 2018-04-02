$(document).ready(function () {
    $("#IdDocumentoIteressado").val(padLeft($("#Numero").val()));
    $("#IdDocumentoParte").val("0");
    $("#DocNumero").val($("#Numero").val());
    $("#DocAno").val($("#Ano").val());

    LoadTabelaInteressado();

    CarregarParteInteressada();
});

$(function () {
    $("#TipoDocumentoInteressado").change(function () {
        $('#divDocumentoPessoal').css('display', 'none');
        $("#divFormRg").css("display", "none");
        //$("#divFormCpf").css("display", "none");
        //$("#divFormCnpj").css("display", "none");

        //LimparCamposRG();
        //LimparCamposCPF();
        //LimparCamposCNPJ();

        $('#NomeRazaoSocial').autocomplete({ source: [] });

        IdentificaCampoDocumento($("#TipoDocumentoInteressado").val())
    });

    $("#IdentificadorExteriorInteressado").change(function () {
        if ($(this).is(":checked")) {
            $("#divFormNomePais").css("display", "block");
        }
        else
            $("#divFormNomePais").css("display", "none");
    });

    $("#IdentificadorPrincipal").change(function () {
        if ($("#IdDocumentoParte").val() > 0) {
            $("#divFormCheckSolicitante").css("display", "none");
            return;
        }

        if ($(this).is(":checked"))
            $("#divFormCheckSolicitante").css("display", "block");
        else
            $("#divFormCheckSolicitante").css("display", "none");
    });

    $("#formParteInteressada").on("submit", function (event) {
        var retorno = "";

        switch ($("#TipoDocumentoInteressado").val()) {
            case "2":
                retorno = validarCPF($("#DocumentoPessoal").val());
                if (retorno === false)
                    BASE.MostrarMensagem("CPF inválido!", TipoMensagem.Error);
                break;
            case "3":
                retorno = validarCNPJ($("#DocumentoPessoal").val());
                if (retorno === false)
                    BASE.MostrarMensagem("CNPJ inválido!", TipoMensagem.Error);
                break;
        }

        if (retorno === false)
            event.preventDefault();
    });
})

var EditarParteInteressada = function (item) {
    $("#IdDocumentoParte").val(item.IdDocumentoParte);
    $("#IdDocumentoIteressado").val(padLeft(item.IdDocumentoIteressado));
    $("#NomeRazaoSocial").val(item.NomeRazaoSocial);
    $("#NomePaisInteressado").val(item.NomePaisInteressado);
    $("#divFormCheckSolicitante").css("display", "none");

    if (item.IdentificadorPrincipal)
        $("#IdentificadorPrincipal").prop("checked", true);
    else
        $("#IdentificadorPrincipal").prop("checked", false);

    if (item.IdentificadorExteriorInteressado) {
        $("#IdentificadorExteriorInteressado").prop("checked", true);
        $("#divFormNomePais").css("display", "block");
    }
    else {
        $("#IdentificadorExteriorInteressado").prop("checked", false);
        $("#divFormNomePais").css("display", "none");
    }

    IdentificaCampoDocumento(item.TipoDocumentoInteressado, "Alterar", item)
}

var IdentificaCampoDocumento = function (tipoDocumento, tipoFuncao, obj) {
    $("#DocumentoPessoal").val('');
    $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
    switch (parseInt(tipoDocumento)) {
        case 0:
            $("#divFormRg").css("display", "none");
            $('#divDocumentoPessoal').css('display', 'none');
            //$("#divFormCpf").css("display", "none");
            //$("#divFormCnpj").css("display", "none");
            $("#TipoDocumentoInteressado").val("0");
            $('#DocumentoPessoal').val('');
            LimparCamposRG();
            //LimparCamposCPF();
            //LimparCamposCNPJ();
            break;
        case 1:
            $("#TipoDocumentoInteressado").val("1");
            $('#divDocumentoPessoal').css("display", "block");
            $("#divFormRg").css("display", "block");
            $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
            $('#DescricaoOrgaoExpedidorInteressado').mask('SSSSS').attr('maxlength', '5');
            //$("#divFormCpf").css("display", "none");
            //$("#divFormCnpj").css("display", "none");
            if (tipoFuncao == "Alterar") {
                $("#DocumentoPessoal").val(obj.DocumentoPessoal);
                $("#DescricaoOrgaoExpedidorInteressado").val(obj.DescricaoOrgaoExpedidorInteressado);
                $("#DescricaoUfExpedidorInteressado").val(obj.DescricaoUfExpedidorInteressado);
                //LimparCamposCPF();
                //LimparCamposCNPJ();
            }
            break;
        case 2:
            $("#TipoDocumentoInteressado").val("2");
            $('#divDocumentoPessoal').css("display", "block");
            //$("#divFormCpf").css("display", "block");
            $("#divFormRg").css("display", "none");
            $('#DocumentoPessoal').mask('000.000.000-00', { placeholder: '___.___.___-__' }).attr('maxlength', '14');
            //$("#divFormCnpj").css("display", "none");
            if (tipoFuncao == "Alterar") {
                //$("#DocumentoPessoal").unmask();
                //$(".cpf").mask("000.000.000-00")
                $("#DocumentoPessoal").val(obj.DocumentoPessoal);
                //LimparCamposRG();
                //LimparCamposCNPJ();
            }
            break;
        case 3:
            $("#TipoDocumentoInteressado").val("3");
            $('#divDocumentoPessoal').css("display", "block");
            $('#DocumentoPessoal').mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' }).attr('maxlength', '18');
            //$("#divFormCnpj").css("display", "block");
            //$("#divFormCpf").css("display", "none");
            $("#divFormRg").css("display", "none");
            if (tipoFuncao == "Alterar") {
                //$("#DocumentoPessoal").unmask();
                //$('.cnpj').mask('00.000.000/0000-00');
                $("#DocumentoPessoal").val(obj.DocumentoPessoal);
                //LimparCamposRG();
                //LimparCamposCPF();
            }
            break;
    }
}

var Pesquisar = function (item) {
    $.ajax({
        url: "/Documento/Pesquisar",
        data: { documento: item },
        method: "POST",
        success: function (result) {
            return result;
        }
    });
};

var ExcluirParteInteressada = function (element) {
    var codInteressado = $(element).data("id");
    var interessado = $(element).data("interessado");
    var situacaoDoc = $(element).data("situacaointe");

    $.ajax({
        url: "/Documento/ExcluirParteInteressada",
        data: { obj: interessado, situacaoDoc: situacaoDoc },
        method: "POST",
        success: function (result) {
            if (result.tipoMsg == 2) {
                BASE.MostrarMensagem(result.msg, TipoMensagem.Error);
                BASE.EscondeModalConfirmacao();
            }
            else if (result.id > 0) {
                var row = $('#tblInteressado').find('tr[data-key=' + result.id + ']');
                $('#tblInteressado').dataTable().fnDeleteRow(row);

                $.each(result.interessado, function (index, value) {
                    if (this.IdentificadorPrincipal === true) {
                        if (result.interessado.length > 1) {
                            $("#interessadosConcluir").text(this.NomeRazaoSocial + " e outros");
                            switch (this.TipoDocumento) {
                                case 1:
                                    $("#interessadoDescricaoDocumento").html("<b>RG:</b>");
                                    $("#interessadoDocumento").html("<span>" + this.DocumentoPessoal + "<span>");
                                    break;
                                case 2:
                                    $("#interessadoDescricaoDocumento").html("<b>CPF:</b>");
                                    $("#interessadoDocumento").html("<span>" + this.DocumentoPessoal + "<span>");
                                    break;
                                case 3:
                                    $("#interessadoDescricaoDocumento").html("<b>CNPJ:</b>");
                                    $("#interessadoDocumento").html("<span>" + this.DocumentoPessoal + "<span>");
                                    break;
                            }
                        }
                        else {
                            $("#interessadosConcluir").text(this.NomeRazaoSocial);
                            switch (this.TipoDocumento) {
                                case 1:
                                    $("#interessadoDescricaoDocumento").html("<b>RG:</b>");
                                    $("#interessadoDocumento").html("<span>" + this.DocumentoPessoal + "<span>");
                                    break;
                                case 2:
                                    $("#interessadoDescricaoDocumento").html("<b>CPF:</b>");
                                    $("#interessadoDocumento").html("<span>" + this.DocumentoPessoal + "<span>");
                                    break;
                                case 3:
                                    $("#interessadoDescricaoDocumento").html("<b>CNPJ:</b>");
                                    $("#interessadoDocumento").html("<span>" + this.DocumentoPessoal + "<span>");
                                    break;
                            }
                        }
                    }
                })

                LimpaCampos();
                BASE.EscondeModalConfirmacao();
                BASE.MostrarMensagem(result.msg, TipoMensagem.Sucesso);
            }
        }
    });
};

var LimpaCampos = function () {
    $("#NomeRazaoSocial").val("");
    $("#NomePaisInteressado").val("0");
    $("#TipoDocumentoInteressado").val("0");
    $("#DocumentoPessoal").val("");
    LimparCamposRG();
    //LimparCamposCPF();
    //LimparCamposCNPJ();
    $("#IdentificadorPrincipal").prop("checked", false);
    $("#IdentificadorExteriorInteressado").prop("checked", false);
    $("#IdentificadorSolicitanteInteressado").prop("checked", false);

    $("#divFormRg").css("display", "none");
    //$("#divFormCpf").css("display", "none");
    //$("#divFormCnpj").css("display", "none");
    $("#divFormCheckSolicitante").css("display", "none");
    $("#divFormNomePais").css("display", "none");
};

var LimparCamposRG = function () {
    $("#DescricaoOrgaoExpedidorInteressado").val("");
    $("#DescricaoUfExpedidorInteressado").val("");
};


var CancelarOperacaoInteressado = function () {
    $("#IdDocumentoParte").val("0");
    LimpaCampos();
    BASE.MostrarMensagem("Operação cancelada com sucesso!", TipoMensagem.Sucesso);
}

function CarregarParteInteressada() {
    $(".loadParteInteressada").unbind('blur').blur(function (evt) {
        if ($("#TipoDocumentoInteressado").val() == 2 || $("#TipoDocumentoInteressado").val() == 3) {
            var documento = $(".loadParteInteressada").val();

            if (documento != "") {
                var $this = $(this);

                $.ajax({
                    url: "/Documento/GetInteressadoPorDocumentoPessoal",
                    data: { documentoPessoal: documento },
                    cache: false,
                    success: function (result) {
                        if (result != null && result != "") {
                            var interessados = [];

                            $.each(result, function (i) {
                                interessados.push(result[i].NomeRazaoSocial);
                            });

                            $('#NomeRazaoSocial').autocomplete({
                                source: interessados,
                                minLength: 0,
                                scroll: true
                            }).focus(function () {
                                $(this).autocomplete("search", "");
                            });

                            $('#NomeRazaoSocial').val("").focus();
                        }
                        else {
                            BASE.MostrarMensagem('O Número do Documento não foi encontrado, por favor insira os dados do interessado.');
                            $('#NomeRazaoSocial').val("");
                            $('#NomeRazaoSocial').autocomplete({ source: [] });
                        }
                    },
                    error: function () {
                        BASE.MostrarMensagem('O Número do documento não foi encontrado, por favor insira os dados do interessado.');
                        $('#NomeRazaoSocial').val("");
                        $('#NomeRazaoSocial').autocomplete({ source: [] });
                        //jQuery(control).autocomplete("destroy");
                    }
                });
            }
        }
    });
}
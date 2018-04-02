var USUARIO = (function () {
    function init() {

        jQuery(document).ready(function () {
            $('.campoCPF').on('blur', verificaCpf);

            jQuery("#formUsuario").submit(function () {

                if ($('#formUsuario #Codigo').val() > 0 && jQuery(".tabela-perfis input:checked").length == 0) {
                    BASE.MostrarMensagemErro("Selecione ao menos um perfil.");
                    return false;
                }

                if (jQuery("#IdEmpresaPadrao").val() == jQuery("#Empresa").val() && jQuery("#CodigoPessoa").val() == "") {
                    CriarPessoaFisica();
                    return false;
                }
            });
        });

        bindAll();

        changeEmpresa($('#formUsuario #Empresa'));
    }

    function bindAll() {
        bindBtnSalvar();
        //bindCheckBox();
        bindChangeEmpresa();
    }

    //function bindCheckBox() {
    //    console.log('bindCheckBox');
    //    $('#formUsuario').on('click', '.chk-perfil-usuario', function () {
    //        var that = $(this);
    //        var id = that.data('perfil-id');
    //        if (that.is(':checked')) {
    //            $('#divPerfisSelecionados').append('<input type="hidden" class="perfil-selecionado" name="associar_' + id + '">');
    //        }
    //        else {
    //            $('#divPerfisSelecionados input[name=associar_' + id + ']').remove();
    //        }
    //    });
    //}

    function bindChangeEmpresa() {
        $('#formUsuario').on('change', '#Empresa', function () {
            var that = $(this);
            changeEmpresa(that, true);

            SelecionarEmpresa(this);
        });
    }

    function changeEmpresa(that, clear) {
        var idEmpresaPadrao = that.data('empresa-padrao');

        if (idEmpresaPadrao == that.val()) {
            $('#CodigoUA').parent().show();
        }
        else {
            $('#CodigoUA').parent().hide();
        }
        if (clear) {
            $('#CodigoUA').val('');
        }
    }

    function bindBtnSalvar() {
        $('#formUsuario #btnSalvar').off('click');
        $('#formUsuario #btnSalvar').on('click', function () {
            var that = $('#formUsuario #Empresa');
            var idEmpresaPadrao = that.data('empresa-padrao');

            var procon = idEmpresaPadrao == that.val();

            var codigoUa = $('#CodigoUA');
            if (!procon) {
                codigoUa.removeAttr('required')
            }
            else {
                codigoUa.rules("add", {
                    required: true,
                    messages: {
                        required: "A UA deve ser selecionada"
                    }
                });
                codigoUa.valid();
            }

            var email = $('#formUsuario #Email');

            if ($('#formUsuario #TipoUsuario').val() == "AD") {

                $('#formUsuario #Email').removeAttr('required');
            }
            else {
                email.rules("add", {
                    required: true,
                    messages: {
                        required: "O campo E-mail deve ser preenchido"
                    }
                });
                email.valid();
            }
        });
    }

    function GetPessoaFisica(cpf) {
        jQuery("input[type=submit]").prop("disabled", "");
        $.ajax({
            url: "/Usuario/GetPessoaFisica",
            data: { cpf: cpf },
            method: "POST",
            success: function (result) {
                if (result != null && result != "") {
                    $('.emailUsuario').val(result.Email);
                    $('#CodigoPessoa').val(result.Codigo);
                    jQuery(".nomePessoaFisica").val(result.Nome);
                }
                else {
                    $("#CodigoPessoa").val('');
                    $('.emailUsuario').val('');
                    BASE.MostrarModalConfirmacao('Usu\u00e1rio', 'CPF n\u00e3o encontrado. Deseja cadastrar uma nova pessoa fisica?', CriarPessoaFisica, null, null);
                }
            },
            error: function () {
                $('#CodigoPessoa').val('');
                $('.emailUsuario').val('');
                BASE.MostrarModalConfirmacao('Usu\u00e1rio', 'CPF n\u00e3o encontrado. Deseja cadastrar uma nova pessoa fisica?', CriarPessoaFisica, null, null);
            }
        })
    };

    function verificaCpf() {
        if ($('#Codigo').val() != "0")
            return true;

        var errorArray = {};
        var c = $('#CPF').val();

        if (!validarCPF(c)) {
            errorArray["CPF"] = 'CPF inv\u00e1lido';
            $('#formUsuario').validate().showErrors(errorArray);
            return false;
        }
    };

    function primeiroUltimoNome(nome) {
        var tmp = nome.split(" ");
        displayname = tmp[0] + "." + tmp[tmp.length - 1];

        return displayname;
    };

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf == '') return false;
        // Elimina CPFs invalidos conhecidos
        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999")
            return false;
        // Valida 1o digito
        add = 0;
        for (i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
        // Valida 2o digito
        add = 0;
        for (i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i), 10) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;
        return true;
    }

    function CriarPessoaFisica() {
        jQuery("#txtCPF").val(jQuery("#CPF").val());
        jQuery("#modalDetalhe").modal();
    }

    function SalvarPessoaFisica(sender) {
        var retorno = new Object();

        var rafael = jQuery(sender).closest("form");

        jQuery("input, select", rafael).each(function () {
            retorno[jQuery(this).prop("name")] = jQuery(this).val();
        });

        jQuery.ajax({
            url: "/PessoaFisica/SaveAjax",
            data: retorno,
            method: "POST",
            success: function (result) {
                if (result.Sucesso == true) {
                    jQuery("#CPF").val(result.Retorno);
                    jQuery("#modalDetalhe").modal('toggle');

                    jQuery("#CPF").val(jQuery("#txtCPF").val());

                    VerificaCPF($("#CPF"));
                }
                else {
                    MostraMensagemInformativa(result.Retorno);
                }
            }
        });

        return false;
    }

    function MontarUserName() {
        var username = primeiroUltimoNome(jQuery(".nomePessoaFisica").val()).toLowerCase();

        jQuery.ajax({
            url: "/Usuario/VerificaUsername",
            data: { usermane: username },
            method: "POST",
            success: function (result) {
                if (result.Resultado == true) {
                    jQuery('#ChaveDeAcesso').val(jQuery('#ChaveDeAcesso').val() + result.Identificador)
                }
            }
        });

        $('#ChaveDeAcesso').val(username);
    }

    function SelecionaTipoEmpresa() {
        if (jQuery('#TipoEmpresa').val() == 'PROCON') {
            jQuery("#Senha").val("").prop("readonly", "readonly");
            jQuery("#Empresa").attr('disabled', true);
            jQuery('#ChaveDeAcesso').prop("readonly", "readonly");
        }
        else {
            jQuery('#ChaveDeAcesso').prop("readonly", "");
            jQuery("#Senha").val("").prop("readonly", "");
            jQuery("#Empresa").attr('disabled', false);
        }
    }

    function VerificaCPF(sender) {
        if (jQuery(sender).val() == "" | !validarCPF(jQuery(sender).val())) {
            return;
        }

        $.ajax({
            url: "/Usuario/VerificaCPF",
            data: { cpf: jQuery(sender).val() },
            method: "POST",
            success: function (result) {
                if (result == "PessoaFisica") {
                    if (jQuery("#TipoUsuario").val() != "AD") {
                        jQuery('#CodigoUA option').attr("disabled", false);

                        jQuery("#CodigoUA").attr("readonly", false);

                        jQuery("#Senha").attr("readonly", false);
                        jQuery("#Empresa").attr('disabled', false);

                        jQuery("#CodigoUA option").attr("disabled", false);
                    }

                    GetPessoaFisica(jQuery(sender).val());
                }
                else if (result == "") {
                    BASE.MostrarModalConfirmacao("Pessoa F\xEDsica", "Deseja cadastrar uma pessoa f\xEDsica?", CriarPessoaFisica, null, null);
                }
                else if (jQuery("#Codigo").val() == "0") {
                    if (jQuery("#IdEmpresaPadrao").val() == jQuery("#Empresa").val()) {
                        jQuery("#CodigoPessoa").val("");
                        jQuery("#NomeUsuario").val("");
                        CriarPessoaFisica();
                    }
                }
            },
            error: function () {
            }
        })
    }

    function ValidarUsername() {
        if (jQuery("#ChaveDeAcesso").val() == "")
            return;

        $.ajax({
            url: "/Usuario/VerificaUsername",
            data: { usermane: jQuery("#ChaveDeAcesso").val() },
            method: "POST",
            success: function (result) {
                if (result == true) {
                    jQuery("#ChaveDeAcesso").addClass("input-validation-error").next().html("Nome de usu\u00e1rio j\u00e1 cadastrado");
                    return true;
                }
                else {
                    jQuery("#ChaveDeAcesso").next().html("");
                    return false;
                }
            },
            error: function () {
            }
        })
    }

    function SelecionarEmpresa(sender) {
        if (jQuery(sender).val() == "")
            jQuery("#PerfilContainer").html("");

        $.ajax({
            url: "/Usuario/GetPerfis",
            data: { id_empresa: $(sender).val(), id_usuario: $("#Codigo").val() },
            method: "POST",
            success: function (result) {
                $("#PerfilContainer").html(result);
            },
            error: function () {
            }
        })
    }

    function VerificaEmpresaProcon() {
        if (jQuery("#Empresa").val() != "") {
            $.ajax({
                url: "/Usuario/VerificaEmpresaProcon",
                data: { id_empresa: jQuery("#Empresa").val() },
                method: "POST",
                success: function (result) {
                    if (result) {
                        BASE.MostrarModalConfirmacao("Pessoa Fisica", "É necessário cadastrar uma pessoa física. Cadastrar agora?", CriarPessoaFisica, null, null);
                    }
                },
                error: function () {
                }
            })
        }
    }
    return {
        Init: function () {
            init();
        },
        VerificaCPF: VerificaCPF,
        SalvarPessoaFisica: SalvarPessoaFisica
    };
}());

$(function () {
    USUARIO.Init();
});
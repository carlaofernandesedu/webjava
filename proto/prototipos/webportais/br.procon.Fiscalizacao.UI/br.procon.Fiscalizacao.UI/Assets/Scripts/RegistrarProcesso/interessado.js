INTERESSADO = (function () {
    function init() {
        bindAll();
    }

    function bindAll() {
        carregarPaginacao();
        bindMascara();
        bindExterior();
        bindBtnIncluir();
        bindBtnApagar();
        bindBtnExcluir();
        bindBtnAlterar();
    }

    function carregarPaginacao() {
        $('#tblInteressado').DataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"]
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"]
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function bindExterior() {
        $("#form-DocumentoParte input.id-exterior").off('click');
        $("#form-DocumentoParte input.id-exterior").on('click', function () {
            $('.complemento-exterior').toggle();
            if (!$("#form-DocumentoParte input.id-exterior").is(':checked'))
                $('#Pais').val('');
        });
    }

    function bindMascara() {
        $("#form-DocumentoParte input[name=IdTipoDocumento]").change(function () {
            formatarMascara($(this).val());
        });
    }

    function bindValidacao(idTipoDocumento) {
        if (idTipoDocumento == "1") {
            $('#OrgaoUfRG').rules("add", { required: true, messages: { required: "Campo obrigatório." } });
            $('#OrgaoRG').rules("add", { required: true, messages: { required: "Campo obrigatório." } });
        }

        if (idTipoDocumento == "2") {
            $('#DocumentoPessoal').rules("add", { cpf: true });
            $('#OrgaoUfRG').rules("remove", "required");
            $('#OrgaoRG').rules("remove", "required");
            $('#OrgaoUfRG').valid();
            $('#OrgaoRG').valid();
        }

        if (idTipoDocumento == "3") {
            $('#DocumentoPessoal').rules("add", { cnpj: true });
            $('#OrgaoUfRG').rules("remove", "required");
            $('#OrgaoRG').rules("remove", "required");
            $('#OrgaoUfRG').valid();
            $('#OrgaoRG').valid();
        }
    }

    function bindBtnIncluir() {
        $("#form-DocumentoParte #btn-incluir").off('click');
        $("#form-DocumentoParte #btn-incluir").on('click', function () {
            salvar();
        });
    }

    function bindBtnApagar() {
        $("#form-DocumentoParte #btn-apagar").off('click');
        $("#form-DocumentoParte #btn-apagar").on('click', function () {
            limpar();
            $('.complemento-rg').hide();
            $('.complemento-exterior').hide();
            return false;
        });
    }

    function bindBtnExcluir() {
        $("#tblInteressado tbody").off('click', '.btn-excluir');
        $('#tblInteressado tbody').on('click', '.btn-excluir', function () {
            var id = $(this).data('id');
            $('#excluirInteressado').data('id', id);
        });

        $('#btn-confirmar-excluir').click(function () {
            var id = $('#excluirInteressado').data('id');
            excluir(id);
        });
    }

    function bindBtnAlterar() {
        $("#tblInteressado tbody").off('click', '.btn-alterar');
        $('#tblInteressado tbody').on('click', '.btn-alterar', function () {
       
            var idDocumentoParte = $(this).data('id');
            alterar(idDocumentoParte, popularDocumentoParte);
        });
    }

    function salvar() {
        var form = $("#form-DocumentoParte")
        //idDocumento = $("#IdDocumento").val();
        var obj = $("#form-DocumentoParte").serializeObject();

        //bindValidacao(obj.IdTipoDocumento);

        var valido = REGISTRARPROCESSO.ValidarForm(form);

        if (valido) {
            obj.IdTipoDocumento
            obj.IdDocumento = $('#IdDocumento').val();
            $.ajax({
                url: "/Interessado/Salvar",
                type: "POST",
                data: { documentoParte: obj },
                success: function (response, status, xhr) {
                    if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                        REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                    else if (response.Erro !== null && response.Erro !== undefined)
                        BASE.Mensagem.Mostrar("Erro ao salvar interessado", TipoMensagem.Error, "Erro");

                    else {
                        REGISTRARPROCESSO.AbreFrame(2);
                        BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                    }
                },
                error: function () {
                    console.log("erro ao salvar o interessado.");
                    BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
                }
            });
        } else {
            BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Error);
            form.validate();
        }
    }

    function alterar(idDocumentoParte, callback) {
        $.ajax({
            url: "/Interessado/Obter/",
            type: "POST",
            data: { idDocumentoParte: idDocumentoParte },
            success: function (response, status, xhr) {
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    console.log("Não é json");
                }
                else {
                    if (callback !== undefined)
                        callback(response);
                }
            },
            error: function () {
                console.log("erro ao retornar o interessado");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function excluir(idDocumentoParte) {
        $.ajax({
            url: "/Interessado/Excluir/",
            type: "POST",
            data: { idDocumentoParte: idDocumentoParte },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao excluir interessado", TipoMensagem.Error, "Erro");

                else {
                    REGISTRARPROCESSO.AbreFrame(2);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao excluir o interessado.");
                BASE.Mensagem.Mostrar("Erro ao excluir o interessado.", TipoMensagem.Error, "Erro");
            }
        });
    }

    function limpar() {
        if ($("#form-DocumentoParte input.id-exterior").is(':checked')) {
            $('.complemento-exterior').toggle();
        }
        //$('#form-DocumentoParte')[0].reset();
        var form = $("#form-DocumentoParte");
        $(':input', form).each(function () {
            var type = this.type;
            var tag = this.tagName.toLowerCase(); // normalize case
            if (type == 'text' || tag == 'textarea')
                this.value = "";
            else if (type == 'checkbox' || type == 'radio')
                this.checked = false;
            else if (tag == 'select')
                this.selectedIndex = 0;
        });

        $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
    }

    function formatarMascara(idTipoDocumento) {
        $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
        $('.complemento-rg').hide();

        switch (idTipoDocumento) {
            case "1":
                $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
                $('#OrgaoRG').mask('SSSSS').attr('maxlength', '5');
                $('.complemento-rg').show();
                break;
            case "2":
                $('#DocumentoPessoal').mask('000.000.000-00', { placeholder: '___.___.___-__' }).attr('maxlength', '14');
                $('.complemento-rg').hide();
                break;
            case "3":
                $('#DocumentoPessoal').mask('00.000.000/0000-00', { placeholder: '__.___.___/____-__' }).attr('maxlength', '18');
                $('.complemento-rg').hide();
                break;
            default:
                $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
                $('.complemento-rg').hide();
                break;
        }
    }

    function popularDocumentoParte(dados) {
        $("#IdDocumentoParte").val(dados.IdDocumentoParte);
        $("#IdDocumento").val(dados.IdDocumento);
        $("#IdentificadorPrincipal").prop('checked', dados.IdentificadorPrincipal);//.val(dados.IdentificadorPrincipal);
        $("#Nome").val(dados.Nome);
        //$(".idTipoDocumento").prop("checked", dados.IdTipoDocumento)//.val(dados.IdTipoDocumento);
        //$(".idTipoDocumento").val(dados.IdTipoDocumento);
        $("#form-DocumentoParte input[name=IdTipoDocumento]").val([dados.IdTipoDocumento]);
        $("#DocumentoPessoal").val(dados.DocumentoPessoal);
        $("#OrgaoRG").val(dados.OrgaoRG);
        $("#OrgaoUfRG").val(dados.OrgaoUfRG);
        $("#Exterior").prop('checked', dados.Exterior)//.val(dados.Exterior);
        $("#Pais").val(dados.Pais);

        if (dados.IdTipoDocumento > 0)
            formatarMascara(dados.IdTipoDocumento.toString());

        if (dados.Origem)
            $('#externo').prop('checked', true);
        else
            $('#interno').prop('checked', true);

        if (dados.Exterior)
            $('.complemento-exterior').show();
        else
            $('.complemento-exterior').hide();

        if (dados.IdTipoDocumento == 1)
            $('.complemento-rg').show();
        else
            $('.complemento-rg').hide();

        //if (dados.Exterior)
        //    $('.complemento-exterior').toggle();

        //if (dados.IdTipoDocumento == 1)
        //    $('.complemento-rg').show();
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
        Init: function () {
            init();
        }
    }
}());

$(function () {
    INTERESSADO.Init();
});
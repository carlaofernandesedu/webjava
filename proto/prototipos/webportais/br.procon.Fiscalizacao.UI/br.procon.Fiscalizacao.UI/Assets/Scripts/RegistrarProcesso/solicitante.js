SOLICITANTE = (function () {

    function init() {
        bindAll();
    }

    function bindAll() {
        carregarPaginacao();
        bindExterior();
        bindMascara();
        bindBtnApagar();
        bindBtnExcluir();
        bindBtnIncluir();
        bindBtnAlterar();
    }

    function carregarPaginacao() {
        $('#tblSolicitante').DataTable({
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
        $("#form-DocumentoSolicitante input.id-exterior").off('click');
        $("#form-DocumentoSolicitante input.id-exterior").on('click', function () {
            $('.complemento-exterior').toggle();
            if (!$("#form-DocumentoSolicitante input.id-exterior").is(':checked'))
                $('#Pais').val('');
        });
    }

    function bindMascara() {
        $("#form-DocumentoSolicitante input[name=IdTipoDocumento]").change(function () {
            formatarMascara($(this).val());
        });
    }

    function bindBtnApagar() {
        $("#form-DocumentoSolicitante #btn-apagar").off('click');
        $("#form-DocumentoSolicitante #btn-apagar").on('click', function () {
            limpar();
            $('.complemento-rg').hide();
            $('.complemento-exterior').hide();
        });
    }

    function bindBtnExcluir() {
        $("#tblSolicitante tbody").off('click', '.btn-excluir');
        $('#tblSolicitante tbody').on('click', '.btn-excluir', function () {
            var id = $(this).data('id');
            $('#excluirSolicitante').data('id', id);
        });

        $('#btn-confirmar-excluir').click(function () {
            var id = $('#excluirSolicitante').data('id');
            excluir(id);
        });
    }

    function bindBtnIncluir() {
        $("#form-DocumentoSolicitante #btn-incluir").off('click');
        $("#form-DocumentoSolicitante #btn-incluir").on('click', function () {
            salvar();
        });
    }

    function bindBtnAlterar() {
        $("#tblSolicitante tbody").off('click', '.btn-alterar');
        $('#tblSolicitante tbody').on('click', '.btn-alterar', function () {
            var idDocumentoSolicitante = $(this).data('id');
            alterar(idDocumentoSolicitante, popularDocumentoSolicitante);
        });
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

    function limpar() {
        if ($("#form-DocumentoSolicitante input.id-exterior").is(':checked')) {
            $('.complemento-exterior').toggle();
        }
        var form = $("#form-DocumentoSolicitante");
        $(':input', form).each(function () {
            var type = this.type;
            var tag = this.tagName.toLowerCase();
            var id = this.id;
            if (type == 'text' || tag == 'textarea' || type == 'hidden') {
                if (id != 'IdDocumentoSolicitante')
                    this.value = "";
            }
            else if (type == 'checkbox' || type == 'radio')
                this.checked = false;
            else if (tag == 'select')
                this.selectedIndex = 0;
        });

        $('#DocumentoPessoal').unmask().removeAttr('placeholder').attr('maxlength', '18');
    }

    function excluir(idDocumentoSolicitante) {
        $.ajax({
            url: "/Solicitante/Excluir/",
            type: "POST",
            data: { idDocumentoSolicitante: idDocumentoSolicitante },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao excluir solicitante", TipoMensagem.Error, "Erro");

                else {
                    REGISTRARPROCESSO.AbreFrame(3);
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao excluir o solicitante.");
                BASE.Mensagem.Mostrar("Erro ao excluir o solicitante.", TipoMensagem.Error, "Erro");
            }
        });
    }

    function salvar() {
        var form = $('#form-DocumentoSolicitante')
        var valido = REGISTRARPROCESSO.ValidarForm(form);

        if (valido) {

            var obj = form.serializeObject();
            obj.IdDocumento = $('#IdDocumento').val();

            salvarSolicitante(obj);

        } else {
            BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Alerta, "Atenção");
            form.validate();
        }
    }

    function salvarSolicitante(obj) {
        $.ajax({
            url: "/Solicitante/Salvar",
            type: "POST",
            data: { documentoSolicitante: obj },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    REGISTRARPROCESSO.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao salvar solicitante", TipoMensagem.Error, "Erro");

                else {
                    limpar();
                    REGISTRARPROCESSO.AbreFrame(3);
                    BASE.Mensagem.Mostrar("Registro salvo com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            },
            error: function () {
                console.log("erro ao salvar o solicitante.");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
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

    function alterar(idDocumentoSolicitante, callback) {
        $.ajax({
            url: "/Solicitante/Obter/",
            type: "POST",
            data: { idDocumentoSolicitante: idDocumentoSolicitante },
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
                console.log("erro ao retornar o solicitante");
                BASE.Mensagem.Mostrar("Erro ao executar operação", TipoMensagem.Error, "Erro");
            }
        });
    }

    function popularDocumentoSolicitante(dados) {       
        $("#IdDocumentoSolicitante").val(dados.IdDocumentoSolicitante);
        $("#IdDocumento").val(dados.IdDocumento);        
        $("#Nome").val(dados.Nome);
        $("#form-DocumentoSolicitante input[name=IdTipoDocumento]").val([dados.IdTipoDocumento]);
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
    }

    return {
        Init: function () {
            init();
        }
    }

}());

$(function () {
    SOLICITANTE.Init();
});
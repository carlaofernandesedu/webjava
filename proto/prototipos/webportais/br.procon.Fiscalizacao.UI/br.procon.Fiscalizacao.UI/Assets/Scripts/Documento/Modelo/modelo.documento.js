var MODELODOCUMENTO = (function () {
    var _operacao = {
        incluir: 0,
    };

    var _contexto = {
        paginaCadastro: 0,
        paginaFiltro: 1,
    };

    var _tipoHeaderEditor = {
        SP_PROCON: 1,
        PROCON: 2,
        TEXTO: 3
    };

    function init() {
        bindAll();
    }

    function carregarPaginacao() {
        $('#table-modelo-documento').dataTable(
            {
                /*Coluna que não permite ordenação, partindo do array 0*/
                "aoColumnDefs": [
                    {
                        "bSortable": false,
                        "aTargets": ["no-sort"],
                    },
                    {
                        "word-wrap": "break-word",
                        "aTargets": ["col-wrap"],
                    }],

                /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
                "order": [[0, "asc"]],

                /*Resposividade da tabela*/
                responsive: false,
                destroy: true
            }
        );
    }

    function bindAll() {
        $("#btnNovo").attr('data-complexo', true);
        carregarContexto();
    }

    function carregarEditor() {
        bindEditorHeader();
        bindEditorSubHeader();
        bindEditorBody();
        bindEditorFooter();
        bindModeloHeader();
    }

    function bindSalvar() {
        $('#modaleditavel').off('click', 'div.acoesform #btnSalvarModelo');
        $('#modalDetalhe').on('click', 'div.acoesform #btnSalvarModelo', function () {
            var form = $("#modalDetalhe #form-detalhe");

            var valido = validarDados(form);

            if (valido) {
                var novo = $('#modalDetalhe #form-detalhe #Codigo').val();

                if (novo <= 0) {
                    salvar(form, true);
                } else {
                    salvar(form, false);
                }
            }
            else {
                form.validate();
                BASE.Mensagem.Mostrar("Dados inválidos!", TipoMensagem.Informativa);
            }

            return false;
        });
    }

    function salvar(form, criar) {
        var objeto = criarObjetoFiltro($(form).serializeObject());

        objeto.ContentHeader = $($('.Editor-editor')[0]).html();
        objeto.ContentSubHeader = $($('.Editor-editor')[1]).html();
        objeto.ContentBody = $($('.Editor-editor')[2]).html();
        objeto.ContentFooter = $($('.Editor-editor')[3]).html();

        $.ajax({
            type: "POST",
            url: form.attr('action'),
            data: objeto,
            success: function (response) {
                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                }
                else if (response.Sucesso === true) {
                    if (criar === true) {
                        BASE.Modal.Ocultar();
                        CRUDBASE.Eventos.ModalPosCriar();
                        limpar();
                    } else {
                        window.location = '/ModeloDocumento';
                        BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Sucesso);
                    }
                }
            },
            error: function (e) {
                BASE.Mensagem.Mostrar(e, TipoMensagem.Error);
            }
        });
    }

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
            CRUDBASE.Validator.RegrasEspecificas();
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    function criarObjetoFiltro(obj) {
        var novoObjeto = {};
        if (jQuery.type(obj) === "object") {
            for (key in obj) {
                novoObjeto[key] = obj[key];
            }
        }

        return novoObjeto;
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

    function carregarContexto() {
        var obterContexto = $('#conteudo_principal').find('#divFiltro').length;
        if (obterContexto === _contexto.paginaCadastro) {
            carregarEditor();
            bindLimpar();
            bindBtnCancelar();
            bindSalvar();

            bindModalParametros();
            bindDefinirOperacao(parseInt($("#Codigo").val()));
            AutoCompleteSerieDocumental();
            carregarUnidadeAdministrativa();
            CRUDBASE.Eventos.ModalPosCriar = menssagemSucesso;
        }
        else {
            CRUDFILTRO.Evento.PosListar = bindStatusModeloDocumento;
            CRUDFILTRO.Carregar();
            CRUDFILTRO.Filtrar();
        }
    }

    function bindLimpar() {
        $('#form-detalhe .btn-limpar').off('click');
        $('#form-detalhe .btn-limpar').on('click', function () {
            limpar();
        });
    }

    function menssagemSucesso() {
        BASE.Mensagem.Mostrar('Registro incluido com sucesso!', TipoMensagem.Sucesso);
    }

    function bindDefinirOperacao(tipo) {
        if (tipo === _operacao.incluir) {
            bindData();
            bindMascara();
            obterHtmlHeader(_tipoHeaderEditor.SP_PROCON);
        }
        else {
            carregarSubHeader();
        }
    }

    function bindStatusModeloDocumento() {
        $('.btn-status').off('click');
        $('.btn-status').on('click', function () {
            menssagemAlterarStatus(this);
        });

        carregarPaginacao();
    }

    function menssagemAlterarStatus(elemento) {
        BASE.Modal.ExibirModalConfirmacao(
              'Alterar Status', 'Deseja mesmo alterar o status?',
              'small',
              'Sim',
              'btn-primary',
              'Não',
              'btn-danger',
              function () {
                  var status = $(elemento).data('value') == 1 ? false : true;

                  if (status === true) {
                      $(elemento).closest('div').find('.btn-on').addClass('active')
                      $(elemento).closest('div').find('.btn-off').removeClass('active')
                  }
                  else {
                      $(elemento).closest('div').find('.btn-off').addClass('active')
                      $(elemento).closest('div').find('.btn-on').removeClass('active')
                  }
              },
              function () {
                  alterarStatus(elemento);
              });
    }

    function alterarStatus(elemento) {
        var statusModelo = $(elemento).data('value') == 1 ? true : false;
        var idModelo = $(elemento).data('id');

        $.ajax({
            url: '/ModeloDocumento/AlterarStatus',
            type: 'POST',
            data: { id: idModelo, ativar: statusModelo },
            cache: false,
            success: function (response, status, xhr) {
                BASE.Mensagem.Mostrar('Status alterado com sucesso!', TipoMensagem.Sucesso);
                return false;
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    function carregarUnidadeAdministrativa() {
        CONTROLES.DropDown.Preencher('#IdUARestricao', 'UnidadeAdministrativa', 'ComboUnidadeAdministrativa', null, true, false, false, null);
    }

    function AutoCompleteSerieDocumental() {
        $("#SerieDocumental").typeahead({
            onSelect: function (item) {
                $("#IdSerieDocumental").val(item.value);
            },
            ajax: {
                url: '/ModeloDocumento/RetornaSerieDocumental',
                triggerLength: 4,
                dataType: "json",
                displayField: "DescricaoSerie",
                valueField: "IdSerieDocumental",
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    if (data.lista.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                        return false;
                    }

                    pesquisarGrupoDocumento(data.lista[0].IdGrupoDocumento);;

                    return data.lista;
                }
            }
        });
    }

    function pesquisarGrupoDocumento(idGrupo) {
        $.ajax({
            url: '/EmitirExpediente/ObterGrupoDocumento',
            type: 'POST',
            data: { id: idGrupo },
            cache: false,
            success: function (response, status, xhr) {
                $('#NomeGrupoDocumento').val(response.Sigla);
                montarIdentificacaoDocumento($('#NomeGrupoDocumento').val());

                return false;
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    function montarIdentificacaoDocumento(tipo) {
        $('.documento-tipo').text(tipo);
    }

    function bindEditorHeader() {

        var fontsizes = {
            "Small": "2px",
            "Normal": "4px",
            "Medium": "6px",
            "Large": "8px",
            "Huge": "10px"
        };

        $('textarea[name="ContentHeader"]').Editor({
            "insert_table": false,
            "fonts": false,
            "styles": false,
            "font_size": fontsizes,
            "color": false,
            "ol": false,
            "ul": false,
            "indent": false,
            "outdent": false,
            "insert_img": false,
            "insert_link": false,
            "unlink": false,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": true,
            "splchars": false,
            "block_quote": false,
            "source": false
        });

        $('textarea[name="ContentHeader"]').closest('div').find('.Editor-editor').off('keyup');
        $('textarea[name="ContentHeader"]').closest('div').find('.Editor-editor').on('keyup', function (event) {
            if (event.keyCode === 220) {
                var valor = $(event.target).html();
                $(event.target).html(obterParametro(valor, 'ContentHeader'));
                $('textarea[name="ContentHeader"]').html($(this).html());
            }
        });

        $('textarea[name="ContentHeader"]').closest('div').find('.Editor-editor').off('blur');
        $('textarea[name="ContentHeader"]').closest('div').find('.Editor-editor').on('blur', function () {
            $('textarea[name="ContentHeader"]').html($(this).html());
        });
    }

    function bindEditorSubHeader() {

        var fontsizes = {
            "Small": "2px",
            "Normal": "4px",
            "Medium": "6px",
            "Large": "8px",
            "Huge": "10px"
        };

        $('textarea[name="ContentSubHeader"]').Editor({
            "insert_table": false,
            "fonts": false,
            "styles": false,
            "font_size": fontsizes,
            "color": false,
            "ol": false,
            "ul": false,
            "indent": false,
            "outdent": false,
            "insert_img": false,
            "insert_link": false,
            "unlink": false,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": true,
            "splchars": false,
            "block_quote": false,
            "source": false
        });

        $('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').off('keyup');
        $('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').on('keyup', function (event) {
            if (event.keyCode === 220) {
                var valor = $(event.target).html();
                $(event.target).html(obterParametro(valor, 'ContentSubHeader'));
                $('textarea[name="ContentSubHeader"]').html($(this).html());
            }
        });

        $('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').off('blur');
        $('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').on('blur', function () {
            $('textarea[name="ContentSubHeader"]').html($(this).html());
        });
    }

    function bindEditorBody() {
       
        var fontsizes = {
            "Small": "2px",
            "Normal": "4px",
            "Medium": "6px",
            "Large": "8px",
            "Huge": "10px"
        };

        $('textarea[name="ContentBody"]').Editor({
            "insert_table": false,
            "fonts": false,
            "styles": false,
            "font_size": fontsizes,
            "color": false,
            "ol": false,
            "ul": false,
            "indent": false,
            "outdent": false,
            "insert_img": false,
            "insert_link": false,
            "unlink": false,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": true,
            "splchars": false,
            "block_quote": false,
            "source": false
        });

        $('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').off('keyup');
        $('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').on('keyup', function (event) {
            if (event.keyCode === 220) {
                var valor = $(event.target).html();
                $(event.target).html(obterParametro(valor, 'ContentBody'));
                $('textarea[name="ContentBody"]').html($(this).html());
            }
        });

        $('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').off('blur');
        $('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').on('blur', function () {
            $('textarea[name="ContentBody"]').html($(this).html());
        });
    }

    function bindEditorFooter() {
         
        var fontsizes = {
            "Small": "2px",
            "Normal": "4px",
            "Medium": "6px",
            "Large": "8px",
            "Huge": "10px"
        };

        $('textarea[name="ContentFooter"]').Editor({
            "insert_table": false,
            "fonts": false,
            "styles": false,
            "font_size": fontsizes,
            "color": false,
            "ol": false,
            "ul": false,
            "indent": false,
            "outdent": false,
            "insert_img": false,
            "insert_link": false,
            "unlink": false,
            "strikeout": false,
            "hr_line": false,
            "print": false,
            "select_all": false,
            "togglescreen": true,
            "splchars": false,
            "block_quote": false,
            "source": false
        });

        $('textarea[name="ContentFooter"]').closest('div').find('.Editor-editor').off('keyup');
        $('textarea[name="ContentFooter"]').closest('div').find('.Editor-editor').on('keyup', function (event) {
            if (event.keyCode === 220) {
                var valor = $(event.target).html();
                $(event.target).html(obterParametro(valor, 'ContentFooter'));
                $('textarea[name="ContentFooter"]').html($(this).html());
            }
        });

        $('textarea[name="ContentFooter"]').closest('div').find('.Editor-editor').off('blur');
        $('textarea[name="ContentFooter"]').closest('div').find('.Editor-editor').on('blur', function () {
            $('textarea[name="ContentFooter"]').html($(this).html());
        });
    }

    function obterParametro(valor, contexto) {
        var _oldValue = valor.removerChaves();
        var _newValue = valor.removerChaves().replace(/\s/g, '').replace('&nbsp;', '');

        var tagAbertura = "<label class='editavel controle-elemento' data-tipo='texto' data-contexto='" + contexto + "'>"
        var tagFechamento = "</label><label>&nbsp;</label>";
        var resultado = valor.replace('{', tagAbertura).replace('}', tagFechamento);

        console.log(String(resultado).replace(_oldValue, _newValue));

        return String(resultado).replace(_oldValue, _newValue);
    }

    function bindParametros(contexto) {
        $('#modaleditavel').off('click', '#btn-confirmar');
        $('#modaleditavel').on('click', '#btn-confirmar', function () {
            var identificar = $('#identificarParametro').val();
            var elemento = $('textarea').closest('div').find('.Editor-editor').find(".editavel:contains('" + identificar + "')")
            var tipo = $('#modaleditavel #TipoParametro').val();

            $(elemento).attr("data-tipo", tipo);
            $(elemento).text($('#modaleditavel #NomeDocumento').val().replace(/\s/g, ''));

            $('textarea[name="ContentHeader"]').html($('textarea[name="ContentHeader"]').closest('div').find('.Editor-editor').html());
            $('textarea[name="ContentSubHeader"]').html($('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').html());
            $('textarea[name="ContentBody"]').html($('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').html());
            $('textarea[name="ContentFooter"]').html($('textarea[name="ContentFooter"]').closest('div').find('.Editor-editor').html());

            BASE.Mensagem.Mostrar('Parâmetro atualizado com sucesso!', TipoMensagem.Sucesso);
            $('#modaleditavel').modal('hide');
        });
    }

    function bindModeloHeader() {
        $('#form-detalhe').off('change', 'input[name=cbc]');
        $('#form-detalhe').on('change', 'input[name=cbc]', function () {
            obterHtmlHeader($(this).val());
            return false;
        });
    }

    function bindModalParametros() {
        $('#form-detalhe').off('click', '.editavel');
        $('#form-detalhe').on('click', '.editavel', function () {
            var tipo = $(this).attr('data-tipo');
            var contexto = $(this).attr('data-contexto');
            var nome = $(this).text();

            $('#modaleditavel').modal();
            $('#modaleditavel .modal-title').html('Parametro Modelo Documento').css('text-transform', 'capitalize');

            $('#modaleditavel #identificarParametro').val(nome);
            $('#modaleditavel #NomeDocumento').val(nome);
            $('#modaleditavel #TipoParametro').val(tipo);

            bindParametros(contexto);
        });
    }

    function bindData() {
        $('#DataInicioVigencia').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        $('#DataFinalVigencia').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        $("#DataInicioVigencia").datetimepicker('update', new Date());
        $("#DataFinalVigencia").datetimepicker('update', new Date());
    }

    function bindMascara() {
        $('#DataInicioVigencia').mask('00/00/0000');
        $('#DataFinalVigencia').mask('00/00/0000');
    }

    function obterHtmlHeader(tipo) {
        var cbc1 = '<table id="TableHeader" data-tipo="1" width="100%" style="font-family: arial, helvetica, Verdana;"> <tr> <td> <img src="/Assets/Img/logo-governo-sp.png" width="120"/></div></td><td style="text-align: center;"> <h3 style="font-weight:bold;">SECRETARIA DA JUSTIÇA E DEFESA DA CIDADANIA</h3> <p style="font-size:17px;font-weight:bold;">FUNDAÇÃO DE PROTEÇÃO E DEFESA DO CONSUMIDOR</p> </td><td> <img src="/Assets/Img/logo_procon.png" width="120"/></div></td></tr></table>'
        var cbc2 = '<table id="TableHeader" data-tipo="1" width="100%" style="font-family: arial, helvetica, Verdana;"> <tr> <td> <img src="/Assets/Img/logo_procon.png" width="120"/></div></td><td style="text-align: center;"> <h3 style="font-weight:bold;">SECRETARIA DA JUSTIÇA E DEFESA DA CIDADANIA</h3> <p style="font-size:17px;font-weight:bold;">FUNDAÇÃO DE PROTEÇÃO E DEFESA DO CONSUMIDOR</p>  </td></tr></table>'
        var cbc3 = '<table id="TableHeader" data-tipo="1" width="100%" style="font-family: arial, helvetica, Verdana;"> <tr> <td style="text-align: center;"> <h3 style="font-weight:bold;">SECRETARIA DA JUSTIÇA E DEFESA DA CIDADANIA</h3> <p style="font-size:17px;font-weight:bold;">FUNDAÇÃO DE PROTEÇÃO E DEFESA DO CONSUMIDOR</p> </p></td></tr></table>'

        switch (parseInt(tipo)) {
            case _tipoHeaderEditor.SP_PROCON:
                $("textarea[name='ContentHeader']").Editor("setText", cbc1);
                $("textarea[name='ContentHeader']").html(cbc1);
                break;
            case _tipoHeaderEditor.PROCON:
                $("textarea[name='ContentHeader']").Editor("setText", cbc2);
                $("textarea[name='ContentHeader']").html(cbc2);
                break;
            default:
                $("textarea[name='ContentHeader']").Editor("setText", cbc3);
                $("textarea[name='ContentHeader']").html(cbc3);
        }
    }

    function carregarSubHeader() {
        var subHeader = $('.sub-header-modelo').html();
        $('.sub-header-modelo').remove();
        $('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').html(subHeader);
        $('#ContentSubHeader').html(subHeader);
    }

    function limpar() {
        var form = $("#form-detalhe");
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

        $('#cbc1').click();
        obterHtmlHeader(_tipoHeaderEditor.SP_PROCON);
        $('textarea[name="ContentHeader"]').html($('textarea[name="ContentHeader"]').closest('div').find('.Editor-editor').html());

        $('textarea[name="ContentSubHeader"]').closest('div').find('.Editor-editor').html('')
        $('textarea[name="ContentSubHeader"]').val('');

        $('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').html('')
        $('textarea[name="ContentBody"]').val('');

        $('textarea[name="ContentFooter"]').closest('div').find('.Editor-editor').html('')
        $('textarea[name="ContentFooter"]').val('');
    }

    function bindBtnCancelar() {
        $(".btn-cancelar").off('click');
        $(".btn-cancelar").on('click', function () {
            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
                'small',
                'Sim',
                'btn-primary',
                'Não',
                'btn-danger',
                null,
                function () {
                    $('#modaleditavel').modal('hide');
                    window.location.href = '/ModeloDocumento';
                });
        });
    }

    function bindBtnCancelarParametro() {
        $("#modaleditavel .btn-cancelar").off('click');
        $("#modaleditavel .btn-cancelar").on('click', function () {
            BASE.Modal.ExibirModalConfirmacao(
                'Cancelar Operação', 'Deseja mesmo cancelar a operação?',
                'small',
                'Sim',
                'btn-primary',
                'Não',
                'btn-danger',
                null,
                function () {
                    window.location = '/ModeloDocumento';
                });
        });
    }

    String.prototype.width = function (font) {
        var f = font || '12px arial',
            o = $('<div>' + this + '</div>')
                  .css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f })
                  .appendTo($('body')),
            w = o.width();

        o.remove();

        return w;
    }

    String.prototype.inverter = String.prototype.f = function () {
        var s = this
        return s.split('').reverse().join('');
    };

    String.prototype.removerChaves = String.prototype.f = function () {
        var s = this
        return s.replace('{', '').replace('}', '').replace('</label>', '');
    };

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    MODELODOCUMENTO.Init();
})







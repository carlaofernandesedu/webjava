var DOCUMENTOSIMPLES = (function () {
    var _tipoHeaderEditor = {
        SP_PROCON: 1,
        PROCON: 2,
        TEXTO: 3
    };

    function init() {
        bindAll();
    }

    function bindAll() {
        bindFiltro();
        carregarModeloDocumentoPorUA();
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

        objeto.ContentBody = $('textarea[name="ContentBody"]').closest('div').find('.Editor-editor').html();
        objeto.ContentFooter = $('#ContentFooter').html();
        objeto.ContentHeader = $('#ContentHeader').html();
        objeto.ContentSubHeader = $('#ContentSubHeader').html() + "<div style='text-align:center'>" + $('#NomeDocumento').html() + "</div>";       
        objeto.Interessado = $('input[type=text][id=Interessado]').val();
        objeto.Solicitante = $('input[type=text][id=Solicitante]').val();
        objeto.Assunto = $('input[type=text][id=Assunto]').val();
        objeto.IdModeloDocumento = $('#IdModeloDocumento').val();  
        objeto.NomeDocumento = $('#NomeDocumento').val();
        objeto.Opcao = $('#Opcao').val();

        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: objeto,
            success: function (response) {
                if (response.Sucesso === false) {
                    BASE.Mensagem.Mostrar(response.Mensagem, TipoMensagem.Error);
                }
                else if (response.Sucesso === true) {
                    if (criar === true) {
                        if (response.Resultado !== '' && response.Resultado !== null && response.Resultado !== undefined) {
                            if (response.Resultado.Codigo > 0)
                                window.open('/EmitirExpediente/ObterPDF?id=' + response.Resultado.Codigo, '_blank');
                        }

                        BASE.Mensagem.Mostrar('Registro incluido com sucesso!', TipoMensagem.Sucesso);
                        window.location = '/ModeloDocumento';
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

    function bindFiltro() {
        $('#btnFiltroAvancado').click();
        $('#btnFiltroAvancado').hide();
    }

    function carregarModeloDocumentoPorUA() {
        CONTROLES.DropDown.Preencher('#IdModeloDocumento', 'ModeloDocumento', 'ObterModeloDocumento', null, true, false, false, null);
        carregarConteudoModeloDocumento();
    }

    function bindTypeHeader() {
        var tipo = $('#TableHeader').data('tipo');

        var type = 1;

        if(tipo != null && tipo != undefined){
            type = parseInt($('#TableHeader').data('tipo'));

        }      
               
        $("#Opcao").val(type);
    }

    function carregarSubHeader() {
        var subHeader = $('.sub-header-modelo').html();        

        $('.sub-header-modelo').remove();
        $('.sub-header-expediente').append(subHeader);      

        var grupo = $('#NomeGrupoDocumento').val();
        var sigla = $('#SiglaUA').val();
        var numero = 'XXXX';
        var ano = $('#Ano').val();
        var data = $('#DataExtenso').val();
        var unidade_administrativa = $('#NomeUA').val();
        var serie_documental = $('#SerieDocumental').val();
        var numero_protocolo = 'XXXXXX/' + ano;

        $('label[data-tipo="identificacao"]').text(grupo + '/' + sigla + '/' + numero + '/' + ano)
        $('label[data-tipo=dataExtenso]').html(data)
        $('label[data-tipo=ua_usuario]').html(unidade_administrativa);
        $('label[data-tipo=serie_documental]').html(serie_documental);
        $('label[data-tipo=numero_protocolo]').html(numero_protocolo);


        $('input').on('change', function () {           

            switch($(this).prop('name'))
            {
                case "Solicitante":
                    $('.elemento-solicitante').text($(this).val());
                    break;

                case "Interessado":
                    $('.elemento-interessado').text($(this).val());
                    break;

                case "Assunto":
                    $('.elemento-assunto').text($(this).val());
                    break;


            }

        });

    }

    function carregarParametrosDinamicos(contexto) {
        var elementos = $('.controle-elemento')

        $.each(elementos, function (key, elemento) {
           
            $(elemento).removeClass('elemento-texto');
            $(elemento).removeClass('elemento-data');
            $(elemento).removeClass('elemento-dataExtenso');
            $(elemento).removeClass('elemento-identificacao');
            $(elemento).removeClass('elemento-usuario');

            var id = $(elemento).text().removerChaves();

            var controle = '#' + id;

            if (id != '' && id != null && id != undefined) {
                var contexto = $(elemento).attr('data-contexto');

                $(elemento).addClass('elemento-' + id);
                $(elemento).attr('id', id);

                $(".painel-parametros-dinamicos").append(obterTemplate(id, $(elemento).attr('data-tipo'), contexto));

                $('#form-detalhe').off('change', controle);
                $('#form-detalhe').on('change', controle, function () {
                    var _inputForm = this;
                    if (_inputForm.value !== '' && _inputForm.value !== undefined) {
                        $('.elemento-' + _inputForm.id).text(_inputForm.value);
                    }
                });
            }
        });
    }

    function input_update_size() {
        var value = $(this).val();
        var size = 12;

        if (this.currentStyle)
            size = this.currentStyle['font-size'];
        else if (window.getComputedStyle)
            size = document.defaultView.getComputedStyle(this, null).getPropertyValue('font-size');
        $(this).stop().animate({ width: (parseInt(size) / 2 + 1) * value.length + 20 }, 500);
    }

    function carregarConteudoModeloDocumento() {
        $('.frm-filtro').off('change', '#IdModeloDocumento');
        $('.frm-filtro').on('change', '#IdModeloDocumento', function () {
            //CRUDFILTRO.Filtrar();
            //CRUDFILTRO.Evento.PosListar = posListar;
            //CRUDBASE.UrlPDF = 'EmitirExpediente/'

            var idModeloDocumento = $('#IdModeloDocumento').val();

            if (idModeloDocumento == "" || idModeloDocumento == null){
                $('#ContentHeader').empty();
                $('#ContentSubHeader').empty();
                $('#ContentBody').empty();
                $('#ContentFooter').empty(); 

                $(' .painel-parametros-dinamicos').empty();                     

                return false;
            }
            
            $.ajax({
                url: "/EmitirExpediente/ObterModelo",
                type: "POST",
                data: { idModeloDocumento: idModeloDocumento },                
                success: function (data, text, xhr) {                   
                             
                    posListar(data);


                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log("erro", jqXhr);
                }
            });
            
        });
    }

    function posListar(data) {

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

        $('#ContentHeader').empty();

        $('#ContentHeader').html(data.ContentHeader);
        
        $('#NomeDocumento').html(data.NomeDocumento);

        if(data.ContentBody != null && $.parseHTML(data.ContentBody).length >0){
            $(' .Editor-editor').html($($.parseHTML(data.ContentBody)[0]).prop('innerHTML'));
        }

        if(data.ContentFooter != null && $.parseHTML(data.ContentFooter).length >0){
            $('#ContentFooter').html($($.parseHTML(data.ContentFooter)[0]).prop('innerHTML'));
        }

        $('#IdModeloDocumento').val(data.IdModeloDocumento);
        $('#DataExtenso').val(data.DataExtenso);
        $('#NomeUsuarioLogado').val(data.NomeUsuarioLogado);
        $('#NomeGrupoDocumento').val(data.NomeGrupoDocumento);
        $('#SiglaUA').val(data.SiglaUA);
        $('#Ano').val(data.Ano);
        $('#Opcao').val(data.Opcao);
        $('#NomeUA').val(data.NomeUA);
        $('#Assunto').val(data.Assunto);
        $('#Solicitante').val(data.Solicitante);
        $('#Interessado').val(data.Interessado);
        $('#SerieDocumental').val(data.SerieDocumental);
        $('#NomeDocumento').val(data.NomeDocumento);     
      
        carregarParametrosDinamicos('ContentHeader');

        carregarParametrosDinamicos('ContentBody');

        carregarParametrosDinamicos('ContentFooter');

        bindTypeHeader();

        carregarSubHeader();
        
        bindSalvar();

        $('.data').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        CRUDBASE.Init();
    }

    function obterTemplate(nome, tipo, contexto) {
        var countElement = parseInt($(".painel-parametros-dinamicos [name='" + nome + "']").length);
        var temp = '';

        var grupo = $('#NomeGrupoDocumento').val();
        var sigla = $('#SiglaUA').val();
        var numero = 'XXXX';
        var ano = $('#Ano').val();
        var data = $('#DataExtenso').val();
        var unidade_administrativa = $('#NomeUA').val();
        var serie_documental = $('#SerieDocumental').val();
        var numero_protocolo = 'XXXXXX/' + ano;        

        if (countElement === 0 && nome.removerChaves() != '' && nome.removerChaves() != undefined) {
            temp;
            nome = nome.removerChaves();

            switch(tipo)
            {
                case 'texto':                
                temp = "<div class='col-md-6'>" + nome + "<input data-contexto='" + contexto + "' class='form-control' id='" + nome + "' name='" + nome + "' type='text' value=''></div>";
                break;

                case "data":               
                temp = "<div class='col-md-2'>" + nome + "<input data-contexto='" + contexto + "' class='form-control data' id='" + nome + "' name='" + nome + "' type='text' value=''></div>";
                break;

                case "usuario":
                var usuario = $("#NomeUsuarioLogado").val();
                temp = "<div class='col-md-6'>" + nome + "<input disabled='disabled' data-contexto='" + contexto + "' class='form-control' id='" + nome + "' name='" + nome + "' type='text' value='" + usuario + "'></div>";
                $('.elemento-' + nome).text(usuario);
                break;

                case "solicitante":
                var solicitante = $('#Solicitante').val();
                $('.elemento-' + nome).text(solicitante);
                break;

                case "interessado":
                var interessado = $('#Interessado').val();
                $('.elemento-' + nome).text(interessado);
                break;

                case "assunto":
                var assunto = $('#Assunto').val();
                $('.elemento-' + nome).text(assunto);
                break;

                case "ua_usuario":
                var unidade_administrativa = $('#NomeUA').val();
                $('.elemento-' + nome).text(unidade_administrativa);
                break;

                case "numero_protocolo":
                $('.elemento-' + nome).text(numero_protocolo);

                break;


            }
         
        }

        return temp;
    }

    String.prototype.removerChaves = String.prototype.f = function () {
        var s = this
        return s.replace('{', '').replace('}', '').replace('/', '_');
    };

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    DOCUMENTOSIMPLES.Init();
}); 



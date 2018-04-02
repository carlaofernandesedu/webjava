AUTOINFRACAO = (function () {

    var tbAutoInfracao = "tbAutoInfracao_S456FH734FH";

    function init() {
        $('#divLocalFiscalizadoRaf').hide();

        bindAll();

        AUTOSASSOCIADOS.Init();
    }

    function bindAll() {
        formatarMascara();        
        bindHideInfracao();
        bindHideInfracoes();
        bindHideComplementos();
        bindHideBotoesComplemento();
        bindCarregarComponentesConduta();
        bindFocusNoLink();
        bindIncluirInfracao();
        bindCacelarInfracaoClick();
        bindAutoComplete();
        binHideItens();
        bindEditarItemApreendidoNotif();
        bindModalIncluirItemCancelar();
        bindModalIncluirItemConfirmar();
        bindModalIncluirItemEditar();
        bindCampoComplementoRemoveClass();
        bindComplementoClick();       
        MENUAUTO.BindControlesTela();
        bindHideDadosConduta();

        CarregarItens();
        AUTOSASSOCIADOS.CarregaAutosAssociados();

        if (MENUAUTO.InfracaoTotal() == 0) {
            $('input[name="Nome"]').removeAttr("disabled");
        } else {
            $('input[name="Nome"]').attr("disabled", "disabled");
        }

        $('input[type="radio"], input[type="checkbox"], input[type="text"], input[type="checkbox"], select').on('change', function () {
            FISCALIZACAOOPERACIONAL.Deschecar('.vertical_nav #tipoAutuacao');
        });

    }

    /*-------- AUTO DE INFRAÇÃO -----------*/
    function bindHideDadosConduta() {      
       $('#dadosConduta').hide();       
       $('#campoComplemento').hide();
    }

    function bindHideComplementos() {
        $('#campoComplementotxt1, #campoComplementotxt2').hide();
    }

    function bindHideBotoesComplemento() {
        $('.botoesComplemento .btn-primary').hide();
    }

    function bindHideInfracao() {
        $('#infracoes').hide();
    }

    function bindHideInfracoes() {
        $(document).on('click', '#excluirInfracao', function () {

            var index = $(this).parent("div").data().excluirLocalstorage;
            
            MENUAUTO.ExcluirInfracao(index, false);
            var infracaoExcluida = $(this).parent().detach();

            if (MENUAUTO.InfracaoTotal() == 0) {
                $('input[name="Nome"]').removeAttr("disabled");
            } else {
                $('input[name="Nome"]').attr("disabled","disabled");
            }        

            CarregarItens();

        });
    }

    var CarregarItens = function() {
        var items = MENUAUTO.CarregaItens();
        $("#infracoes .row .col-md-12").html('');
        for (var i = 0; i < items.length; i++) {
            if (items[i].tipo == 2) {
                var conteudo = "<div class='input-group infracaoCadastrada form-group' data-excluir-localStorage='" + items[i].codigo + "'><div class='form-control custom-control jumbotron'><h4>Descrição</h4>" + items[i].descricao + "<br /><h4>Enquadramento</h4>" + items[i].enquadramento + "</div><span id='excluirInfracao' class='input-group-addon btn btn-danger'><i class='fa fa-trash'></i></span></div>";
                $("#infracoes .row .col-md-12").append(conteudo);
            }
            if (items[i].tipo == 1) {
                $('#itensApreensaoNotif').show();
                $('#itensApreensaoNotif table').show();
            }
        }
        $("#infracoes").css({ display: (items.length > 0 ? 'block' : 'none') });
    };

    function bindFocusNoLink() {
        $('#campoComplemento textarea').focusin(function () {              
            $('.textoComplemento.txt2').removeClass('bg-success');
            $('.textoComplemento.txt1').addClass('bg-success');
        });
    }

    function bindCampoComplementoRemoveClass() {
        $('#campoComplementotxt1 textarea').focusout(function () {
            $('.jumbotron .txt1').removeClass('text-primary boldFont');
        });
    }

    function bindComplementoClick() {
        $('.textoComplemento').off('click');
        $('.textoComplemento').click(function () {

            $('#campoComplemento').show();
            $('#campoComplemento textarea').focus();
            $('#campoComplemento textarea').attr('data-valor', $(this).text());
            $('#campoComplemento textarea').attr('data-reset', $(this).attr("data-valor-inicial"));


            var indices = $('#div-exemplo-conduta').children();
            var indiceExemplo = $('#div-exemplo-conduta').children().eq($('#campoComplemento textarea').attr('data-reset'));
            $(indices).removeClass('text-primary boldFont');
            $(indiceExemplo).addClass('text-primary boldFont');

            $('.textoComplemento').removeClass('bg-success');
            $(this).attr("data-valor-inicial", $('#campoComplemento textarea').attr('data-reset')).addClass('bg-success');

            if ($(this).text() == '{' + $(this).attr("data-valor-inicial") + '}') {
                $('#campoComplemento textarea').val('');
            }
            else {
                $('#campoComplemento textarea').val($(this).text());
            }

            //button substituir texto do parametro selecionado.
            $('.input-group-addon').off('click');
            $('.input-group-addon').click(function () {
                $('.textoComplemento').removeClass('bg-success');
                $('#div-exemplo-conduta').children().removeClass('text-primary boldFont');

                var conteudo = $("#autoNotificacao").find("#div-contudo-conduta-parametros").html();
                var parametro = $("#campoComplemento textarea").attr("data-valor");
                var conteudoRedefinido = $('#campoComplemento textarea').val();

                if ($('#campoComplemento textarea').val() == "") {
                    conteudoRedefinido = "{" + $("#campoComplemento textarea").attr("data-reset") + "}";
                    $('#campoComplemento').hide();
                }
                else {
                    $('#campoComplemento textarea').val('');
                    $('#campoComplemento').hide();
                }

                conteudo = conteudo.replace(parametro, conteudoRedefinido);

                $("#autoNotificacao").find("#div-contudo-conduta-parametros").text("");
                $("#autoNotificacao").find("#div-contudo-conduta-parametros").append(conteudo);

                bindComplementoClick();
                validarAdicionarItens();

            });

            if ($('#campoComplemento').is(":visible")) {
                $('.botoesComplemento .btn-primary').hide();
            }
        });
    }

    function validarAdicionarItens() {

        var conteudo = $("#autoNotificacao").find("#div-contudo-conduta-parametros").html();
        var rex = /\{([0-9]+?)}/g;
        var matches = conteudo.match(rex);
        var retorno = new Array();

        if (matches != null) {
            for (var i = 0; i < matches.length; i++) {
                retorno.push(matches[i])
            }
        }

        if (retorno.length === 0) {
            $('#incluirInfracao').show();
        }
    }

    function bindIncluirInfracao() {
        $('#incluirInfracao').off('click');
        $('#incluirInfracao').click(function ()
        {
            var condutaID = $('#CondutaID').val();

            MENUAUTO.AdicionarInfracao($('#div-contudo-conduta-parametros').text(), $("#autoNotificacao #div-conduta-enquadramento p").text(), condutaID);

            //var conteudo = "<div class='input-group infracaoCadastrada form-group' data-excluir-localStorage='" + index + "'><div class='form-control custom-control jumbotron'>" + texto + "</div><span id='excluirInfracao' class='input-group-addon btn btn-danger'><i class='fa fa-trash'></i></span></div>";
            //$("#infracoes .row .col-md-12").append(conteudo);

            CarregarItens();

            $('input[name="Nome"]').attr("disabled", "disabled");

            $("#dadosConduta").hide();
            $(this).hide();
           
        });
    }

    function bindCacelarInfracaoClick() {
        $('#cancelarInfracao').off('click');
        $('#cancelarInfracao').click(function () {
            $('#dadosConduta').hide();
        });
    }

    function bindListarGridConduta(idGrupo) {
        $.ajax({
            url: '/AutoFiscalizacao/ListarConduta',
            type: "GET",
            data: { grupo: idGrupo, lei: parseInt($("#checkLei:checked").val()) },
            success: function (data) {
                if (data != null && data != undefined) {
                    $("#modalTabelaCondutas").find("#ModaldadosConduta").html(data);
                    $("#modalTabelaCondutas").find("#ModaldadosConduta").show();
                    bindCompontentes();
                }
            },
            error: function (data) {
            }
        });
        return  false;
    }

    function bindCompontentes() {
        if ($('#Descricao option').size() === 0)
            CONTROLES.DropDown.Preencher('#Descricao', 'AutoFiscalizacao', 'SelectListGrupoConduta', null, true);

        //tabela conduta do modal.
        $('#tb_conduta').dataTable({

            "aoColumnDefs": [
                { "bSortable": false, "aTargets": ["no-sort"] },
                { "word-wrap": "break-word", "aTargets": ["col-wrap"] }
            ],
            "order": [[0, "asc"]],
            responsive: true,
            "bDestroy": true,            
        });

        //recebe o codigo da linha clicada na linha do grid da modal.
        $("body").off('click');
        $("body").on("click", "#tb_conduta tr", function () {
 			//codigo
            $("#autoNotificacao").find("#filtroCodigoConduta").val("");

            $('#CondutaID').val($(this).find('#Codigo').val());

            //titulo
            $("#autoNotificacao").find("#div-titulo-conduta").html("<strong>" + $(this).find("td")[0].innerText + "-" + $(this).find("td")[1].innerText + "</strong>");

            //exemplo
            $("#autoNotificacao").find("#div-exemplo-conduta").text($(this).find("td")[7].innerText);

            $("#modalTabelaCondutas").modal("hide");           

            montarParametros($(this).find("td")[6].innerText, $(this).find("td")[7].innerText, $(this).closest('tr').data('enquadramento'));

            if (!$('.textoComplemento').length) {
                $('#incluirInfracao').show();
            }

            $("#dadosConduta").show();
        });

        //adiciona o evento change na seleção do contrle e altera os registros do grid da modal.
        $("#Descricao").off('change');
        $("#Descricao").on('change', function () {
            var grupo = $(this).val();
            if (grupo == "" || grupo == undefined || grupo == null) {
                grupo = 0;

            }
            bindListarGridConduta(grupo, parseInt($("#checkLei:checked").val()));

        });

        $(".radio-lei").off('change');
        $(".radio-lei").on('change', function () {
            bindCarregarComponentesConduta();
            CONTROLES.DropDown.Preencher('#Descricao', 'AutoFiscalizacao', 'SelectListGrupoConduta', null, true);
        });
    }

    function bindCarregarComponentesConduta() {
        var numeroLei = parseInt($("#checkLei:checked").val()),
               definicaoSerie = "I";

        if (numeroLei === 1)
            definicaoSerie = "K"

        $("#Serie").val(definicaoSerie);
        bindListarGridConduta(0, numeroLei);
        bindCompontentes();
    }

    function montarParametros(conteudo, exemplo, enquadramento) {

        //conteudo        
        var retornoConteudo = retornarArrayParametros(conteudo);
        var retornoExemplo = retornarArrayParametros(exemplo);

        if (retornoConteudo != null) {
            for (var i = 0; i < retornoConteudo.length; i++) {
                var substituirParametroConteudo = "<span class='bg-primary textoComplemento' data-valor-inicial='" + retirarChavesParametros(retornoConteudo[i]) + "'>" + retornoConteudo[i] + "</span>";
                var parametroConteudo = retornoConteudo[i];
                conteudo = conteudo.replace(parametroConteudo, substituirParametroConteudo);
            }
        }

        $("#autoNotificacao").find("#div-contudo-conduta-parametros").text("");
        $("#autoNotificacao").find("#div-contudo-conduta-parametros").append(conteudo);
        //conteudo     

        $("#autoNotificacao").find("#div-conduta-enquadramento p").text(enquadramento);

        //jumbotron      
        if (retornoExemplo != null) {
            for (var i = 0; i < retornoExemplo.length; i++) {
                var substituirParametroExemplo = "<span>" + retornoExemplo[i] + "</span>";
                var parametroExemplo = retornoExemplo[i];
                exemplo = exemplo.replace(parametroExemplo, substituirParametroExemplo);
            }
        }

        $("#autoNotificacao").find("#div-exemplo-conduta").text("");
        $("#autoNotificacao").find("#div-exemplo-conduta").append(exemplo);
        //jumbotron  

        bindComplementoClick();
    }

    function retirarChavesParametros(parametro) {
        return parametro.replace('{', '').replace('}', '');
    }

    function retornarArrayParametros(conteudo) {

        var str = conteudo
        var rex = /\{([^\n]+?)}/g;
        var matches = str.match(rex);
        var retorno = new Array();

        if (matches != null) {
            for (var i = 0; i < matches.length; i++) {
                retorno.push(matches[i])
            }
        }

        return retorno;
    }

    function bindAutoComplete() {
        $("#autoNotificacao").find("#filtroCodigoConduta").typeahead({
            onSelect: function (item) {

                $.ajax({
                    url: '/AutoFiscalizacao/ListarCondutaAutoComplete',
                    type: "GET",
                    data: { query: item.value },
                    cache: false,
                    success: function (item) {

                        if (item.lista.length === 0) {
                            BASE.MostrarMensagem('Ocorreu um erro ao tentar abrir a página solitada', TipoMensagem.Error);
                            return false;
                        }
                       
                        //codigo
                        $("#autoNotificacao").find("#filtroCodigoConduta").val("");
                        //titulo
                        $("#autoNotificacao").find("#div-titulo-conduta").html("<strong>" + item.lista[0].CodigoConduta + "-" + item.lista[0].Descricao + "</strong>");
                        //exemplo
                        $("#autoNotificacao").find("#div-exemplo-conduta").text(item.lista[0].Exemplo);

                        // enquadramento
                        $("#autoNotificacao").find("#div-conduta-enquadramento p").text(item.lista[0].Enquadramento);

                        $('#dadosConduta').show();
                        montarParametros(item.lista[0].DescricaoCompleta, item.lista[0].Exemplo);

                        if (!$('.textoComplemento').length) {
                            $('#incluirInfracao').show();
                        }

                    },
                    error: function (result) {
                        if (result === null || result === undefined) {
                            BASE.MostrarMensagem('Ocorreu um erro ao tentar abrir a página solitada', TipoMensagem.Error);
                            return false;
                        }
                        BASE.MostrarMensagem(result.Mensagem, TipoMensagem.Error);
                    }
                });               

            },
            ajax: {
                url: '/AutoFiscalizacao/ListarCondutaAutoComplete',
                triggerLength: 4,
                dataType: "json",
                displayField: "CodigoConduta",
                valueField: "CodigoConduta",
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    var listaSerie = [];
                    if (data.lista.length === 0) {
                        BASE.MostrarMensagem("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                        return false;
                    }
                    return data.lista;
                }
            }
        });
    }

    function formatarMascara() {
        formatarMascaras($('.tipo-documento-responsavel:checked').val());
        $('.tipo-documento-responsavel').change(function () {
            formatarMascaras($(this).val());
        });
    }

    function formatarMascaras(object) {
        $('#NumeroDocumentoResponsavelFornecedor').removeAttr('placeholder');
        $("#NumeroDocumentoResponsavelFornecedor").attr('maxlength', '14');

        if (object === "CPF") {           
            $("#NumeroDocumentoResponsavelFornecedor").mask('000.000.000-00', { placeholder: '___.___.___-__' });
        }
        else {           
            $("#NumeroDocumentoResponsavelFornecedor").unmask();

        }
    }
 
    function binHideItens() {
        $('#incluiApreensaoNotif').prop('checked', false);
        $('#itensApreensaoNotif').hide();
        $('#itensApreensaoNotif table').hide();
    }

    /*--- INCLUI / EDITA ITEM APREENSÃO ---*/
    function bindIncluirItemApreensaoNotif() {
        var incluirItemApreensaoNotif = function () {
            $('#modalIncluirItemApreendidoNotif').modal();
            $('#modalIncluirItemApreendidoNotif textarea').val('');
        }
    }
    function bindEditarItemApreendidoNotif() {
        var editarItemApreendidoNotif = function () {
            $('#modalEditarItemApreendidoNotif').modal()
        }
    }

    function bindModalIncluirItemCancelar() {
        $('#modalIncluirItemApreendidoNotif .btn-danger').click(function () {
            if ($('#modalIncluirItemApreendidoNotif input').val() == '') {
                $('#incluiApreensaoNotif').prop('checked', false);
            }
        });
    }

    function bindModalIncluirItemConfirmar() {
        $('#modalIncluirItemApreendidoNotif .btn-primary').click(function () {
            $('#itensApreensaoNotif table').show();
        });
    }

    function bindModalIncluirItemEditar() {
        $('#modalEditarItemApreendidoNotif .btn-primary').click(function () {
            $('#itensApreensaoNotif table').show();
        });
    }



    return {
        Init: init,
        TblLocalStorageItensAutoInfracao: tbAutoInfracao
    };


}());


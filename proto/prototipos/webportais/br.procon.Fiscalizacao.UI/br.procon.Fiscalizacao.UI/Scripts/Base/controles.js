var CONTROLES = (function () {
    function init() {
        bindButtoToRedirectTecnico();
        //bindButtoToRedirectPesquisar();
    }

    function bindButtoToRedirectTecnico() {
        $('a[href="/AtendimentoTecnico/AtendimentoSolicitacoes"]').off('click');
        $('a[href="/AtendimentoTecnico/AtendimentoSolicitacoes"]').on('click', function () {
            ATENDIMENTOBASE.Redirect.Limpar();
            ATENDIMENTOBASE.Redirect.Definir('/AtendimentoTecnico/AtendimentoSolicitacoes');
        });
    }

    function bindButtoToRedirectPesquisar() {
        $('a[href="/PesquisarAtendimento"]').off('click');
        $('a[href="/PesquisarAtendimento"]').on('click', function () {
            //ATENDIMENTOBASE.Redirect.Limpar();
            //ATENDIMENTOBASE.Redirect.Definir('/PesquisarAtendimento');
        });
    }

    function configurarSeletor(seletor) {
        var controles;

        if (seletor instanceof jQuery) {
            controles = seletor;
        }
        else {
            controles = $(seletor);
        }

        return controles;
    }

    var gerarOption = function (texto) {
        var newOption = $('<option>', {
            value: '',
            text: texto
        });

        return newOption;
    }

    var dropdownReset = function (controle) {
        $(controle).find('option').remove();
    }

    var dropdownInicializar = function (seletor, texto) {
        var controles = configurarSeletor(seletor);
        controles.each(function (index, element) {
            var $ddl = $(this);

            if (texto === undefined || texto === null) {
                texto = $ddl.data('ddlChainTextoInicial');
            }

            if ($ddl.is('select')) {
                $ddl.append(gerarOption(texto));
            }
        });
    }

    function dropDownOcultarCondicional(contexto, seletor, valorDeUso, seletorAlvoHabilitar, selectorAlvoDesabilitar) {
        $(contexto).off('change', seletor);
        $(contexto).on('change', seletor, function () {
            var valor = $(this).val();
            var alvoHabilitar = $(seletorAlvoHabilitar);
            var alvoDesabilitar = $(selectorAlvoDesabilitar);

            if (valor === valorDeUso) {
                dropDownHabilitar(alvoHabilitar)
                dropDownDesabilitar(alvoDesabilitar, false, 'Não disponível');
                alvoDesabilitar.val("");
            }
            else {
                dropDownHabilitar(alvoDesabilitar)
                dropDownDesabilitar(alvoHabilitar, false, 'Não disponível');
                alvoHabilitar.val("");
            }
        });
    }

    var eventoDdlMouseDown = 'mousedown.temporario';
    var eventoClick = 'click.ddl';
    function dropDownHabilitar(seletor) {
        var controles = configurarSeletor(seletor);

        controles.prop('readonly', false);
        controles.css('background-color', '#fff');
        controles.off(eventoDdlMouseDown);
        controles.off(eventoClick);
    }

    function dropDownDesabilitar(seletor, esvaziar, texto) {
        console.log('dropDownDesabilitar ' + seletor);
        var controles = configurarSeletor(seletor);

        controles.each(function (index, element) {
            var $ddl = $(this);
            $ddl.prop('readonly', true);
            console.log('desabilitando ' + $ddl.attr('id'));

            $ddl.css('background-color', '#eee');

            if (esvaziar === true) {
                $ddl.empty();
                dropdownInicializar($ddl, texto);
            }
        });

        controles.on(eventoClick, function (e) {
            e.preventDefault();
            this.blur();
            window.focus();
        });
    }

    function radioDesabilitar(seletor) {
        var controles = configurarSeletor(seletor);

        controles.each(function (index, element) {
            var $ddl = $(this);
            $ddl.prop('readonly', true);

            $ddl.css('background-color', '#eee');
        });

        controles.click(false);
    }

    function desabilitarChain(seletorContexto, seletorFilhos, callback) {
        $(seletorFilhos).each(function (index, element) {
            //BASE.Debug('desabilitando chain para ' + $(this).attr('id'));
            $(seletorContexto).off('change', $(this));
        });

        if (callback) {
            callback();
        }
    }

    function dropDownDefineChain(seletorContexto, seletorPai, seletorFilho, bloquear, textoInicial, changeCallback) {
        //BASE.Debug('habilitando chain para ' + $(seletorPai).attr('id'));
        var pai;
        var seletorFilhos = seletorContexto + ' ' + seletorFilho;
        var $filhos = $(seletorFilhos);

        if (seletorPai instanceof jQuery) {
            pai = seletorPai;
        }
        else {
            pai = $(seletorContexto + ' ' + seletorPai);
        }

        var idPai = pai.prop('id');

        if (bloquear === undefined || bloquear === null) {
            bloquear = true;
        }

        $filhos.addClass('ddl-chain-filho');
        $filhos.data('ddl-chain-texto-inicial', textoInicial);

        dropDownDesabilitar(seletorFilhos, true, textoInicial);

        if (changeCallback) {
            desabilitarChain(seletorContexto, seletorFilho);

            var idSelecionado = pai.val();

            if (idSelecionado !== undefined) {
                changeCallback(idSelecionado);
            }

            console.log('definindo chain ' + idPai + ' --> ' + seletorFilho);

            $(seletorContexto).off('change', '#' + idPai);
            $(seletorContexto).on('change', '#' + idPai, function () {
                idSelecionado = $(pai).val();

                $(seletorFilho).each(function (index, element) {
                    $(element).removeData('valorSelecionado');
                    $(element).removeAttr('data-valor-selecionado');
                });

                if (idSelecionado === undefined || (idSelecionado !== null && idSelecionado.length === 0)) {
                    dropDownDesabilitar(seletorFilhos, true, textoInicial);
                }
                else {
                    changeCallback(idSelecionado);
                }
            });
        }
    }

    var popularDropDown = function (lista, controles, criarItemDefault, bind, descricaoItemDefault, propriedadeValue, propriedadeText, propriedadeGroup) {
        var criarDefault = criarItemDefault;
        controles.each(function (index, element) {
            var $this = $(this);
            if ($this.is('select')) {
                var idSelecionado = $this.data("valorSelecionado");
                var options = '';

                if (propriedadeValue === undefined || propriedadeValue.length === 0)
                    propriedadeValue = "Value";
                if (propriedadeText === undefined || propriedadeText.length === 0)
                    propriedadeText = "Text";
                if (propriedadeGroup === undefined || propriedadeGroup.length === 0)
                    propriedadeGroup = "Group";

                var readOnly = $this.attr('readonly') !== undefined;
                var disabled = $this.attr('disabled') !== undefined;

                if (criarDefault && (readOnly == undefined || !readOnly)) {
                    if (descricaoItemDefault != '') {
                        options += '<option value="">' + descricaoItemDefault + '</option>';
                    }
                }

                for (var i = 0; i < lista.length; i++) {
                    var idElemento = lista[i][propriedadeValue];
                    var valor = lista[i][propriedadeValue];
                    var texto = lista[i][propriedadeText];
                    var group = lista[i][propriedadeGroup];
                    var optionDisabled = lista[i]['Disabled'];
                    var classe = '';
                    var propriedadesExtras = '';
                    var selecionado = lista[i].Selected;

                    if (group === null) {
                        classe = 'pai-opcao';
                    }
                    else {
                        classe = 'filho-opcao';
                    }

                    if (idSelecionado !== undefined) {
                        selecionado = idElemento == idSelecionado;
                    }

                    for (var property in lista[i]) {
                        if (property !== "Text" && property !== "Value" && property !== "Selected" && property !== "Disabled" && property !== "Group") {
                            propriedadesExtras += 'data-' + property + '="' + lista[i][property] + '"';
                        }
                    }
                    if (selecionado) {
                        options += '<option class="' + classe + '" value="' + valor + '" ' + propriedadesExtras + 'selected>' + texto + '</option>';
                        $this.data('valorSelecionado', idSelecionado);
                    }
                    else {
                        if (!readOnly) {
                            if (optionDisabled) {
                                options += '<option class="' + classe + '" value="' + valor + '"' + propriedadesExtras + ' disabled>' + texto + '</option>';
                            } else {
                                options += '<option class="' + classe + '" value="' + valor + '"' + propriedadesExtras + '>' + texto + '</option>';
                            }
                        }
                    }
                }
                $this.html(options).show();

                if (disabled) {
                    $this.removeAttr('disabled');
                }

                if (bind) {
                    bindDropDown($this);
                }
            }
        });
    };

    var dropdownPreencher = function (seletor, controller, action, idPai, textoVazio, bind, data, callback) {
        action = BASE.Util.MontarUrl(controller, action);
        var method = "post";
        var controles = configurarSeletor(seletor);
        if (controles.length > 0) {
            var removerUaUsuarioLogado = controles.data("remover-ua-usuario-logado");
            var idSelecionado = controles.data("valorSelecionado");

            var ajaxData = { idPai: idPai, idSelecionado: idSelecionado, removerUaUsuarioLogado: removerUaUsuarioLogado };

            if (data) {
                ajaxData = data;
            }

            dropdownReset(controles);
            dropdownInicializar(controles, 'carregando...');

            $.ajax({
                url: action,
                type: method,
                data: ajaxData,
                dataType: 'json',
                cache: false,
                success: function (result) {
                    if (result.Sucesso) {
                        controles.each(function (index, element) {
                            var $ddl = $(this);
                            //$ddl.empty();

                            var criarItemDefault = true;
                            if (textoVazio === true || textoVazio === undefined) {
                                criarItemDefault = true;
                                textoVazio = "Selecione";
                            }
                            else if (textoVazio === false) {
                                criarItemDefault = false;
                            }

                            if (result.Resultado.length === 0) {
                                dropDownDesabilitar($ddl, true, 'Nenhum item para selecionar');
                            }
                            else {
                                popularDropDown(result.Resultado, $ddl, criarItemDefault, bind, textoVazio);
                                dropDownHabilitar(seletor);
                            }
                        });

                        if (callback)
                            callback();
                    } else {
                        if (result != null && result.Mensagem.length > 0) {
                            if (result.Sucesso === false) {
                                BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                            }
                            else {
                                BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Info);
                            }
                        } else {
                            dropdownReset(controles);
                            dropDownDesabilitar(controles, true, 'Nenhum item para selecionar');
                        }
                    }
                },
                error: function (xhr, err) {
                    BASE.Mensagem.Mostrar("Erro ao carregar dropdown " + controller, TipoMensagem.Error);
                }
            });


        }
        else {
        }
    };

    var dropdownPreencherSimples = function (seletor, controller, action, textoVazio, callback) {
        action = BASE.Util.MontarUrl(controller, action);
        var controles = configurarSeletor(seletor);

        dropdownInicializar(controles, 'carregando...');

        $.ajax({
            url: action,
            type: 'post',
            cache: false,
            success: function (result) {
                if (result.Sucesso) {
                    controles.each(function (index, element) {
                        var $ddl = $(this);
                        $ddl.empty();

                        var criarItemDefault = true;
                        if (textoVazio === true || textoVazio === undefined) {
                            criarItemDefault = true;
                            textoVazio = "Selecione";
                        }
                        else if (textoVazio === false) {
                            criarItemDefault = false;
                        }

                        if (result.Resultado.length === 0) {
                            dropDownDesabilitar($ddl, true, 'Nenhum item para selecionar');
                        }
                        else {
                            popularDropDown(result.Resultado, $ddl, criarItemDefault, '', textoVazio);
                            dropDownHabilitar(seletor);
                        }
                    });

                    if (callback)
                        callback();
                } else {
                    if (result != null && result.Mensagem.length > 0) {
                        if (result.Sucesso === false) {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                        }
                        else {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Info);
                        }
                    }
                }
            },
            error: function (xhr, err) {
                console.log(xhr);
                console.log(err);
                BASE.Mensagem.Mostrar("Erro ao carregar dropdown " + controller, TipoMensagem.Error);
            }
        });
    };

    var dropdownPreencherPorId = function (seletor, controller, action, id, textoVazio, callback) {
        action = BASE.Util.MontarUrl(controller, action);
        var controles = configurarSeletor(seletor);

        dropdownInicializar(controles, 'carregando...');

        $.ajax({
            url: action,
            type: 'post',
            data: { id: id },
            cache: false,
            success: function (result) {
                if (result.Sucesso) {
                    controles.each(function (index, element) {
                        var $ddl = $(this);
                        $ddl.empty();

                        var criarItemDefault = true;
                        if (textoVazio === true || textoVazio === undefined) {
                            criarItemDefault = true;
                            textoVazio = "Selecione";
                        }
                        else if (textoVazio === false) {
                            criarItemDefault = false;
                        }

                        if (result.Resultado.length === 0) {
                            dropDownDesabilitar($ddl, true, 'Nenhum item para selecionar');
                        }
                        else {
                            popularDropDown(result.Resultado, $ddl, criarItemDefault, '', textoVazio);
                            dropDownHabilitar(seletor);
                        }
                    });

                    if (callback)
                        callback();
                } else {
                    if (result != null && result.Mensagem.length > 0) {
                        if (result.Sucesso === false) {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Error);
                        }
                        else {
                            BASE.Mensagem.Mostrar(result.Mensagem, TipoMensagem.Info);
                        }
                    }
                }
            },
            error: function (xhr, err) {
                console.log(xhr);
                console.log(err);
                BASE.Mensagem.Mostrar("Erro ao carregar dropdown " + controller, TipoMensagem.Error);
            }
        });
    };

    function configurarEditor() {
        $(".editorwysiwyg").each(function (index, element) {
            var $this = $(this);
            var texto = $this.text();

            var options = {
                fonts: false,
                styles: false,
                font_size: false,
                color: false,
                bold: false,
                italics: false,
                underline: false,
                strikeout: false,
                ol: false,
                ul: false,
                //undo: false,
                //redo: false,
                l_align: false,
                r_align: false,
                c_align: false,
                justify: false,
                unlink: false,
                insert_link: false,
                insert_img: false,
                insert_table: false,
                hr_line: false,
                block_quote: false,
                indent: false,
                outdent: false,
                print: false,
                //rm_format: false,
                select_all: false,
                togglescreen: false,
                splchars: false,
                source: false
            };

            options.bold = true;
            options.italics = true;
            options.underline = true;
            options.c_align = true;
            options.l_align = true;
            options.r_align = true;
            options.color = true;

            $this.Editor(options);
            $this.Editor("setText", texto);

            var form = $this.closest('form');

            form.submit(function (e) {
                console.log('controlesjsformsubmit');
                e.preventDefault();
                var conteudo = $this.Editor("getText");

                $this.text(conteudo);

                form[0].submit();
            });
        });
    }

    function definirTextoEditor(seletor, texto) {
        var controles = configurarSeletor(seletor);
        controles.val(texto);

        if (controles.hasClass('editorwysiwyg') || controles.next('.Editor-container').length === 1) {
            controles.Editor('setText', texto);
        }
    }

    function configurarTabela(callBackNenhumItem, callbackSucesso) {
        var divLista = $("#divLista");
        var tabelaSeletor = 'table.dataTable';
        var tabela = $(tabelaSeletor);

        var url = tabela.data("datatables-url");

        var pagesize = tabela.data("datatables-pagesize") || 5;

        var paginar = true;
        if (tabela.data('tabela-paginar') !== undefined) {
            paginar = tabela.data('datatables-paginar');
        }

        var ordenar = false;
        if (tabela.data('datatables-ordenar') !== undefined) {
            ordenar = tabela.data('datatables-ordenar');
        }

        var buscar = false;
        if (tabela.data('tabela-buscar') !== undefined) {
            buscar = tabela.data('datatables-buscar');
        }

        var valueDeferLoading = null;
        if (divLista.data("carregar-lista") !== undefined) {
            var carregarLista = divLista.data("carregar-lista");
            carregarLista === false ? valueDeferLoading = 0 : valueDeferLoading = null;
        }

        if (url === undefined) {
            if (!$.fn.DataTable.isDataTable(tabelaSeletor)) {
                tabela.dataTable({
                    /*Coluna que não permite ordenação, partindo do array 0*/
                    //"aoColumnDefs": [{ "bSortable": false, "aTargets": ["no-sort"] },
                    //                 { "word-wrap": "break-word", "aTargets": ["col-wrap"] }], // HACK no-sort não funciona e quebra o datatables com coluna com checkbox. Mantis 0001908

                    /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
                    "order": [[0, "asc"]],

                    /*Resposividade da tabela*/
                    responsive: false,

                    paginate: true,
                    ordering: true,
                    searching: true,
                    columnDefs: [{
                        "defaultContent": "-",
                        "targets": "_all"
                    }]
                });
            }
        }
        else {
            var ths = tabela.find('thead tr th');
            var columns = [];

            ths.each(function (index, element) {
                var id = element.innerHTML.trim();

                if (element.dataset.datatablesColumnName !== undefined) {
                    id = BASE.Texto.ToCamelCase(element.dataset.datatablesColumnName);
                    var type = element.dataset.datatablesColumnType;

                    if (type === undefined) {
                        type = 'display';
                    }

                    var newColumn = {
                        name: id,
                        data: id,
                        title: element.innerHTML.trim(),
                        type: type
                    }
                    columns.push(newColumn);
                }
            });

            $.fn.dataTable.ext.errMode = 'none';

            tabela.DataTable().destroy();

            tabela
                .on('error.dt',
                    function (e, settings, techNote, message) {
                        console.log(message);
                        return false;
                    })
                .on('xhr.dt',
                    function (e, settings, json, xhr) {
                        if (json.Sucesso === false) {
                            if (callBackNenhumItem) {
                                callBackNenhumItem(json.Mensagem);
                            } else {
                                nenhumItemEncontradoDefault(json.Mensagem);
                            }
                        } else {
                            if (callbackSucesso) {
                                callbackSucesso();
                            }
                        }
                        e.stopPropagation();
                        return false;
                    })
                .on('preXhr.dt',
                    function (e, settings, data) {
                        if ($('.frm-filtro').is('form')) {
                            data.filtro = $('.frm-filtro').serialize();
                        } else {
                            data.filtro = $('.frm-filtro :input').serialize();
                        }
                    })
                .dataTable({
                    paginate: paginar,
                    ordering: ordenar,
                    searching: buscar,
                    deferRender: false,
                    info: true,
                    stateSave: false,
                    pageLength: pagesize,
                    lengthMenu: [5, 10, 25, 50, 75, 100],
                    serverSide: true,
                    deferLoading: valueDeferLoading,
                    ajax: {
                        url: url,
                        type: "POST",
                        data: { meh: 'meh' }
                    },
                    columns: columns,
                    columnDefs: [{
                        targets: '_all',
                        createdCell: function (td, cellData, rowData, row, col) {
                            if (rowData.caracteristicas !== null && rowData.caracteristicas.destaque === true) {
                                $(td).html('<strong>' + $(td).html() + '</strong>');
                            }
                            if (rowData.caracteristicas !== null && rowData.caracteristicas.colcentralizar === col) {
                                $(td).html('<center>' + $(td).html() + '</center>');
                            }
                        }
                    }, {
                        defaultContent: "-",
                        targets: 'selecione',
                        orderable: false,
                        render: dataTablesFormataSelecione,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).addClass('text-center');
                        }
                    }, {
                        defaultContent: "-",
                        targets: 'acoes',
                        orderable: false,
                        render: dataTablesFormataAcoes,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).addClass(' acoes text-center');
                        }
                    }, {
                        defaultContent: "-",
                        targets: 'simbolo-legenda',
                        orderable: false,
                        render: dataTablesFormataSimboloLegenda,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).addClass('text-center');
                        }
                    }]
                });
        }
    }

    function nenhumItemEncontradoDefault(msg) {
        BASE.Mensagem.Mostrar(msg, TipoMensagem.Informativa, "Aviso");
    }

    function dataTablesFormataSelecione(data, type, full, meta) {
        var html = '';

        if (full != undefined) {
            html += '<input data-id="' + full.id + '" type="checkbox" title="Selecione" value="true">';
        }

        return html;
    }

    function dataTablesFormataAcoes(data, type, full, meta) {
        var html = '';
        if (data != undefined) {
            for (var i = 0; i < data.length; i++) {
                var margL = ' margL0 ';
                if (i > 0) {
                    margL = ' margL5 ';
                }

                var classe = ' ' + data[i].classe;
                var disable = data[i].disabled === true ? "disabled='disabled'" : "";
                var title = data[i].title !== null ? data[i].title : "";

                switch (data[i].tipo) {
                    case "button":
                        html += '<button type="button" class="btn btn-sm btn-default' + margL + classe + '" data-url="' + data[i].url + '" title="' + title + '" ' + disable + ' ><i class="' + data[i].icone + '"></i></button>';
                        break;
                    case "a":
                    default:
                        html += '<a class="btn btn-sm btn-default' + margL + classe + '" href="' + data[i].url + '" title="' + title + '" ' + disable + '><i class="' + data[i].icone + '"></i></a>';
                }
            }
        }

        return html;
    }

    function dataTablesFormataSimboloLegenda(data, type, full, meta) {
        var html = '';

        if (data != undefined) {
            var valorSeparado = data.split('|');

            html += '<span class="' + valorSeparado[1] + '">' + valorSeparado[0] + '</span>';
        }

        return html;
    }

    function configurarDatePicker() {
        var minBirthDate = moment().subtract(14, "years");
        $(".data").datetimepicker({
            language: 'pt-BR',
            format: 'dd/mm/yyyy',
            autoclose: true,
            minView: 2,
            pickTime: false,
            inline: true,
            startDate: 2
        });

        $('.birthdatetimepicker').datetimepicker({
            locale: moment.locale("pt-br"),
            format: "DD/MM/YYYY",
            minDate: new Date(1900, 0, 1)
        });
        $('.birthdatetimepicker').mask('00/00/0000', { placeholder: '__/__/____', minDate: new Date(1999, 12, 31), maxDate: '+50Y' });

        $('.birthdatetimepicker').each(function (index) {
            var maxDate = $(this).data("maxDate");
            if (maxDate !== undefined) {
                var m = (maxDate == 'maxBirthDate()' ? minBirthDate : moment(minBirthDate));
                $(this).data("DateTimePicker").maxDate(m);
            }
        });
    }

    function configurarIntervaloData() {
        $($("[data-intervalo='inicial']")).on("change", function (e) {
            $($("[data-intervalo='final']")).datetimepicker('setStartDate', $("[data-intervalo='inicial']").val());
        });

        $($("[data-intervalo='final']")).on("change", function (e) {
            $($("[data-intervalo='inicial']")).datetimepicker('setEndDate', $("[data-intervalo='final']").val());
        });
    }

    function contadorCaracter(elemento, callback) {
        elemento.off("keyup");
        elemento.on("keyup", function () {
            var maxLength = $(this).attr("maxlength"),
                length = $(this).val().length;
            $(".remaining-chars").text(maxLength - length);

            if (callback !== undefined)
                callback(length);
        });
    }

    function inicializaTypeahead() {
        $("input[type='text'][data-istypeahead='true']").unbind('keyup').bind('keyup', function (e) {
            var value = $('input[name="' + $(this).attr('data-value-field') + '"]');
            if (e.keyCode == 8) {
                console.log('clear!');
                value.val('');
            }
        });
        $("input[type='text'][data-istypeahead='true']").unbind('blur').bind('blur', function (e) {
            var value = $('input[name="' + $(this).attr('data-value-field') + '"]');
            if (value.val() == '') {
                console.log('clear this!');
                $(this).val('');
            }
        });
        $("input[type='text'][data-istypeahead='true']").each(function () {
            var id = $(this).attr('name');
            var displayField_value = $(this).attr('data-service-displayField');
            var valueField_value = $(this).attr('data-service-valueField');
            var dataServiceUrl_value = $(this).attr('data-service-url');
            var dataValueField_value = $(this).attr('data-value-field');
            var minlength_value = parseInt($(this).attr('data-minlength'));

            var parametosExtras = {};
            if ($(this).attr('data-parametros')) {
                parametosExtras = JSON.parse($(this).attr('data-parametros'));
                parametosExtras = "?" + $.param(parametosExtras);
            }

            if ($.isEmptyObject(parametosExtras)) {
                parametosExtras = '';
            }

            $(this).typeahead({
                onSelect: function (item) {
                    $('[name="' + dataValueField_value + '"]').val(dataValueField_value).val(item.value);
                    $('[name="' + dataValueField_value + '"]').trigger('change');
                    console.log(item.value);
                },
                ajax: {
                    url: $.validator.format(dataServiceUrl_value, $("input[name='" + id + "']").val()) + parametosExtras,
                    triggerLength: minlength_value,
                    dataType: "json",
                    displayField: displayField_value,
                    valueField: valueField_value,
                    preDispatch: function (query) {
                        return {
                            query: query
                        }
                    },
                    preProcess: function (data) {
                        var listaSerie = [];
                        if (data.length === 0) {
                            return false;
                        }
                        return data;
                    }
                }
            });
        });
    };

    function exibeEscondeElemento(array, exibe, callback) {
        $(array).each(function () {
            exibe === true ? $(this).show() : $(this).hide();
        });

        if (callback !== undefined && callback !== null)
            callback();

        return false;
    }

    function definirMaxLength(context) {
        $("input[data-val-length-max]").each(function (index, element) {
            element.setAttribute("maxlength", element.getAttribute("data-val-length-max"))
        });
    }

    return {
        Init: init,
        Geral: {
            DefinirMaxLength: definirMaxLength
        },
        Configurar: {
            DatePicker: configurarDatePicker,
            ConfigurarIntervaloData: configurarIntervaloData,
            ContadorCaracter: contadorCaracter
        },
        DropDown: {
            Inicializar: dropdownInicializar,
            Habilitar: dropDownHabilitar,
            Desabilitar: dropDownDesabilitar,
            DefinirChain: dropDownDefineChain,
            Preencher: dropdownPreencher,
            PreencherSimples: dropdownPreencherSimples,
            PreencherPorId: dropdownPreencherPorId,
            HabilitarCondicional: dropDownOcultarCondicional,
            ConfigurarSeletor: configurarSeletor,
            PopularDropDown: popularDropDown
        },
        Radio: {
            Habilitar: function () { return false; },
            Desabilitar: radioDesabilitar
        },
        Elemento: {
            ExibiEsconde: exibeEscondeElemento
        },
        Tabela: {
            Configurar: configurarTabela
        },
        Plugins: {
            WYSIWYG: configurarEditor
        },
        Editor: {
            Configurar: configurarEditor,
            DefinirTexto: definirTextoEditor
        },
        Typeahead: {
            Configurar: inicializaTypeahead
        }
    };
}());

$(function () {
    CONTROLES.Init();
});
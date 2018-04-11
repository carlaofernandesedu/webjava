var CONTROLES = (function () {

    function init() {

    }

    //INFO TRATAMENTO DO CONTROLE DE COMBO BOX 
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

    //No componente que ira gerar o DropDown podera ter o atributo data-ddlChainTextoInicial(valor) para passar o primeiro item do combo
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
    //https://www.w3schools.com/jquery/jquery_events.asp
    //The on() method attaches one or more event handlers for the selected elements.
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
            this.blur(); //remove o foco do controle 
            window.focus(); //retorna o foco para a corrente janela
        });
    }

    var dropdownReset = function (controle) {
        $(controle).find('option').remove();
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

    //textoVazio: (boolean) true or null criar o item Selecione 
    //Define data-valorSelecionado e verifica se o controle possui data-valorSelecionado
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

    //idPai campo informado na pesquisa 
    //verifica campos data-remover-ua-usuario-logado e data-valorSelecionado
    //Por Padrao : pesquisar pelos campos idPai idSelecionado removerUaUsuarioLogado
    //Campo data: informa os parametros de pesquisa
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


    function desabilitarChain(seletorContexto, seletorFilhos, callback) {
        $(seletorFilhos).each(function (index, element) {
            //BASE.Debug('desabilitando chain para ' + $(this).attr('id'));
            $(seletorContexto).off('change', $(this));
        });

        if (callback) {
            callback();
        }
    }

    //seletorPai 
    //seletorFilho
    //bloquear parece nao ter utilidade 
    //changecallback - passar o idPai do Combo Selecionado
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



    //TRATAMENTO DO CONTROLE DE DATA 
    //https://malot.fr/bootstrap-datetimepicker/
    function configurarDatePicker(seletorObjeto) {
        $(seletorObjeto).datetimepicker({
            minView: 2,
            language: 'pt-BR',
            format: 'dd/mm/yyyy',
            autoClose:true
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

    return {
        Init: init,
        Configurar:
        {
                DatePicker: configurarDatePicker,
                ConfigurarIntervaloData: configurarIntervaloData
            },
        DropDown: {
            Inicializar: dropdownInicializar,
            Habilitar: dropDownHabilitar,
            Desabilitar: dropDownDesabilitar,
            DefinirChain: dropDownDefineChain,
            Preencher: dropdownPreencher,
            PreencherSimples: dropdownPreencherSimples,
            //PreencherPorId: dropdownPreencherPorId,
            //HabilitarCondicional: dropDownOcultarCondicional,
            ConfigurarSeletor: configurarSeletor,
            PopularDropDown: popularDropDown
        }
    }
})();

$(function () {
    CONTROLES.Init();
});
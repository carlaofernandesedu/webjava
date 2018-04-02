var EVENTO = (function () {

    function init() {
        bindAll();
        CONTROLES.Tabela.Configurar();
        CRUDBASE.Validator.RegrasEspecificas = allValidarCampos;
    }

    function bindAll() {
        
    }

    function controleTela()
    {
        bindConvenioMunicipal();
        bindSetorFiscalizacao();
        bindIntervaloData();
    }

    function bindIntervaloData()
    {
        var context = "#form-detalhe ";
        InicializarIntervaloDatasComContexto(context);
    }

    function carregarFiltro() {
        CONTROLES.DropDown.Preencher('.frm-filtro #TipoEvento', 'TipoEvento', 'SelectList', null);
    }

    function posCarregarEditar() {

        var edicao = parseInt($("#modalDetalhe #Codigo").val()) > 0 ? true : false;

        //CONTROLES.DropDown.HabilitarCondicional("#modalDetalhe", "#TipoEvento", 1, null, "#Convenio, #SetorFiscalizacao");
        //CONTROLES.DropDown.HabilitarCondicional("#modalDetalhe", "#TipoEvento", "2", "#Convenio, #SetorFiscalizacao", null);
        //CONTROLES.DropDown.HabilitarCondicional("#modalDetalhe", "#TipoEvento", "3", "#Convenio, #SetorFiscalizacao", null);
        ////CONTROLES.DropDown.HabilitarCondicional("#modalDetalhe", "#TipoRotina", "1", "#SetorFiscalizacao");

        CONTROLES.DropDown.Preencher('#modalDetalhe #TipoEvento', 'TipoEvento', 'SelectList', null, "Selecione", null, null, function () {
            CONTROLES.DropDown.DefinirChain('#modalDetalhe', '#TipoEvento', '#Convenio, #SetorFiscalizacao', false, "Selecione um Tipo de Motivo", function (idPai) {
                carregarSelect(idPai);
            });
        });



        CONTROLES.DropDown.Preencher('#modalDetalhe #Assunto', 'AssuntoAdministrativo', 'ObterAssuntos', null, "Selecione", null, null, function () {
            CONTROLES.DropDown.DefinirChain('#modalDetalhe', '#Assunto', '#Problema', true, "Selecione um assunto", function (idPai) {
                if (idPai) {
                    CONTROLES.DropDown.Preencher('#modalDetalhe #Problema', 'ProblemaAdministrativo', 'ObterProblemas', idPai);
                    //selectAssunto(idPai);
                }
            });
        });

        //function selectMovel(idLocal) {
        //    CONTROLES.DropDown.Preencher('#form-detalhe #IdMovelArquivo', 'ArquivoMovel', 'ObterMovelComboBox', idLocal, true, false, false, function () {
        //        CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdMovelArquivo', '#IdMovelDivisao', false, "Selecione um movel", function (idPai) {
        //            if (idPai) {
        //                CONTROLES.DropDown.Preencher('#form-detalhe #IdMovelDivisao', 'ArquivoMovel', 'ObterDivisaoComboBox', idPai, true);
        //            }
        //        });
        //    });
        //}

        controleTela();
    }

    function carregarSelect(idPAi) {

        switch (parseInt(idPAi)) {
            case 1:
                CONTROLES.DropDown.Desabilitar("#modalDetalhe #Convenio", true, "Selecione");
                CONTROLES.DropDown.Desabilitar("#modalDetalhe #SetorFiscalizacao", true, "Selecione");
                break;
            case 2:
                selectConvenioESetorFiscalizacao();
                break;
            case 3:
                selectConvenioESetorFiscalizacao();
                break;
            default:
        }
    }

    function selectAssunto(idAssunto) {
        CONTROLES.DropDown.Preencher('#modalDetalhe #Problema', 'ProblemaAdministrativo', 'ObterProblemas', idAssunto);
    }

    function selectConvenioESetorFiscalizacao() {
        CONTROLES.DropDown.Preencher('#modalDetalhe #Convenio', 'Convenio', 'SelectList', null, true, null, null, selectSetorFicalizacao);

    }

    function selectSetorFicalizacao() {
        CONTROLES.DropDown.Preencher('#modalDetalhe #SetorFiscalizacao', 'Setor', 'SelectList', null, true, null, null, null);
    }

    function allValidarCampos() {
        convenioObrigatorio();
        fiscalizacaoObrigatorio();
    }

    function bindConvenioMunicipal() {
        $('#Convenio').off('change');
        $('#Convenio').on('change', function () {
            var value = $(this).val();

            if (value != undefined && value != "") {
                $('#modalDetalhe #form-detalhe #SetorFiscalizacao').val('');
                CONTROLES.DropDown.Desabilitar("#modalDetalhe #SetorFiscalizacao", false, "Selecione");
                $('#modalDetalhe #form-detalhe #Convenio').rules("remove", "required");
                $('#modalDetalhe #form-detalhe #SetorFiscalizacao').rules("remove", "required");
            }
            else {
                CONTROLES.DropDown.Habilitar("#modalDetalhe #SetorFiscalizacao");
                return false;
            }
        });
    }

    function bindSetorFiscalizacao() {
        $('#SetorFiscalizacao').off('change');
        $('#SetorFiscalizacao').on('change', function () {
            var value = $(this).val();
            if (value != undefined && value != "") {
                $('#modalDetalhe #form-detalhe #Convenio').val('');
                CONTROLES.DropDown.Desabilitar("#modalDetalhe #Convenio", false, "Selecione");
                $('#modalDetalhe #form-detalhe #Convenio').rules("remove", "required");
                $('#modalDetalhe #form-detalhe #SetorFiscalizacao').rules("remove", "required");
            }
            else {
                CONTROLES.DropDown.Habilitar("#modalDetalhe #Convenio");
            }
        });
    }

    function convenioObrigatorio() {
        $('#modalDetalhe #form-detalhe #Convenio').rules('add', {
            required: function () {

                var tipoOperacao = $('#modalDetalhe #form-detalhe #TipoEvento').val(),
                    convenio = $('#modalDetalhe #form-detalhe #Convenio').val(),
                    setorFisc = $('#modalDetalhe #form-detalhe #SetorFiscalizacao').val();

                if (tipoOperacao === "2" || tipoOperacao === "3") {
                    if (convenio !== "" || setorFisc !== "") {
                        $("#modalDetalhe #form-detalhe #Convenio").rules("remove", "required");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    $("#modalDetalhe #form-detalhe #Convenio").rules("remove", "required");
                    return false
                }
            },
            messages: {
                required: "Campo Convênio Munícipal é obrigatorio!"
            }
        });
    }

    function fiscalizacaoObrigatorio() {
        $('#modalDetalhe #form-detalhe #SetorFiscalizacao').rules('add', {
            required: function () {

                var tipoOperacao = $('#modalDetalhe #form-detalhe #TipoEvento').val(),
                    convenio = $('#modalDetalhe #form-detalhe #Convenio').val(),
                    setorFisc = $('#modalDetalhe #form-detalhe #SetorFiscalizacao').val();

                if (tipoOperacao === "2" || tipoOperacao === "3") {
                    if (convenio !== "" || setorFisc !== "") {
                        $("#modalDetalhe #form-detalhe #SetorFiscalizacao").rules("remove", "required");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    $("#modalDetalhe #form-detalhe #SetorFiscalizacao").rules("remove", "required");
                    return false
                }
            },
            messages: {
                required: "Campo Setor Fiscalização é obrigatorio!"
            }
        });
    }

    return {
        Init: function () {
            init();
            CRUDBASE.Eventos.PosCarregarEditar = posCarregarEditar;
            CRUDFILTRO.Carregar = carregarFiltro;
        }
    };

}());

$(function () {
    EVENTO.Init();
    CRUDFILTRO.Carregar();
    CRUDFILTRO.Filtrar();
});

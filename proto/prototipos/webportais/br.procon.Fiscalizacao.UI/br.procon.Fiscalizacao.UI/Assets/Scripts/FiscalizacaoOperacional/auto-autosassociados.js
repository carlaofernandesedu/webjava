AUTOSASSOCIADOS = (function () {

    var tbAutosAssociados = "tbAutosAssociados";

    function init() {
        bindAssociarAuto();
        configuraBusca();
    }

    function limparAutos() {
        var autos =
            [
                AUTOSASSOCIADOS.TblLocalStorageAutosAssociados

            ];

        $.each(autos, function (index, value) {
            localStorage.removeItem(value);
        });
    }

    function configuraBusca() {
        $('.dadosPesquisa').mask('99999-S9');
        $('.dadosPesquisa').attr('placeholder', '99999-Z9');
    }

    function bindAssociarAuto() {
        $("#btnAssociarAuto").off("click");
        $("#btnAssociarAuto").on("click", function () {
            $("#TipoParametro").val(1);

            var hdnTipo = $('#buscaSimples #TipoParametro');
            var txtCodigo = $('#buscaSimples #ParamentroSimples');
            var tipo = hdnTipo.val();
            var codigo = txtCodigo.val();

            var valido = validarDados(tipo, codigo);

            if (valido) {
                buscar(tipo, codigo);
            }

            txtCodigo.val('');
        });
    }

    function carregaAutosAssociados() {
        var objs = recuperarAutosAssociados();

        listaAuto(objs);
    }

    function recuperarAutosAssociados() {
        var tbItens = loadTbItens(AUTOSASSOCIADOS.TblLocalStorageAutosAssociados, false);
        return tbItens;
    }

    function validarDados(tipo, codigo) {
        var valido = true;

        if (tipo.length === 0) {
            BASE.Mensagem.Mostrar('Erro ao detectar buscar', TipoMensagem.Alerta);
            valido = false;
        }
        if (codigo.length === 0) {
            BASE.Mensagem.Mostrar('É preciso digitar um código para buscar', TipoMensagem.Informativa);
            valido = false;
        }

        return valido;
    }

    function buscar(tipo, codigo) {

        $.ajax({
            url: '/AutoFiscalizacao/BuscarAutoJson',
            type: 'POST',
            data: { ParamentroSimples: codigo, TipoParametro: tipo },
            cache: false,
            success: function (response, status, xhr) {

                if (response.Sucesso) {
                    if (response.Resultado.length === 0) {
                        BASE.Mensagem.Mostrar("Auto não encontrado.", TipoMensagem.Informativa);
                    }
                    else {

                        $.each(response.Resultado, function (i, item) {
                            var item = tratarPropriedades(item);

                            var autoAssociadoNoStorage = AUTOSASSOCIADOS.AdicionarAutoAssociado(item);

                            if (autoAssociadoNoStorage) {
                                listaAuto(response.Resultado);
                            }
                        });
                    }
                }
                else {
                    BASE.Mensagem.Mostrar(response, TipoMensagem.Error);
                }
            },
            error: function (e) {
                console.error(e);
            }
        });
    }

    function adicionarAutoAssociado(obj) {
        var tblMenu = AUTOSASSOCIADOS.TblLocalStorageAutosAssociados
        var tbItens = loadTbItens(tblMenu, false);
        var key = tbItens.length;

        if (obj.Codigo === null || obj.Codigo === undefined || obj.Codigo === '' || obj.Codigo === 0) {
            BASE.Mensagem.Mostrar('Nenhum auto foi associado', TipoMensagem.Alerta);
            return false;
        }

        var tipoNaoPermitido = obj.TipoAuto === EnumTipoAuto.Infracao || obj.TipoAuto === EnumTipoAuto.RAF;
        if (tipoNaoPermitido) {
            BASE.Mensagem.Mostrar('Esse auto não pode ser associado!', TipoMensagem.Alerta);
            return false;
        }

        var jaPossuiAutoDesseTipo = false;
        var autoJaAssociado = false;
        for (var i = 0; i < tbItens.length; i++) {
            var item = tbItens[i];

            if (!autoJaAssociado) {
                autoJaAssociado = item.Codigo === obj.Codigo;

                if (autoJaAssociado) {
                    break;
                }
            }

            if (!jaPossuiAutoDesseTipo) {
                jaPossuiAutoDesseTipo = item.TipoAuto === obj.TipoAuto;

                if (jaPossuiAutoDesseTipo) {
                    break;
                }
            }
        }

        if (autoJaAssociado) {
            BASE.Mensagem.Mostrar('Esse auto já está associado', TipoMensagem.Alerta);
            return false;
        }
        else if (jaPossuiAutoDesseTipo) {
            BASE.Mensagem.Mostrar('Já existe um auto desse tipo associado', TipoMensagem.Alerta);
            return false;
        }


        var objTratado = tratarPropriedades(obj);

        tbItens.push(objTratado);

        localStorage.setItem(tblMenu, JSON.stringify(tbItens));

        return true;
    }

    function listaAuto(objs) {
        var frmContent = $('#formPesquisaAuto #divDados #divResultado');
        var table = frmContent.find('table');
        var body = table.find('tbody');

        $.each(objs, function (i, item) {

            var obj = tratarPropriedades(item);

            body.append('<tr class="detalheAuto"><td>' + obj.NumeroSerie + '</td><td>' + obj.Data + '</td><td>' + obj.NomeFornecedor + '</td><td>' + obj.Assinado + '</td><td>' + obj.TipoAutoTexto + '</td></tr>');

            frmContent.removeClass('hidden').show();

        });
    }

    function tratarPropriedades(obj) {

        var dataCrua = obj.DataEmissaoNotificacaoString === undefined ? obj.Data : obj.DataEmissaoNotificacaoString;

        var newObj = {
            Codigo: obj.Codigo,
            Numero: obj.Numero,
            Serie: obj.Serie,
            NumeroSerie: BASE.Util.Pad(obj.Numero, 5) + "-" + obj.Serie,
            Data: dataCrua,//BASE.Util.FormatarDataJson(dataCrua),
            NomeFornecedor: obj.NomeFornecedor,
            TipoAuto: obj.TipoAuto,
            TipoAutoTexto: obj.TipoAutoTexto === undefined ? EnumTipoAutoReverse[obj.TipoAuto] : obj.TipoAutoTexto,
            RecusaAssinatura: obj.RecusaAssinatura,
            Assinado: obj.RecusaAssinatura === false ? "Sim" : "Não"
        }

        return newObj;
    }

    function loadTbItens(tbItensDoLocalStorage, carregarLista) {

        tbItens = localStorage.getItem(tbItensDoLocalStorage);
        var result = JSON.parse(tbItens);
        var retornoItensTotal = [];
        var retorno = [];
        var retornoApreensao = [];
        var retornoInfracao = [];

        if (result === null || result === undefined || result === '') {
            result = [];
        }

        for (var i in result) {

            var item = result[i];

            try {
                item = JSON.parse(item);
            }
            catch (e) {
            }

            if (item != null && item != undefined && item != '') {

                retornoItensTotal.push(item);
                switch (item.tipo) {
                    case 0:
                        retorno.push(item);
                        break;
                    case 1:
                        retornoApreensao.push(item);
                        break;
                    case 2:
                        retornoInfracao.push(item);
                        break;
                }
            }
        }

        if (carregarLista === true) {
            listarItens(retorno);
            listarItensApreensao(retornoApreensao);
            listarItensInfracao(retornoInfracao);
        }


        return retornoItensTotal;
    }

    return {
        Init: init,
        TblLocalStorageAutosAssociados: tbAutosAssociados,
        LimparStorage: limparAutos,
        AdicionarAutoAssociado: adicionarAutoAssociado,
        RecuperarAutosAssociados: recuperarAutosAssociados,
        CarregaAutosAssociados: carregaAutosAssociados
    };
}());
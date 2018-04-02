ENDERECOFISCALIZACAO = (function () {

    var hierarquiaSeletores = '#frmContent #conteudoAutoNotificao ';
    var tamanhoParaBuscaCpfCnpj = 0;
    var tabelaDiligencia = null;
    var tblEnderecoFiscalizacao = 'tblEnderecoFiscalizacao_ASDAIIO2345DFG';
    var tblEnderecoFornecedor = null;

    function init() {
        bindAll();
        tabelaDiligencia = localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia);
        tblEnderecoFornecedor = FORNECEDORFISCALIZACAO.TblLocalStorageEnderecoFornecedor;
        FISCALIZACAOOPERACIONAL.BindVoltar();
        FISCALIZACAOOPERACIONAL.ControleDeBuscaDeDados(FISCALIZACAOOPERACIONAL.GetLocalStorage(DILIGENCIA.IdDiligencia));

    }

    function bindAll() {

        FORNECEDORFISCALIZACAO.ControleTela();
        bindEnderencoFiscalizacao();
        bindCancelarModalFiscalizacao();
        bindBtnModalSalvar();
        bindBuscarEncereco();
        bindEditarEnderecoFiscalizacao();
        DILIGENCIA.BindSalvarDiligencia();

    };

    function initFuncoesModalFiscalizacao() {
        tabelaDiligencia = localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia);
        tblEnderecoFornecedor = FORNECEDORFISCALIZACAO.TblLocalStorageEnderecoFornecedor;
        bindEnderencoFiscalizacao();
        bindBuscarEncereco();
        bindCancelarModalFiscalizacao();
        bindBtnModalSalvar();
        bindEditarEnderecoFiscalizacao();
    }

    function bindEnderencoFiscalizacao() {
        $("#addEnderecoFiscalizacao").off('click');
        $("#addEnderecoFiscalizacao").on('click', function () {
            var checked = $(this).prop("checked");
            $('#btnAddModalEnderecoFisc').text("Incluir");
            $("#btnCamcelarModalEnderecoFisc").data("acao", 'adicao');

            exibirModalEndereco(this, true);
            if (checked === false)
                removeEnderecoLocalStorage();

        });
    }

    function bindBuscarEncereco() {
        $("#CepEndereco").off('change');
        $("#CepEndereco").on('change', function () {
            buscarEnderecoServico($(this));
        });
    }

    function bindCancelarModalFiscalizacao() {
        $('#modalFiscalizacao #btnCamcelarModalEnderecoFisc').click(function () {
            if ($(this).data("acao") === 'adicao') {
                $('#addEnderecoFiscalizacao').prop('checked', false);
            }
            else {
                $('#addEnderecoFiscalizacao').prop('checked', true);
            }
        });
    };

    function bindBtnModalSalvar() {
        $('#modalFiscalizacao #btnAddModalEnderecoFisc').click(function () {
            retornaDadosEndereco();
        });
    };

    function bindEditarEnderecoFiscalizacao() {
        $("#btnEditarFiscalizacao").off('click');
        $("#btnEditarFiscalizacao").on('click', function () {
            $("#btnCamcelarModalEnderecoFisc").data("acao", 'atualizacao');
            $('#btnAddModalEnderecoFisc').text("Atualizar");
            exibirModalEndereco(this, false);
        });
    }

    function buscar() {
        exibirEnderecoFiscalizacao();
        $('#addEnderecoFiscalizacao').prop('checked', true);

    }

    function salvar(obj, callback) {

        var _diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        if (obj != null) {

            _diligencia === null ? _diligencia = {} : _diligencia;

            _diligencia.CepEndereco = obj.CepEndereco;
            _diligencia.DescricaoEndereco = obj.DescricaoEndereco;
            _diligencia.NumeroEndereco = obj.NumeroEndereco;
            _diligencia.ComplementoEndereco = obj.ComplementoEndereco;
            _diligencia.BairroEndereco = obj.BairroEndereco;
            _diligencia.MunicipioEndereco = obj.MunicipioEndereco;
            _diligencia.EstadoEndereco = obj.EstadoEndereco;

            _diligencia.EhEnderecoFiscalizacao = true;
            localStorage.setItem(DILIGENCIA.TblLocalStorageDiligencia, JSON.stringify(_diligencia));

            if (callback != undefined)
                callback(_diligencia);

        }

        //exibirEnderecoFiscalizacao(_diligencia);
    }

    function exibirModalEndereco(elemento, inclusao) {
        if (inclusao == true) {
            if ($(elemento).is(':checked')) {
                $('#modalFiscalizacao').modal('show');
                resetaCamposModal();
            }
            else {
                $('.enderecoFiscalizacao').hide();
                removeEnderecoLocalStorage();
            }
        }
        else {
            $('#modalFiscalizacao').modal('show');
            populaModalFiscalizacao();
        }
    };

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid();
    }

    function buscarEnderecoServico($Elemnt) {
        var Cep = $Elemnt.val();

        $.ajax({
            type: "GET",

            url: "/Cep/GetEnderecoByCep",
            data: { cep: Cep.replace(/[^\d]+/g, '') },
            cache: false,
            success: function (data) {
                if (data != null && data != undefined && data != "") {
                    preencherCamposModalEnderecoFiscalizacao(JSON.parse(data));

                }
                else {
                    $('#modalFiscalizacao #DescricaoEndereco').val('');
                    $('#modalFiscalizacao #BairroEndereco').val('');
                    $('#modalFiscalizacao #MunicipioEndereco').val('');
                    $('#modalFiscalizacao #MunicipioEndereco').val('');
                    $('#modalFiscalizacao select').val('--');
                    //BASE.Mensagem.Mostrar("Endereço não encontrado!");
                    //resetaCamposModal();
                }
            },
            error: function (data) {
                console.log(data);
                BASE.Mensagem.Mostrar("data", TipoMensagem.Error);
            }
        });
    }

    function retornaDadosEndereco() {
        var valido = false;
        var obj = $("#frmEnderecoFiscalizacao").serializeObject();
        var $formModal = $("#frmEnderecoFiscalizacao");

        valido = validarDados($formModal);

        if (obj.EstadoEndereco != "SP") {
            BASE.Mensagem.Mostrar("Endereço não permitido! Deve ser informado um endereço do estado de SP.", TipoMensagem.Alerta);
            return false;
        }

        if (obj.CepEndereco != null && obj.CepEndereco.length >= 2 && parseInt(obj.CepEndereco.substr(0, 2)) > 19) {
            BASE.Mensagem.Mostrar("Endereço não permitido! Deve ser informado um endereço do estado de SP.", TipoMensagem.Alerta);
            return false;
        }

        if (valido) {
            salvar(obj, exibirEnderecoFiscalizacao);
            hideModal();
        }
        else {
            return false;

        }
    }

    function hideModal() {
        var $modal = $("#modalFiscalizacao");
        $modal.modal('hide');
    }

    function exibirEnderecoFiscalizacao() {
        montaEnderecoFiscalizacao();
        $('.dadosEnderecoFiscalizacao').show();
    }

    function montaEnderecoFiscalizacao() {

        var diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        if (diligencia != null && diligencia != undefined && diligencia.CepEndereco != null && diligencia.CepEndereco != undefined) {
            var logradouro = diligencia.DescricaoEndereco.concat(diligencia.NumeroEndereco != '' ? ', ' : '')
                .concat(diligencia.NumeroEndereco)
                .concat(diligencia.ComplementoEndereco != '' ? ' - ' : '')
                .concat(diligencia.ComplementoEndereco);

            var cidade = diligencia.BairroEndereco.concat(diligencia.MunicipioEndereco != '' ? ' - ' : '')
                .concat(diligencia.MunicipioEndereco)
                .concat(diligencia.EstadoEndereco != '' ? ' / ' : '')
                .concat(diligencia.EstadoEndereco);

            $("#dadoLogra").text(logradouro);
            $("#dadoCidade").text(cidade);
            $("#dadoCep").text(String('CEP: ').concat(diligencia.CepEndereco));
        }
    }

    function populaModalFiscalizacao() {

        var diligencia = JSON.parse(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        $("#CepEndereco").val(diligencia.CepEndereco);
        $("#DescricaoEndereco").val(diligencia.DescricaoEndereco);
        $("#NumeroEndereco").val(diligencia.NumeroEndereco);
        $("#ComplementoEndereco").val(diligencia.ComplementoEndereco);
        $("#BairroEndereco").val(diligencia.BairroEndereco);
        $("#MunicipioEndereco").val(diligencia.MunicipioEndereco);
        $("#Estado").val(diligencia.EstadoEndereco);
    }

    function removeEnderecoLocalStorage() {
        var divEnderecoFisc = $(".dadosEnderecoFiscalizacao");

        var diligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        diligencia.CepEndereco = null;
        diligencia.DescricaoEndereco = null;
        diligencia.NumeroEndereco = null;
        diligencia.ComplementoEndereco = null;
        diligencia.MunicipioEndereco = null;
        diligencia.EstadoEndereco = null;
        diligencia.EhEnderecoFiscalizacao = false;

        DILIGENCIA.AtualizarDiligencia(diligencia);
        divEnderecoFisc.hide();
    }

    function resetaCamposModal() {
        $('#modalFiscalizacao input').val('');
        $('#modalFiscalizacao select').val('--');
    }

    function preencherCamposModalEnderecoFiscalizacao(dados) {
        //$('#DescricaoEndereco').attr('disabled', 'disabled');
        //$('#BairroEndereco').attr('disabled', 'disabled');

        if (dados[0].endereco == '') {
            $('#DescricaoEndereco').removeAttr('disabled').focus();
            //$('#BairroEndereco').removeAttr('disabled');
            $("#MunicipioEndereco").val(dados[0].municipio);
            $("#Estado").val(dados[0].uf);

        } else {
            $("#DescricaoEndereco").val(dados[0].tipoLogradouro + ' ' + dados[0].endereco);
            $("#BairroEndereco").val(dados[0].bairro);
            $("#MunicipioEndereco").val(dados[0].municipio);
            $("#Estado").val(dados[0].uf);
        }
    }

    function buscaEnderecoFiscalizacaoLS() {
        var diligencia = FISCALIZACAOOPERACIONAL.ConverterObjJson(localStorage.getItem(DILIGENCIA.TblLocalStorageDiligencia));

        if (diligencia != null) {
            var enderecoFicalizacao = {
                Bairro: diligencia.BairroEndereco,
                Cep: diligencia.CepEndereco,
                Complemento: diligencia.ComplementoEndereco,
                Estado: diligencia.EstadoEndereco,
                Logradouro: diligencia.DescricaoEndereco,
                Municipio: diligencia.MunicipioEndereco,
                Numero: diligencia.NumeroEndereco,
                EhEnderecofiscalizacao: diligencia.EhEnderecoFiscalizacao
            }
        }

        return enderecoFicalizacao;
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
        },
        TblLocalStorageEnderecoFiscalizacao: tblEnderecoFiscalizacao,
        TblLocalStorageEnderecoFornecedor: tblEnderecoFornecedor,
        BuscaEnderecoFiscalizacaoLS: buscaEnderecoFiscalizacaoLS,
        BuscarEnderecoFiscalizacao: buscar,
        InitFuncoesModalFiscalizacao: initFuncoesModalFiscalizacao,
        ExibeEnderecoFiscalizacao: exibirEnderecoFiscalizacao
    };

}());
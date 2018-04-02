PESQUISAAUTO = (function () {

    var hierarquiaSeletores = '#formPesquisaAuto #conteudoAutoNotificao';

    function init() {
        bindAll();
        //CRUDBASE.Validator.RegrasEspecificas = camposObrigatorios;
        camposObrigatorios();
        bindDatePicker();
    };

    function bindDatePicker() {

        var currentDate = new Date();

        $('#PeriodoEmissaoInicio').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        $("#PeriodoEmissaoInicio").datetimepicker("update", currentDate);

        $('#PeriodoEmissaoFim').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
        });

        $("#PeriodoEmissaoFim").datetimepicker("update", currentDate);

        $('#CodSerie').mask('S9');
       
    }

    function bindAll() {
        bindMascaraInicialParamentroPesquisa();
        bindParametroPesquisa();
        bindLinkBuscaAvancada();
        bindBtnBuscarSimples();
        bindBtnBuscaAvancada();
        bindAutocompleteFiscais();
        validarPeriodoEmissao();        
      
    };

    function bindControlesGrid() {
        bindBtnDetalheAuto();
        bindPaginacao();
    }  

    function validarDigitoAP(numeroAP) {

        var tamanhoTotal = numeroAP.length;
        var digito = 0;

        if (numeroAP === '000000000') {
            return false;
        }

        if (tamanhoTotal === 9) {
            digito = parseInt(numeroAP.substr(8, 1));
        }
        else if (tamanhoTotal === 10) {
            //Sem pontuação
            digito = parseInt(numeroAP.substr(9, 1));
        }
        else if (tamanhoTotal === 12) {
            //Com pontuação
            digito = parseInt(numeroAP.substr(11, 1));
        }

        var valido = retornarDigitoApValido(numeroAP);

        if (digito === valido) {
            return true;
        }
        else {
            return false;
        }
    }

    function retornarDigitoApValido(apuracao) {

        var coef = "23456789";
        var k = 0;
        var r = 0;
        var T = 0;

        apuracao = apuracao.substring(0, 2) + parseInt(apuracao.substring(2, 8));

        for (k = 1; k <= 8; k++) {
            T = T + apuracao.substr(k - 1, 1) * coef.substr(k - 1, 1);
        }
        r = T % 11
        if (r < 2) {
            return 0;
        }
        else {
            return 11 - r;
        }
    }

    function bindParametroPesquisa() {
        $('.parametro').off('click');
        $('.parametro').on('click', (function () {
            var id = $(this).attr('data-id');
            $('.parametro').removeClass('ativo');
            $('.dadosPesquisa').focus();
            $('.dadosPesquisa').removeAttr('id').attr('id', id).val('');
            if ($('.dadosPesquisa').is('#dadosNAuto')) {
                $('.dadosPesquisa').mask('99999-S9');
                $('.dadosPesquisa').attr('placeholder', '99999-Z9');
                $("#TipoParametro").val(1);
            }
            else if ($('.dadosPesquisa').is('#dadosProtocolo')) {
                $('.dadosPesquisa').mask('9999999999');
                $('.dadosPesquisa').attr('placeholder', '9999999999');
                $("#TipoParametro").val(2);
            }
            else if ($('.dadosPesquisa').is('#dadosAP')) {
                $('.dadosPesquisa').mask('99.999.999-9');
                $('.dadosPesquisa').attr('placeholder', '99.999.999-9');
                $("#TipoParametro").val(3);
            }

            if ($(this).not('ativo')) {
                $(this).addClass('ativo');
            }
        }));
    }

    // INICIA A MASCARA DO CAMPO N° DO AUTO
    function bindMascaraInicialParamentroPesquisa() {
        $('.dadosPesquisa').mask('99999-S9');
        $('.dadosPesquisa').attr('placeholder', '99999-Z9');
        $('#PeriodoEmissaoInicio').mask('00/00/0000', { placeholder: '__/__/____' }).val('');
        $('#PeriodoEmissaoFim').mask('00/00/0000', { placeholder: '__/__/____' }).val('');
        $("#TipoParametro").val(1);
    }

    // CLIQUE NO BOTAO BUSCA DA BUSCA SIMPLES
    function bindBtnBuscarSimples() {
        $("#btnBuscaSimples").off("click");
        $("#btnBuscaSimples").on("click", function () {

            if ($('.validaAP').attr('id') == "dadosAP") {
                var tamanhoAP = $('.validaAP').val().length;
                if (tamanhoAP === 12) {
                    var numeroAPInformado = $('.validaAP').val();
                    var numAP = numeroAPInformado.replace(/[^0-9]/g, '');

                    var apValido = validarDigitoAP(numAP);

                    if (apValido == false) {
                        BASE.Mensagem.Mostrar("Número incorreto! O dígito verificador deve ser válido.", TipoMensagem.Alerta)
                        return false;
                    }
                }
            }
            var _form = $(this).parents('form:first');
            buscar(_form);
        });
    }

    // CLIQUE NO BOTAO BUSCA DA BUSCA AVANÇADA  
    function bindBtnBuscaAvancada() {
        $("#btnBuscarAvancada").off("click");
        $("#btnBuscarAvancada").on("click", function () {
            var _form = $(this).parents('form:first');
            buscar(_form);
        });
    }

    // CLIQUE NO LINK BUSCA AVANÇADA
    function bindLinkBuscaAvancada() {
        $('#abreBA').off('click');
        $('#abreBA').on('click', (function () {
            $('#iconeAbre').toggleClass('fa-angle-up fa-angle-down');
            $('#buscaSimples').slideToggle();
            $('.dadosPesquisa').val('');
        }));
    }

    function validarPeriodoEmissao() {
       
        $('#PeriodoEmissaoInicio').change(function () {
            var regexData = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
            var dtInformada, dtAtual;
            dtAtual = new Date();

            if ($('#PeriodoEmissaoInicio').val() != '') {
                if (!regexData.test($('#PeriodoEmissaoInicio').val())) {
                    dtInformada = dtAtual;
                } else {
                    var aux = $('#PeriodoEmissaoInicio').val().split('/');
                    dtInformada = new Date(aux[2], aux[1] - 1, aux[0]);
                }

                if (dtInformada > dtAtual) {
                    dtInformada = dtAtual;
                }

                var dt = dataFormatada(dtInformada);

                $('#PeriodoEmissaoInicio').val(dt);
            }

        });

        $('#PeriodoEmissaoFim').change(function () {
            var regexData = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
            var dtInformada, dtInicio, dtAtual, dtAux;
            dtAtual = new Date();
            
            if ($('#PeriodoEmissaoFim').val() != '') {
                if ($('#PeriodoEmissaoFim').val() == '' || !regexData.test($('#PeriodoEmissaoFim').val())) {
                    dtInformada = dtAtual;
                } else {
                    var aux = $('#PeriodoEmissaoFim').val().split('/');
                    dtInformada = new Date(aux[2], aux[1] - 1, aux[0]);
                }

                if ($('#PeriodoEmissaoInicio').val() == '')
                    dtInicio = dtAtual;
                else {
                    var aux = $('#PeriodoEmissaoInicio').val().split('/');
                    dtInicio = new Date(aux[2], aux[1] - 1, aux[0]);
                }

                if (dtInformada > dtAtual) {
                    dtInformada = dtAtual;
                }

                if (dtInformada < dtInicio) {
                    dtInformada = dtInicio;
                }               

                var dt = dataFormatada(dtInformada);

                $('#PeriodoEmissaoFim').val(dt);
            }

        });

    }

    function dataFormatada(d) {
        var data = new Date(d),
            dia = data.getDate(),
            mes = data.getMonth() + 1,
            ano = data.getFullYear();
            //hora = data.getHours(),
            //minutos = data.getMinutes();
        return [dia, mes, ano].join('/');
    }

    // Autocomplete de fiscais aitvos no sistema
    function bindAutocompleteFiscais() {

        $("#NomeAgenteFiscal").typeahead({
            onSelect: function (item) {
                $("#AgenteFiscal").val(item.value);
            },
            ajax: {
                url: '/AutoFiscalizacao/CarregarListaFiscaisAtivos',
                triggerLength: 4,
                dataType: "json",
                displayField: "Nome",
                valueField: "Codigo",
                preDispatch: function (query) {
                    return {
                        query: query
                    }
                },
                preProcess: function (data) {
                    var listaSerie = [];
                    if (data.lista.length === 0) {
                        BASE.Mensagem.Mostrar("Nenhum item foi encontrado!", TipoMensagem.Alerta)
                        return false;
                    }
                    return data.lista;
                }
            }
        });
    }

    function bindBtnDetalheAuto() {
        $(".detalheAuto").off('click');
        $(".detalheAuto").on('click', function () {
            var _idAuto = $(this).data('idauto');
            detalheAuto(_idAuto);

        });
    }

    function bindPaginacao() {
        $('#resultadoBusca').dataTable({
            "aoColumnDefs":
                [{
                    "bSortable": false,
                    "aTargets": ["no-sort"]
                },
                  {
                      "word-wrap": "break-word",
                      "aTargets": ["col-wrap"]
                  }],
            "order": [[0, "asc"]],
            "bDestroy": true,
            responsive: false,
        });
    }

    // CARREGA A LISTA DE TIPO DE AUTOS DA PESQUISA AVANÇADA
    function carregarListas() {
        CONTROLES.DropDown.PreencherSimples(hierarquiaSeletores + ' #TipoAuto', 'AutoFiscalizacao', 'BuscarListaTipos', '', null);
    }

    function validarDados(form) {
        if ($.validator !== undefined) {
            $.validator.unobtrusive.parse(form);
            camposObrigatorios();
        }
        else {
            BASE.Debug('problema no jQuery validator', DebugAction.Warn);
        }

        return form.valid(true);
    }

    function camposObrigatorios() {
        
        var fiscalConvenio = false;
        $.ajax({
            url: '/AutoFiscalizacao/CarregarFiscalLogado',
            type: 'POST',
            cache: false,
            success: function (resultado) {
                if (resultado.ConvenioCodigo > 0)
                    fiscalConvenio = true;
            },
            error: function (e) {
                console.log(e)
            }
        });

        $('.dadosPesquisa').rules('add', {
            required: function () {
            },
            messages: {
                required: "Campo é obrigatorio!"
            }
        });

        $('#pesquisaAutoAvancada #CpfCnpj').rules('add', {
            required: {
                depends: function (element) {
                    if (fiscalConvenio) {
                        return true;
                    }
                }
            }
            , messages: {
                required: "Fiscal convênio deve informar um CPF / CNPJ"
            }
        });

        $('#pesquisaAutoAvancada #PeriodoEmissaoInicio').rules('add', {
            required: true            
            , messages: {
                required: "Campo Data Inicial obrigatório"
            }
        });

        $('#pesquisaAutoAvancada #PeriodoEmissaoFim').rules('add', {
            required: true
            , messages: {
                required: "Campo Final obrigatório"
            }
        });
      
    }

    function buscar(_form) {       

        var valido = validarDados(_form);
        var dataInicial = $('#pesquisaAutoAvancada #PeriodoEmissaoInicio').val();
        var dataFinal = $('#pesquisaAutoAvancada #PeriodoEmissaoFim').val();

        if (dataInicial != "" && dataFinal != "") {

            var dtIniArr = dataInicial.split('/');
            var dtfimArr = dataFinal.split('/');

            var dtIni = new Date(dtIniArr[2], dtIniArr[1], dtIniArr[0]);
            var dtFim = new Date(dtfimArr[2], dtfimArr[1], dtfimArr[0], 23, 59, 59, 999);

            var timeDiff = Math.abs(dtFim.getTime() - dtIni.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
            if (dtFim < dtIni) {
                BASE.Mensagem.Mostrar('Data Inicial deve ser maior que Data Final', TipoMensagem.Alerta);
                valido = false;
            }
            //MANTIS 0001350: HOM 24/4 [Pesquisar Auto] CORRETIVA: Filtro - Período de emissão deve ser ilimitado <Regiane> 
            //else if (diffDays > 60) {
            //    BASE.Mensagem.Mostrar('A diferenças entra a Data Inicial e a Final deve ser de até 60 dias', TipoMensagem.Alerta);
            //    valido = false;
            //}
        }

        if (valido) {
            var obj = _form.serializeObject();

            $.ajax({
                url: '/AutoFiscalizacao/BuscarAuto',
                type: 'POST',
                data: { filtroPesquisa: obj },
                cache: false,
                success: function (response, status, xhr) {
                    var isJson = BASE.Util.ResponseIsJson(xhr);

                    if (isJson != undefined && !isJson) {
                        alteraHtmlView(response);
                        bindControlesGrid();
                    }
                    else {
                        BASE.Mensagem.Mostrar(response, TipoMensagem.Error);
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            });
        }
    }

    function detalheAuto(idAuto) {
        window.location = "/AutoFiscalizacao/DetalheAuto?idAuto=" + idAuto;
    }

    function alteraHtmlView(html) {
        var frmContent = $('#formPesquisaAuto #divDados #divResultado');
        frmContent.html(html);
    }

    $.fn.dataTable.ext.errMode = 'none';

    // SERIALIZA E CRIA UM OBJETO A PARTIR DO FORM
    $.fn.serializeObject = function () {
        var o = {};
        // var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function () {
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
        Init: init
    };

}());

$(function () {
    PESQUISAAUTO.Init();
})




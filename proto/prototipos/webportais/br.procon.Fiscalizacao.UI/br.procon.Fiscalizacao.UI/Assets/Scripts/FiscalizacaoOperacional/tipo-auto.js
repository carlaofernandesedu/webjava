TIPOAUTO = (function () {

    var numeroSerie = null,
        serie = null,
        form = null;

    function init() {
        REGISTRARAUTO.PreCarregar = function () { return false };
        REGISTRARAUTO.TratamentosEspecificos = exibeAuto;
        REGISTRARAUTO.ResetaRegras = resetaRegra;
        bindAll();
    }

    function bindAll() {
        REGISTRARAUTO.Buscar();
        bindClickTipoAuto();
        bindMascaraTipoAuto();
        bindClickContinuar();
        bindClickVoltar();
        bindChangeNumero();
        bindChangeSerie();
        bindValidacaoCampos();
        bindData();
        bindHora();
        liberarBotaoContinuar();
        esconderTipoAutoFiscalLogado();
      
        $('#inputNumero').attr('readonly', 'readonly');      
        $('#inputSerie').attr('readonly', 'readonly');

        $('#labelNotificacao').off('click');
        $('#labelNotificacao').on('click', function () {

            $('#inputSerie').val('');
            $('#inputNumero').val('');
            $('#inputSerie').removeAttr('readonly');
            $('#inputNumero').removeAttr('readonly');

        });

        $('#labelApreensao').off('click');
        $('#labelApreensao').on('click', function () {

            $('#inputSerie').val('');
            $('#inputNumero').val('');
            $('#inputSerie').removeAttr('readonly');
            $('#inputNumero').removeAttr('readonly');

        });

        $('#labelConstatacao').off('click');
        $('#labelConstatacao').on('click', function () {

            $('#inputSerie').val('');
            $('#inputNumero').val('');
            $('#inputSerie').removeAttr('readonly');
            $('#inputNumero').removeAttr('readonly');

        });

        $('#labelInfracao').on('click', function () {

            $('#inputSerie').val('');
            $('#inputNumero').val('');
            $('#inputSerie').removeAttr('readonly');
            $('#inputNumero').removeAttr('readonly');

        });

        $('#labelRaf').off('click');
        $('#labelRaf').on('click', function () {                     
          
            $('#inputNumero').val('00000');
            $('#inputNumero').attr('readonly', 'readonly');

            $('#inputSerie').val('R9');
            $('#inputSerie').attr('readonly', 'readonly');

        });

        var tipoauto = $('input[name=TipoAuto]:checked', '#formDadosAuto').val();

        $('#inputHora').off('blur');
        $('#inputHora').on('blur', function () {

            tipoauto = $('input[name=TipoAuto]:checked', '#formDadosAuto').val();
           
            if (tipoauto == "5") {
              
                var valido = false;
                var _serie = $('#inputSerie').val();
                var tipoauto = $('input[name=TipoAuto]:checked', '#formDadosAuto').val();

                if (_serie !== '' && _serie != undefined && _serie != null && _serie.length === 2) {
                    valido = validarRegraSerie(tipoauto, _serie, liberarBotaoContinuar);
                }
                else {
                    valido = false;
                    liberarBotaoContinuar();
                }
            }

        });
        

        switch (tipoauto) {
            case "1", "2", "3", "4":
                $('#inputSerie').val('');
                $('#inputNumero').val('');
                $('#inputSerie').removeAttr('readonly');
                $('#inputNumero').removeAttr('readonly');
                break;

            case "5":
                $('#inputSerie').val('R9');
                $('#inputNumero').val('00000');
                $('#inputSerie').attr('readonly', 'readonly');
                $('#inputNumero').attr('readonly', 'readonly');
                break;
        }            
    }   

    function bindValidacaoCampos() {
        $("#formDadosAuto").validate({
            rules: {
                Numero: "required",
                Serie: {
                    required: "required",
                    serieValida: true
                },
                DataEmissao: {
                    required: "required",
                    dateBR: true
                },
                Hora: {
                    required: "required",
                    horaValida: true
                }
            },
            messages: {
                Numero: "Campo obrigatório",
                Serie: {
                    required: "Campo obrigatório",
                },
                DataEmissao: {
                    required: "Campo obrigatório",
                },
                Hora: {
                    required: "Campo obrigatório",
                },
            }
        });
    }

    function bindClickTipoAuto() {
        $('.blocoItem input:radio').off('change');
        $('.blocoItem input:radio').on('change', function () {
            pintaTipoAuto(this);
            exibeAuto();
        });
    }

    function bindMascaraTipoAuto() {

        $('#inputNumero').mask('99999');
        $('#inputSerie').mask('S9');
        $('#inputDataEmissao').mask('99/99/9999');
        $('#inputHora').mask('99:99');
    }

    function bindChangeNumero() {
        $('#inputNumero').off('blur');
        $('#inputNumero').on('blur', function () {

            var numero = 0;

            if ($('#inputNumero').val() != '') {
                numero = parseInt($('#inputNumero').val());

            }          

            if (numero === 0 && $('#inputSerie').val() != 'R9') {
                serie = false;                
                BASE.Mensagem.Mostrar("Número inválido", TipoMensagem.Alerta);

            }           
        });
    }

    function bindChangeSerie() {
        $('#inputSerie').off('blur');
        $('#inputSerie').on('blur', function () {
                      
            var _serie = $(this).val();
         
            var tipoauto = $('input[name=TipoAuto]:checked', '#formDadosAuto').val();

            if (_serie !== '' && _serie != undefined && _serie != null && _serie.length === 2) {
                serie = validarRegraSerie(tipoauto, _serie, liberarBotaoContinuar);
            }
            else {
                serie = false;
                liberarBotaoContinuar();
            }

            return false;
        });
    }

    function bindClickContinuar() {
        $("#btnContinuar").off('click');
        $("#btnContinuar").on('click', function () {
         
            var form = $("#formDadosAuto"),
                valido = REGISTRARAUTO.ValidarDados(form),
                numero = null,
                serie = null;


            if (valido) {
             
                var numero = $('#inputNumero').val();
                var serie = $('#inputSerie').val();
                var tipoauto = $('input[name=TipoAuto]:checked', '#formDadosAuto').val();

                if ((numero != '' && numero != undefined && numero != null) && (serie != '' && serie != undefined && serie != null)) {

                    validarRegraNumeroSerie(tipoauto, numero, serie, function () {

                        salvar();

                        REGISTRARAUTO.ControlesMenu.DesabilitarOpcao('.vertical_nav #tipoAuto');
                        REGISTRARAUTO.ControlesMenu.HabilitarOpcao('.vertical_nav #cadastrarDadosFornecedor');
                        REGISTRARAUTO.ControlesMenu.ChecarOpcao('.vertical_nav #tipoAuto');

                        REGISTRARAUTO.AbreFrame(2);
                        BASE.Mensagem.Mostrar("Sucesso", TipoMensagem.Sucesso);

                    });
                }
                else {
                    BASE.Mensagem.Mostrar("Número da série inválido.", TipoMensagem.Sucesso);
                }
            }
            else {
                BASE.Mensagem.Mostrar("Preencha os campos obrigatórios.", TipoMensagem.Error);
                form.validate();
            }
        });
    }

    function bindClickVoltar() {
        $("#btnVoltar").off('click');
        $("#btnVoltar").on('click', function () {
            var indice = $(this).data('indice');
            REGISTRARAUTO.AbreFrame(indice);
        });
    }

    function bindData() {
        $('#inputDataEmissao').datetimepicker({
            minView: 2,
            format: "dd/mm/yyyy",
            minuteStep: 5,
            language: 'pt-BR',
            autoclose: true
            //endDate: '01/01/2018'
        });

        $('.datetimepicker-days[style*="display: block"] .table-condensed').hide();

    }

    function bindHora() {
        $('#inputHora').datetimepicker({
            format: 'hh:ii',
            language: 'pt-BR',
            autoclose: true,
            startView: 1,
            maxView: 1,
            pickDate: false,
            inline: true,
            forceParse: false
        });
    }

    function pintaTipoAuto(elem) {
        var naocheck = $('.blocosItem').find('input').not(':checked');
        $(elem).parent().addClass('btn-primary active');
        $(naocheck).parent().removeClass('btn-primary active');
    }

    function exibeAuto() {
        $('#painelAuto').collapse('show');
    }

    function liberarBotaoContinuar() {
        if (serie == true)
            REGISTRARAUTO.LiberarBotaoContinuar(true);
        else
            REGISTRARAUTO.LiberarBotaoContinuar(false);
    }

    function validarRegraSerie(tipoauto, _serie, callback) {

        $.ajax({
            url: 'RegistrarAuto/ValidarSerie/',
            type: 'GET',
            data: {tipoAuto: tipoauto, serie: _serie },
            success: function (data) {
                if (data.Sucesso) {
                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Sucesso, data.TituloMensagem);
                    serie = true;
                }
                else {
                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Alerta, data.TituloMensagem);
                    serie = false;
                }

                if (callback != undefined) {
                    callback();
                }

                return false;
            },
            error: function (data) {
                BASE.Mensagem.Mostrar(data, Tipo.Error);
            }
        });
    }

    function validarRegraNumeroSerie(tipoauto, _numero, _serie, callback) {

        $.ajax({
            url: 'RegistrarAuto/ValidarNumeroSerie/',
            type: 'GET',
            data: { tipoAuto: tipoauto, numero: _numero, serie: _serie },
            success: function (data) {
                if (data.Sucesso) {
                    numeroSerie = true;

                    if (callback != undefined)
                        callback();

                }
                else {
                    BASE.Mensagem.Mostrar(data.Mensagem, TipoMensagem.Alerta, data.TituloMensagem);
                    numeroSerie = false;
                }
            },
            error: function (data) {
                BASE.Mensagem.Mostrar(data, Tipo.Error);
            }
        });
    }

    function salvar() {
        var obj = $("#formDadosAuto").serializeObject(),
        autoManual = null,
        fiscalLogado = REGISTRARAUTO.FiscalLogado();
        autoManualLocalStorage = REGISTRARAUTO.ConverterObjJson(localStorage.getItem(tbAutoManual));

        if (autoManualLocalStorage === null || autoManualLocalStorage === undefined) {
            autoManual = REGISTRARAUTO.ObjetoCompletoAutoManual(fiscalLogado);
        }
        else {
            autoManual = autoManualLocalStorage;
        }

        autoManual = REGISTRARAUTO.CopiarPropriedades(obj, autoManual);
        REGISTRARAUTO.Salvar(autoManual);
    }

    function resetaRegra() {
        serie = false;
        numeroSerie = false;
    }

    function esconderTipoAutoFiscalLogado() {
        var fiscalLocado = REGISTRARAUTO.FiscalLogado();

        if (fiscalLocado.IdConvenio != null && fiscalLocado.IdConvenio > 0 && fiscalLocado.IdConvenio != undefined)
            $("#formDadosAuto #labelInfracao").hide();
        else
            $("#formDadosAuto #labelInfracao").show();
    }

    return {
        Init: init
    }
}());
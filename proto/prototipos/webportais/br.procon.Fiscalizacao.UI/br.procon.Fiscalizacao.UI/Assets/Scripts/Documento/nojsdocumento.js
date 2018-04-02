DOCUMENTO = (function () {

    var orgaoExterno = $("#OrgaoExterno"),
        serie = $("#idSerie"),
        dataDoc,
        result;

    function init() {
        bindAll();
    }

    function bindAll() {
        

        $("#nrProtocolo").focus();
        var data = $("#DataRecebimento").val();

        if (data !== undefined) {
            dataDoc = data.toString().split('/');
            result = new Date(dataDoc[1] + "/" + dataDoc[0] + "/" + dataDoc[2]);
        }

        $('.field-validation-error').empty();
        $($("#DataDocumento")).datetimepicker('setEndDate', result);

        if ($('input[name=Numero]').length > 0)
            $($('input[name=Numero]')[1]).val(padLeft($($('input[name=Numero]')[1]).val()));

        $("#SerieDocumental").val("");

        jQuery.extend(jQuery.validator.messages, { minlength: jQuery.validator.format("Digite mais de 3 caracteres para efetuar a pesquisa!") });

        $('#DataDocumento').blur(function (e) {

            var dataDigitada = e.target.value;
            var dataRecebimento = $("#DataRecebimento").val();

            var dataDigitadaArray = dataDigitada.toString().split('/');
            var dataDigitadaFormatada = dataDigitadaArray[1] + "/" + dataDigitadaArray[0] + "/" + dataDigitadaArray[2];

            var dataRecebimentoArray = dataRecebimento.toString().split('/');
            var dataRecebimentoFormatada = dataRecebimentoArray[1] + "/" + dataRecebimentoArray[0] + "/" + dataRecebimentoArray[2];

            var novaDataRecebimento = new Date(dataDigitadaFormatada)
            var novaDataRecebimentoFormatada = new Date(dataRecebimentoFormatada)

            if (novaDataRecebimento > novaDataRecebimentoFormatada) {
                BASE.Mensagem.Mostrar("O campo Data Documento não pode ser posterior a data de emissão do protocolo.", TipoMensagem.Error);
                $("#DataDocumento").val('');
            }
        });
        $('#SomeOtherDdlId').change(function () {
            // when the selection of some other drop down changes 
            // get the new value
            var value = $(this).val();

            // and send it as AJAX request to the newly created action
            $.ajax({
                url: '@Url.Action("foo")',
                type: 'POST',
                data: { someValue: value },
                success: function (result) {
                    // when the AJAX succeeds refresh the ddl container with
                    // the partial HTML returned by the Foo controller action
                    $('#ddlcontainer').html(result);
                }
            });
        });
        $('#SomeOtherDdlId').change(function () {
            // when the selection of some other drop down changes 
            // get the new value
            var value = $(this).val();

            // and send it as AJAX request to the newly created action
            $.ajax({
                url: '@Url.Action("foo")',
                type: 'POST',
                data: { someValue: value },
                success: function (result) {
                    // when the AJAX succeeds refresh the ddl container with
                    // the partial HTML returned by the Foo controller action
                    $('#ddlcontainer').html(result);
                }
            });
        });
        $('input[name="Origem"]').change(function () {

            switch ($('input[name="Origem"]:checked').val()) {
                case "Interno":

                    $("#SerieDocumental").val("");
                    $("#divIntSerieDocumental").css("display", "block");
                    $("#divExtOrgao").css("display", "none")
                    $("#divNomeDocumento").css("display", "none")

                    validaCamposObrigatorios($('input[name=Origem]:checked').val());
                    break;

                case "Externo":

                    $("#divIntSerieDocumental").css("display", "none");
                    $("#divExtOrgao").css("display", "block")
                    $("#divNomeDocumento").css("display", "block")

                    validaCamposObrigatorios($('input[name=Origem]:checked').val());
                    break;
            }
        });

        bindClickBtnLimparClassificacao();
        bindClickCancelarProtocolo();
        bindBlurUltimoProtocolo();
        bindAutoCompleteSerieDocumental();
        bindPopulaFuncao(populaSubFuncao);
        bindChangePopulaOrgaoExterno();
        consultaOrgaoExterno(orgaoExterno.val());
        carregaSeriePorId(serie.val());
        ValidaCamposObrigatorios();
        exibirMensagemSerieDocumental();
    }

    function bindClickCancelarProtocolo() {
        $("#btnCancelarProtocolo").off('click');
        $("#btnCancelarProtocolo").on('click', function () {
            $("#nrProtocolo").val('');
        });
    }

    function bindBlurUltimoProtocolo() {
        $('#ultimoProtocolo').off('blur');
        $('#ultimoProtocolo').on('blur', function () {

            var tipoDocumento = $('#ultimoProtocolo').val();

            $.ajax({
                url: "/Documento/PesquisarReplicaDocumento",
                data: { documento: $('#ultimoProtocolo').val() },
                cache: false,
                success: function (result) {
                    if (result.result == "Desabilitar" && result.remessa == '') {
                        BASE.Mensagem.Mostrar('Protocolo não finalizado!', TipoMensagem.Alerta);
                        $('#btnReplicar').attr('disabled', 'disabled');
                    } else if (result.result == "Desabilitar" && result.remessa != '') {
                        BASE.Mensagem.Mostrar(result.remessa, TipoMensagem.Alerta);
                        $('#btnReplicar').attr('disabled', 'disabled');
                    } else {
                        $('#btnReplicar').removeAttr('disabled');
                    }
                }
            });
        });
    }

    function bindAutoCompleteSerieDocumental() {

        $("#SerieDocumental").typeahead({
            onSelect: function (item) {
                $("#SerieDocumental").val(item.value);
                $("#SerieDocumento").empty();
                $("#SerieDocumento").append($("<option value='" + item.value + "'>" + item.text + "</option>"));
                $("#Funcao").val("0");
                $("#SubFuncao").empty();
                $("#Atividade").empty();
                $("#SubFuncao").prop("disabled", true);
                $("#Atividade").prop("disabled", true);
            },
            ajax: {
                url: '/Documento/RetornaSerieDocumental',
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

    function bindPopulaFuncao(calback) {
        $.ajax({
            url: '/Documento/CarregaComboFuncao',
            type: 'POST',
            success: function (data) {
                $("#Funcao").empty();
                $("#Funcao").append($("<option value='0'>Selecione</option>"));

                $.each(data.lista, function (index, value) {
                    $("#Funcao").append($("<option value='" + value.IdFuncao + "'>" + value.DescricaoFuncao + "</option>"));
                });

                $("#SubFuncao").prop("disabled", true);
                $("#Atividade").prop("disabled", true);

                calback($("#Funcao"));
            }
        });
    }

    function populaSubFuncao(combo) {
        $("#Funcao").off('change');
        $("#Funcao").on('change', function () {

            $("#SerieDocumento").empty();
            console.log(combo.val());

            if (combo.val() != "0") {
                $.ajax({
                    url: '/Documento/CarregaComboSubFuncao',
                    type: 'POST',
                    cache: false,
                    data: { idFuncao: combo.val() },
                    success: function (data) {

                        $("#SerieDocumental").val("");
                        $("#SubFuncao").empty();
                        $("#Atividade").empty();
                        $("#SerieDocumento").empty();
                        $("#Atividade").prop("disabled", true);

                        if (data.lista.length > 0) {

                            $("#SubFuncao").append($("<option value='0'>Selecione</option>"));

                            $.each(data.lista, function (index, value) {
                                $("#SubFuncao").append($("<option value='" + value.IdSubFuncao + "'>" + value.DescricaoSubFuncao + "</option>"));
                            });
                            $("#SubFuncao").prop("disabled", false);
                            $("#Atividade").prop("disabled", true);

                            bindPopulaAtividade($("#SubFuncao"));

                        }
                        else {
                            $("#SubFuncao").empty();
                            $("#SubFuncao").prop("disabled", true);
                        }
                    }
                });
            }
            else {
                $("#SubFuncao").empty();
                $("#SubFuncao").prop("disabled", true);
                $("#Atividade").empty();
                $("#Atividade").prop("disabled", true);
                $("#SerieDocumento").empty();
            }
        });
    }

    function bindPopulaAtividade(combo) {
        combo.off('change');
        combo.on('change', function () {

            if (combo.val() !== "0") {
                $.ajax({
                    url: '/Documento/CarregaComboAtividade',
                    type: 'POST',
                    cache: false,
                    data: { idSubFuncao: combo.val() },
                    success: function (data) {

                        $("#Atividade").empty();

                        if (data.lista.length > 0) {

                            $("#Atividade").append($("<option value='0'>Selecione</option>"));

                            $.each(data.lista, function (index, value) {
                                $("#Atividade").append($("<option value='" + value.IdAtividade + "'>" + value.DescricaoAtividade + "</option>"));
                            });
                            $("#Atividade").prop("disabled", false);

                            bindPopulaSerie($("#Atividade"));
                        }
                        else {
                            $("#Atividade").empty();
                            //$("#SubFuncao").append($("<option>Selecione</option>"));
                            $("#Atividade").prop("disabled", true);
                        }
                    }
                });
            } else {
                $("#Atividade").empty();
                $("#Atividade").prop("disabled", true);
                $("#SerieDocumento").empty();
            }
        });
    }

    function bindPopulaSerie(combo) {
        combo.off('change');
        combo.on('change', function () {

            if (combo.val() !== "0") {
                $.ajax({
                    url: '/Documento/CarregaComboSeriePorIdAtividade',
                    type: 'POST',
                    cache: false,
                    data: { idAtividade: combo.val() },
                    success: function (data) {

                        $("#SerieDocumento").empty();

                        if (data.lista.length > 0) {

                            $("#SerieDocumento").append($("<option value='0'>Selecione</option>"));

                            $.each(data.lista, function (index, value) {
                                $("#SerieDocumento").append($("<option value='" + value.IdSerieDocumental + "'>" + value.DescricaoSerie + "</option>"));
                            });
                        }
                        else {
                            $("#SerieDocumento").empty();
                            $("#SerieDocumento").append($("<option>Selecione</option>"));

                        }
                    }
                });
            } else {
                $("#SerieDocumento").empty();
                $("#SerieDocumento").prop("disabled", true);
            }
        });
    }

    function bindChangePopulaOrgaoExterno() {

    }

    function bindClickBtnLimparClassificacao() {
        $("#formClassificarDoc #btnAcao #btnLimpar").off('click');
        $("#formClassificarDoc #btnAcao #btnLimpar").on('click', function () {
            $("#OrgaoExterno").val("");
            $("#OrgaoExternoAutoComplete").val("");
            $("#DataDocumento").val("");
            $("#DescricaoAssunto").val("");
            $("#QtdeVolume").val("");
            $("#NomeDocumento").val("");
            $("#NomeDocumento").val("");
            $("#SerieDocumental").val("");
            $("#SerieDocumento").val("");
            $("#SerieDocumento").val("");
            $('#TipoOrgao').val("");
        });
    }

    function consultaOrgaoExterno() {

    }

    function carregaSeriePorId() {

    }

    function validaCamposObrigatorios() {
        $("#OrgaoExternoAutoComplete").rules('remove');
        $("#NomeDocumento").rules('remove');
        $("#SerieDocumento").rules('remove');

        switch (value) {
            case "Interno":

                $("#divIntSerieDocumental").css("display", "block");
                $("#divExtOrgao").css("display", "none");
                $("#divNomeDocumento").css("display", "none")

                $("#SerieDocumento").rules("add", {
                    required: true,
                    messages: {
                        required: "O campo Série é obrigatório!"
                    }
                });


                break;

            case "Externo":

                $("#divIntSerieDocumental").css("display", "none");
                $("#divExtOrgao").css("display", "block")
                $("#divNomeDocumento").css("display", "block")

                $("#OrgaoExternoAutoComplete").rules("add", {
                    required: true,
                    minlength: 4,
                    messages: {
                        required: "O campo Origem é de preenchimento obrigatório."
                    }
                });

                $("#NomeDocumento").rules("add", {
                    required: true,
                    messages: {
                        required: "O campo Nome Documento é de preenchimento obrigatório."
                    }
                });
                break;
        }
    }

    function exibirMensagemSerieDocumental() {
        $("#btnSalvar").off('click');
        $("#btnSalvar").on('click', function () {

            if (($("#SerieDocumento").val() === "" || $("#SerieDocumento").val() == null || $("#SerieDocumento").val() === "0") && $('input[name=Origem]:checked').val() === "Interno") {

                $('.field-validation-error[data-valmsg-for="SerieDocumento"]').html('O campo Série Documental é de preenchimento obrigatório');
                $('.field-validation-error[data-valmsg-for="SerieDocumento"]').show();

                var msg = [];
                msg.push("A Série Documental é obrigatória. Para obtê-la digite ");
                msg.push("a série no campo “Descrição” ou selecione as opções dos campo Função/Sub Função/Atividade e Série");

                BASE.MostrarMensagem(msg, TipoMensagem.Error);
                return false;

            } else {
                $('.field-validation-error[data-valmsg-for="SerieDocumento"]').hide();
            }
            return false;
        });
    }

    return {
        Init: function () {
            init();
        }
    }

}());

$(function () {
    DOCUMENTO.Init();
});



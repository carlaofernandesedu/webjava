var CLASSIFICACAO = (function () {

    var form = $("#form-detalhe");

    function init() {
        console.log('atendimento-classificacao.js');
        CRUDBASE.Eventos.PosCarregarEditar = posCarregarEditar;
        CRUDFILTRO.Carregar = carregarFiltro;
        CRUDBASE.Eventos.PosLimparEditar = propagarClassificacaoPai;
        CONTROLES.Tabela.Configurar();
        bindLimpar();

        CRUDBASE.VerificarModo();
    }

    function bindLimpar() {
        $('.frm-filtro').on('click', '.acoes #btnLimpar', function () {
            $('.frm-filtro #IdPai').val('');

            return false;
        });
    }

    function carregarFiltro() {
        CONTROLES.DropDown.Preencher('.frm-filtro #Codigo', 'Classificacao', 'SelectList', null, "Nenhum");

        //Cascade Dropdown
        CLASSIFICACAO_CASCADE_DDL.SetIdObject("#IdPai");
        $('#filtrar').slideToggle('show');

    }

    function posCarregarEditar() {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdPai', 'Classificacao', 'SelectList', null, "Nenhum");

        console.log('posCarregarEditar');
        CONTROLES.DropDown.Preencher('#form-detalhe #IdArea', 'Area', 'SelectList', null, true, false, false, function () {
            CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdArea', '#IdAssunto, #IdProblema', false, "Selecione", function (idPai) {
                if (idPai) {
                    console.log('areaselecionada: ' + idPai);
                    selectArea(idPai);

                    form.find("#IdAssunto").rules('remove', "required");
                }
            });
            CONTROLES.DropDown.DefinirChain('#form-detalhe', '#IdAssunto', '#IdProblema', false, "Selecione", function (idPai) {
                if (idPai) {
                    console.log('assuntoselecionado-' + idPai);
                    CONTROLES.DropDown.Preencher('#form-detalhe #IdProblema', 'Problema', 'SelectList', idPai, true);
                }
            });
        });

        bindChangeIdPai();

        bindChangeVisibilidade();

        $('#form-detalhe').find("#Externa").trigger("change");
    }

    function selectArea(idArea) {
        CONTROLES.DropDown.Preencher('#form-detalhe #IdAssunto', 'Assunto', 'SelectList', idArea, true, false, false, function () {

            var idAssunto = $('#IdAssunto option:selected').val();  

            debugger          
            CONTROLES.DropDown.Preencher('#form-detalhe #IdProblema', 'Problema', 'SelectList', idAssunto, true);
        });


        //if ($('#Pai').val() !== undefined && $('#Pai').val() != '') {
        //    var pai = JSON.parse($('#Pai').val());
        //    if (pai !== null) {
        //        $('#form-detalhe select[name="Externa"]').val(pai.Resultado.Externa.toString());
        //        $('#form-detalhe select[name="Status"]').val(pai.Resultado.Status.toString());

        //        $('#form-detalhe select[name="Externa"]').find('option[value!="' + pai.Resultado.Externa.toString() + '"]').prop('disabled', true);
        //        $('#form-detalhe select[name="Status"]').find('option[value!="' + pai.Resultado.Status.toString() + '"]').prop('disabled', true);

        //        $('#StatusEdicao').val(pai.Resultado.Status.toString());
        //    }
        //}
    }

    function bindChangeVisibilidade() {
        form.on("change", "#Externa", function () {
            var that = $(this);
            var showDiv = that.val() === "true";
            var ruleAction = showDiv ? "add" : "remove";

            form.find("#divOnlyExternal").toggle(showDiv);

            form.find("#IdArea").rules(ruleAction, "required");
            form.find("#IdAssunto").rules(ruleAction, "required");
            form.find("#IdProblema").rules(ruleAction, "required");
        });
    }

    function bindChangeIdPai() {
        $('#form-detalhe').off('change', '#IdPai');
        $('#form-detalhe').on('change', '#IdPai', function () {
            propagarStatusVisibilidadePai($(this));

            return false;
        });

        $('.frm-filtro input').keypress(function (e) {
            if (e.keyCode === 13) {
                filtrar();

                return false;
            }
        });
    }

    function propagarClassificacaoPai() {
        var ddl = $('#form-detalhe #IdPai');

        propagarStatusVisibilidadePai(ddl);
    }

    function propagarStatusVisibilidadePai(ddl) {
        var selectedOption = ddl.find(':selected');
        var statusPai = selectedOption.data('status');
        var visibilidadePai = selectedOption.data('externa');

        var ddlStatus = $('#form-detalhe select[name="Status"]');
        var ddlVisibilidade = $('#form-detalhe select[name="Externa"]');

        ddlHerdar(ddlStatus, statusPai);
        ddlHerdar(ddlVisibilidade, visibilidadePai);

        ddlVisibilidade.trigger("change");

        $('#StatusEdicao').val(statusPai);
    }

    function ddlHerdar(ddl, valorPai) {
        if (valorPai === undefined || valorPai === null || valorPai === '') {
            ddl.val('');
            //ddl.removeAttr("disabled");
            ddl.find('option').prop('disabled', false);
        } else {
            ddl.val(valorPai.toString());
            ddl.find('option').prop('disabled', false);
            ddl.find('option[value!="' + valorPai + '"]').prop('disabled', true);
            //ddl.attr("disabled", "disabled");
        }
    }

    return {
        Init: init
    };
}());

$(function () {
    CLASSIFICACAO.Init();
    CRUDFILTRO.Carregar();
});
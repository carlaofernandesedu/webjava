ProcessoDocumento = (function () {

    function init() {
        bindAll();
        CRUDBASE.Eventos.PosListar = bindAcoesLista;
    }

    function bindAll() {
        bindExibirModalAutuar();
        bindAutuarProcesso();
        bindFormatarMascara();
        //bindCarregarPaginacao();
    }

    //function bindCarregarPaginacao() {
    //    $('#grupo_lista_relacionar').DataTable({
    //        /*Coluna que não permite ordenação, partindo do array 0*/
    //        "aoColumnDefs": [
    //            {
    //                "bSortable": false,
    //                "aTargets": ["no-sort"]
    //            },
    //            {
    //                "word-wrap": "break-word",
    //                "aTargets": ["col-wrap"]
    //            }],

    //        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
    //        "order": [[0, "asc"]],

    //        /*Resposividade da tabela*/
    //        responsive: false
    //    });
    //}

    function bindFormatarMascara() {

        $('#NrProtocolo').mask('000000/0000', { reverse: true, placeholder: '______/____' }).attr('maxlength', '11');
        $('#NrProtocolo').change(function () {
            $('#NrProtocolo').val(adicionarZeroEsquerda($(this).val()));
            if ($('#NrProtocolo').val().indexOf('000000') >= 0) {
                $('#NrProtocolo').val('');
            }
        });
    }

    function adicionarZeroEsquerda(num) {
        var str = ("" + num);
        return (Array(Math.max(12 - str.length, 0)).join("0") + str);
    }

    function bindExibirModalAutuar() {

        $('.btnModalAutuar').off('click');
        $('.btnModalAutuar').on('click', function () {
            var nrDocumento = $(this).data("id");
            var anoDocumento = $(this).data("ano");
            bindBuscarDetalheDocumento(nrDocumento, anoDocumento);
        });
    }

    function bindBuscarDetalheDocumento(nrDocumento, anoDocumento) {
        $.ajax({
            url: "/AutuarProcesso/DetalharDocumento",
            type: 'GET',
            cache: false,
            data: { nrDocumento: nrDocumento, anoDocumento: anoDocumento },
            success: function (data) {

                $("#modalDetalhe").html(data);
                $("#modalDetalhe").modal("show");
            }
        });
    }

    function bindAutuarProcesso() {
        $('#modalDetalhe').off('click', 'div #btnSalvar');
        $('#modalDetalhe').on('click', 'div #btnSalvar', function () {

            $('#form-detalhe #btnSalvar').prop('disabled', true);
            $('#form-detalhe #btnSalvar').attr('disabled', 'disabled');

            var form = $("#form-detalhe").serialize();
            var dsSerieDocumental = $("#DescricaoSerieDocumental").val().replace(/[.*]/g, "");
            var CodigoCompetencia = 0;

            var d = new Date();
            var ano = d.getFullYear();

            var re = /\d+/g;
            var result = re.exec(dsSerieDocumental);

            
            if (result != null)
                result[0] == 11020602 ? CodigoCompetencia = 1 : CodigoCompetencia = 2;

            var processo =
                {
                    CodigoCompetencia: CodigoCompetencia,
                    Ano: ano,
                    Informacao: $("#Informacao").val(),
                    Sigilo: false,
                    Situacao: 1,
                    Documento: $("#Codigo").val()
                };

            bindSalvarModal(processo);

            $('#form-detalhe #btnSalvar').prop('disabled', false);
            $('#form-detalhe #btnSalvar').removeAttr('disabled');
        })
    }

    function bindSalvarModal(processo) {

        if (bindRequired()) {

            $.ajax({
                url: "/Processo/AutuarProcesso",
                type: 'POST',
                cache: false,
                data: { model: processo },
                success: function (data) {
                    if (data.Sucesso) {
                     
                        var idUsuario = $("#tbodyProcesso").data("idusuario");
                        var idUa = $("#tbodyProcesso").data("idua");

                        window.open("/RegistrarProcesso/EmitirFolhaLiderProcesso?nrProcesso=" + data.Resultado.NumeroProcesso + "&anoProcesso=" + data.Resultado.AnoProcesso + "&nrCompetencia=" + data.Resultado.CodigoCompetencia);
                        window.location = "/RegistrarProcesso/Editar/" + data.Resultado.IdDocumento;                        

                        BASE.MostrarMensagem(data.Mensagem, TipoMensagem.Sucesso);
                    }
                    else
                        BASE.MostrarMensagem(data.Mensagem, TipoMensagem.Error);

                    bindPosSalvarModal();
                },
                error: function (e) {
                    console.log('Erro \n' + e);
                    BASE.MostrarMensagem(e, TipoMensagem.Error);
                    location.reload();
                }
            });
        }
        return false;
    }

    function bindPosSalvarModal() {
        $("#Informacao").val("");
        bindEsconderModal();
        CRUDFILTRO.Filtrar();
    }

    function bindEsconderModal() {
        $("#modalDetalhe").modal("hide");
    }

    function bindRequired() {

        var x = document.forms["form-detalhe"]["Informacao"].value;
        if (x == null || x == "") {
            BASE.MostrarMensagem("O campo de Informações Processuais é de preenchimento obrigatório", TipoMensagem.Error);
            return false;
        }
        else
            return true;
    }

    function bindAcoesLista() {
        bindExibirModalAutuar();
        bindAutuarProcesso();
    }

    return {
        Init: function () {
            init();
            ExibirModalAutuar: bindExibirModalAutuar
        },
        Eventos: {
            PosCarregarDetalhe: function () { return false; }
        }
    };
}());

$(function () {
    ProcessoDocumento.Init();
    CRUDFILTRO.Filtrar();
});

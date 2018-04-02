EMITIRPROTOCOLO = (function () {

    function Init() {
        bindAll();
    }

    function bindAll() {
        inicializarFuncaoEnter();
        InicializarTabelaProtocolo();
        bindGerarProtocolos()
        IdentificarTipoInteracao();
        Limpar();
    }

    function inicializarFuncaoEnter() {
        $(document).on('keydown', function (event) {
            if (event.keyCode !== 13) return;
            SubmiterFormulario();
        });

        $('#QtdProtocolos').on('keydown', function (event) {
            if (event.keyCode === 13) { 
                SubmiterFormulario();
                return false;
            }
            return true;
        });              
    }

    function InicializarTabelaProtocolo() {
        $('#tblProtocolo').dataTable({
            /*Colunas que não permitem ordenação, partindo do array 0*/
            "aoColumnDefs": [{
                "bSortable": false,
                "aTargets": [1, 2, 3, 4, 5]
            }],

            /*Coluna que inicia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "desc"]],

            /*Resposividade da tabela*/
            responsive: true,
            "bDestroy": true
        });
        $('select[name=tblProtocolo_length]').addClass('tabela-length');
    }

    function IdentificarTipoInteracao() {
        $('input[name="TipoEmissao"]').change(function (e) {
            if ($(this).val() == 0) {
                GerenciarInputQtdeProtocolos(true);
            } else {
                GerenciarInputQtdeProtocolos(false);
                $('#QtdProtocolos').focus();
            }
        });
    }

    function GerenciarInputQtdeProtocolos(status) {
        $('#QtdProtocolos').prop('disabled', status);
        $('#QtdProtocolos').val("");
        $('.protocolos').mask('00');
    }

    function Limpar() {
        $('#QtdProtocolos').val("");
    }


    function bindGerarProtocolos() {
        $('#btnGerarProtocolos').off('click');
        $('#btnGerarProtocolos').on('click', function () {
            SubmiterFormulario();
        });
    }


    function SubmiterFormulario() {

        var frm = $('#frmProtocolo');

        if (frm.valid()) {

            if ($('input[name="TipoEmissao"]:checked').val() == 0) {
                $.ajax({
                    type: 'POST',
                    url: '/Documento/Emitir/',
                    data: frm.serialize(),
                    success: function (data) {
                        $("body").empty();
                        $("body").append(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem(JSON.parse(XMLHttpRequest.responseText), TipoMensagem.Error);
                    }
                })
            }
            else {
                $.ajax({
                    type: 'POST',
                    url: '/Documento/Emitir/',
                    data: frm.serialize(),
                    async: false,
                    success: function (data) {
                        CarregarPDFNovaJanela("/Documento/ImprimirMultiplosProtocolos/", JSON.stringify(data.ids));

                        setTimeout(function () {
                            window.location.href = '/Documento';
                        }, 500);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BASE.MostrarMensagem(JSON.parse(XMLHttpRequest.responseText), TipoMensagem.Error);
                    }
                })
            }
        }
    };

    function CarregarPDFNovaJanela(url, data) {
        //Cria um Novo Formulário Oculto.
        var form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
        form.action = url;
        form.style.display = "none";

        //Cria um Hidden para Receber os Dados.
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "id";
        input.value = data;
        form.appendChild(input);

        //Vincula o Hidden ao Formulário, submete o Formulário e Remove a Estrutura Criada.
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    return {
        Init: function () {
            Init();
        }
    }

}());

$(function () {
    EMITIRPROTOCOLO.Init();
});



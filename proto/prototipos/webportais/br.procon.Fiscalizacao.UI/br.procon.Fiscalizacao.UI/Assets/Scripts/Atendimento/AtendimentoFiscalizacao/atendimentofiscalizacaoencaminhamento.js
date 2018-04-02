var ATENDIMENTOFISCALIZACAOENCAMINHAMENTO = (function () {

    var formOk = false;
   
    function init() {
        bindAll();
        CONTROLES.Editor.Configurar();
        $(".Editor-editor").height(660);

    }

    function bindAll() {
        
        $(document).ready(function(){
            bindBtnPrevisualizar();
            carregaPreviaDocumento();
            
        });         
        
          
    }

    function bindVoltarAtendimento() {
        $('a[class*=btnVoltar]').off('click');
        $('a[class*=btnVoltar]').on('click', function () {           

            var idFicha = getUrlParameter("idFichaAtendimento");
            window.location = "/AtendimentoFiscalizacao/EditarEncaminhamento?idFichaAtendimento=" + idFicha + "&atendTec=True&urlref=pesquisa";

        });

    }

    function bindBtnPrevisualizar() {
        $("#btnPrevisualizar").off("click");
        $("#btnPrevisualizar").on("click", function() {
            var idFichaAtendimento = $("#IdFichaAtendimento").val(),
                texto = $("#mensagem").val();         

            var data = $('#frmAtendimentoInformacaoComplementar').serializeObject();   

            data.mensagem = $(' .Editor-editor').html();

            texto = data.mensagem;

            var model = JSON.stringify(data);

            localStorage.setItem('form_cip', model);

            ATENDIMENTOBASE.Acao.Encaminhamento.Previsualizar(idFichaAtendimento, texto, function (response) {
                $("#conteudo-visualizacao").html(response);
                bindEncaminharFiscalizacao();
                bindVoltarAtendimento();
            });
        });
    }

    function bindEncaminharFiscalizacao() {
        $(".btnGerarEncaminhamento").off("click");
        $(".btnGerarEncaminhamento").on("click", function() {
            gerarEncaminhamentoFiscalizacao();            
        });
    }

    function gerarEncaminhamentoFiscalizacao() {
        var idFichaAtendimento = $("#IdFichaAtendimento").val(),
            corpo = $("#corpo").val();

        var urlRedirect = ATENDIMENTOBASE.Redirect.Obter();

        ATENDIMENTOBASE.Acao.Encaminhamento.Gerar(idFichaAtendimento, corpo, function (data) {
            window.open("/AtendimentoConsumidor/ImprimirDocumentoProduzido?IdDocumento=" + data.IdDocumentoProduzido, "_blank");
            window.location = urlRedirect;
        });
    }

     function carregaPreviaDocumento(){

        var form  = '#frmAtendimentoInformacaoComplementar';
        var data = localStorage.getItem('form_cip');
        
        if(data != null && data != undefined){

            data = JSON.parse(data);            
            $(' .Editor-editor').html(data.mensagem);

        }

    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

     $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], textarea, input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function () {
            if ($(this).attr('type') == 'hidden') {
                //if checkbox is checked do not take the hidden field                
                var $parent = $(this).parent(); var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '')
                return;
            var elemValue = null;
            if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) { o[this.name] = [o[this.name]]; } o[this.name].push(elemValue || '');
            }
            else {
                o[this.name] = elemValue || '';
            }
        }); return o;
    }

    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    ATENDIMENTOFISCALIZACAOENCAMINHAMENTO.Init();
});
MANTERALERTADAOC = (function () {

    var form = $("#form-manter-alerta-daoc");

    function init() {
        bindAll();
        CRUDFILTRO.Evento.PosListar = posListar;

    }

    function bindAll() {
        bindSelectTipoAlertaDaoc();
        bindCarregarPaginacao();
    }

    function bindControleBtn() {
        bindBtnPesquisar();
        bindBtnNovo();
        bindBtnEditar();
        bindBtnDetalhar();
        bindBtnExcluir();
    }

    function bindBtnPesquisar() {
        $("#frmFiltroManterAlertadaDaoc #btn-pesquisar").off("click");
        $("#frmFiltroManterAlertadaDaoc #btn-pesquisar").on("click", function () {
            var filtro = $("#frmFiltroManterAlertadaDaoc").serializeObject();

            listar(filtro);
        });
    }

    function bindBtnNovo() {
        $("#btn-novo").off("click");
        $("#btn-novo").on("click", function () {
           
            window.location = BASE.Url.Simples("/ManterAlertadaDaoc/Novo");
        });
    }

    function bindBtnEditar() {
        $("#alerta-daoc #tb-alerta-daoc .btn-editar-alerta").off("click");
        $("#alerta-daoc #tb-alerta-daoc .btn-editar-alerta").on("click", function () {
            console.log("editando detalahndo alerta daoc");
            var id = $(this).data("id");

            if (id !== undefined)
                window.location = BASE.Url.Simples("/ManterAlertadaDaoc/Editar?id=", id);
        });
    }

    function bindBtnDetalhar() {
        $("#alerta-daoc #tb-alerta-daoc .btn-detalhar-alerta").off("click");
        $("#alerta-daoc #tb-alerta-daoc .btn-detalhar-alerta").on("click", function () {
            console.log("detalahndo alerta daoc");
            var id = $(this).data("id");

            if (id !== undefined)
                window.location = BASE.Url.Simples("/ManterAlertadaDaoc/Detalhar?id=", id);
        });
    }

    function bindBtnExcluir() {
        $("#alerta-daoc #tb-alerta-daoc .btn-excluir-alerta").off("click");
        $("#alerta-daoc #tb-alerta-daoc .btn-excluir-alerta").on("click", function () {
            console.log("excluindo alerta daoc");
            var id = $(this).data("id");
            BASE.Modal.ExibirModalConfirmacao(
                "Atenção",
                "Deseja mesmo excluir o registro?",
               TamanhoModal.Pequeno,
                "Não",
                "btn-primary",
                "Sim",
                "btn-danger",
                function () {
                    excluir(id);
                },
                null);
        });
    }

    function bindCarregarPaginacao() {
        $('#tb-alerta-daoc').dataTable({
            /*Coluna que não permite ordenação, partindo do array 0*/
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": ["no-sort"],
                },
                {
                    "word-wrap": "break-word",
                    "aTargets": ["col-wrap"]
                }],

            /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
            "order": [[0, "asc"]],

            /*Resposividade da tabela*/
            responsive: false,
            destroy: true
        });
    }

    function bindSelectTipoAlertaDaoc() {
        CONTROLES.DropDown.Preencher("#IdTipoLista", "ManterAlertadaDaoc", "ComboTipoAlertaDaoc", null, true);
    }

    function posListar(parameters) {
        bindControleBtn();
        bindCarregarPaginacao();
    }

    function listar(filtro) {

        $.ajax({
            url: "/ManterAlertadaDaoc/Listar",
            type: "GET",
            data: filtro,
            success: function (response, status, xhr) {
             
                var isJson = BASE.Util.ResponseIsJson(xhr);

                if (!isJson) {
                    BASE.Util.RenderHtml("#alerta-daoc", response, posListar);
                }

            }, error: function (response, status, xhr) {
                console.log("erro ao listar alerta daoc");
            }
        });
    }

    function editar(id) {

        $.ajax({
            url: "/ManterAlertadaDaoc/Editar",
            type: "POST",
            data: { id: id },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    BASE.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao editar alerta daoc", TipoMensagem.Error, "Erro");

                else {
                    BASE.Mensagem.Mostrar("Registro editado com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            }, error: function (response, status, xhr) {
                console.log("erro ao editar alerta daoc");
            }
        });
    }

    function detalhar(id) {

        $.ajax({
            url: "/ManterAlertadaDaoc/Detalhar",
            type: "POST",
            data: { id: id },
            success: function (response, status, xhr) {
                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined)
                    BASE.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined)
                    BASE.Mensagem.Mostrar("Erro ao detalhar alerta daoc", TipoMensagem.Error, "Erro");

                else {
                    BASE.Mensagem.Mostrar("Registro detalhado com sucesso", TipoMensagem.Sucesso, "Sucesso");
                }
            }, error: function (response, status, xhr) {
                console.log("erro ao detalhar alerta daoc");
            }
        });
    }

    function excluir(id) {

        $.ajax({
            url: "/ManterAlertadaDaoc/Excluir",
            type: "POST",
            data: { id: id },
            success: function (response, status, xhr) {

                if (response.MensagensCriticas !== null && response.MensagensCriticas !== undefined && response.MensagensCriticas.length !== 0)
                    BASE.MostrarMensagensAlerta(response);

                else if (response.Erro !== null && response.Erro !== undefined && response.Erro.length !== 0)
                    BASE.Mensagem.Mostrar("Erro ao excluir alerta daoc", TipoMensagem.Error, "Erro");

                else {
                    BASE.Mensagem.Mostrar("Registro excluído com sucesso", TipoMensagem.Sucesso, "Sucesso");

                    var filtro = { NomeAlerta: "", IdTipoLista: null, Ativo: null };

                    listar(filtro);
                }
            }, error: function (response, status, xhr) {
                console.log("erro ao excluir alerta daoc");
            }
        });
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
        }
    };
}());

$(function () {
    MANTERALERTADAOC.Init();
    CRUDFILTRO.Filtrar();
});
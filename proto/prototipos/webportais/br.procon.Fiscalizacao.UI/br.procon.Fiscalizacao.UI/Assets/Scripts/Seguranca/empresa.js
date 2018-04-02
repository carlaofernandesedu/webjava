var EMPRESA = (function () {

    function init() {
        cacheSelectors();
        displayHandler();
        bindProvider();
    }

    function cacheSelectors() {
        __FORNECEDOR = "Fornecedor";
        __VAZIO = "";

        contexto = $("#conteudo-empresa");
        regraObrigatorioSeFornecedor = $(".fornecedor");
        empresaTipo = $("#TipoEmpresa");
        empresaCnpj = $("#CNPJ");

        empresaFornecedor = $('#Fornecedor');
        empresaRazaoSocial = $('#RazaoSocial');
        empresaNomeFantasia = $('#NomeFantasia');
        empresaCEP = $('#CEP');
        empresaLogradouro = $('#Logradouro');
        empresaNumero = $('#Numero');
        empresaComplemento = $('#Complemento');
        empresaBairro = $('#Bairro');
        empresaMunicipio = $('#Municipio');
        empresaUF = $('#UF');
    }

    function displayHandler() {
        contextDisplayHandler();
        requiredDisplayHandler();
    }

    function contextDisplayHandler() {
        if (empresaTipo.val() === __VAZIO) {
            contexto.hide();
        }
        else {
            contexto.show();
        }
    }

    function requiredDisplayHandler() {
        if (empresaTipo.val() === __FORNECEDOR) {
            regraObrigatorioSeFornecedor.removeClass("invisible");
        }
        else {
            regraObrigatorioSeFornecedor.addClass("invisible");
        }
    }

    function findCNPJ() {
        if (empresaCnpj.val() !== __VAZIO) {

            if (!validarCNPJ(empresaCnpj.val())) {
                BASE.MostrarMensagemErro("CNPJ inválido.");
                return;
            }

            $.ajax({
                url: "/Fornecedor/GetFornecedorByCNPJ",
                data: { cnpj: empresaCnpj.val().replace(/[^\d]+/g, __VAZIO) },
                success: function (result) {
                    if (result.retorno !== undefined && result.retorno !== __VAZIO && result.retorno.PJ !== undefined) {
                        
                        empresaFornecedor.val(result.retorno.Codigo);
                        empresaRazaoSocial.val(result.retorno.Nome);
                        empresaNomeFantasia.val(result.retorno.NomeFantasia);

                        if (result.retorno.EnderecoSEFAZ !== undefined) {
                            empresaCEP.val(result.retorno.EnderecoSEFAZ.CEP);
                            empresaLogradouro.val(result.retorno.EnderecoSEFAZ.Logradouro);
                            empresaNumero.val(result.retorno.EnderecoSEFAZ.Numero);
                            empresaComplemento.val(result.retorno.EnderecoSEFAZ.Complemento);
                            empresaBairro.val(result.retorno.EnderecoSEFAZ.Bairro);
                            empresaMunicipio.val(result.retorno.EnderecoSEFAZ.Municipio.Descricao);
                            empresaUF.val(result.retorno.EnderecoSEFAZ.Municipio.UF);
                        }
                    }
                    else {
                        BASE.MostrarMensagem("O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.");
                        reset();
                    }
                },
                error: function () {
                    BASE.MostrarMensagem("O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.");
                    reset();
                }
            });
        }
    }

    function reset() {
        empresaFornecedor.val(__VAZIO);
        empresaRazaoSocial.val(__VAZIO);
        empresaNomeFantasia.val(__VAZIO);
        empresaCEP.val(__VAZIO);
        empresaLogradouro.val(__VAZIO);
        empresaNumero.val(__VAZIO);
        empresaComplemento.val(__VAZIO);
        empresaBairro.val(__VAZIO);
        empresaMunicipio.val(__VAZIO);
        empresaUF.val(__VAZIO);
    }

    function bindProvider() {
        empresaTipo
            .off("change")
            .on("change", displayHandler);

        empresaCnpj
            .off("blur")
            .on("blur", findCNPJ);
    }

    return {
        Inicializar: init
    }
}());

$(function () {
    EMPRESA.Inicializar();
});
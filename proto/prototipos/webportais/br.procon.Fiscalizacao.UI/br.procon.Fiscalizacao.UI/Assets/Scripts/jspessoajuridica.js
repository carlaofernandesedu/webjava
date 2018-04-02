jQuery(document).ready(function () {
    //$('.loadCNPJ').on('blur', CarregaCNPJ());
}
);

function CarregaCNPJ() {  
    var cnpj = $(".loadCNPJ").val();
    if (cnpj != "") {

        if (!validarCNPJ(cnpj)) {
            BASE.MostrarMensagemErro('CNPJ inválido.');
            return;
        }

        var errorArray = {};
        var $this = $(this);
        //$this.spinner();
        $.ajax({
            url: "/Fornecedor/GetFornecedorByCNPJ",
            data: { cnpj: $(".loadCNPJ").val().replace(/[^\d]+/g, '') },
            success: function (result) {
                if (result != null && result != "" && result.PJ != null) {

                    $('#Telefone').unmask();
                    $('#Cep').unmask();
                    $('#InscricaoEstadual').unmask();

                    $('#RazaoSocial').val(result.Nome);
                    $('#TermoColeta_RazaoSocial').val(result.NomeFantasia);
                    $('#NomeFantasia').val(result.NomeFantasia);
                    $('#InscricaoEstadual').val(result.PJ.IE);
                    $('#Telefone').val(result.Telefone);

                    if (result.CNAE != null) {
                        $('#CNAE_Codigo').val(result.CNAE.Codigo);
                        $('#CNAE_Descricao').val(result.CNAE.Descricao);
                    }

                    if (result.EnderecoSEFAZ != null) {
                        $('#Cep').val(result.EnderecoSEFAZ.CEP);
                        $('#Endereco').val(result.EnderecoSEFAZ.Logradouro);
                        $('#Cidade').val(result.EnderecoSEFAZ.Municipio.Descricao);
                        $('#UFFornecedor').val(result.EnderecoSEFAZ.Municipio.UF);
                    }                    

                    $('#Telefone').mask('(00) 0000-0000');                   
                    $('#InscricaoEstadual').mask('000.000.000.000');
                    $('#Cep').mask('00000-000');

                }
                else {
                    BASE.MostrarMensagem('O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.');
                    LimparDadosFornecedor();
                }
            },
            error: function () {
                BASE.MostrarMensagem('O Número do CNPJ não foi encontrado, por favor insira os dados do fornecedor.');
                LimparDadosFornecedor();
            }
        });
    }
}

function LimparDadosFornecedor() {
    $('#RazaoSocial').val('');
    $('#NomeFantasia').val('');
    $('#InscricaoEstadual').val('');
    $('#CNAE_Descricao').val('');
    $('#Telefone').val('');
    $('#RamoAtividade').val('');
    $('#Cep').val('');
    $('#Endereco').val('');
    $('#Cidade').val('');
    $('#UFFornecedor').val('');
}

function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2;
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;

}
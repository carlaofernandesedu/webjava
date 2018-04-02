TESTE = (function () {
    var data = new Date();
    var dataTexto = data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();

    function gerarFornecedorPJ(){

        $('#TipoFornecedor').val('2');

        // Obrigatórios
        $("#TipoPessoaFisica").hide();
        $("#TipoPessoaJuridica").show();

        $('#PJ_CNPJ').val('51.157.855/0001-61');
        $('#PJ_IE').val('123456');
        $('#PJ_RazaoSocial').val('Fornecedor PJ Gerado');
        $('#PJ_NomeFantasia').val('Lojas ' + dataTexto);

        $('#Email').val('rolando@lero.com.br');

        $('#Status').val('true');


        $('#EnderecoSEFAZ_CEP').val('01412-000');
        $('#EnderecoSEFAZ_CEP').trigger('blur');

        $('#EnderecoSEFAZ_Numero').val('7');

        // opcionais
        $('#PJ_CNAEID').val('3');
        $('#PJ_CNAEID').trigger('change');
        $('#FAX').val('(15) 6516-5165');
        $('#WebSite').val('http://www.pudim.com.br');
        $('#Telefone').val('(15) 6516-5165');
    }

    function gerarFornecedorPF() {

        $('#TipoFornecedor').val('1');

        // Obrigatórios
        $("#TipoPessoaFisica").show();
        $("#TipoPessoaJuridica").hide();

        $('#PF_CPF').val('132.676.506-07');
        $('#PF_RG').val('12.345.678-9');
        $('#PF_Nome').val('Fornecedor PF Gerado');
        $('#PF_DataNascimento').val('10/02/1980');

        $('#Email').val('rolando@lero.com.br');

        $('#Status').val('true');


        $('#EnderecoSEFAZ_CEP').val('11702-310');
        $('#EnderecoSEFAZ_CEP').trigger('blur');

        $('#EnderecoSEFAZ_Numero').val('7');

        // opcionais
        $('#PF_CNAEID').val('3');
        $('#PF_CNAEID').trigger('change');
        $('#FAX').val('(15) 6516-5165');
        $('#WebSite').val('http://www.pudim.com.br');
        $('#Telefone').val('(15) 6516-5165');
    }

    function gerarEmpresa() {

        // Obrigatórios
        $('#RazaoSocial').val('Empresa Teste');
        $('#NomeFantasia').val('Lojas ' + dataTexto);

        $('#CNPJ').val('51.157.855/0001-61');
        $('#TipoEmpresa').val('1');

        $('#Email').val('rolando@lero.com.br');

        $('#Status').val('true');


        $('#CEP').val('01412-000');
        $('#CEP').trigger('blur');

        $('#Numero').val('7');
    }

    return {
        GerarFornecedorPJ: gerarFornecedorPJ,
        GerarFornecedorPF: gerarFornecedorPF,
        GerarEmpresa: gerarEmpresa
    }
}());
DADOSFORNECEDOR = (function () {

    function init() {
        bindAll();
    }
    function bindAll() {
        selecionarCpfCnpj();
        bindCep();
    }

    function selecionarCpfCnpj() {
        $('#NumDocumento').attr('disabled', 'disabled');
        $('input[name="tipoDocumento"]').change(function (e) {
            $('#NumDocumento').val('');
            $('#NumDocumento').removeAttr('disabled');
            definirMascaraCpfCnpj($(this).val());
        });

    }
    function definirMascaraCpfCnpj(tipo) {
        var cnpj = tipo == 0 ? true : false;
        $('#TipoDocumento').val(cnpj);
     
        if (tipo == 0) {
            $('#NumDocumento').mask('00.000.000/0000-00');
          
        } else {
            $('#NumDocumento').mask('000.000.000-00');
          
        }
        $('#NumDocumento').val($('#NumDocumento').masked($('#NumDocumento').val()));
    }

    function bindCep() {
        $('input[name="Cep"]').off('blur');
        $('input[name="Cep"]').on('blur', function () {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "/Cep/GetEnderecoByCep",
                cache: false,
                data: { cep: $(this).val().replace(/[^\d]+/g, '') },
                success: function (data) {
                    if (data === "") {
                        BASE.Mensagem.Mostrar("CEP", "CEP não localizado", TipoMensagem.Alerta);
                        console.log("Cep não foi localizado!");
                    } else {

                        data = JSON.parse(data);

                        $('#IdMunicipio').val(data[0].idMunicipio);
                        $('#Logradouro').val(data[0].enderecoAbrev);
                        $('#Bairro').val(data[0].bairro);
                        $('#Cidade').val(data[0].municipio);
                        $('#Estado').val(data[0].uf);

                        $('#Logradouro').valid();
                        $('#Bairro').valid();
                        $('#Cidade').valid();
                        $('#Estado').valid();

                        $('#Numero').focus();
                    }
                },
                error: function () {
                    BASE.Mensagem.Mostrar("CEP", "CEP não localizado", TipoMensagem.Alerta);
                    console.log("Cep não foi localizado!");
                }
            });
        });
    }
    
    return {
        Init: function () {
            init();
        }
    };
}());

$(function () {
    DADOSFORNECEDOR.Init();
});


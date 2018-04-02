$(document).ready(function () {
    LoadCEP();
});

function LoadCEP() {
    //if (BloquearCamposEndereco != undefined) {
    //    BloquearEndereco(true);
    //}

    $(".loadCEP").blur(function (evt) {
        if ($(".loadCEP").val() != "") {
            var errorArray = {};
            var $this = $(this);
            
            $.ajax({
                url: "/Cep/GetEnderecoByCep",
                data: { cep: $this.val().replace(/[^\d]+/g, '') },
                cache: false,
                success: function (result) {

                    if (result != null && result != "") {
                        var enderecoPesquisado = jQuery.parseJSON(result);
                        
                        var drt = $('#Drt'); // HACK isso foi feito pra não quebrar outras funcionalidades.
                        if (drt.length > 0) {
                            CEPHELPER.CarregarMunicipios('#Municipio', enderecoPesquisado[0].uf, enderecoPesquisado[0].municipio);
                        }
                        

                        if (enderecoPesquisado[0].numeroIBGE != null) {
                            $('#UF option:not(:selected),.loadUF option:not(:selected)').attr('disabled', false);
                            $('#Logradouro,.loadLogradouro').val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                            $('#Endereco').val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                            $('#Bairro,.loadBairro').val(enderecoPesquisado[0].bairro);
                            $('#Municipio,.loadMunicipio').val(enderecoPesquisado[0].municipio);
                            $('#UF,.loadUF').val(enderecoPesquisado[0].uf);

                            if ($('#IdMunicipio').length > 0) {
                                $('#IdMunicipio').val(enderecoPesquisado[0].idMunicipio);
                            }

                            if ($('#UF,.loadUF').val() === null) {
                                $('#UF,.loadUF').val(enderecoPesquisado[0].idUf);
                            }

                            $('#ddlPais').val(1);

                            jQuery("#Municipio option").removeAttr("selected").each(function () {
                                if (jQuery(this).html() == enderecoPesquisado[0].municipio) {
                                    jQuery(this).attr("selected", "selected");
                                }
                            });
                            
                            BloquearEndereco(true);
                            $('#Numero').focus();
                        }
                    }
                    else {
                        errorArray[".loadCEP"] = 'CEP não cadastrado na base de dados. Favor preencher os campos!';
                        BASE.MostrarMensagem('CEP não cadastrado na base de dados. Favor preencher os campos!', TipoMensagem.Error)
                        BloquearEndereco(false);
                        return false;
                    }
                }
            });
        }
    });
}

function BloquearEndereco(bloq)
{


    $(".loadBairro").prop("readonly", bloq);
    $(".loadMunicipio").prop("readonly", bloq);
    $(".loadUF").attr("readonly", bloq);

    if ($(".loadBairro").val() == "") { $(".loadBairro").prop("readonly", false); }
    if ($(".loadMunicipio").val() == "") { $(".loadMunicipio").prop("readonly", false); }
    if ($(".loadUF").val() == "") { $(".loadUF").prop("readonly", false); }

    /*
    //$("#Logradouro,.loadLogradouro").prop("readonly", bloq);
    $("#Bairro,.loadBairro").prop("readonly", bloq);
    $("#Municipio,.loadMunicipio").prop("readonly", bloq);
    $("#Municipio").prop("readonly", bloq);
    $("#UF, .loadUF").attr("readonly", bloq);

    if (bloq) {
        var uf = jQuery("#UF, .loadUF").val();

        TornarReadOnly(jQuery("#UF, .loadUF"));

        var municipio = jQuery("#Municipio option[selected]").html();
        TornarReadOnly(jQuery("#Municipio"));
    }
    else
    {
        RetirarReadOnly(jQuery("#UF, loadUF"));
    }

    //$("#UF").attr("disabled", bloq);
    if (!bloq) {
        $("#UF,.loadUF").val("");
        //$('#UF option,.loadUF option').attr('disabled', bloq);
    }
    else {
        //$('#UF option:not(:selected),.loadUF option:not(:selected)').attr('disabled', bloq);
    }*/
}

//        eAutoWebService.GetEnderecoByCep($("[id$=CEPFiscalizacaoTextBox]").val(), function (result) {
//            //$this.spinner("remove");
//            if (result != null) {
//                var enderecoPesquisado = jQuery.parseJSON(result);
//                if (enderecoPesquisado[0].numeroIBGE != null) {
//                    if (enderecoPesquisado[0].uf == "SP") {
//                        $("[id$=EnderecoFiscalizacaoTextBox]").val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
//                        $("[id$=BairroFiscalizacaoTextBox]").val(enderecoPesquisado[0].bairro);
//                        $("[id$=NumeroFiscalizacaoTextBox]").focus();
//                        $("[id$=CidadesFiscalizacaoTextBox]").val(enderecoPesquisado[0]);
//                        $("[id$=CidadesIdFiscalizacaoHidden]").val('');
//                        $("[id$=NumeroTextBox]").focus();
//                    }
//                    else {
//                        alert("CEP não pertence ao estado de SP. Favor preencher os campos!");
//                    }
//                }
//                else {
//                    alert("CEP não cadastrado na base de dados. Favor preencher os campos!");
//                }
//            }
//        }, function () {
//            $this.spinner("remove");
//            alert("CEP não cadastrado na base de dados. Favor preencher os campos!");
//        });
//    } else {
//        evt.preventDefault();
//        alert("Você deve digitar um CEP válido!");
//        $("[id$=CEPFiscalizacaoTextBox]").focus();
//    }
//}
//});

var CEPHELPER = (function () {
    function init() {
        loadCep();   
    }

    function carregarMunicipioNovo(seletor, uf, nomeMunicipioSelecionado) {
        
        var ddlMunicipio = $(seletor);

        $.ajax({
            url: "/Endereco/SelectListMunicipio",
            type: 'POST',
            data: { uf: uf, nomeMunicipio: nomeMunicipioSelecionado },
            cache: false,
            success: function (result) {
                if (result != null && result.Sucesso === true) {

                    var municipioSelecionado = '';
                    result.Resultado.map(function (c) {

                        if (c.Selected === true) {
                            municipioSelecionado = c.Value;
                            var optionExistente = ddlMunicipio.find('option[value="' + c.Value + '"]')

                            if (optionExistente.length === 0) {
                                ddlMunicipio.append("<option value=" + c.Value + ">" + c.Text + "</option>");
                            }
                        }
                    });

                    ddlMunicipio.val(municipioSelecionado);
                    RetirarReadOnly(ddlMunicipio);
                }
            }
        });
    }    

    function loadCep() {
        jQuery(".carregar-cep").blur(function (evt) {
            var $this = $(this);
            var url = "/Cep/GetEnderecoByCep";
            if ($this.data("url") !== undefined) {
                url = $this.data("url");
            }
            var container = jQuery($this).closest(".busca-endereco");
            
            if ($this.val() != "") {
                
                jQuery.ajax({
                    url: url,
                    data: { cep: $this.val().replace(/[^\d]+/g, '') },
                    cache: false,
                    success: function (result) {
                        if (result != null && result != "") {
                            
                            var enderecoPesquisado = jQuery.parseJSON(result);
                            if (enderecoPesquisado[0].numeroIBGE != null) {

                                jQuery('.carregar-uf', container).val(enderecoPesquisado[0].idUf);
                                jQuery('.carregar-uf-nome', container).val(enderecoPesquisado[0].uf);
                                jQuery('.carregar-logradouro', container).val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                                jQuery('.carregar-endereco', container).val(enderecoPesquisado[0].tipoLogradouro + " " + enderecoPesquisado[0].endereco);
                                jQuery('.carregar-bairro', container).val(enderecoPesquisado[0].bairro);
                                jQuery('.carregar-municipio', container).val(enderecoPesquisado[0].municipio);
                                jQuery('.carregar-numero', container).focus();

                                jQuery(".carregar-municipio-lista option", container).removeAttr("selected").each(function () {
                                    if (jQuery(this).html() == enderecoPesquisado[0].municipio) {
                                        jQuery(this).attr("selected", "selected");
                                    }
                                });
                            }
                        }
                        else {
                            BASE.MostrarMensagem('CEP não cadastrado na base de dados. Favor preencher os campos!');
                            return false;
                        }
                        
                    }
                });
            }
        });
    }

    return {
        Init: init,
        CarregarMunicipios: carregarMunicipioNovo
    };
}());

$(function () {
    CEPHELPER.Init();
});
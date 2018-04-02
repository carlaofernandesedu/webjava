
$(document).ready(function () {
    LoadTableCepEspecial();
});


function GetCepEspecial() {
    jQuery.ajax({
        url: "/CepEspecial/GetMunicipio",      
        success: function (result) {
            if (result != null && result != "") {
                result.map(function (c) {
                    $("#id_municipio").append("<option value=" + c.Codigo + ">" + c.Descricao + "</option>");
                });
            }           
        }
    });
}

function LoadTableCepEspecial() {
    $('#grupo_lista_cep_especial').dataTable({
        /*Coluna que não permite ordenação, partindo do array 0*/
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [7] }],
        /*Coluna que incia em ORDENAÇÃO ASC ou DESC*/
        "order": [[0, "asc"]],
        /*Resposividade da tabela*/
        responsive: true,
        "bDestroy": true
    });
}
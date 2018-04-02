$(function () {
    bindReplicar();
});

function bindReplicar() {
    $('#btnReplicar').off('click');
    $('#btnReplicar').on('click', function () {
        var numeroDocumento = $("#hdNumero").val() + '/' + $("#hdAno").val();
        if (numeroDocumento != null && numeroDocumento != undefined) {
            window.location = '/Documento/Pesquisar2?numeroAno=' + numeroDocumento;
        }
    });
}
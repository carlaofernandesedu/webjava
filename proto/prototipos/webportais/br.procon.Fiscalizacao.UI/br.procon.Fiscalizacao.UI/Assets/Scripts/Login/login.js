$(function () {
    HabilitaEsqueciMinhaSenha();
});


function HabilitaEsqueciMinhaSenha() {
    $("#chkAD").off('click');
    $("#chkAD").on('click', function () {
        CLIENTSTORAGE.RemoverObjeto("link");
        var check = $('#chkAD').prop('checked');
        $('.divEsqueciMinhaSenha').toggle(!check);
    });
}
var ATENDIMENTO_SITUACAO = function ()
{


    var _component_id= 905901;
    var _titulo = "Alterar Situação";
    var _placeholder = "Atendido";
    var _id_situacao_atendimento = [];
    var _button = 1;
    var _id_ficha_atendimento = 0;
    var _modalname      = "";
    var _confirm_label  = "OK";
    var _cancel_label = "Cancelar";
    var _callback = function () { };

    var init = function (id_ficha_atendimento, titulo, placeholder, id_situacao_atendimento, button, confirm_label, callback)
    {
        _titulo = titulo;
        _placeholder = placeholder;
        _id_situacao_atendimento = id_situacao_atendimento;
        _button = button;
        _id_ficha_atendimento = id_ficha_atendimento;
        _modalname = "modal-alterar-situacao_" + _component_id;
        _confirm_label = confirm_label;
        _callback = callback;

        

        appendModal();
        bindBtnShowModalSituacao();
        bindBtnConfirmarSituacao();
    };

    var appendModal = function ()
    {    
        buildModal(_modalname, "body", _titulo, _confirm_label, _cancel_label);
    };

    var bindBtnShowModalSituacao = function () {
        $(_button).off('click');
        $(_button).on('click', function () {
            $('#' + _modalname).modal('show');
        });
    };

    var bindBtnConfirmarSituacao = function ()
    {
        $('#' + _modalname + " " + "button#btn-confirmar-situacao").off('click');
        $('#' + _modalname + " " + "button#btn-confirmar-situacao").on('click', function () {

            if ($('#' + _modalname + " " + " form").valid())
            {
                $('#' + _modalname + " " + "button#btn-confirmar-situacao").prop('disabled', 'disabled');

                var data = {
                    "id_ficha_atendimento": _id_ficha_atendimento,
                    "id_situacao_atendimento": $('#' + _modalname + " " + " form select").val(),
                    "msg_iteracao": $('#' + _modalname + " " + " form textarea").val()
                };

                $.ajax({
                    type: "POST",
                    url: "/AtendimentoTecnico/AlterarSituacao",
                    data: data,
                    dataType: "json",
                    success: function (response) {
                        $('#' + _modalname + " " + "button#btn-confirmar-situacao").removeProp('disabled');
                        $('#' + _modalname).modal('hide');

                        if (_callback) _callback();
                    }
                });
            }

        });
    };


    function buildModal(Id, placement, heading, btnConfirm, btnCancel)
    {
        var form = _modalname+'_form';

        var html = "";
        html += '<div class="modal fade" id="'+Id+'" tabindex="-1" role="dialog" aria-labelledby="respostaPadrao-label">';
        html += '<!-- Modal ' + _titulo + '-->';
        html += '<div class="modal-dialog" role="document">';
        html += '   <div class="modal-content">';

        html += '       <div class="modal-header">';
        html += '           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        html += '           <h4 class="modal-title">' + _titulo + '</h4>';
        html += '       </div>';

        html += '       <div class="modal-body">';
        html += '           <form id="' + form + '">';
        html += '               <div class="form-group">';
        html += '                   <label>Situação do Atendimento:</label>';
        html += '                   <select class="form-control">';

        html += '                       <option value=""> -- SELECIONE -- </option>';
        for (var i = 0; i < _id_situacao_atendimento.length; i++) {
        html += '                       <option value="' + _id_situacao_atendimento[i].id_situacao_atendimento + '">' + _id_situacao_atendimento[i].ds_situacao_atendimento + '</option>';
        }
        html += '                   </select>';
        html += '               </div>';
        html += '               <div class="form-group">';
        html += '                   <label>Motivo:</label>';
        html += '                   <textarea id="motivo" placeholder="' + _placeholder + '" class="form-control"></textarea>';
        html += '               </div>';
        html += '           </form>';
        html += '       </div>';

        html += '       <div class="modal-footer">';
        html += '           <button class="btn btn-danger" data-dismiss="modal"> ' + btnCancel + ' </button>';
        html += '           <button class="btn btn-primary" id="btn-confirmar-situacao"> ' + btnConfirm + ' </button>';
        html += '       </div>';

        html += '   </div>'; // modal-content
        html += '</div>'; // modal-dialog
        html += '<!-- Modal  ' + _titulo + '-->';
        html += '</div>'; // modal
        

        $(placement).remove('#' + Id);
        $(placement).append(html);

        var form = '#' + _modalname + '_form';
        var input = $(form + " textarea");  //$('.bootbox-form').find('textarea')
        var select = $(form + " select");  //$('.bootbox-form').find('textarea')

        $.validator.unobtrusive.parse(form);

        $(input).attr('id', 'msg_motivo_situacao_' + _component_id);
        $(input).attr('name', 'msg_motivo_situacao_' + _component_id);
        $(input).after('<span class="field-validation-valid" data-valmsg-for="' + 'msg_motivo_situacao_' + _component_id + '" data-valmsg-replace="true"></span>');
        $(input).rules('add', { required: true, messages: { required: "Campo motivo é obrigatorio!" } });

        $(select).attr('id', 'id_situacao_atendimento_' + _component_id);
        $(select).attr('name', 'id_situacao_atendimento');
        $(select).after('<span class="field-validation-valid" data-valmsg-for="' + 'id_situacao_atendimento_' + _component_id + '" data-valmsg-replace="true"></span>');
        $(select).rules('add', { required: true, messages: { required: "Campo situação é obrigatorio!" } });
    }

    return {
        Init: init
    };

};//());
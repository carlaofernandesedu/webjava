var TAG = (function () {
    function init() {
        bindAll();
    }

    function bindAll() {
    }

    function posCarregarDetalhe() {
        bindInicializarTags();
    }

    function bindInicializarTags() {
        $(".tagsinput").each(function (index, element) {
            var that = $(this);
            that.tagsinput({
                //onTagExists: function(){
                //    that.tagsinput('refresh');
                //},
                preventPost: true,
                allowDuplicates: false,
                cancelConfirmKeysOnEmpty: false,
                trimValue: true,
                freeInput: true,
                maxChars: 20, //Definição de tamanho no documento de requisitos
                confirmKeys: [1, 2, 9, 13, 32], //Botões de aceitação paara inclsão das Tags, clique esquerdo, clique direito do mouse,
                //barra de espaço, enter, tab
                //itemValue: 'Descricao',
                //itemText: 'Descricao',
                //timeout: 50,
                typeahead: { //https://github.com/biggora/bootstrap-ajax-typeahead
                    ajax: {
                        url: 'tag/Filtrar',
                        method: 'POST'//,
                        //displayField: 'Descricao',
                        //valueField: 'Descricao'
                    },
                    onSelect: function (item) {
                        that.tagsinput('add', item.text);
                    },
                    onTagExists: function (item, $tag) {
                        $tag.hide().fadeIn();
                    }
                }
            });
        });

        var value = $('#hdClassificacaoTags').val(),
            items = (value != null && value !== "") ? JSON.parse(value) : null;

        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                $('.tagsinput').tagsinput('add', items[i].Descricao);
                $('.tagsinput').tagsinput('refresh');
            }
        }

        limparTagExcedente();
    }

    function limparTagExcedente() {
        $('.tagsinput').on('itemAdded', function (event) {
            setTimeout(function () {
                $(">input[type=text]", ".bootstrap-tagsinput").val("");
            }, 1);
        });
    }

    function limparTags() {
        $(".tagsinput").tagsinput('removeAll');
    }

    return {
        Init: function () {
            init();
        },
        PosCarregarDetalhe: posCarregarDetalhe,
        LimparTags: limparTags
    };
}());

$(function () {
    TAG.Init();
});
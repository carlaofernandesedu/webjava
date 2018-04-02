jQuery(document).ready(function () {
    
    jQuery("tbody").each(function () {
        SelecionaRecurso(jQuery("input", this).first());
    });

    AplicaSwitchery();

});

function SelecionaRecurso(sender) {
    if (jQuery("[name=codigo_" + jQuery(sender).data("codigo-aplicacao")).prop("checked") == false) {
        jQuery(sender).prop("checked", false);
        return;
    }


    var quantidadeRecursos = 0;
    var aplicacao = jQuery(sender).data("codigo-aplicacao");
    jQuery(sender).closest("tbody").find("tr").each(function () {
        if (jQuery("input[type=checkbox]:checked", this).length > 0)
            quantidadeRecursos++;
    });

    jQuery("#contador_" + aplicacao).html(quantidadeRecursos);
}

function SelecionaTodosRecursos(sender) {
    if (jQuery("[name=codigo_" + jQuery(sender).data("codigo-aplicacao")).prop("checked") == false) {
        return;
    }


    if (jQuery(sender).closest("tr").find("input[type=checkbox]:checked").length > 0 && jQuery(sender).closest("tr").find("input[type=checkbox]:not(:checked)").length > 0) {
        jQuery(sender).closest("tr").find("input[type=checkbox]").prop("checked", true);
    }
    else if (jQuery(sender).closest("tr").find("input[type=checkbox]:checked").length == 0) {
        jQuery(sender).closest("tr").find("input[type=checkbox]").prop("checked", true);
    }
    else {
        jQuery(sender).closest("tr").find("input[type=checkbox]").prop("checked", false);
    }

    SelecionaRecurso(jQuery(sender).closest("tr").find("input").first());
}

function ClickAplicacao(sender) {
    if (jQuery(sender).prop("checked")) {       
        SelecionaRecurso(jQuery("#tb_aplicacao_" + jQuery(sender).data("codigo-aplicacao") + " input").first());
    }
    else {
        jQuery("#tb_aplicacao_" + jQuery(sender).data("codigo-aplicacao") + " input").prop("checked", false);
        jQuery("#contador_" + jQuery(sender).data("codigo-aplicacao")).html("0");
    }
}

function LimparCampos() {
    jQuery("input[type=text]").val("");
    jQuery("input[type=checkbox]").prop("checked", false);
    jQuery("select").val("");

    jQuery("tbody").each(function () {
        SelecionaRecurso(jQuery("input", this).first());
    });

    jQuery(".js-switch").next().remove();
    AplicaSwitchery();
}

function AplicaSwitchery() {
    // Default
    // if-else statement used only for fixing <IE9 issues
    if (Array.prototype.forEach) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

        elems.forEach(function (html) {
            var switchery = new Switchery(html);
        });
    } else {
        var elems = document.querySelectorAll('.js-switch');

        for (var i = 0; i < elems.length; i++) {
            var switchery = new Switchery(elems[i]);
        }
    }

    // Disabled switch
    var disabled = document.querySelector('.js-switch-disabled');
    if (disabled != null)
        var switchery = new Switchery(disabled, { disabled: true });

    var disabledOpacity = document.querySelector('.js-switch-disabled-opacity');
    if (disabledOpacity != null)
        var switchery = new Switchery(disabledOpacity, { disabled: true, disabledOpacity: 0.75 });

    // Colored switches
    var blue = document.querySelector('.js-switch-blue');
    if (blue != null)
        var switchery = new Switchery(blue, { color: '#7c8bc7', jackColor: '#9decff' });

    var pink = document.querySelector('.js-switch-pink');
    if (pink != null)
        var switchery = new Switchery(pink, { color: '#faab43', secondaryColor: '#fC73d0', jackColor: '#fcf45e', jackSecondaryColor: '#c8ff77' });

    // Switch sizes
    var small = document.querySelector('.js-switch-small');
    if (small != null)
        var switchery = new Switchery(small, { size: 'small' });

    var large = document.querySelector('.js-switch-large');
    if (large != null)
        var switchery = new Switchery(large, { size: 'large' });

    // Dynamic enable/disable
    var dynamicDisable = document.querySelector('.js-dynamic-state');
    if (dynamicDisable != null)
        var dynamicStateCheckbox = new Switchery(dynamicDisable);

    jQuery('.js-dynamic-disable').on('click', function () {
        dynamicStateCheckbox.disable();
    });

    jQuery('.js-dynamic-enable').on('click', function () {
        dynamicStateCheckbox.enable();
    });

    // Getting checkbox state
    // On click
    var clickCheckbox = document.querySelector('.js-check-click')
      , clickButton = document.querySelector('.js-check-click-button');

    if (clickButton != null) {
        if (window.addEventListener) {
            clickButton.addEventListener('click', function () {
                alert(clickCheckbox.checked);
            });
        } else {
            clickButton.attachEvent('onclick', function () {
                alert(clickCheckbox.checked);
            });
        }
    }

    // On change
    var changeCheckbox = document.querySelector('.js-check-change')
      , changeField = document.querySelector('.js-check-change-field');

    if (changeCheckbox != null) {
        changeCheckbox.onchange = function () {
            changeField.innerHTML = changeCheckbox.checked;
        };
    }

    // CSS3 Pie for <IE9
    if (window.PIE) {
        var wrapper = document.querySelectorAll('.switchery')
          , handle = document.querySelectorAll('.switchery > small');

        if (wrapper.length == handle.length) {
            for (var i = 0; i < wrapper.length; i++) {
                PIE.attach(wrapper[i]);
                PIE.attach(handle[i]);
            }
        }
    }
}
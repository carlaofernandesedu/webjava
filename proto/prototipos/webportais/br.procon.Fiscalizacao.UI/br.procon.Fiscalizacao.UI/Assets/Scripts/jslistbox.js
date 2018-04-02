var vals = [];
$("#Aplicacao").click(function (e) {
    var scroll_offset = this.scrollTop;
    var newVals = $(this).val();
    if (newVals.length === 1) {
        var index = vals.indexOf(newVals[0]);
        if (index > -1) {
            vals.splice(index, 1);
        } else {
            vals.push(newVals[0]);
        }
        $(this).val(vals);
        this.scrollTop = scroll_offset;
    }
});
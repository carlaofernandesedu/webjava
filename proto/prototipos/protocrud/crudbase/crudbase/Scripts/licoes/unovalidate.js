$("#formcui").submit(function (e) {
    if ($(this).valid()) {
        $.post('/Company/CreateUserInformation', $(this).serialize(), function (data) {
            $("#dadosdinamicos").html(data);
            $.validator.unobtrusive.parse($("#dadosdinamicos"));
        });

    }
    e.preventDefault();
    return false;
});
$("#prevButton").click(function () {
    $.post('/Company/CreateUserPrevious', $($("form")[0]).serialize(), function (data) {
        $("#dadosdinamicos").html(data);
        $.validator.unobtrusive.parse($("#dadosdinamicos"));
    });
});
$("#formcei").submit(function (e) {
    if ($(this).valid()) {
        $.post('/Company/CreateUserCompanyInformation', $(this).serialize(), function (data) {
            $("#dadosdinamicos").html(data);
            $.validator.unobtrusive.parse($("#dadosdinamicos"));
        });
    }
    e.preventDefault();
    return false;
});

//http://nadeemkhedr.com/how-the-unobtrusive-jquery-validate-plugin-works-internally-in-asp-net-mvc/
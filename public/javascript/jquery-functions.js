$(function () {

    let cookieName;

    window.getCookie = function (name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    $("#submitBtn").on("click", () => {
        let url = "/users/details";

        $.get({url: url}).then((details) => {
            cookieName = details.filterMyLeechesCookieName;

            let cookie = window.getCookie(details.filterMyLeechesCookieName);
            if (cookie) {
                $('#showMyLeeches').prop('checked', true);
            } else {
                $('#showMyLeeches').prop('checked', false);
            }

            $('#gridSystemModal').modal('show');
        });
    });

    $("#showMyLeeches").on("change", () => {
        let isChecked = $("#showMyLeeches").is(':checked');

        if (isChecked) {
            document.cookie = cookieName + "=" + isChecked;
        } else {
            document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01GMT;';
        }

        $('#gridSystemModal').modal('hide');
        window.location.replace("/");
        $.get("/");
    });
});

"use strict";

function setFileUploadButtonState() {
    if ($('#useStockPhoto').prop('checked')) {
        $('#shopPhoto').prop('disabled', true);
    } else {
        $('#shopPhoto').prop('disabled', false);
    }
}

function voteUp(leechId) {
    let url = "/users/details";

    $.get({url: url}).then((details) => {

        if (!details.isAuthenticated) {
            window.location.replace("/users/login");
        } else {
            url = "/leeches/vote?vote=1&id=" + leechId;

            $.get({url: url}).then((votingStats) => {
                $("#leechVotes-" + leechId).text(votingStats.leechVotes);

                refreshStats(votingStats.votesToday, votingStats.votesRemaining);
            }).catch((err) => {
                console.log(err);
            });
        }
    });
}

function refreshStats(votesToday, votesRemaining) {
    $('#votesToday').text(votesToday);
    $('#votesRemainingToday').text(votesRemaining);

    if (votesRemaining <= 0) {
        $('[id^="idUp-"]').hide();
    }
}

function validateFileSize() {
    let useStockPhoto = document.getElementById("useStockPhoto");

    if (!useStockPhoto.checked) {
        var uploadFile = document.getElementById("shopPhoto").files[0]; // <input type="file" id="fileUpload" accept=".jpg,.png,.gif,.jpeg"/>

        if (!uploadFile || uploadFile.size > 71680) // 2 mb for bytes.
        {
            alert("You must select a File under 70k bytes!");
            return false;
        }
    }

    return true;
}

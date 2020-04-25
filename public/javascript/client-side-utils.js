"use strict";

function setFileUploadButtonState() {
    if ($('#useStockPhoto').prop('checked')) {
        $('#shopPhoto').prop('disabled', true);
    } else {
        $('#shopPhoto').prop('disabled', false);
    }
}

function voteUp(leechId) {
    let url = "/users/authenticated";

    $.get({url: url}).then((isAuthenticated) => {

        if (!isAuthenticated) {
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

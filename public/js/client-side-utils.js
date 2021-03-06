"use strict";

function setFileUploadButtonState() {
    if ($('#useStockPhoto').prop('checked')) {
        $('#shopPhoto').prop('disabled', true);
    } else {
        $('#shopPhoto').prop('disabled', false);
    }
}

function voteUp(leechId) {
    let url = "/leech/leech?vote=1&id=" + leechId;

    $.get({url: url}).then((votingStats) => {

        // todo not pretty but will do for now
        if (!votingStats.leechVotes) {
            window.location.replace(window.location.origin);
        } else {
            $("#leechVotes-" + leechId).text(votingStats.leechVotes);

            refreshStats(votingStats.votesToday, votingStats.votesRemaining);
        }
    }).catch((err) => {
        console.log(err);
    });
}

function refreshStats(votesToday, votesRemaining) {
    $('#votesToday').text(votesToday);
    $('#votesRemainingToday').text(votesRemaining);

    if (votesRemaining <= 0) {
        $('[id^="idUp-"]').hide();
    }
}

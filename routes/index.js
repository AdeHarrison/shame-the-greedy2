const express = require('express');
const router = express.Router();
const Leech = require("../models/leech");
const formUtils = require("../utils/form")
const VoteCount = require("../models/voteCount");

router.get('/', function (req, res) {
    _refresh_home_page(req, res, "voteCount", "descending");
});

router.get('/order', function (req, res) {
    let sortBy = req.query.by;
    let sortDirection = req.query.direction;

    _refresh_home_page(req, res, sortBy, sortDirection);
});

const _refresh_home_page = async (req, res, sortField, sortDirection) => {
    try {
        if (req.isAuthenticated()) {
            let votingStats = await _getUserVotingStats(req.user._id, gConfig.todaysUTCDate);
            let sess = req.session;

            sess.votesToday = votingStats.votesToday;
            sess.votesRemaining = votingStats.votesRemaining;
        }

        let sortParams = {};
        sortParams[sortField] = sortDirection;

        let leeches = await Leech.find({}).sort(sortParams).exec();

        res.render("index", formUtils.createIndexParams(req, leeches));
    } catch (err) {
        console.error(err);
    }
}

const _getUserVotingStats = async (userId, voteDay) => {
    try {
        return await getUserVotingStats(userId, voteDay);
    } catch (err) {
        console.error(err);
    }
}

const getUserVotingStats = async (userId, voteDay) => {
    let searchParams = {userId: userId, voteDay: voteDay};

    let voteCount = await VoteCount.findOne(searchParams);

    if (!voteCount) {
        voteCount = await VoteCount.create(searchParams);
    }

    let votingStats = {
        votesToday: voteCount.voteDayCount.toString(),
        votesRemaining: (gConfig.maxVotesPerDay - voteCount.voteDayCount).toString()
    };

    return votingStats;
};

module.exports = router;

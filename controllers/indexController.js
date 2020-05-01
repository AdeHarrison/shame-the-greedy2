"use strict";

const Leech = require("../models/leeches/leech");
const formUtils = require("../utils/form")
const VoteCount = require("../models/leeches/voteCount");

exports.home_get = (req, res) => {
    let orderBy = req.cookies.orderBy ? req.cookies.orderBy : "voteCount";
    let orderDirection = req.cookies.orderDirection ? req.cookies.orderDirection : "descending";

    req.session.orderTitle = setOrderTitle(orderBy, orderDirection);

    return _refresh_home_page(req, res, orderBy, orderDirection);
};

exports.order_get = (req, res) => {
    let orderBy = req.query.by;
    let orderDirection = req.query.direction;

    req.session.orderTitle = setOrderTitle(orderBy, orderDirection);

    return _refresh_home_page(req, res, orderBy, orderDirection);
}

const _refresh_home_page = async (req, res, orderBy, orderDirection) => {
    let sess = req.session;

    try {
        if (req.isAuthenticated()) {
            let votingStats = await _getUserVotingStats(req.user._id, gConfig.todaysUTCDate);

            sess.votesToday = votingStats.votesToday;
            sess.votesRemaining = votingStats.votesRemaining;
        }

        let sortParams = {};
        sortParams[orderBy] = orderDirection;

        let showPage = req.query.showPage ? req.query.showPage: 1;

        const options = {
            page: showPage,
            limit: 3,
            sort: sortParams,
            collation: {
                locale: 'en'
            }
        };

        Leech.paginate({}, options, function (err, result) {
            let pagination = {
                previousPage: result.page > 1 ? result.page - 1 : false,
                nextPage: result.page < result.totalPages ? result.page + 1 : false,

                // currentPage:result.page,
                totalPages:result.totalPages,
                // totalLeeches: result.totalDocs,
                // hasPrevPage: result.hasPrevPage,
                // hasNextPage: result.hasNextPage
            }
            sess.pagination = pagination;

            res.cookie('orderBy', orderBy)
                .cookie('orderDirection', orderDirection)
                .render("index", formUtils.createIndexParams(req, result.docs));

        });
    } catch (err) {
        console.error(err);
    }
}

function setOrderTitle(orderBy, orderDirection) {
    if (!orderBy) {
        return "Order The Greedy By...";
    }

    let orderedBy = "The Greedy Ordered By ";
    let orderedDirection = orderDirection === "ascending" ? " Ascending" : " Descending";

    if (orderBy === "voteCount") {
        orderedBy += "Vote Count";
    } else if (orderBy === "shopName") {
        orderedBy += "Shop Name";
    } else if (orderBy === "cityTown") {
        orderedBy += "City/Town";
    } else if (orderBy === "districtArea") {
        orderedBy += "District/Area";
    }

    return orderedBy + orderedDirection;
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

    return {
        votesToday: voteCount.voteDayCount.toString(),
        votesRemaining: (gConfig.maxVotesPerDay - voteCount.voteDayCount).toString()
    };
};

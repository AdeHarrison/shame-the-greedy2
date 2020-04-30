"use strict";

const express = require('express');
const router = express.Router();
const Leech = require("../models/leeches/leech");
const formUtils = require("../utils/form")
const VoteCount = require("../models/leeches/voteCount");
const serverSideUtils = require('../utils/server-side-utils');

exports.home_get = (req, res, messages) => {
    let orderBy = req.cookies.orderBy ? req.cookies.orderBy : "voteCount";
    let orderDirection = req.cookies.orderDirection ? req.cookies.orderDirection : "descending";

    req.session.orderTitle = setOrderTitle(orderBy, orderDirection);

    _refresh_home_page(req, res, orderBy, orderDirection);
};

exports.order_get = (req, res, messages) => {
    let orderBy = req.query.by;
    let orderDirection = req.query.direction;

    req.session.orderTitle = setOrderTitle(orderBy, orderDirection);

    _refresh_home_page(req, res, orderBy, orderDirection);
}

const _refresh_home_page = async (req, res, orderBy, orderDirection) => {
    try {
        if (req.isAuthenticated()) {
            let votingStats = await _getUserVotingStats(req.user._id, gConfig.todaysUTCDate);
            let sess = req.session;

            sess.votesToday = votingStats.votesToday;
            sess.votesRemaining = votingStats.votesRemaining;
        }

        let sortParams = {};
        sortParams[orderBy] = orderDirection;

        const options = {
            page: 1,
            limit: 2,
            sort: sortParams,
            collation: {
                locale: 'en'
            }
        };

        // Leech.paginate({}, options, function (err, result){
        //     // let leeches = await Leech.find({}).sort(sortParams).exec();
        //
        //     res.cookie('orderBy', orderBy)
        //         .cookie('orderDirection', orderDirection)
        //         .render("index", formUtils.createIndexParams(req, result.docs));
        //
        // });
        let leeches = await Leech.find({}).sort(sortParams).exec();

        res.cookie('orderBy', orderBy)
            .cookie('orderDirection', orderDirection)
            .render("index", formUtils.createIndexParams(req, leeches));
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

    let votingStats = {
        votesToday: voteCount.voteDayCount.toString(),
        votesRemaining: (gConfig.maxVotesPerDay - voteCount.voteDayCount).toString()
    };

    return votingStats;
};
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const formUtils = require("./utils/form")
const config = require('./config/config.js');
const schedule = require('node-schedule');
const serverSideUtils = require('./utils/server-side-utils');
var cookieParser = require('cookie-parser');

const User = require('./models/user');
const Leech = require("./models/leech");
const VoteCount = require("./models/voteCount");
const Vote = require("./models/vote");

// Mongoose
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(gConfig.databaseURL, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Failed to connect to " + gConfig.databaseURL));
db.once("open", () => {
    console.log("Successfully connected to " + gConfig.databaseURL);

    if (process.env.NODE_DROP_DB === "true") {
        console.log("Dropping Database");
        db.dropDatabase().then((err) => {
            configureInitialDatabase()
            console.log("Database Dropped");
        });
    } else {
        console.log("Keeping Database");
        configureInitialDatabase();
    }
});

setupVotingLimits();

// Init App
const app = express();
// app.use("/user", userRouter);

// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Cookie parser
app.use(cookieParser());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// Route Files
let index = require('./routes/index');
let articles = require('./routes/articles');
let users = require('./routes/users');
let leeches = require('./routes/leeches');
app.use('/', index);
app.use('/articles', articles);
app.use('/users', users);
app.use('/leeches', leeches);

// Home Route
app.get('/', function (req, res) {
    _refresh_home_page(req, res);
});


// Start Server
app.listen(7000, function () {
    console.log('Server started on port 7000...');
});

function configureInitialDatabase() {
    User.createCollection();
    Leech.createCollection();
    VoteCount.createCollection();
    Vote.createCollection();
}

function setupVotingLimits() {
    gConfig.todaysUTCDate = serverSideUtils.getUTCDate();

    schedule.scheduleJob({hour: 0, minute: 1}, function () {
        gConfig.todaysUTCDate = serverSideUtils.getUTCDate();
    });
}


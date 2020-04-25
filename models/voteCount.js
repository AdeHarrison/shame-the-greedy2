const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const voteCountSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    voteDay: {
        type: String,
        required: true
    },
    voteDayCount: {
        type: Number,
        default: 0
    }
});

const VoteCount = mongoose.model("VoteCount", voteCountSchema);

module.exports = VoteCount;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const voteSchema = new Schema({
    userId: {
        type: String,
        required: true,
        tags: {type: [String], index: true}
    },
    leechId: {
        type: String,
        required: true
    },
    voteDate: {
        type: Date,
        required: true
    }
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
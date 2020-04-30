const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const leechSchema = new Schema({
    shopName: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    cityTown: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    districtArea: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    comments: {
        type: String,
        trim: true
    },
    photoLocation: {
        type: String,
        required: [true, "You must select a stock photo or upload one"]
    },
    voteCount: {
        type: Number,
        default: 0
    },
    userId: String
});

leechSchema.plugin(mongoosePaginate);

//todo compound index here on 1st 3 fields
const Leech = mongoose.model("Leech", leechSchema);

module.exports = Leech;

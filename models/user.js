const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true
    },
    verified: Boolean,
    verificationID: String,
    verificationExpiryDate: Date
});

const User = mongoose.model("User", userSchema);

module.exports = User;

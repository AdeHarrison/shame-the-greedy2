const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true
    },
    verified: Boolean,
    verification: String,
    verificationSalt: String,
    verificationExpiryDate: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

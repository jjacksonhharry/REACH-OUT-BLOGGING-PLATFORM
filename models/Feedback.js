const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Feedback', feedbackSchema);

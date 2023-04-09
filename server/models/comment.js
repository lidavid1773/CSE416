const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 30
    },
    date: {
        type: Date, 
        default: Date.now
    },
    text: {
        type: String,
        required: true, 
        maxlength: 150
    },
    parent: {
        type: Schema.Types.ObjectId, 
        ref: "Comment", 
    },
    votes: [{ 
        vote_up: Boolean,
        vote_by: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' } 
    }]
});

module.exports = mongoose.model('Comment', CommentSchema);
const Comment = require('../models/comment');
const Map = require('../models/map');

postComment = async (req,res) => {
    const { text, username } = req.body;
    const { mapid } = req.params;
    if(!text || !username) {
        return res.status(406).send("Text or Username can not be empty!");  
    }

    const map = await Map.findById(mapid);
    if (!map) {
        return res.status(406).send("Map is not exist!");
    }

    const newComment = new Comment({
        text: text,
        username: username,
        votes: []
    });

    await newComment.save();
    map.comments.push(newComment._id);
    await map.save();

    res.status(201).send({
        map: map.toObject(),
        comment: newComment.toObject()
    });

}

replyComment = async (req,res) => {
    const { text, username } = req.body;
    const { mapid, commentid } = req.params;
    if(!text || !username) {
        return res.status(406).send("Text or Username can not be empty!");  
    }

    const map = await Map.findById(mapid);
    if (!map) {
        return res.status(406).send("Map does not exist!");
    }

    const parentComment = await Comment.findById(commentid);
    if (!parentComment) {
        return res.status(406).send("Comment does not exist!");
    }

    const newComment = new Comment({
        text: text,
        username: username,
        parent: parentComment._id,
        votes: []
    });

    await newComment.save();
    map.comments.push(newComment._id);
    await map.save();

    res.status(201).send({
        map: map.toObject(),
        comment: newComment.toObject()
    });

}

getAllComments = async (req,res) => {
    try{
        res.status(201).send({
            comments: await Comment.find({})
        });
    } catch (error) {
        console.log(error);
        res.status(201).send({
            error: true,
            message: "Failed get comments!"
        });
    }
}

upvote = async (req,res) => {
    const { user } = req.body;
    const { commentid } = req.params;

    const comment = await Comment.findById(commentid);
    if(!comment){
        return res.status(406).send("The comment does not exist!");
    }

    const vote = comment.votes.find(u => u.vote_by.toString() === user._id.toString());
    if(vote){
        comment.votes.splice(comment.votes.indexOf(vote), 1);
        if(!vote.vote_up){
            comment.votes.push({
                vote_up: true,
                vote_by: user._id,
            });
        }
    } else {
        comment.votes.push({
            vote_up: true,
            vote_by: user._id,
        });
    }

    await comment.save();

    res.status(201).send({
        votes: comment.votes
    });

}

downvote = async (req,res) => {
    const { user } = req.body;
    const { commentid } = req.params;

    const comment = await Comment.findById(commentid);
    if(!comment){
        return res.status(406).send("The comment does not exist!");
    }

    const vote = comment.votes.find(u => u.vote_by.toString() === user._id.toString());
    if(vote){
        comment.votes.splice(comment.votes.indexOf(vote), 1);
        if(vote.vote_up){
            comment.votes.push({
                vote_up: false,
                vote_by: user._id,
            });
        }
    } else {
        comment.votes.push({
            vote_up: false,
            vote_by: user._id,
        });
    }

    await comment.save();

    res.status(201).send({
        votes: comment.votes
    });

}

deleteComment = async (req,res) => {
    const { text } = req.body;

    try{
        await Comment.deleteOne({ text });
        return res.status(201).send({});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllComments,
    postComment,
    replyComment,
    upvote,
    downvote,
    deleteComment
}
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

module.exports = {
    getAllComments,
    postComment,
    replyComment
}
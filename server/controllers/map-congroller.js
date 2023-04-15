const Map = require('../models/map');

searchMaps = async (req,res) => {
    const { search } = req.query;
    const maps = await Map.find({});
    res.status(201).send(maps);
}

createMap = async (req,res) => {
    const { username, title, visibility, data } = req.body;

    try{
        const newmap = new Map({
            username: username,
            title: title,
            visibility: visibility,
            data: data,
            downloads: [],
            comments: [],
            votes: []
        });
    
        await newmap.save();
        res.status(201).send({
            map: newmap.toObject()
        });

    } catch (error) {
        console.log(error);
        res.status(201).send({
            error: true,
            message: "Failed to create map!"
        });
    }

}

updateMap = async (req,res) => {
    const { mapid } = req.params;
    const { data } = req.body;
    
    try{
        await Map.findByIdAndUpdate(mapid, { data: data });
        res.status(201).send({
            message: "Updated map!"
        });

    } catch (error) {
        console.log(error);
        res.status(201).send({
            error: true,
            message: "Failed to update map!"
        });
    }

}

viewMap = async (req,res) => {
    const { mapid } = req.params;
    const map = await Map.findById(mapid).populate('comments');
    if (!map) {
        return res.status(406).send("Map is not exist!");
    }

    const post_comments = map.comments.filter(comment => !comment.parent);
    const reply_comments = map.comments.filter(comment => comment.parent);

    for(const post_comm of post_comments){
        post_comm.replies = reply_comments.filter(comment => comment.parent.equals(post_comm._id));
    }
    map.comments = post_comments;

    res.status(201).send(map.comments[0].replies);

}

getMapById = async (req,res) => {
    const { mapid } = req.params;
    
    try{
        res.status(201).send({
            map: await Map.findById(mapid).populate('comments')
        });
    } catch (error) {
        console.log(error);
        res.status(201).send({
            error: true,
            message: "Failed get map!"
        });
    }
}

downloadMap = async (req,res) => {
    const { user } = req.body;
    const { mapid } = req.params;
    const map = await Map.findById(mapid);
    if (!map) {
        return res.status(406).send("Map is not exist!");
    }

    map.downloads.push(user._id);
    await map.save();

    res.status(201).send({
        downloads: map.downloads
    });

}

allMapsByUsername = async (req,res) => {
    const { username } = req.body;

    try{
        res.status(201).send({
            maps: await Map.find({ username })
        });
    } catch(error) {
        console.log(error);
        res.status(201).send({
            error: true,
            message: "Failed to get maps!"
        });
    }
}

upvote = async (req,res) => {
    const { user } = req.body;
    const { mapid } = req.params;

    const map = await Map.findById(mapid);
    if(!map){
        return res.status(406).send("The map does not exist!");
    }

    const vote = map.votes.find(u => u.vote_by.toString() === user._id.toString());
    if(vote){
        map.votes.splice(map.votes.indexOf(vote), 1);
        if(!vote.vote_up){
            map.votes.push({
                vote_up: true,
                vote_by: user._id,
            });
        }
    } else {
        map.votes.push({
            vote_up: true,
            vote_by: user._id,
        });
    }

    await map.save();

    res.status(201).send({
        votes: map.votes
    });

}

downvote = async (req,res) => {
    const { user } = req.body;
    const { mapid } = req.params;

    const map = await Map.findById(mapid);
    if(!map){
        return res.status(406).send("The map does not exist!");
    }

    const vote = map.votes.find(u => u.vote_by.toString() === user._id.toString());
    if(vote){
        map.votes.splice(map.votes.indexOf(vote), 1);
        if(vote.vote_up){
            map.votes.push({
                vote_up: false,
                vote_by: user._id,
            });
        }
    } else {
        map.votes.push({
            vote_up: false,
            vote_by: user._id,
        });
    }

    await map.save();

    res.status(201).send({
        votes: map.votes
    });

}


module.exports = {
    getMapById,
    searchMaps,
    createMap,
    updateMap,
    viewMap,
    downloadMap,
    allMapsByUsername,
    upvote,
    downvote
}
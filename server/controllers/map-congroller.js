const Map = require('../models/map');

searchMaps = async (req,res) => {
    const { search } = req.query;
    const maps = await Map.find({});
    res.status(201).send(maps);
}

createMap = async (req,res) => {
    const { username, title, visibility, geodata } = req.body;

    try{
        const newmap = new Map({
            username: username,
            title: title,
            visibility: visibility,
            geodata: geodata,
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
    const { geodata } = req.body;
    
    try{
        await Map.findByIdAndUpdate(mapid, { geodata: geodata });
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

    res.status(201).send(map);

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

NumofdownloadMap = async (req,res) => {
    const { mapid } = req.params;

    try{
        const map = await Map.findByIdAndUpdate(mapid,{ $inc: { downloads: 1 } });
        await map.save();

        res.status(201).send({
            downloads: map.downloads
        });
    } catch(error){
        console.log(error);
    }


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

    const voted = map.votes.find(u => u.vote_by.toString() === user._id.toString());
    if(voted){
        map.votes.splice(map.votes.indexOf(voted), 1);
        if(!voted.vote_up){
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

    const voted = map.votes.find(u => u.vote_by.toString() === user._id.toString());
    if(voted){
        map.votes.splice(map.votes.indexOf(voted), 1);
        if(voted.vote_up){
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

deleteMap = async (req,res) => {
    const { mapid } = req.params;

    try{
        await Map.findByIdAndDelete(mapid);
        res.status(200).send("Delete Successfully!")
    } catch(error){
        console.log(error);
    }
}

module.exports = {
    getMapById,
    searchMaps,
    createMap,
    updateMap,
    viewMap,
    NumofdownloadMap,
    allMapsByUsername,
    upvote,
    downvote,
    deleteMap
}
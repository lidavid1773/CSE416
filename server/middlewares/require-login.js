const requireLogin = (req,res,next) => {
    if(!req.session.jwt){
        res.status(401).send("Need to login crednetial!");
        return;
    }

    next();
};

module.exports = requireLogin;
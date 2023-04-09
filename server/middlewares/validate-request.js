const { validationResult } = require('express-validator');

const validateRequest = (req,res,next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        res.status(401).send("Request is not valid!");
        return;
    }

    next();
    
};

module.exports = validateRequest;
const jwt = require('jsonwebtoken');

createTokenKey = (id,email,username) => {
    return jwt.sign(
            {
                id: id,
                email: email,
                username: username,
            },
            process.env.JWT_KEY
        );
}

verifyToken = (req,res) => {
    return jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY
        );
}

module.exports = {
    createTokenKey,
    verifyToken,
}
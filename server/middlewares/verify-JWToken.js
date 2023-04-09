const auth = require('../controllers/auth-controller');

const verifyJWToken = (req, res, next) => {
    try {
        console.log(req.session);
        const payload = auth.verifyToken(req,res);

        if(!payload){
          return res.status(406).send("Token is not valid!");
        }

        req.currentUser = payload;
      } catch (err) {}
    
      next();
};

module.exports = verifyJWToken;

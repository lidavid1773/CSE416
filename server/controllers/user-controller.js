const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('./auth-controller');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const sendingEmail = (email, link) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASS,
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Password',
        text: 'Click on the link to reset your password!',
        html: '<p>' + link +'</p>',
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Got error!!!!!");
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

signin = async (req,res) => {
    const { username, email, password } = req.body;
    const error = "Email or Password is incorrect!";

    const existinguser = await User.findOne({ email });
    if (!existinguser) {
        res.status(406).send(error);
        return;
    }

    let match = bcrypt.compareSync(password,existinguser.password);
    if (!match) {
        res.status(406).send(error);
        return;
    }

    const userJwt = auth.createTokenKey(existinguser.id, existinguser.email, username);
    req.session.jwt = userJwt;

    res.status(201).send({
      token: req.session.jwt,
      user: existinguser.toObject()
    });

}


signup = async (req,res) => {
    const { username, email, password } = req.body;
    const existinguser = await User.findOne({ email });

    if (existinguser) {
        res.status(406).send('Email is aleady in used!');
        return;
    }

    const newuser = new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password,10),
    });

    await newuser.save();

    const userJwt = auth.createTokenKey(newuser.id, newuser.email, username);
    req.session.jwt = userJwt;
    
    res.status(201).send({
        token: req.session.jwt,
        user: newuser.toObject()
    });

}


signout = async (req,res) => {
    delete req.session.jwt;
    res.status(200).send({});
}


getme = async (req,res) => {
    res.status(201).send({ currentUser: req.currentUser || null });
}


forgetPass = async (req,res) => {
    const { email } = req.body;
    const existinguser = await User.findOne({ email });
    if (!existinguser) {
        res.status(406).send("Email is not exist!");
        return;
    }

    try{
        const new_Tokenkey = process.env.JWT_KEY + existinguser.password;
        const new_Token = jwt.sign(
            {
                id: existinguser._id,
                email: existinguser.email,
            },
            new_Tokenkey,
            {expiresIn: '10m'}
        );

        const link = `http://localhost:8000/MapWorkShop/users/resetpass/${existinguser._id}/${new_Token}`;
        sendingEmail(email, link);
        console.log(link);
        res.status(201).send({
            id: existinguser._id,
            token: new_Token,
        });

    } catch (error) {
        console.log(error);
        res.send(201).send({
            error: true,
            message: "Reset Failed!" 
        });
    }
}

resetPass = async (req,res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const olduser = await User.findById(id);
    if (!olduser) {
        res.status(406).send("User is not exist!");
        return;
    }

    try{
        const new_Tokenkey = process.env.JWT_KEY + olduser.password;
        const verify = jwt.verify(token, new_Tokenkey);
        if(!verify){
            res.status(406).send("Invalid Token!");
            return;
        }

        await User.findByIdAndUpdate(id,{ password: bcrypt.hashSync(password,10) });
        res.status(201).send({
            message: "Reset Password Success!",
        });

    } catch (error) {
        console.log(error);
        res.send(201).send({
            error: true,
            message: "Reset Failed!" 
        });
    }

}

module.exports = {
    signin,
    signup,
    signout,
    getme,
    forgetPass,
    resetPass,
}
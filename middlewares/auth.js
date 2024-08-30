const jwt = require('jsonwebtoken')

const User = require('../models/userModel');

const SECRET = "Abra ca Dabra";


const isAuthenticiated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            console.log("authorization header not found");
            return res.status(401).json({
                err: "Log in to access",
            });
        }
        const token = authHeader.split(" ")[1]; //bearer token extracted

        if(!token) {
            return res.status(401).json({
                err: "No token. Authorization denied",
            });
        }

        const decoded = jwt.verify(token, SECRET);

        const user = await User.findOne({ where: { id: decoded.user.id }});

        if(!user) {
            return res.status(404).json({err: "user not found"});
        }

        req.user = user;
        next();
    }   catch (e) {
        console.log(e);
        return res.status(401).send(e);
    }
};


const isSeller = async (req, res, next) => {

    if(req.user.dataValues.isSeller) {
        next();
    } else {
        return res.status(401).json({
            err: "You are not seller"
        });
    }
};



module.exports = { isAuthenticiated, isSeller };
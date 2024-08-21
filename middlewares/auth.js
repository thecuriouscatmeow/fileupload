const jwt = require('jsonwebtoken')


const isAuthenticiated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.send(401).json({
                err: "authorization header not found"
            });
        }
        const token = authHeader.split(" ")[1];

        if(!token) {
            return res.send(401).json({
                err: "token  not found"
            });
        }

        const decoded = jwt.verify(token, "SECRET MESSAGE");

        const user = await User.findOne({ where: { id: decoded.user.id }});

        if(!user) {
            return res.send(404).json({
                err: "user not found"
            });
        }

        req.user = user;
        next();
    }   catch (e) {
        return res.status(500).send(e);
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
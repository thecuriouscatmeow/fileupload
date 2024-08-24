const express = require ('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = "Abra Ca Dabra";

const router = express.Router();

const User = require('../models/userModel');
const{
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validators');
const { JsonWebTokenError } = require('jsonwebtoken');


router.post("/signup", async (req, res) => {
    try{

        const { name, email, password, isSeller } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({where: {email}});
        if(existingUser) {
            return res.status(403).json({ err: "User already exists" });
        }

        // Validate inputs        
        if(!validateName(name)) {
            return res.status(400).json({ err: "Name Validation Fails" });
        }
        if(!validateEmail(email)) {
            return res.status(400).json({ err: "Email Validation Fails" });
        }
        if(!validatePassword(password)) {
            return res.status(400).json({ err: "Password Validation Fails" });
        }

        const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

        const user = {
            email,
            name,
            isSeller,
            password: hashedPassword
        };

        const createdUser = await User.create(user);

        return res.status(201).json({
            message: `Welcome ${createdUser.name}`,
        })

    } catch(e) {
        console.log('>>>',e);
        return res.status(500).send(e);
    }
});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        //Empty Field Check
        if(email.length == 0){
            return res.status(400).json({
                err: "Please provide password"
            })
        };
        if(password.length == 0){
            return res.status(400).json({
                err: "Please provide password"
            })
        };

        //Existing User Check
        const existingUser = await User.findOne({where: { email }});
        if(!existingUser) {
            return res.status(404).json({
                err: "User not found"
            })
        }

        //Password match for valid user
        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatched) {
            return res.status(400).json({
                err: "email or password mismatched"
            })
        }

        const payload = { user: { id: existingUser.id }};
        const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
            expiresIn: 360000,
        })

        res.cookie('t', bearerToken, { expire: new Date() + 9999 });

        return res.status(200).json({
            bearerToken
        })

    } catch(e) {
        return res.status(500).send(e);
    }
});

router.get('/signout', (req, res) => {
    try {
        res.clearCookie('t');
        return res.status(200).json({ message: "cookie deleted" });
    } catch (e) {
        return res.status(500).send(e);
    }
});

module.exports = router;
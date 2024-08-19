const express = require ('express');

const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const{
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validators');


router.post("/signup", async (req, res) => {
    try{

        const { name, email, password, isSerller } = req.body;

        const existingUser = await User.findOne({where: {email}});
        if(existingUser) {
            return res.status(403).json({ err: "User already exists" });
        }

        if(!validateName(Name)) {
            return res.status(400).json({ err: "Name Validation Fails" });
        }
        if(!validateName(email)) {
            return res.status(400).json({ err: "Email Validation Fails" });
        }
        if(!validateName(password)) {
            return res.status(400).json({ err: "Password Validation Fails" });
        }

        const hashedPassword = await bcrypt.hash(password);

        const user = {
            email: email,
            name: name,
            isSeller,
            password: hashedPassword
        };

        const createdUser = await User.create(user);

        return res.status(201).json({
            message: `Welcome ${createdUser.name}`,
        })

    } catch(e) {
        return.res.status(500).send(e);
    }
});



module.exports = router;
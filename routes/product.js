const express = require ('express');
const { isAuthenticiated, isSeller } = require('../middlewares/auth');
const router = express.Router();



router.post("/create", isAuthenticiated, isSeller, (req, res) => {

});










module.exports = router;
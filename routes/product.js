const express = require ('express');

const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const { isAuthenticiated, isSeller } = require('../middlewares/auth');

const router = express.Router();


router.post("/create", isAuthenticiated, isSeller, (req, res) => {
    upload(req, res, async(err) => {
        if(err) {
            console.log('coming in err', err);
            return res.status(500).send({err: err.message});
        }

        let { name, price } = req.body;
        if( !name || !price || !req.file) {
            return res.status(400).json({
                err: "Fill in all fields"
            })
        }

        price = Number(price);
        if(Number.isNaN(price))  {
            return res.status(400).json({
                err: "err: price should be a number"
            })
        }

        let productDetails = {
            name: name,
            price: price,
            content: req.file.path
        };

        const createdProduct = await Product.create(productDetails);
        console.log("Created Product : ", createdProduct);

        return res.status(200).json({
            status: 'ok',
            productDetails
        });
    })
});


router.get("/get/all", isAuthenticiated, async(req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({Products: products});

    } catch (err) {
        console.log(err);
        return res.status(500).json({err: err.message});
    }
});




module.exports = router;
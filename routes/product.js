const express = require ('express');
const { stripeKey } = require('../config/credentials');
const stripe = require('stripe')(stripeKey);

const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const { isAuthenticated, isSeller, isBuyer } = require('../middlewares/auth');

const router = express.Router();


router.post("/create", isAuthenticated, isSeller, (req, res) => {
    upload(req, res, async(err) => {
        if(err) {
            console.log('coming in err', err);
            return res.status(500).send({err: err.message});
        }

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

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

        return res.status(201).json({
            status: 'ok',
            productDetails
        });
    })
});


router.get("/get/all", isAuthenticated, async(req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({Products: products});

    } catch (err) {
        console.log(err);
        return res.status(500).json({err: err.message});
    }
});



router.get("/buy/:productId", isAuthenticated, isBuyer , async(req, res) => {
    try {
        const product = await Product.findOne({ 
            where: { id: req.params.productId }
        })?.dataValues;

        if(!product) {return res.status(404).json({ err: "No product found" })};

        const orderDetails = {
            productId,
            buyerId: req.user.id,
        }


        let paymentMethod = await stripe.paymentMethod.create({
            type: "card",
            card: {
                number: "548743874387",
                exp_month: 9,
                exp_year: 2023,
                cvc: "314",
            },
        });

        let paymeentIntent = await  stripe.paymeentIntent.create({
            amount: product.price,
            currency: "inr",
            payment_method_types: ["card"],
            payment_method: paymentMethod.id,
            confirm: true
        });

        if(paymentIntent) {
            const createOrder = await Order.create(orderDetails);
            return res.status(200).json({ createOrder });
        } else {
            return res.status(400).json({
                err: "payment failed"
            })
        };


    } catch (err) {
        console.log(err);
        return res.status(500).json({err: err.message});
    }
});



module.exports = router; 
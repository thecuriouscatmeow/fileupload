const express = require ('express');
const router = express.Router();

const { stripeKey } = require('../config/credentials');
const stripe = require('stripe')(stripeKey);

const { isAuthenticated, isSeller, isBuyer } = require('../middlewares/auth');
const upload = require('../utils/fileUpload');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');




const { WebhookClient }  = require("discord.js"); 

const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1283138703119614075/3lUezQhHIS2lhM0G590TcENKFgxmMdMObkSswl1Yo-_nG0NaepcPTyi86su8L5FwduQm"
});


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



router.post("/buy", isAuthenticated, isBuyer , async(req, res) => {
    try { 
        const { productId, paymentMethodId } = req.body; // Expecting test token in paymentMethodId
        
        
        const product = await Product.findOne({ 
            // where: { id: req.params.productId }
            where: { id: productId }
        });

        if(!product) {
            return res.status(404).json({ err: "No product found" })
        };

        const orderDetails = {
            productId,
            buyerId: req.user.id,
        }

// HARD CODED CARD DETAILS NOT ALLOWED
        // let paymentMethod = await stripe.paymentMethods.create({
        //     type: "card",
        //     card: {
        //         number: "4242424242424242",
        //         exp_month: 9,
        //         exp_year: 2025,
        //         cvc: "314",
        //     },
        // });

        const paymentIntent = await  stripe.paymentIntents.create({
            amount: Math.round(product.price * 100),
            currency: "inr",
            payment_method: 'pm_card_visa',
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            }
        });

        if(paymentIntent. status === 'succeeded') {
            const createOrder = await Order.create(orderDetails);

            webhook.send({
                content: `New order Update. ID: ${createOrder.id}`,
                username: "order-keeper",
                avatarURL: "https://as1.ftcdn.net/v2/jpg/08/34/31/24/1000_F_834312429_fF8SuKsNCU6ZHmiy1j7SLagQfMZHsNjZ.webp",
            }) 

            return res.status(200).json({ status: "Product bought successfully", order: createOrder });
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
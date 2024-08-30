const express = require('express');
const logger = require('morgan');


const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const PORT = 3001;

const app = express();
connectDB( ()=> {
    console.log("DB connected");
});

//middlewares
app.use(express.json());
app.use(logger("dev"));
app.use(express.static('content'));
app.use(express.urlencoded({ extended: false }));


//Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);

app.get('/', async (req, res) => {
    return res.status(200).send("API works");
});

app.listen(PORT, () => {
    console.log(`Server is up & running on port:${PORT}`);
    
});

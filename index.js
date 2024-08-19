const express = require('express');
const router = express();
const { connectDB } = require('./config/db');


//middlewares
app.use(express.json);
app.use(express.static('content'));
app.use(express.urlencoded({ extends: false }));

const PORT = 1338;

app.listen(PORT => {
    console.log('Server is UP & running on ${PORT}');
    connectDB();
});

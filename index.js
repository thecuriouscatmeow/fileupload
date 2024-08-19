const express = require('express');
const router = express();


//middlewares
app.use(express.json);
app.use(express.static('content'));


const PORT = 1338;

app.listen(PORT => {
    console.log('Server is UP & running on ${PORT}');
});

const { Sequelize } = require('sequelize');

const createDB = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

const connectDB = () => {
    createDB
        .sync()
        .then( (res) => {
            console.log('Connected to database: success');
        })
        .catch((e) => {
            console.log('Database connection failed: ', e);
        })
    
}


module.exports = { createDB, connectDB };
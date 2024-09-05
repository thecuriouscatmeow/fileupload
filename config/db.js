const { Sequelize } = require('sequelize');

const createDB = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

const connectDB = async () => {
    try {
        await createDB.authenticate(); // Checks if the connection is OK
        console.log('Connected to database: success');
        await createDB.sync(); // Sync models after connection is verified
    } catch (e) {
        console.log('Database connection failed: ', e);
    }
    // createDB
    //     .sync()
    //     .then( (res) => {
    //         console.log('Connected to database: success');
    //     })
    //     .catch((e) => {
    //         console.log('Database connection failed: ', e);
    //     })
    
}


module.exports = { createDB, connectDB };


const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

orderModel.belongsTo(userModel, { foreignKey: "buyerId" });
userModel.hasMany(orderModel, { foreignKey: "id" });
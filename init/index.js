require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const initData = require('./data');
const Product = require('../models/product');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Successfully connected to MongoDB :)");

        const insertedProducts = await Product.insertMany(initData.data);
        console.log('Sample products inserted:', insertedProducts);

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
run().catch(console.dir);

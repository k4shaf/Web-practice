require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose.connect(process.env.MONGODB_URI, clientOptions).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Create a new user
const createUser = async () => {
    const username = 'yourUsername';
    const password = 'yourPassword';

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create and save the user
    const user = new User({
        username: username,
        password: hashedPassword
    });

    try {
        await user.save();
        console.log('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
};

createUser();
const mongoose = require('mongoose');
const dontenv = require('dotenv');
dontenv.config();   

const db = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            dbName: 'superbox',
        });
        console.log('MongoDB Connected...');    
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
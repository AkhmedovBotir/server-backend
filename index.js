require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDBga ulanish amalga oshirildi'))
    .catch(err => console.log('MongoDBga ulanishda xato:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlayapti`);
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

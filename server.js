const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Guest = require('./guestModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

// Function to format phone number to E.164 format
const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('8')) {
        return `+7${phoneNumber.slice(1)}`;
    }
    if (!phoneNumber.startsWith('+')) {
        return `+${phoneNumber}`;
    }
    return phoneNumber;
};

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/invitation', (req, res) => {
    res.json({
        title: "60 жыл",
        content: "Құрметті ағайын-туыс бауырлар, нағашылар, жиен-бөлелер, құда-жекжат, дос-жарандар, кластастар!\nСіздерді әкеміз Жанаттың мерей тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
        date: "30.08.2024",
        time: "18:00",
        location: "с. Бесағаш, ул. Райымбек 145 А 'Ханшайым' мейрамханасы",
        hosts: "Жұбайы Бақытгүл, балалары Арайлым, Әлішер, Әділет"
    });
});

app.post('/rsvp', async (req, res) => {
    try {
        const guest = new Guest(req.body);
        await guest.save();

        res.status(200).send('Guest data saved successfully');
    } catch (err) {
        res.status(500).send('Error saving guest data');
    }
});

app.get('/test', (req, res) => {
    res.json("ok");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const keys = [
    process.env.REACT_APP_2GIS_API_KEY_1,
    process.env.REACT_APP_2GIS_API_KEY_2,
    process.env.REACT_APP_2GIS_API_KEY_3,
    process.env.REACT_APP_2GIS_API_KEY_4,
    process.env.REACT_APP_2GIS_API_KEY_5,
    process.env.REACT_APP_2GIS_API_KEY_6
];

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://invitation-frontend-umber.vercel.app', 'https://zhanat-60-zhyldyk.vercel.app']
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
const uri = process.env.MONGO_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import KeyUsage model
const KeyUsage = require('./keyModel');

// Initialize keys in the database
const initializeKeys = async () => {
    const keysCount = await KeyUsage.countDocuments();
    if (keysCount === 0) {
        for (const key of keys) {
            await new KeyUsage({ key, count: 0 }).save();
        }
    }
};
initializeKeys();

// Function to update key usage
const updateKeyUsage = async () => {
    const keysUsage = await KeyUsage.find().sort({ _id: 1 });

    for (let i = 0; i < keysUsage.length; i++) {
        if (keysUsage[i].count < 128) {
            keysUsage[i].count += 1;
            await keysUsage[i].save();
            return keysUsage[i].key;
        }
    }

    // Reset counts if all keys exceed the limit
    for (let i = 0; i < keysUsage.length; i++) {
        keysUsage[i].count = 0;
        await keysUsage[i].save();
    }
    return keysUsage[0].key;
};

// Schedule job to reset counts at midnight
schedule.scheduleJob('0 0 * * *', async () => {
    await KeyUsage.updateMany({}, { count: 0 });
});

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

app.get('/2gis_apikeys', async (req, res) => {
    try {
        const key = await updateKeyUsage();
        res.json({ key });
    } catch (err) {
        res.status(500).send('Error getting API key');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

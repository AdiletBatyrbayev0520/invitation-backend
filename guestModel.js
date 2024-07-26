const mongoose = require('./mongoose-connection');

const guestSchema = new mongoose.Schema({
    fullname: String,
    mobile_number: String,
    willAttend: Boolean,
    numberOfPeople: Number
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;

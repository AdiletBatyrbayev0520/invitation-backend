const mongoose = require('mongoose');

const keyUsageSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});

const KeyUsage = mongoose.model('KeyUsage', keyUsageSchema);

module.exports = KeyUsage;

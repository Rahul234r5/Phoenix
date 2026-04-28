const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  },
  medicines: [{
    name: String,
    available: Boolean,
    lastUpdated: { type: Date, default: Date.now }
  }]
});

// CRITICAL: This index allows 10ms proximity searches
PharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pharmacy', PharmacySchema);
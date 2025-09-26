const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  currentMileage: { type: Number, default: 0 },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
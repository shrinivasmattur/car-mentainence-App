const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: Date, default: Date.now },
  mileageAtService: { type: Number, required: true },
  type: { type: String, enum: ['Oil Change', 'Tire Rotation', 'Brake Check'], required: true },
  notes: { type: String },
});

module.exports = mongoose.model('Service', serviceSchema);
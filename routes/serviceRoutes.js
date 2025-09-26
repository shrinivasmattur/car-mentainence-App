const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services for a vehicle
router.get('/:vehicleId', async (req, res) => {
  try {
    const services = await Service.find({ vehicleId: req.params.vehicleId }).sort({ date: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create service
router.post('/', async (req, res) => {
  const service = new Service(req.body);
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get last service for type (for chatbot)
router.get('/last/:vehicleId/:type', async (req, res) => {
  try {
    const service = await Service.findOne({ vehicleId: req.params.vehicleId, type: req.params.type }).sort({ date: -1 });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
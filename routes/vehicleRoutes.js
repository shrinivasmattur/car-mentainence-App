const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update mileage
router.put('/:id/mileage', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { currentMileage: req.body.currentMileage }, { new: true });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create vehicle
router.post('/', async (req, res) => {
  const vehicle = new Vehicle(req.body);
  try {
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
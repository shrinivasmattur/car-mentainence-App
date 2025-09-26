import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import ServiceList from './components/ServiceList';
import MileageTracker from './components/MileageTracker';
import AutoBot from './components/ChatBot';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '' });
  const [key, setKey] = useState(0); // To refresh components after mileage update

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
      if (res.data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(res.data[0]._id); // Select first vehicle by default
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const handleCreateVehicle = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/vehicles', newVehicle);
      setVehicles([...vehicles, res.data]);
      setSelectedVehicleId(res.data._id); // Select new vehicle
      setNewVehicle({ make: '', model: '', year: '' }); // Reset form
    } catch (err) {
      console.error('Error creating vehicle:', err);
    }
  };

  return (
    <Container>
      <h1>Car Maintenance Log</h1>
      <Row>
        <Col>
          <h2>Select Vehicle</h2>
          <Form.Group>
            <Form.Label>Choose a Vehicle</Form.Label>
            <Form.Select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h2>Add New Vehicle</h2>
          <Form>
            <Form.Group>
              <Form.Label>Make</Form.Label>
              <Form.Control
                type="text"
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
              />
            </Form.Group>
            <Button className="mt-2" onClick={handleCreateVehicle}>
              Add Vehicle
            </Button>
          </Form>
        </Col>
      </Row>
      {selectedVehicleId && (
        <>
          <Row className="mt-3">
            <Col>
              <h2>Mileage Tracker</h2>
              <MileageTracker vehicleId={selectedVehicleId} onUpdate={() => setKey(key + 1)} />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <h2>Service History</h2>
              <ServiceList vehicleId={selectedVehicleId} key={key} />
            </Col>
            <Col>
              <h2>Auto Bot</h2>
              <AutoBot vehicleId={selectedVehicleId} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, Card } from 'react-bootstrap';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import ServiceList from './components/ServiceList';
import MileageTracker from './components/MileageTracker';
import AutoBot from './components/ChatBot';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '' });
  const [key, setKey] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
      if (res.data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(res.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to fetch vehicles');
    }
  };

  const handleCreateVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year) {
      toast.error('Please fill all vehicle fields');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/vehicles', newVehicle);
      setVehicles([...vehicles, res.data]);
      setSelectedVehicleId(res.data._id);
      setNewVehicle({ make: '', model: '', year: '' });
      toast.success('Vehicle added successfully');
    } catch (err) {
      toast.error('Failed to add vehicle');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand>Car Maintenance Log</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link onClick={() => setShowChatbot(!showChatbot)}>
              {showChatbot ? 'Hide Auto Bot' : 'Show Auto Bot'}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Select Vehicle</Card.Title>
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
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Add New Vehicle</Card.Title>
              <Form>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Make</Form.Label>
                      <Form.Control
                        type="text"
                        value={newVehicle.make}
                        onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button className="mt-3" onClick={handleCreateVehicle}>
                  Add Vehicle
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {selectedVehicleId && (
            <>
              <Row>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Mileage Tracker</Card.Title>
                      <MileageTracker vehicleId={selectedVehicleId} onUpdate={() => setKey(key + 1)} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Service History</Card.Title>
                      <ServiceList vehicleId={selectedVehicleId} key={key} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </motion.div>
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              className="chatbot-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <AutoBot vehicleId={selectedVehicleId} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="chatbot-toggle"
          onClick={() => setShowChatbot(!showChatbot)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          💬
        </motion.div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
    </>
  );
}

export default App;
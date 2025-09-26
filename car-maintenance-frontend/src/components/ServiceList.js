import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ServiceList = ({ vehicleId }) => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [vehicleId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/services/${vehicleId}`);
      setServices(res.data);
    } catch (err) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!currentService.mileageAtService || !currentService.type) {
      toast.error('Mileage and Type are required');
      return;
    }
    setLoading(true);
    try {
      if (currentService.id) {
        await axios.put(`http://localhost:5000/api/services/${currentService.id}`, currentService);
        toast.success('Service updated');
      } else {
        await axios.post('http://localhost:5000/api/services', { ...currentService, vehicleId });
        toast.success('Service added');
      }
      fetchServices();
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (err) {
      toast.error('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service = {}) => {
    setCurrentService(service);
    setShowModal(true);
  };

  return (
    <div>
      <Button onClick={() => openModal()} disabled={loading} className="mb-3">
        {loading ? <Spinner size="sm" /> : 'Add Service'}
      </Button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mileage</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <motion.tr
                key={service._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td>{new Date(service.date).toLocaleDateString()}</td>
                <td>{service.mileageAtService}</td>
                <td>{service.type}</td>
                <td>{service.notes}</td>
                <td>
                  <Button variant="info" onClick={() => openModal(service)} disabled={loading}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(service._id)} disabled={loading}>
                    Delete
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      )}
      <AnimatePresence>
        {showModal && (
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{currentService.id ? 'Edit' : 'Add'} Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={currentService.date ? new Date(currentService.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentService({ ...currentService, date: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Mileage</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentService.mileageAtService || ''}
                    onChange={(e) => setCurrentService({ ...currentService, mileageAtService: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={currentService.type || ''}
                    onChange={(e) => setCurrentService({ ...currentService, type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option>Oil Change</option>
                    <option>Tire Rotation</option>
                    <option>Brake Check</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={currentService.notes || ''}
                    onChange={(e) => setCurrentService({ ...currentService, notes: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCreate} disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Save'}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceList;
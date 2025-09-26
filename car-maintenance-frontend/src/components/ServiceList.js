import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const ServiceList = ({ vehicleId }) => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${vehicleId}`);
        setServices(res.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    if (vehicleId) {
      fetchServices();
    }
  }, [vehicleId]);

  const handleCreate = async () => {
    try {
      if (currentService.id) {
        await axios.put(
          `http://localhost:5000/api/services/${currentService.id}`,
          currentService
        );
      } else {
        await axios.post('http://localhost:5000/api/services', {
          ...currentService,
          vehicleId,
        });
      }
      setShowModal(false);
      // Refresh service list
      const res = await axios.get(`http://localhost:5000/api/services/${vehicleId}`);
      setServices(res.data);
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      // Refresh after delete
      const res = await axios.get(`http://localhost:5000/api/services/${vehicleId}`);
      setServices(res.data);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const openModal = (service = {}) => {
    setCurrentService(service);
    setShowModal(true);
  };

  return (
    <div>
      <Button className="mb-3" onClick={() => openModal()}>
        Add Service
      </Button>
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
            <tr key={service._id}>
              <td>{new Date(service.date).toLocaleDateString()}</td>
              <td>{service.mileageAtService}</td>
              <td>{service.type}</td>
              <td>{service.notes}</td>
              <td className="d-flex gap-2">
                <Button variant="info" size="sm" onClick={() => openModal(service)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(service._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentService.id ? 'Edit' : 'Add'} Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={
                  currentService.date
                    ? new Date(currentService.date).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setCurrentService({ ...currentService, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={currentService.mileageAtService || ''}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    mileageAtService: Number(e.target.value),
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={currentService.type || ''}
                onChange={(e) =>
                  setCurrentService({ ...currentService, type: e.target.value })
                }
              >
                <option value="">Select a service type</option>
                <option>Oil Change</option>
                <option>Tire Rotation</option>
                <option>Brake Check</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                value={currentService.notes || ''}
                onChange={(e) =>
                  setCurrentService({ ...currentService, notes: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceList;

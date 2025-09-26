import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const MileageTracker = ({ vehicleId, onUpdate }) => {
  const [mileage, setMileage] = useState(0);

  useEffect(() => {
    const fetchMileage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
        setMileage(res.data.currentMileage);
      } catch (error) {
        console.error('Error fetching mileage:', error);
      }
    };

    fetchMileage();
  }, [vehicleId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vehicles/${vehicleId}/mileage`, {
        currentMileage: mileage,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating mileage:', error);
    }
  };

  return (
    <Form className="d-flex gap-2">
      <Form.Control
        type="number"
        value={mileage}
        onChange={e => setMileage(Number(e.target.value))}
        min={0}
      />
      <Button variant="primary" onClick={handleUpdate}>
        Update Mileage
      </Button>
    </Form>
  );
};

export default MileageTracker;

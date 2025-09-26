import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const MileageTracker = ({ vehicleId, onUpdate }) => {
  const [mileage, setMileage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMileage();
  }, [vehicleId]);

  const fetchMileage = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
      setMileage(res.data.currentMileage);
    } catch (err) {
      toast.error('Failed to fetch mileage');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/vehicles/${vehicleId}/mileage`, { currentMileage: mileage });
      toast.success('Mileage updated');
      onUpdate();
    } catch (err) {
      toast.error('Failed to update mileage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form inline className="d-flex align-items-center">
        <Form.Control
          type="number"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          disabled={loading}
          className="me-2"
        />
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Update Mileage'}
        </Button>
      </Form>
    </motion.div>
  );
};

export default MileageTracker;
// src/components/CustomStep.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomStep = ({ vehicleId, onReply }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const types = ['Oil Change', 'Tire Rotation', 'Brake Check'];
        const intervals = { 'Oil Change': 5000, 'Tire Rotation': 10000, 'Brake Check': 20000 };
        let reminders = [];

        const vehicleRes = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
        const currentMileage = vehicleRes.data.currentMileage;

        for (let type of types) {
          const res = await axios.get(`http://localhost:5000/api/services/last/${vehicleId}/${type}`);
          const lastService = res.data;
          if (lastService) {
            const milesSince = currentMileage - lastService.mileageAtService;
            const milesToNext = intervals[type] - milesSince;
            reminders.push(`${type}: ${milesToNext > 0 ? `${milesToNext} miles until next` : 'Overdue!'}`);
          } else {
            reminders.push(`${type}: No record, schedule soon!`);
          }
        }

        onReply(reminders.join('\n'));
      } catch (err) {
        onReply('Sorry, I couldn’t fetch service reminders right now.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [vehicleId, onReply]);

  return loading ? <div>Checking reminders...</div> : null;
};

export default CustomStep;

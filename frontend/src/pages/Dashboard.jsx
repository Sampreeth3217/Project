import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/events', {
        headers: { Authorization: token },
      });
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="dashboard">
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
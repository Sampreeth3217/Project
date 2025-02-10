import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/events/create', { name, date, description, organizer }, {
        headers: { Authorization: token },
      });
      alert('Event created successfully');
    } catch (error) {
      alert('Error creating event');
    }
  };

  return (
    <div className="create-event">
      <h2>Create Event</h2>
      <form onSubmit={handleCreateEvent}>
        <input type="text" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
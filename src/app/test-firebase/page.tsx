'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestFirebase() {
  const [ip, setIp] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Fetching data...');
    setData(null);

    try {
      console.log('Sending request to Next.js API with IP:', ip);
      const response = await axios.post('/api/test-firebase', { ip });
      console.log('Full response:', response.data);

      if (response.data.success) {
        setMessage('Data fetched successfully');
        setData(response.data.data);
      } else {
        setMessage('Error: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage('Error: ' + (error.response?.data?.message || error.message));
      } else {
        setMessage('An unexpected error occurred');
      }
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Test ZK Device API</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Enter device IP"
          required
        />
        <button type="submit">Fetch Data</button>
      </form>
      {message && <p>{message}</p>}
      {data && (
        <div>
          <h2>Device Info:</h2>
          <pre>{JSON.stringify(data.deviceInfo, null, 2)}</pre>
          <h2>Users:</h2>
          <pre>{JSON.stringify(data.users, null, 2)}</pre>
          <h2>Attendance:</h2>
          <pre>{JSON.stringify(data.attendance, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
// components/PersonalInfo.tsx
import React from 'react';

interface PersonalInfoProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  birthday: string;
  setBirthday: (birthday: string) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  name, setName, email, setEmail, phone, setPhone, birthday, setBirthday
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Full Name"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="tel"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
        placeholder="Phone"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="date"
        onChange={(e) => setBirthday(e.target.value)}
        value={birthday}
        placeholder="Birthday"
        required
        className="w-full p-2 mb-2 border rounded"
      />
    </div>
  );
};

export default PersonalInfo;
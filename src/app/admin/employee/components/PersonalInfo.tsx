// components/PersonalInfo.tsx
import React, { useEffect } from 'react';

interface PersonalInfoProps {
  name: string;
  setName: (name: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  birthday: string;
  setBirthday: (birthday: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  maritalStatus: string;
  setMaritalStatus: (maritalStatus: string) => void;
  nationality: string;
  setNationality: (nationality: string) => void;
  currentAddress: string;
  setCurrentAddress: (currentAddress: string) => void;
  permanentAddress: string;
  setPermanentAddress: (permanentAddress: string) => void;
  isPermanentSameAsCurrent: boolean;
  setIsPermanentSameAsCurrent: (isPermanentSameAsCurrent: boolean) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
  emergencyContactName: string;
  setEmergencyContactName: (emergencyContactName: string) => void;
  emergencyContactPhone: string;
  setEmergencyContactPhone: (emergencyContactPhone: string) => void;
  emergencyContactAddress: string;
  setEmergencyContactAddress: (emergencyContactAddress: string) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  name, setName, nickname, setNickname, birthday, setBirthday, gender, setGender, maritalStatus, setMaritalStatus, nationality, setNationality, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, isPermanentSameAsCurrent, setIsPermanentSameAsCurrent, phone, setPhone, email, setEmail, emergencyContactName, setEmergencyContactName, emergencyContactPhone, setEmergencyContactPhone, emergencyContactAddress, setEmergencyContactAddress
}) => {

  useEffect(() => {
    if (isPermanentSameAsCurrent) {
      setPermanentAddress(currentAddress);
    } else {
      setPermanentAddress('');
    }
  }, [isPermanentSameAsCurrent, currentAddress, setPermanentAddress]);

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
        type="text"
        onChange={(e) => setNickname(e.target.value)}
        value={nickname}
        placeholder="Nickname"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="flex flex-col mb-2">
        <label htmlFor="birthday" className="text-sm text-gray-500 mb-1">
          Birthday
        </label>
        <input
          type="date"
          id="birthday"
          onChange={(e) => setBirthday(e.target.value)}
          value={birthday}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <select
        onChange={(e) => setGender(e.target.value)}
        value={gender}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <select
        onChange={(e) => setMaritalStatus(e.target.value)}
        value={maritalStatus}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Marital Status</option>
        <option value="single">Single</option>
        <option value="married">Married</option>
        <option value="divorced">Divorced</option>
        <option value="widowed">Widowed</option>
      </select>
      <input
        type="text"
        onChange={(e) => setNationality(e.target.value)}
        value={nationality}
        placeholder="Nationality"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        onChange={(e) => setCurrentAddress(e.target.value)}
        value={currentAddress}
        placeholder="Current Address"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={isPermanentSameAsCurrent}
          onChange={(e) => setIsPermanentSameAsCurrent(e.target.checked)}
          className="mr-2"
        />
        <label>Permanent address is the same as current</label>
      </div>
      {!isPermanentSameAsCurrent && (
        <textarea
          onChange={(e) => setPermanentAddress(e.target.value)}
          value={permanentAddress}
          placeholder="Permanent Address"
          required
          className="w-full p-2 mb-2 border rounded"
        />
      )}
      <input
        type="tel"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
        placeholder="Phone"
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
        type="text"
        onChange={(e) => setEmergencyContactName(e.target.value)}
        value={emergencyContactName}
        placeholder="Emergency Contact Name"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        onChange={(e) => setEmergencyContactPhone(e.target.value)}
        value={emergencyContactPhone}
        placeholder="Emergency Contact Phone"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        onChange={(e) => setEmergencyContactAddress(e.target.value)}
        value={emergencyContactAddress}
        placeholder="Emergency Contact Address"
        required
        className="w-full p-2 mb-2 border rounded"
      />
    </div>
  );
};

export default PersonalInfo;

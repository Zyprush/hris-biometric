// components/PersonalInfo.tsx
import React, { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { rtdb } from '@/firebase';


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
  userIdRef: string;
  setUserIdRef: (userIdRef: string) => void;
}

interface User {
  cardno: string;
  name: string;
  role: string;
  userid: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  name, setName, nickname, setNickname, birthday, setBirthday, gender, setGender, maritalStatus, setMaritalStatus, nationality, setNationality, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, isPermanentSameAsCurrent, setIsPermanentSameAsCurrent, phone, setPhone, email, setEmail, emergencyContactName, setEmergencyContactName, emergencyContactPhone, setEmergencyContactPhone, emergencyContactAddress, setEmergencyContactAddress,
  userIdRef, setUserIdRef
}) => {
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    const usersRef = ref(rtdb, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData: { [key: string]: User } = {};
        snapshot.forEach((childSnapshot) => {
          usersData[childSnapshot.key!] = childSnapshot.val();
        });
        setUsers(usersData);
      } else {
        console.log('No users data found');
      }
    });
    return () => {
      off(usersRef);
    };
  }, []);

  useEffect(() => {
    if (isPermanentSameAsCurrent) {
      setPermanentAddress(currentAddress);
    } else {
      setPermanentAddress('');
    }
  }, [isPermanentSameAsCurrent, currentAddress, setPermanentAddress]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Personal Information</h2>

      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="selectedUser" className="text-sm text-gray-500 mb-1 block">User Reference</label>
          <select
            id="userIdRef"
            onChange={(e) => setUserIdRef(e.target.value)}
            value={userIdRef}
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          >
            <option value="">Select User Reference</option>
            {Object.values(users).map((user) => (
              <option key={user.userid} value={user.userid}>
                {user.name} (User ID: {user.userid})
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="fullName" className="text-sm text-gray-500 mb-1 block">Full Name</label>
          <input
            type="text"
            id="fullName"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Full Name"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="nickname" className="text-sm text-gray-500 mb-1 block">Nickname</label>
          <input
            type="text"
            id="nickname"
            onChange={(e) => setNickname(e.target.value)}
            value={nickname}
            placeholder="Nickname"
            required
            className="w-full p-2 border rounded  dark:bg-zinc-200"
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="birthday" className="text-sm text-gray-500 mb-1 block">Birthday</label>
          <input
            type="date"
            id="birthday"
            onChange={(e) => setBirthday(e.target.value)}
            value={birthday}
            required
            className="w-full p-2 border rounded  dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="gender" className="text-sm text-gray-500 mb-1 block">Gender</label>
          <select
            id="gender"
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            required
            className="w-full p-2 border rounded  dark:bg-zinc-200"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="maritalStatus" className="text-sm text-gray-500 mb-1 block">Marital Status</label>
          <select
            id="maritalStatus"
            onChange={(e) => setMaritalStatus(e.target.value)}
            value={maritalStatus}
            required
            className="w-full p-2 border rounded  dark:bg-zinc-200"
          >
            <option value="">Select Marital Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="nationality" className="text-sm text-gray-500 mb-1 block">Nationality</label>
          <input
            type="text"
            id="nationality"
            onChange={(e) => setNationality(e.target.value)}
            value={nationality}
            placeholder="Nationality"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="currentAddress" className="text-sm text-gray-500 mb-1 block">Current Address</label>
          <input
            type="text"
            id="currentAddress"
            onChange={(e) => setCurrentAddress(e.target.value)}
            value={currentAddress}
            placeholder="Current Address"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center">
          <input
            type="checkbox"
            id="permanentSameAsCurrent"
            checked={isPermanentSameAsCurrent}
            onChange={(e) => setIsPermanentSameAsCurrent(e.target.checked)}
            className="mr-2  dark:bg-zinc-200"
          />
          <label htmlFor="permanentSameAsCurrent" className="text-sm text-gray-500">Permanent address is the same as current</label>
        </div>
      </div>

      {!isPermanentSameAsCurrent && (
        <div className="mb-4">
          <label htmlFor="permanentAddress" className="text-sm text-gray-500 mb-1 block">Permanent Address</label>
          <textarea
            id="permanentAddress"
            onChange={(e) => setPermanentAddress(e.target.value)}
            value={permanentAddress}
            placeholder="Permanent Address"
            required
            className="w-full p-2 border rounded  dark:bg-zinc-200"
          />
        </div>
      )}

      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="phone" className="text-sm text-gray-500 mb-1 block">Phone</label>
          <input
            type="tel"
            id="phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            placeholder="Phone"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="email" className="text-sm text-gray-500 mb-1 block">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-4 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/3">
          <label htmlFor="emergencyContactName" className="text-sm text-gray-500 mb-1 block">Emergency Contact Name</label>
          <input
            type="tel"
            id="emergencyContactName"
            onChange={(e) => setEmergencyContactName(e.target.value)}
            value={emergencyContactName}
            placeholder="Emergency Contact Name"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="emergencyContactPhone" className="text-sm text-gray-500 mb-1 block">Emergency Contact Phone</label>
          <input
            type="tel"
            id="emergencyContactPhone"
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
            value={emergencyContactPhone}
            placeholder="Emergency Contact Phone"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="emergencyContactAddress" className="text-sm text-gray-500 mb-1 block">Emergency Contact Address</label>
          <input
            type="text"
            id="emergencyContactAddress"
            onChange={(e) => setEmergencyContactAddress(e.target.value)}
            value={emergencyContactAddress}
            placeholder="Emergency Contact Address"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>

      </div>
    </div>

  );
};

export default PersonalInfo;

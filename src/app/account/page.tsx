"use client"
import React, { useState } from 'react'

const UpdateAccount = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div>UpdateAccount</div>
  )
}

const DetailItem: React.FC<{
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ label, value, isEditing, onChange }) => (
    <div className="mb-2">
      <span className="font-semibold text-gray-700 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}: </span>
      {isEditing ? (
        <input
          type="text"
          name={label}
          value={value}
          onChange={onChange}
          className="border rounded px-2 py-1 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      ) : (
        <span className="text-gray-600">{value}</span>
      )}
    </div>
  );

export default UpdateAccount;
// components/Credentials.tsx
import React from 'react';
import { formatDate } from './utils';

interface CredentialsProps {
  autoGeneratePassword: boolean;
  setAutoGeneratePassword: (autoGenerate: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  rePassword: string;
  setRePassword: (rePassword: string) => void;
  role: "user" | "admin";
  setRole: (role: "user" | "admin") => void;
  birthday: string;
}

const Credentials: React.FC<CredentialsProps> = ({
  autoGeneratePassword, setAutoGeneratePassword, password, setPassword, 
  rePassword, setRePassword, role, setRole, birthday
}) => {
  const handleAutoGeneratePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoGeneratePassword(e.target.checked);
    if (e.target.checked) {
      const formattedPassword = formatDate(birthday);
      setPassword(formattedPassword);
      setRePassword(formattedPassword);
    } else {
      setPassword("");
      setRePassword("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Credentials (for user login)</h2>
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          onChange={handleAutoGeneratePassword}
          checked={autoGeneratePassword}
          className="mr-2"
        />
        <label>Auto-generate password based on Birthday.</label>
      </div>
      {!autoGeneratePassword && (
        <>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            required
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            onChange={(e) => setRePassword(e.target.value)}
            value={rePassword}
            placeholder="Re-enter Password"
            required
            className="w-full p-2 mb-2 border rounded"
          />
        </>
      )}
      <select
        onChange={(e) => setRole(e.target.value as "user" | "admin")}
        value={role}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
};

export default Credentials;
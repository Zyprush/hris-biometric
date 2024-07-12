// components/LegalDocuments.tsx
import React from 'react';

interface LegalDocumentsProps {
  ssn: string;
  setSsn: (ssn: string) => void;
  workPermitNumber: string;
  setWorkPermitNumber: (workPermitNumber: string) => void;
  documents: FileList | null;
  setDocuments: (documents: FileList | null) => void;
}

const LegalDocuments: React.FC<LegalDocumentsProps> = ({
  ssn, setSsn, workPermitNumber, setWorkPermitNumber, documents, setDocuments
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Legal Compliance and Documents</h2>
      <input
        type="text"
        onChange={(e) => setSsn(e.target.value)}
        value={ssn}
        placeholder="SSN/TIN"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        onChange={(e) => setWorkPermitNumber(e.target.value)}
        value={workPermitNumber}
        placeholder="Work Permit Number"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setDocuments(e.target.files)}
        multiple
        className="w-full p-2 mb-2 border rounded"
      />
      {documents && (
        <p className="text-sm text-gray-600">
          {documents.length} file(s) selected
        </p>
      )}
    </div>
  );
};

export default LegalDocuments;
// components/LegalDocuments.tsx
import React from 'react';

interface LegalDocumentsProps {
  sss: string;
  setSss: (sss: string) => void;
  philHealthNumber: string;
  setPhilHealthNumber: (philHealthNumber: string) => void;
  pagIbigNumber: string;
  setPagIbigNumber: (pagIbigNumber: string) => void;
  tinNumber: string;
  setTinNumber: (tinNumber: string) => void;
  documents: FileList | null;
  setDocuments: (documents: FileList | null) => void;
}

const LegalDocuments: React.FC<LegalDocumentsProps> = ({
  sss, setSss, philHealthNumber, setPhilHealthNumber, pagIbigNumber, setPagIbigNumber, tinNumber, setTinNumber, documents, setDocuments
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Legal Compliance and Documents</h2>
      <h2 className="text-sm font-thin mb-4">Put &quot;N/A&quot; if not applicable</h2>
      <input
        type="text"
        onChange={(e) => setSss(e.target.value)}
        value={sss}
        placeholder="SSS"
        required
        className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
      />
      <input
        type="text"
        onChange={(e) => setPhilHealthNumber(e.target.value)}
        value={philHealthNumber}
        placeholder="Philhealth Number"
        required
        className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
      />
      <input
        type="text"
        onChange={(e) => setPagIbigNumber(e.target.value)}
        value={pagIbigNumber}
        placeholder="Pag-ibig Number"
        required
        className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
      />
      <input
        type="text"
        onChange={(e) => setTinNumber(e.target.value)}
        value={tinNumber}
        placeholder="TIN Number"
        required
        className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
      />
      <div className="w-full mb-4">
        <label htmlFor="profilePic" className="text-sm text-gray-500 mb-1">Documents</label>
        <input
          type="file"
          onChange={(e) => setDocuments(e.target.files)}
          multiple
          className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
        />
      </div>
      {documents && (
        <p className="text-sm text-gray-600">
          {documents.length} file(s) selected
        </p>
      )}
    </div>
  );
};

export default LegalDocuments;
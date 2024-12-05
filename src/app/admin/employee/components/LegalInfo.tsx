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
      <h3 className="text-sm font-thin mb-4">Put &quot;N/A&quot; if not applicable</h3>
      <div className='w-full mb-4'>
        <label htmlFor="sss" className='text-sm text-gray-500 mb-1'>
          Social Security System No.{' '}
          <span className='text-xs'>
            (0-9 only, max 10 digits, {sss.length}/10)
          </span>
        </label>
        <input
          type="text"
          onChange={(e) => {
            const sssValue = e.target.value;
            const onlyNumbers = sssValue.replace(/[^0-9]/g, '');
            if (sssValue.length <= 10) {
              setSss(onlyNumbers);
            }
          }}
          value={sss}
          placeholder="SSS"
          required
          className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
        />
      </div>
      <div className='w-full mb-4'>
        <label htmlFor="philHealthNumber" className="text-sm text-gray-500 mb-1">
          Philhealth No.{' '}
          <span className='text-xs'>
            (0-9 only, max 12 digits, {philHealthNumber.length}/12)
          </span>
        </label>
        <input
          type="text"
          onChange={(e) => {
            const philHealthNumberValue = e.target.value;
            const onlyNumbers = philHealthNumberValue.replace(/[^0-9]/g, '');
            if (philHealthNumberValue.length <= 12) {
              setPhilHealthNumber(onlyNumbers);
            }
          }}
          value={philHealthNumber}
          placeholder="Philhealth Number"
          required
          className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
        />
      </div>
      <div className='w-full mb-4'>
        <label htmlFor="pagIbigNumber" className="text-sm text-gray-500 mb-1">
          Pag-ibig No.{' '}
          <span className='text-xs'>
            (0-9 only, max 12 digits, {pagIbigNumber.length}/12)
          </span>
        </label>
        <input
          type="text"
          onChange={(e) => {
            const pagIbigNumberValue = e.target.value;
            const onlyNumbers = pagIbigNumberValue.replace(/[^0-9]/g, '');
            if (pagIbigNumberValue.length <= 12) {
              setPagIbigNumber(onlyNumbers);
            }
          }}
          value={pagIbigNumber}
          placeholder="Pag-ibig Number"
          required
          className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
        />
      </div>
      <div className='w-full mb-4'>
        <label htmlFor="tinNumber" className="text-sm text-gray-500 mb-1">
          Taxpayer Identification Number{' '}
          <span className='text-xs'>
            (0-9 only, max 14 digits, {tinNumber.length}/14)
          </span>
        </label>
        <input
          type="text"
          onChange={(e) => {
            const tinNumberValue = e.target.value;
            const onlyNumbers = tinNumberValue.replace(/[^0-9]/g, '');
            if (tinNumberValue.length <= 14) {
              setTinNumber(onlyNumbers);
            }
          }}
          value={tinNumber}
          placeholder="TIN Number"
          required
          className="w-full p-2 mb-2 border rounded dark:bg-zinc-200"
        />
      </div>
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
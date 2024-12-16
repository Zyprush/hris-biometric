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
  const handleNumberInput = (
    value: string, 
    setter: (val: string) => void, 
    maxLength: number
  ) => {
    // If not 'N/A', proceed with numeric validation
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    if (onlyNumbers.length <= maxLength) {
      setter(onlyNumbers);
    }
  };

  const renderInputWithNAButton = (
    value: string, 
    setter: (val: string) => void, 
    placeholder: string, 
    maxLength: number
  ) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          onChange={(e) => handleNumberInput(e.target.value, setter, maxLength)}
          value={value}
          placeholder={placeholder}
          required
          className="flex-grow p-2 mb-2 border rounded dark:bg-zinc-200"
        />
        <button
          type="button"
          onClick={() => setter('N/A')}
          className="p-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          N/A
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Legal Compliance and Documents</h2>
      <h3 className="text-sm font-thin mb-4">Put &quot;N/A&quot; if not applicable</h3>
      
      <div className='w-full mb-4'>
        <label htmlFor="sss" className='text-sm text-gray-500 mb-1'>
          Social Security System No.{' '}
          <span className='text-xs'>
            (0-9 only, max 10 digits, {sss === 'N/A' ? 'N/A' : `${sss.length}/10`})
          </span>
        </label>
        {renderInputWithNAButton(
          sss, 
          setSss, 
          "SSS", 
          10
        )}
      </div>
      
      <div className='w-full mb-4'>
        <label htmlFor="philHealthNumber" className="text-sm text-gray-500 mb-1">
          Philhealth No.{' '}
          <span className='text-xs'>
            (0-9 only, max 12 digits, {philHealthNumber === 'N/A' ? 'N/A' : `${philHealthNumber.length}/12`})
          </span>
        </label>
        {renderInputWithNAButton(
          philHealthNumber, 
          setPhilHealthNumber, 
          "Philhealth Number", 
          12
        )}
      </div>
      
      <div className='w-full mb-4'>
        <label htmlFor="pagIbigNumber" className="text-sm text-gray-500 mb-1">
          Pag-ibig No.{' '}
          <span className='text-xs'>
            (0-9 only, max 12 digits, {pagIbigNumber === 'N/A' ? 'N/A' : `${pagIbigNumber.length}/12`})
          </span>
        </label>
        {renderInputWithNAButton(
          pagIbigNumber, 
          setPagIbigNumber, 
          "Pag-ibig Number", 
          12
        )}
      </div>
      
      <div className='w-full mb-4'>
        <label htmlFor="tinNumber" className="text-sm text-gray-500 mb-1">
          Taxpayer Identification Number{' '}
          <span className='text-xs'>
            (0-9 only, max 14 digits, {tinNumber === 'N/A' ? 'N/A' : `${tinNumber.length}/14`})
          </span>
        </label>
        {renderInputWithNAButton(
          tinNumber, 
          setTinNumber, 
          "TIN Number", 
          14
        )}
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
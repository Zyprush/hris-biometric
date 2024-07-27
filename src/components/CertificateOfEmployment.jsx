const CertificateOfEmployment = () => (
    <div style={{ border: '1px solid black', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Certificate of Employment</h1>
      
      <h2 style={{ textAlign: 'center' }}>CERTIFICATION</h2>
      
      <p>To Whom It May Concern,</p>
      
      <p>
        This is to certify that {'{employeeName}'} is a bonafide employee of Beper Shopping
        Center holding the position of {'{position}'} from {'{employmentDate}'} up to the present.
      </p>
      
      <p>
        This certification is being issued upon the request of {'{employeeName}'} for any
        purpose it may serve.
      </p>
      
      <p>
        Issued this {'{day}'} day of {'{month}'}, year {'{year}'} in {'{location}'} Mamburao, Occidental
        Mindoro Philippines.
      </p>
    </div>
  );
  
  export default CertificateOfEmployment;
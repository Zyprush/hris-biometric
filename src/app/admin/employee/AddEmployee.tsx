"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { auth, db, storage } from "@/firebase";
import Loading from "@/components/Loading";
import { format } from "date-fns";
import { errorToast, successToast } from "@/components/toast";
import { ToastContainer } from "react-toastify";

const AddEmployee = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoGeneratePassword, setAutoGeneratePassword] = useState<boolean>(false);

  // Personal Information
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");

  // Employment Info
  const [position, setPosition] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");

  // Legal Compliance and Documents
  const [ssn, setSsn] = useState<string>("");
  const [workPermitNumber, setWorkPermitNumber] = useState<string>("");
  const [documents, setDocuments] = useState<FileList | null>(null);

  // Credentials
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const validateStep = () => {
    switch (step) {
      case 1:
        return name !== "" && email !== "" && phone !== "" && birthday !== "";
      case 2:
        return position !== "" && department !== "" && startDate !== "" && employeeId !== "";
      case 3:
        return ssn !== "" && workPermitNumber !== "" && documents !== null;
      case 4:
        return autoGeneratePassword || (password !== "" && rePassword !== "" && password === rePassword);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep() && step < 4) setStep(step + 1);
    else errorToast("Please fill out all required fields before proceeding.");
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "MMddyyyy");
  };

  const handleAutoGeneratePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoGeneratePassword(e.target.checked);
    if (e.target.checked) {
      const formattedPassword = formatDate(birthday);
      setPassword(formattedPassword);
      setRePassword(formattedPassword);
      console.log(formattedPassword);
    } else {
      setPassword("");
      setRePassword("");
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!autoGeneratePassword && password !== rePassword) {
      errorToast("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await createUser(email, password);
      if (result?.user) {
        const uploadedDocumentUrls: string[] = [];

        // Upload documents if any
        if (documents) {
          for (let i = 0; i < documents.length; i++) {
            const file = documents[i];
            const storageRef = ref(storage, `employee_documents/${result.user.uid}/${file.name}`);
            try {
              const snapshot = await uploadBytes(storageRef, file);
              const downloadURL = await getDownloadURL(snapshot.ref);
              uploadedDocumentUrls.push(downloadURL);
            } catch (error) {
              console.error("Error uploading file: ", error);
            }
          }
        }

        try {
          await setDoc(doc(db, "users", result.user.uid), {
            // Personal Information
            name,
            email,
            phone,
            birthday,
            // Employment Info
            position,
            department,
            startDate,
            employeeId,
            // Legal Compliance and Documents
            ssn,
            workPermitNumber,
            documentUrls: uploadedDocumentUrls,
            // Credentials
            role,
          });
          console.log("Document successfully written!");
        } catch (firestoreError) {
          console.error("Error writing document: ", firestoreError);
          if (firestoreError instanceof FirebaseError) {
            console.error("Firebase error code:", firestoreError.code);
            console.error("Firebase error message:", firestoreError.message);
          }
        }
        //await sendEmailVerification();
        setLoading(false);
        successToast("User created successfully.");
      } else {
        console.error("User creation failed");
        errorToast("User creation failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof FirebaseError) {
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
      }
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
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
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Employment Info</h2>
            <input
              type="text"
              onChange={(e) => setPosition(e.target.value)}
              value={position}
              placeholder="Position"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              placeholder="Department"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              placeholder="Start Date"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              onChange={(e) => setEmployeeId(e.target.value)}
              value={employeeId}
              placeholder="Employee ID"
              required
              className="w-full p-2 mb-2 border rounded"
            />
          </div>
        );
      case 3:
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
      case 4:
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
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer/>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">
            Add Employee - Step {step} of 4
          </div>
          <form onSubmit={onSubmit}>
            {loading ? <Loading /> : renderStep()}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;

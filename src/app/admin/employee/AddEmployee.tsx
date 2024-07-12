"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/firebase";
import Loading from "@/components/Loading";

const AddEmployee = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [loading, setLoading] = useState<boolean>(false);

  // Personal Information
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

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

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== rePassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await createUser(email, password);
      if (result?.user) {
        try {
          await setDoc(doc(db, "users", result.user.uid), {
            // Personal Information
            name,
            email,
            phone,
            // Employment Info
            position,
            department,
            startDate,
            employeeId,
            // Legal Compliance and Documents
            ssn,
            workPermitNumber,
            // We don't store the actual files in Firestore
            // You'd need to use Firebase Storage for file uploads
            hasUploadedDocuments: documents !== null,
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
        await sendEmailVerification();
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } else {
        console.error("User creation failed");
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
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Credentials (for user login)</h2>
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
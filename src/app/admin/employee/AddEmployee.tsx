// pages/AddEmployee.tsx
"use client";
import React, { useState, FormEvent } from "react";
import Loading from "@/components/Loading";
import { errorToast, successToast } from "@/components/toast";
import { ToastContainer } from "react-toastify";
import { validateStep } from "./components/utils";
import { handleSubmit } from "./components/formSubmitt";
import PersonalInfo from "./components/PersonalInfo";
import EmploymentInfo from "./components/EmployeeInfo";
import LegalDocuments from "./components/LegalInfo";
import Credentials from "./components/CredentialInfo";
import { auth } from "@/firebase";
import AdminRouteGuard from "@/app/AdminRouteGuard/page";

const AddEmployee = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Personal Information
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [permanentAddress, setPermanentAddress] = useState<string>("");
  const [isPermanentSameAsCurrent, setIsPermanentSameAsCurrent] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emergencyContactName, setEmergencyContactName] = useState<string>("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>("");
  const [emergencyContactAddress, setEmergencyContactAddress] = useState<string>("");

  // Employment Info
  const [employeeId, setEmployeeId] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [supervisor, setSupervisor] = useState<string>("");

  // Legal Compliance and Documents
  const [ssn, setSsn] = useState<string>("");
  const [workPermitNumber, setWorkPermitNumber] = useState<string>("");
  const [documents, setDocuments] = useState<FileList | null>(null);

  // Credentials
  const [autoGeneratePassword, setAutoGeneratePassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const nextStep = () => {
    if (validateStep(step, {
      name, email, phone, birthday,
      position, department, startDate, employeeId,
      ssn, workPermitNumber, documents,
      autoGeneratePassword, password, rePassword, status, supervisor
    })) {
      setStep(step + 1);
    } else {
      errorToast("Please fill out all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(4, { autoGeneratePassword, password, rePassword })) {
      errorToast("Please ensure all fields are filled correctly.");
      return;
    }
    setLoading(true);
    try {
      await handleSubmit({
        auth,
        email,
        password,
        documents,
        formData: {
          name, nickname, gender, maritalStatus, nationality, currentAddress, permanentAddress, isPermanentSameAsCurrent, email, phone, birthday, emergencyContactName, emergencyContactPhone, emergencyContactAddress, position, department, startDate, employeeId,
          ssn, workPermitNumber, role, status, supervisor
        }
      });
      successToast("User created successfully.");
      setLoading(true);
    } catch (error) {
      console.error("Error during signup:", error);
      errorToast("User creation failed. Please try again later.");
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo {...{ name, setName, nickname, setNickname,  birthday, setBirthday, gender, setGender, maritalStatus, setMaritalStatus, nationality, setNationality, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, isPermanentSameAsCurrent, setIsPermanentSameAsCurrent, phone, setPhone, email, setEmail, emergencyContactName, setEmergencyContactName, emergencyContactPhone, setEmergencyContactPhone, emergencyContactAddress, setEmergencyContactAddress }} />;
      case 2:
        return <EmploymentInfo {...{ employeeId, setEmployeeId, position, setPosition, department, setDepartment, startDate, setStartDate, status, setStatus, supervisor, setSupervisor }} />;
      case 3:
        return <LegalDocuments {...{ ssn, setSsn, workPermitNumber, setWorkPermitNumber, documents, setDocuments }} />;
      case 4:
        return <Credentials {...{ autoGeneratePassword, setAutoGeneratePassword, password, setPassword, rePassword, setRePassword, role, setRole, birthday }} />;
      default:
        return null;
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4">
        <ToastContainer />
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
    </AdminRouteGuard>
  );
};

export default AddEmployee;
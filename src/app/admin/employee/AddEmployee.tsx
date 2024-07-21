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
import Credentials from "./components/CredentialInfo";
import { auth } from "@/firebase";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import LegalDocuments from "./components/LegalInfo";
import { useUserStore } from "@/state/user";
import { useHistoryStore } from "@/state/history";

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
  const [branch, setBranch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [supervisor, setSupervisor] = useState<string>("");

  // Legal Compliance and Documents
  const [sss, setSss] = useState<string>("");
  const [philHealthNumber, setPhilHealthNumber] = useState<string>("");
  const [pagIbigNumber, setPagIbigNumber] = useState<string>("");
  const [tinNumber, setTinNumber] = useState<string>("");
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  // Credentials
  const [autoGeneratePassword, setAutoGeneratePassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const { userData } = useUserStore();
  const { addHistory } = useHistoryStore();

  const nextStep = () => {
    const validationResult = validateStep(step, {
      name, nickname, birthday, gender, nationality, currentAddress, permanentAddress, phone, email, emergencyContactName, emergencyContactPhone, emergencyContactAddress,
      position, department, startDate, employeeId, sss, philHealthNumber, pagIbigNumber, tinNumber, status, supervisor, branch, documents
    });

    if (validationResult.isValid) {
      setStep(step + 1);
    } else {
      errorToast(validationResult.errorMessage || "Please fill out all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = validateStep(4, { autoGeneratePassword, password, rePassword, role });
    if (!validationResult.isValid) {
      errorToast(validationResult.errorMessage || "Please ensure all fields are filled correctly.");
      return;
    }
    setLoading(true);
    try {
      await handleSubmit({
        auth,
        email,
        password,
        documents,
        profilePic,
        formData: {
          name, nickname, gender, maritalStatus, nationality, currentAddress, permanentAddress, isPermanentSameAsCurrent, email, phone, birthday, emergencyContactName, emergencyContactPhone, emergencyContactAddress, position, department, startDate, employeeId,
          sss, philHealthNumber, pagIbigNumber, tinNumber, role, status, supervisor, branch
        }
      });
      // add to history
      const currentDate = new Date().toISOString();
      addHistory({
        adminId: userData?.id,
        text: `${userData?.name} created ${name} account`,
        time: currentDate,
      });
      successToast("User created successfully.");
      // Set a short timeout before reloading to ensure the success toast is visible
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 seconds delay
    } catch (error) {
      console.error("Error during signup:", error);
      errorToast("User creation failed. Please try again later.");
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo {...{ name, setName, nickname, setNickname, birthday, setBirthday, gender, setGender, maritalStatus, setMaritalStatus, nationality, setNationality, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, isPermanentSameAsCurrent, setIsPermanentSameAsCurrent, phone, setPhone, email, setEmail, emergencyContactName, setEmergencyContactName, emergencyContactPhone, setEmergencyContactPhone, emergencyContactAddress, setEmergencyContactAddress }} />;
      case 2:
        return <EmploymentInfo {...{ employeeId, setEmployeeId, position, setPosition, department, setDepartment, branch, setBranch, startDate, setStartDate, status, setStatus, supervisor, setSupervisor, profilePic, setProfilePic }} />;
      case 3:
        return <LegalDocuments {...{ sss, setSss, philHealthNumber, setPhilHealthNumber, pagIbigNumber, setPagIbigNumber, tinNumber, setTinNumber, documents, setDocuments }} />;
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
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-primary font-semibold mb-4">
              Add Employee - Step {step} of 4
            </div>
            <form onSubmit={onSubmit}>
              {loading ? <Loading /> : renderStep()}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
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
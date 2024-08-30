// utils/helpers.ts
import { format } from "date-fns";

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, "MMddyyyy");
};

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateStep = (step: number, formData: any): ValidationResult => {
  switch (step) {
    case 1: // Personal Information
      if (formData.userIdRef === "")
        return { isValid: false, errorMessage: "User Reference is required." };
      if (formData.name === "")
        return { isValid: false, errorMessage: "Name is required." };
      if (formData.nickname === "")
        return { isValid: false, errorMessage: "Nickname is required." };
      if (formData.birthday === "")
        return { isValid: false, errorMessage: "Birthday is required." };
      if (formData.gender === "")
        return { isValid: false, errorMessage: "Gender is required." };
      if (formData.nationality === "")
        return { isValid: false, errorMessage: "Nationality is required." };
      if (formData.currentAddress === "")
        return { isValid: false, errorMessage: "Current address is required." };
      if (
        !formData.isPermanentSameAsCurrent &&
        formData.permanentAddress === ""
      ) {
        return {
          isValid: false,
          errorMessage: "Permanent address is required.",
        };
      }
      if (formData.phone === "")
        return { isValid: false, errorMessage: "Phone number is required." };
      if (!/^09\d{9}$/.test(formData.phone)) {
        return {
          isValid: false,
          errorMessage: "Phone number should be 11 digits starting with '09'.",
        };
      }
      if (formData.email === "")
        return { isValid: false, errorMessage: "Email is required." };
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        return { isValid: false, errorMessage: "Invalid email format." };
      }
      if (formData.emergencyContactName === "")
        return {
          isValid: false,
          errorMessage: "Emergency contact name is required.",
        };
      if (formData.emergencyContactPhone === "")
        return {
          isValid: false,
          errorMessage: "Emergency contact phone is required.",
        };
      if (!/^09\d{9}$/.test(formData.emergencyContactPhone)) {
        return {
          isValid: false,
          errorMessage:
            "Emergency contact phone should be 11 digits starting with '09'.",
        };
      }
      if (formData.emergencyContactAddress === "")
        return {
          isValid: false,
          errorMessage: "Emergency contact address is required.",
        };
      return { isValid: true };

    case 2: // Employment Info
      if (formData.employeeId === "")
        return { isValid: false, errorMessage: "Employee ID is required." };
      if (formData.position === "")
        return { isValid: false, errorMessage: "Position is required." };
      if (formData.department === "")
        return { isValid: false, errorMessage: "Department is required." };
      if (formData.branch === "")
        return { isValid: false, errorMessage: "Branch is required." };
      if (formData.startDate === "")
        return { isValid: false, errorMessage: "Start date is required." };
      if (formData.status === "")
        return { isValid: false, errorMessage: "Status is required." };
      if (formData.supervisor === "")
        return { isValid: false, errorMessage: "Supervisor is required." };
      return { isValid: true };

    case 3: // Legal Compliance and Documents
      if (formData.sss === "" || formData.sss === "N/A" || formData.sss === "n/a") {
        if (formData.sss === "") {
          return { isValid: false, errorMessage: "SSS number is required." };
        }
      } else if (!/^\d{10}$/.test(formData.sss)) {
        return {
          isValid: false,
          errorMessage: "SSS number must be exactly 10 digits.",
        };
      }

      if (
        formData.philHealthNumber === "" ||
        formData.philHealthNumber === "N/A" ||
        formData.philHealthNumber === "n/a"
      ) {
        if (formData.philHealthNumber === "") {
          return {
            isValid: false,
            errorMessage: "PhilHealth number is required.",
          };
        }
      } else if (!/^\d{12}$/.test(formData.philHealthNumber)) {
        return {
          isValid: false,
          errorMessage: "PhilHealth number must be exactly 12 digits.",
        };
      }

      if (formData.pagIbigNumber === "" || formData.pagIbigNumber === "N/A" || formData.pagIbigNumber === "n/a") {
        if (formData.pagIbigNumber === "") {
          return {
            isValid: false,
            errorMessage: "Pag-IBIG number is required.",
          };
        }
      } else if (!/^\d{12}$/.test(formData.pagIbigNumber)) {
        return {
          isValid: false,
          errorMessage: "Pag-IBIG number must be exactly 12 digits.",
        };
      }

      if (formData.tinNumber === "" || formData.tinNumber === "N/A" || formData.tinNumber === "n/a") {
        if (formData.tinNumber === "") {
          return { isValid: false, errorMessage: "TIN is required." };
        }
      } else if (!/^\d{14}$/.test(formData.tinNumber)) {
        return {
          isValid: false,
          errorMessage: "TIN must be exactly 14 digits.",
        };
      }

      if (formData.documents === null) {
        return { isValid: false, errorMessage: "Documents are required." };
      }

      return { isValid: true };

    case 4: // Credentials
      if (!formData.autoGeneratePassword) {
        if (formData.password === "")
          return { isValid: false, errorMessage: "Password is required." };
        if (formData.rePassword === "")
          return {
            isValid: false,
            errorMessage: "Please confirm your password.",
          };
        if (formData.password !== formData.rePassword) {
          return { isValid: false, errorMessage: "Passwords do not match." };
        }
        if (formData.password.length < 8) {
          return {
            isValid: false,
            errorMessage: "Password should be at least 8 characters long.",
          };
        }
      }
      if (formData.role === "")
        return { isValid: false, errorMessage: "Role is required." };
      return { isValid: true };

    default:
      return { isValid: false, errorMessage: "Invalid step." };
  }
};

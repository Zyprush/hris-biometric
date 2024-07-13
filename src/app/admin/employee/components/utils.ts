// utils/helpers.ts
import { format } from 'date-fns';

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, "MMddyyyy");
};

export const validateStep = (step: number, formData: any): boolean => {
  switch (step) {
    case 1: // Personal Information
      return (
        formData.name !== "" &&
        formData.nickname !== "" &&
        formData.birthday !== "" &&
        formData.gender !== "" &&
        formData.nationality !== "" &&
        formData.currentAddress !== "" &&
        (formData.isPermanentSameAsCurrent || formData.permanentAddress !== "") &&
        formData.phone !== "" &&
        formData.email !== "" &&
        formData.emergencyContactName !== "" &&
        formData.emergencyContactPhone !== "" &&
        formData.emergencyContactAddress !== ""
      );
    case 2: // Employment Info
      return (
        formData.position !== "" &&
        formData.department !== "" &&
        formData.startDate !== "" &&
        formData.employeeId !== ""
      );
    case 3: // Legal Compliance and Documents
      return (
        formData.ssn !== "" &&
        formData.workPermitNumber !== "" &&
        formData.documents !== null
      );
    case 4: // Credentials
      if (formData.autoGeneratePassword) {
        return true; // If auto-generating, no need to check password fields
      } else {
        return (
          formData.password !== "" &&
          formData.rePassword !== "" &&
          formData.password === formData.rePassword
        );
      }
    default:
      return false;
  }
};
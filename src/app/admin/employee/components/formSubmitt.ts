// utils/formSubmission.ts
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface SubmitParams {
  auth: any;
  email: string;
  password: string;
  documents: FileList | null;
  formData: {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    position: string;
    department: string;
    startDate: string;
    employeeId: string;
    ssn: string;
    workPermitNumber: string;
    role: "user" | "admin";
  };
}

export const handleSubmit = async ({
  auth,
  email,
  password,
  documents,
  formData,
}: SubmitParams) => {
  try {
    // Replace createUser with createUserWithEmailAndPassword
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser = userCredential.user;

    if (newUser) {
      const uploadedDocumentUrls: string[] = [];

      // Upload documents if any
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          const file = documents[i];
          const storageRef = ref(
            storage,
            `employee_documents/${newUser.uid}/${file.name}`
          );
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
        await setDoc(doc(db, "users", newUser.uid), {
          ...formData,
          documentUrls: uploadedDocumentUrls,
        });
        console.log("Document successfully written!");
      } catch (firestoreError) {
        console.error("Error writing document: ", firestoreError);
        if (firestoreError instanceof FirebaseError) {
          console.error("Firebase error code:", firestoreError.code);
          console.error("Firebase error message:", firestoreError.message);
        }
        throw firestoreError;
      }
    } else {
      throw new Error("User creation failed");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    if (error instanceof FirebaseError) {
      console.error("Firebase error code:", error.code);
      console.error("Firebase error message:", error.message);
    }
    throw error;
  }
};

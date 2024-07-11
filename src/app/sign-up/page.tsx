"use client";

import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import Loading from "@/components/Loading";

export default function SignUpPage() {
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user");

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
            name,
            email,
            employeeId,
            role
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
      // Handle error (e.g., show error message to user)
    }
    setLoading(false);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 dark">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 bg-gray-700 text-white rounded-md p-2 hover:bg-gray-600 transition ease-in-out duration-150"
      >
        Back
      </button>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 relative">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Create account</h1>
        <form onSubmit={onSubmit} className="flex flex-col">
          {loading ? (
            <Loading/>
          ) : (
            <>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
                required
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                required
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <input
                type="text"
                onChange={(e) => setEmployeeId(e.target.value)}
                value={employeeId}
                placeholder="Employee ID"
                required
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                required
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <input
                type="password"
                onChange={(e) => setRePassword(e.target.value)}
                value={rePassword}
                placeholder="Re-enter Password"
                required
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <select
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                value={role}
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
              >
                CREATE USER
              </button>

            </>
          )}
        </form>
      </div>
    </div>
  );
}
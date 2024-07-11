"use client";

import { auth } from "@/firebase";
import { IconFidgetSpinner } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";

export default function Page() {
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    await createUser(email, password);
    await sendEmailVerification();
    setLoading(false);
    router.push("/");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 bg-gray-700 text-white rounded-md p-2 hover:bg-gray-600 transition ease-in-out duration-150"
      >
        Back
      </button>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 relative">
        <h1 className="text-2xl font-bold mb-6">Create account</h1>
        <div className="flex flex-col">
          {loading ? (
            <IconFidgetSpinner className="animate-spin w-8 h-8 mx-auto" />
          ) : (
            <>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              />
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                onClick={onSubmit}
              >
                SIGN UP
              </button>
              <Link className="mr-4 underline mt-4" href="../sign-in">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

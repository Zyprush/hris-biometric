"use client";

import { auth } from "@/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function Page() {
  const router = useRouter();
  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    await signInUserWithEmailAndPassword(email, password);
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
        <h1 className="text-2xl font-bold mb-6">Sign in page</h1>
        <div className="flex flex-col">
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
            SIGN IN
          </button>
          <Link className="mr-4 underline mt-4" href="../sign-up">
            Sign up
          </Link>
          <Link className="underline mt-4" href="#">
            Forgot password
          </Link>
        </div>
      </div>
    </div>
  );
}

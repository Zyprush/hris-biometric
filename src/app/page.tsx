"use client";
import { auth } from "@/firebase";
import { IconFidgetSpinner } from "@tabler/icons-react";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { SignedIn } from "./components/signed-in";
import { SignedOut } from "./components/signed-out";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen dark">
        <h1>HOME</h1>
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 relative">
          {loading ? (
            <IconFidgetSpinner className="animate-spin w-12 h-12 mx-auto" />
          ) : (
            <>
              <SignedIn>
                <div className="flex flex-col text-primary-500">
                  <h1 className="text-3xl font-bold">Signed in as</h1>
                  <p>{user?.email}</p>
                  <p>
                    Email verified:{" "}
                    {user?.emailVerified ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-red-500">Not verified</span>
                    )}
                  </p>
                  <button onClick={signOut} className="text-red-500 font-bold">
                    Sign out
                  </button>
                </div>
              </SignedIn>
              <SignedOut>
                <Link className="m-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150" href="/sign-in">
                  Sign in
                </Link>
                <Link className="m-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150" href="/sign-up">
                  Create account
                </Link>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

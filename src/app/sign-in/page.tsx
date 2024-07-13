"use client";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { warnToast, errorToast } from "@/components/toast";
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer } from "react-toastify";
const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData.role;
        console.log('role:', role);
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } else {
        warnToast("User data not found. Please contact support.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            errorToast("Invalid email or password. Please try again.");
            break;
          case "auth/user-disabled":
            errorToast("This account has been disabled. Please contact support.");
            break;
          case "auth/too-many-requests":
            errorToast("Too many failed login attempts. Please try again later.");
            break;
          default:
            errorToast("An unexpected error occurred. Please try again.");
        }
      } else {
        errorToast("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };
  return (
    <AuroraBackground>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center h-screen dark w-full px-4">
        <div className="w-full max-w-lg bg-gray-800 bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md p-6 z-10 relative">
          <h1 className="text-2xl text-white font-bold mb-6">Sign in page</h1>
          <div className="flex flex-col" onKeyDown={handleKeyDown}>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
            />
            <button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? "LOADING..." : "SIGN IN"}
            </button>
          </div>
        </div>
      </div>

    </AuroraBackground>
  );
};
export default SignInPage;
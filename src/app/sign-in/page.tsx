"use client";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { warnToast, errorToast } from "@/components/toast";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useHistoryStore } from "@/state/history";
import { doc, getDoc } from "firebase/firestore";
import { SignedOut } from "@/components/signed-out";
import { SignedIn } from "@/components/signed-in";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";
import { motion } from "framer-motion";
import { text } from "stream/consumers";
import { getPath } from "../page";

const SignInPage = () => {
  const text = "SMART HR";

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: i * 0.5,
          type: "spring",
          duration: 1.5,
          bounce: 0,
        },
        opacity: { delay: i * 0.5, duration: 0.01 },
      },
    }),
  };
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addHistory } = useHistoryStore();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const { role, name, email } = userDocSnap.data();
        console.log("role:", role);
        const currentDate = new Date().toISOString();
        addHistory({
          text: `${name} signed in using ${email}`,
          userId: user.uid,
          time: currentDate,
          login: true,
          type: "login",
        });
        router.push(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      } else {
        warnToast("User data not found. Please contact support.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      if (error instanceof FirebaseError) {
        const errorMessages: { [key: string]: string } = {
          "auth/invalid-credential":
            "Invalid email or password. Please try again.",
          "auth/user-disabled":
            "This account has been disabled. Please contact support.",
          "auth/too-many-requests":
            "Too many failed login attempts. Please try again later.",
        };
        errorToast(
          errorMessages[error.code] ||
            "An unexpected error occurred. Please try again."
        );
      } else {
        errorToast("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  }, [email, password, router, addHistory]);

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        handleSignIn();
      }
    },
    [handleSignIn]
  );

  return (
    <AuroraBackground>
      <SignedOut>
        <ToastContainer />
        <div className="flex md:flex-row flex-col-reverse gap-8 items-center justify-center h-screen dark w-full px-4 bg-black">
          <div className="text-zinc-700 dark:text-zinc-400 text-xs w-[20rem] text-justify">
            <div className="grid grid-cols-1 pl-8 p-3 bg-zinc-950 bg-opacity-70 rounded-lg">
              <motion.svg
                width="300"
                height="100"
                viewBox="0 0 300 100"
                initial="hidden"
                animate="visible"
              >
                {text.split("").map((char, index) => (
                  <motion.path
                    key={index}
                    d={getPath(char, index)}
                    fill="transparent"
                    strokeWidth="4"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={pathVariants}
                    custom={index}
                  />
                ))}
              </motion.svg>
            </div>
            The system is a comprehensive HRIS Biometric web application
            designed to streamline employee management and attendance tracking.
            It features user authentication, role-based access control, and a
            dashboard that provides insights into attendance, leave requests,
            and financial overviews. Additionally, the application integrates
            with Firebase for real-time data management and notifications,
            ensuring a seamless user experience.
          </div>
          <div className="w-full max-w-md bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-lg shadow-md p-6 py-14 z-10 relative">
            <h1 className="text-2xl text-white font-bold mb-6">Sign in</h1>
            <div className="flex flex-col" onKeyDown={handleKeyDown}>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
              />
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* <Link href={"/reset-password"}>forgot password?</Link> */}
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150 flex justify-center items-center"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex gap-2 text-center">
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <RoleBasedRedirect />
        <div className="flex flex-col items-center justify-center h-screen dark w-full px-4 bg-black">
          <div className="w-full max-w-lg bg-gray-800 bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md p-6 z-10 relative">
            <h1 className="text-2xl text-white font-bold mb-6">Sign in</h1>
            <div className="flex flex-col" onKeyDown={handleKeyDown}>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
              />
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-md mt-4 transition ease-in-out duration-150 flex justify-center items-center"
                onClick={handleSignIn}
                disabled={loading}
              >
                <span className="flex gap-2 text-center">
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </span>
              </button>
            </div>
          </div>
        </div>
      </SignedIn>
    </AuroraBackground>
  );
};

export default SignInPage;

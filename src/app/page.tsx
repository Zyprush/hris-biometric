"use client";
import { auth, db } from "@/firebase";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { SignedIn } from "../components/signed-in";
import { SignedOut } from "../components/signed-out";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Loading from "@/components/Loading";
import { GrFingerPrint } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { AuroraBackgroundHero } from "@/components/aurora-hero";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: "user" | "admin";
}

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUserDataLoading(true);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (user && userData) {
      if (userData.role === "admin") {
        router.push("/admin/dashboard");
      } else if (userData && userData.role === "user") {
        router.push("/user/dashboard");
      } else {
        // Handle case where role is not set
        console.log("Role is not set");
      }
    }
  }, [user, userData, router]);

  return (
    <main>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <>
            <SignedIn>
              <div className="text-3xl md:text-7xl font-bold dark:text-white text-center flex items-center justify-center">
                H<GrFingerPrint className="mx-2" />man Resources Info System
              </div>

              <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                All of your need for human resources management.
              </div>
              <button
                className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
              >
                Signing in...
              </button>
            </SignedIn>
            <SignedOut>
              <div className="text-3xl md:text-7xl font-bold dark:text-white text-center flex items-center justify-center">
                H<GrFingerPrint className="mx-2" />man Resources Info System
              </div>

              <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                All of your need for human resources management.
              </div>
              <Link
                className=" bg-gradient-to-r from-indigo-500 to-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-2 px-9 rounded-md mt-4 transition ease-in-out duration-150"
                href="/sign-in"
              >
                Sign in
              </Link>
            </SignedOut>
          </>
        </motion.div>
      </AuroraBackground>
    </main>
  );
}

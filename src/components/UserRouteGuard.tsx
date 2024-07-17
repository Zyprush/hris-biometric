"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { warnToast } from "@/components/toast";

interface UserRouteGuardProps {
  children: ReactNode;
}
interface UserData {
  role: "user" | "admin";
}

export function UserRouteGuard({ children }: UserRouteGuardProps) {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
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
      }
      setUserDataLoading(false);
    };

    if (user) {
      fetchUserData();
    } else if (!loading) {
      setUserDataLoading(false);
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !userDataLoading) {
      if (!user) {
        console.log("User not authenticated. Redirecting to sign-in page...");
        router.push("../sign-in");
      } else if (user && !user.emailVerified) {
        warnToast("Your email is not verified. Please check your inbox for a verification email.");
        console.log("Email not verified.");
      }
    }
  }, [user, userData, loading, userDataLoading, router]);

  return <>{children}</>;
};
"use client";

import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import { SignedIn } from "@/components/signed-in";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const AdminPayroll = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const setAuthChecked = (isChecked: boolean) => {
    console.log("Auth checked:", isChecked);
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated. Redirecting to sign-in page...");
        router.push("../sign-in");
      }
      setAuthChecked(true); 
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <SignedIn>
      <AdminLayout>
        <div>Payroll</div>
      </AdminLayout>
    </SignedIn>
  );
};

export default AdminPayroll;
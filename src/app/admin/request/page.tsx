"use client";
import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import { SignedIn } from "@/components/signed-in";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const AdminRequest = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const setAuthChecked = (isChecked: boolean) => {
    console.log("Auth checked:", isChecked);
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("../sign-in");
      }
      setAuthChecked(true);
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div>request</div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminRequest;

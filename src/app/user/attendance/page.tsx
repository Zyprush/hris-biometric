"use client";

import { SignedIn } from "@/components/signed-in";
import UserLayout from "@/components/UserLayout";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import { auth } from "@/firebase"; // Make sure you import auth from your firebase config
import { useAuthState } from 'react-firebase-hooks/auth'; // Install this package if not already installed
import React from "react";
import AttendanceUser from "./AttendanceUser";

const Page = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Error: {error.message}</div>
      </div>
    );
  }

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          {user && <AttendanceUser userId={user.uid} />}
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Page;
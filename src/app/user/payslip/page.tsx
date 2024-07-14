import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React from "react";

const page = () => {
  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="w-full h-full flex flex-col justify-start items-center"></div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default page;

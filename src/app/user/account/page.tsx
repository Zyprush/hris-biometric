
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React from "react";

const page = () => {
  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <p>dito mo ilipat yung email, password, pic, at emailVerified</p>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default page;



import { SignedIn } from "@/components/signed-in";
import React from "react";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";

const page = () => {
  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <p>dito mo ilipat yung email, password, pic, at emailVerified for admin</p>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default page;

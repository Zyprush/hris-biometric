import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import React from "react";

const page = () => {
  return (
    <SignedIn>
      <AdminLayout>
         <div>Branch</div>
      </AdminLayout>
    </SignedIn>
  );
};

export default page;

"use client";

import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";

const AdminAttendance = () => {

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div>Attendanca</div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminAttendance;
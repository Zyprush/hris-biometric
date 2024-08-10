"use client";

import React, { ReactNode } from "react";
import AdminTopNavbar from "./navbar/AdminTopNavbar";
import AdminSideNavbar from "./navbar/AdminSideNavbar";

interface NavbarProps {
  children: ReactNode;
}

const AdminLayout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <>
      <div className="flex md:hidden">
        <AdminTopNavbar>{children}</AdminTopNavbar>
      </div>
      <div className="md:flex hidden">
        <AdminSideNavbar>{children}</AdminSideNavbar>
      </div>
    </>
  );
};

export default AdminLayout;

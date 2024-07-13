"use client";

import React, { ReactNode } from "react";
import SideNavbar from "./navbar/SideNavbar";
import AdminTopNavbar from "./navbar/AdminTopNavbar";
import AdminSideNavbar from "./navbar/AdminSideNavbar";

interface NavbarProps {
  children: ReactNode;
}

const AdminLayout: React.FC<NavbarProps> = ({ children }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <AdminTopNavbar>{children}</AdminTopNavbar>
      ) : (
        <AdminSideNavbar>{children}</AdminSideNavbar>
      )}
    </>
  );
};

export default AdminLayout;

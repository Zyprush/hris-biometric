"use client";
import React, { ReactNode } from "react";
import SideNavbar from "./navbar/SideNavbar";
import TopNavbar from "./navbar/TopNavbar";

interface NavbarProps {
  children: ReactNode;
}

const UserLayout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <>
      <div className="flex md:hidden">
        <TopNavbar>{children}</TopNavbar>
      </div>
      <div className="md:flex hidden">
        <SideNavbar>{children}</SideNavbar>
      </div>
    </>
  );
};

export default UserLayout;

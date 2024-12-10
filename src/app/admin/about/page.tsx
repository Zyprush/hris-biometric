"use client";
import {AdminRouteGuard} from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import AboutUs from "./aboutus";

const About = () => {
  const [currentTab, setCurrentTab] = useState("");

  const renderContent = () => {
    switch (currentTab) {
      case "About Us":
        return <AboutUs />;
      default:
        return <AboutUs />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto">
            <div className="grid grid-col-1">
              <p className="text-lg font-bold dark:text-white">{currentTab}</p>
              {renderContent()}
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default About;

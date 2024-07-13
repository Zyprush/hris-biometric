import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React from "react";

const page = () => {
  return (
    <SignedIn>
      <UserLayout>
        <div className="w-full h-full flex flex-col justify-start items-center"></div>
      </UserLayout>
    </SignedIn>
  );
};

export default page;

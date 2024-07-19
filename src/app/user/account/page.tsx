"use client";
import UserLayout from "@/components/UserLayout";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import { useUserStore } from "@/state/user";
import React, { useState } from "react";

const UpdateUser = () => {
  const [update, setUpdate] = useState(false);
  const { userData } = useUserStore();

  return (
    <UserRouteGuard>
      <UserLayout>
        <div className="flex p-5 w-full h-full">
          <div className="grid">
<span>
  
</span>
          </div>
        </div>
      </UserLayout>
    </UserRouteGuard>
  );
};


export default UpdateUser;

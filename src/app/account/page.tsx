"use client";
import UserLayout from "@/components/UserLayout";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import React, { useEffect, useState } from "react";

const UpdateUser = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or some fallback UI
  }

  return (
    <UserRouteGuard>
      <UserLayout>
        <div>page</div>
      </UserLayout>
    </UserRouteGuard>
  );
};

export default UpdateUser;

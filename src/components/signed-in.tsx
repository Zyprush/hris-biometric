"use client"
import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React from "react";

interface SignedInProps {
  children: ReactNode;
}

const SignedInComponent = ({ children }: SignedInProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !user) return null;

  return <>{children}</>;
};

export const SignedIn = React.memo(SignedInComponent);

import { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

interface SignedOutProps {
  children: ReactNode;
}

export function SignedOut({ children }: SignedOutProps) {
  const [user] = useAuthState(auth);
  
  if (user) return null;

  return <>{children}</>;
}

import { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

interface SignedInProps {
  children: ReactNode;
}

export function SignedIn({ children }: SignedInProps) {
  const [user] = useAuthState(auth);
  
  if (!user) return null;

  return <>{children}</>;
}

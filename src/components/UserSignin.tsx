"use client"
import React, { useEffect } from 'react'
import FingerprintLoading from './Loading';
import { ReactNode } from "react";
import { useUserStore } from '@/state/user';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/router';

interface SignedInProps {
    children: ReactNode;
  }
const UserSignin = ({ children }: SignedInProps) => {
    const [user, authLoading] = useAuthState(auth);
    const { user: userData, loading, fetchUserData } = useUserStore();
    const router = useRouter();
  
    useEffect(() => {
      if (user) {
        fetchUserData(user.uid);
      }
    }, [user, fetchUserData]);
  
    useEffect(() => {
      if (!user) {
        router.push("/sign-in");
      }
    }, [user, router]);
  
    if (authLoading || loading || !userData) {
      return (
          <FingerprintLoading />
      );
    }
  return (
    <>{children}</>
  )
}

export default UserSignin
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  role: 'user' | 'admin';
}

export const RoleBasedRedirect: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchUserDataAndRedirect = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserData;
            if (userData.role === 'admin') {
              router.push('/admin/dashboard');
            } else if (userData.role === 'user') {
              router.push('/user/dashboard');
            } else {
              console.log('Role is not set');
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserDataAndRedirect();
  }, [user, router]);

  return null; // This component doesn't render anything
};
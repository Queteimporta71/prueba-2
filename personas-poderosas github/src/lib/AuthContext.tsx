import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  registerProfile: (name: string, code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        try {
          const docRef = doc(db, 'users', currUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error(err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const registerProfile = async (name: string, code: string) => {
    if (!user) return false;
    
    // We expect the user to provide the Proser18 code, but we do standard authorization in Firebase rules.
    // Proser18 is required by instructions:
    if (code !== 'Proser18') {
      return false;
    }

    try {
      const newProfile: UserProfile = {
        name,
        email: user.email || '',
        isActive: true,
        isAdmin: false, // Default false, rules handle setting the specific admin
        codeUsed: code,
        createdAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, registerProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

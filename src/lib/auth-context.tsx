"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  updateGuestProfile: (data: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  uid: "guest-user-001",
  email: "learner@k-tech.io",
  displayName: "K-Tech Learner",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  isGuest: true,
  xp: 350,
  level: 2,
  streakDays: 4,
  lastActiveDate: new Date().toISOString(),
  enrolledCourses: ["svelte-fundamentals", "typescript-mastery", "docker-k8s-mastery"],
  completedLessons: ["svelte-fundamentals:s1-1", "svelte-fundamentals:s1-2", "typescript-mastery:ts1-1"],
  quizScores: {
    "svelte-fundamentals:s1-2": 100,
    "typescript-mastery:ts1-1": 90,
  },
  completedCourses: [],
  bookmarks: ["nest-backend", "kafka-streams"],
  notes: {},
  badges: [
    {
      id: "first-step",
      name: "ก้าวแรกสู่นักพัฒนา",
      icon: "🚀",
      description: "เริ่มต้นเรียนรู้บทเรียนแรกบน K-Tech",
      unlockedAt: new Date().toISOString(),
    },
    {
      id: "streak-3",
      name: "ต่อเนื่อง 3 วัน",
      icon: "🔥",
      description: "เข้าเรียนติดต่อกันอย่างน้อย 3 วัน",
      unlockedAt: new Date().toISOString(),
    }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "ktech_user_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from local storage or initialize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch {
          setProfile(defaultProfile);
        }
      } else {
        setProfile(defaultProfile);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProfile));
      }
    }

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setProfile((prev) => {
            const updated: UserProfile = {
              ...(prev || defaultProfile),
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || prev?.displayName || "K-Tech Member",
              photoURL: firebaseUser.photoURL || prev?.photoURL || null,
              isGuest: false,
            };
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            }
            return updated;
          });
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      signInAsGuest();
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.warn("Google Sign-in fallback:", error);
      signInAsGuest();
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) {
      signInAsGuest();
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      setUser(result.user);
    } catch (error) {
      console.warn("Email Sign-in fallback:", error);
      signInAsGuest();
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) {
      signInAsGuest();
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
      }
      setUser(result.user);
    } catch (error) {
      console.warn("Sign-up fallback:", error);
      signInAsGuest();
    }
  };

  const signInAsGuest = () => {
    const guestUser: UserProfile = {
      ...defaultProfile,
      uid: `guest-${Date.now().toString(36)}`,
      displayName: "Guest Student",
      isGuest: true,
    };
    saveProfile(guestUser);
  };

  const signOut = async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error("Sign out error", e);
      }
    }
    setUser(null);
    signInAsGuest();
  };

  const updateGuestProfile = (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    saveProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut,
        updateGuestProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

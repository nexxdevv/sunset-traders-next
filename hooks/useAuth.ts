// hooks/useAuth.ts
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut, // Renamed to avoid conflict
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: new Date().toISOString(),
            favorites: [],
            orders: [],
          });
          console.log("✅ New user document created in Firestore");
        } else {
          console.log("👤 Existing user document found");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // No need to set menuOpen here, parent component will handle it
      router.push("/"); // Redirect to account page after sign in
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message);
        alert(`Error signing in: ${error.message}`);
      } else {
        console.error("Error signing in with Google:", error);
        alert("Error signing in. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error signing out:", error.message);
        alert(`Error signing out: ${error.message}`);
      } else {
        console.error("Unexpected error signing out:", error);
        alert("An unknown error occurred during sign out.");
      }
    }
  };

  return { user, loading, handleGoogleSignIn, handleSignOut };
}
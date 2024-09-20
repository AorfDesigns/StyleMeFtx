'use client'; // Next.js client component

import { FC, useState } from 'react';
import { SiGoogle } from 'react-icons/si';
import { auth, provider, db } from '../../firebase/firebaseConfig'; // Firebase config
import { signInWithPopup } from 'firebase/auth'; // For signing in with Google
import { doc, setDoc } from 'firebase/firestore'; // For saving user data in Firestore
import { useRouter } from 'next/navigation'; // For route navigation

const Signup: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Sign in with Google
      const user = result.user;

      // Check if this is a new user and store data in Firestore
      const userRef = doc(db, "users", user.uid); // Reference to Firestore document
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        createdAt: new Date(),
      });

      // Redirect to a target page after sign-up
      router.push('/dashboard'); // Change this to your desired page
    } catch (error) {
      console.error("Error signing up with Google: ", error);
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up with Google</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mt-6">
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SiGoogle className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

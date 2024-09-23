'use client';

import { FC, useEffect, useState } from 'react';
import { SiGoogle } from 'react-icons/si';
import { auth, provider } from '../../firebase/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const SignInForm: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider); 
      // User signed in successfully, navigate to the desired page
      router.push('/measurement'); // Change this to your target page
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to the desired page
        router.push('/measurement'); // Change this to your target page
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
        
        {error && <p className="text-red-500">{error}</p>}

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SiGoogle className="w-5 h-5 mr-2" />
            Log in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

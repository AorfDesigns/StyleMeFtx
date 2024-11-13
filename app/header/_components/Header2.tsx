'use client'
import React from 'react';
import { FaRegComments } from 'react-icons/fa'; // Importing a message icon
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/firebaseConfig';

const Header2: React.FC = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Image
            src="/dev-images/logo.svg" // Path to the image
            alt="Logo" // Alt text for accessibility
            width={20} // Define width
            height={20} // Define height
          />
        </div>

        {/* Menu list */}
        <ul className="hidden md:flex space-x-8 text-gray-700">
          <li>
            <Link href="/dashboard2" className="hover:text-[#FF6F61]" passHref>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/product2" className="hover:text-[#FF6F61]" passHref>
              Products
            </Link>
          </li>
        </ul>

        {/* Message icon */}
        <div className="flex items-center">
          <Link href="/messages" passHref>
            <FaRegComments size={24} color="#000000" />
          </Link>
        </div>

        {/* Sign Out as text */}
        <div
          onClick={handleSignOut}
          className="cursor-pointer text-red-500 font-bold hover:text-red-600 transition-all duration-300"
        >
          Sign Out
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header2;

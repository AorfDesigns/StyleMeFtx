import React from 'react';
import { FaRegComments } from 'react-icons/fa'; // Importing a message icon
import Image from 'next/image';
import Link from 'next/link';
const Header: React.FC = () => {
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
  <Link href="/dashboard" className="hover:text-blue-600" passHref>
    Dashboard
  </Link>
</li>
<li>
  <Link href="/measurement" className="hover:text-blue-600" passHref>
    Measurements
  </Link>
</li>
          <li>
          <Link href="/fashion-trends" className="hover:text-blue-600">
    Fashion Trends
  </Link>
          </li>
          <li>
          <Link href="/products" className="hover:text-blue-600" passHref>
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

export default Header;

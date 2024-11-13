'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Cards: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (cardName: string) => {
    setSelectedCard(cardName);
  };

  // Navigate based on selected card
  useEffect(() => {
    if (selectedCard === "Fashion Designers") {
      router.push("/measurement");
    } else if (selectedCard === "Manufacturers") {
      router.push("/product2");
    }
  }, [selectedCard, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#FF6F61]">Are you a </h2>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Fashion Designers Card */}
        <div
          onClick={() => handleSelect("Fashion Designers")}
          className={`relative w-80 md:w-96 h-72 rounded-[15px] overflow-hidden shadow-lg border transition transform hover:scale-105 cursor-pointer ${
            selectedCard === "Fashion Designers" ? "border-2 border-[#FF6F61]" : "border-gray-200"
          }`}
          style={{
            backgroundImage: `url('/dev-images/fashion.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Circular Checkmark */}
          {selectedCard === "Fashion Designers" && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-[#FF6F61] rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">✓</span>
            </div>
          )}

          {/* Overlay for opacity */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative flex justify-center items-center h-full">
            <h2 className="text-xl font-bold text-white">Fashion Designers</h2>
          </div>
        </div>

        {/* Manufacturers Card */}
        <div
          onClick={() => handleSelect("Manufacturers")}
          className={`relative w-80 md:w-96 h-72 rounded-[15px] overflow-hidden shadow-lg border transition transform hover:scale-105 cursor-pointer ${
            selectedCard === "Manufacturers" ? "border-2 border-[#FF6F61]" : "border-gray-200"
          }`}
          style={{
            backgroundImage: `url('/dev-images/manufacturer.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Circular Checkmark */}
          {selectedCard === "Manufacturers" && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-[#FF6F61] rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">✓</span>
            </div>
          )}

          {/* Overlay for opacity */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative flex justify-center items-center h-full">
            <h2 className="text-xl font-bold text-white">Manufacturers</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;

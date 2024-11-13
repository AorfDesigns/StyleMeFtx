import Image from 'next/image';
import React from 'react';

const ManufacturerProduct = () => {
  const products = [
    {
      id: 1,
      name: 'Cotton Fabric 1',
      price: '$10.00',
      imageUrl: '/dev-images/cotton.jpg', // Replace with your image path
    },
    {
      id: 2,
      name: 'Cotton Fabric 2',
      price: '$12.00',
      imageUrl: '/dev-images/cotton2.jpg', // Replace with your image path
    },
    {
      id: 3,
      name: 'Cotton Fabric 3',
      price: '$15.00',
      imageUrl: '/dev-images/cotton3.jpg', // Replace with your image path
    },
    {
      id: 4,
      name: 'Cotton Fabric 4',
      price: '$18.00',
      imageUrl: '/dev-images/cotton4.jpg', // Replace with your image path
    },
    {
      id: 5,
      name: 'Cotton Fabric 5',
      price: '$20.00',
      imageUrl: '/dev-images/cotton5.jpg', // Replace with your image path
    },
    {
      id: 6,
      name: 'Cotton Fabric 6',
      price: '$22.00',
      imageUrl: '/dev-images/cotton6.jpg', // Replace with your image path
    },
    {
      id: 7,
      name: 'Cotton Fabric 7',
      price: '$25.00',
      imageUrl: '/dev-images/cotton7.jpg', // Replace with your image path
    },
    {
      id: 8,
      name: 'Cotton Fabric 8',
      price: '$28.00',
      imageUrl: '/dev-images/cotton8.jpg', // Replace with your image path
    },
    {
      id: 9,
      name: 'Cotton Fabric 9',
      price: '$30.00',
      imageUrl: '/dev-images/cotton9.jpg', // Replace with your image path
    },
    {
      id: 10,
      name: 'Cotton Fabric 10',
      price: '$32.00',
      imageUrl: '/dev-images/cotton10.jpg', // Replace with your image path
    },
    {
      id: 11,
      name: 'Cotton Fabric 11',
      price: '$35.00',
      imageUrl: '/dev-images/cotton11.jpg', // Replace with your image path
    },
    {
      id: 12,
      name: 'Cotton Fabric 12',
      price: '$38.00',
      imageUrl: '/dev-images/cotton12.jpg', // Replace with your image path
    },
    {
      id: 13,
      name: 'Cotton Fabric 13',
      price: '$40.00',
      imageUrl: '/dev-images/cotton13.jpg', // Replace with your image path
    },
    {
      id: 14,
      name: 'Cotton Fabric 14',
      price: '$42.00',
      imageUrl: '/dev-images/cotton14.jpg', // Replace with your image path
    },
    {
      id: 15,
      name: 'Cotton Fabric 15',
      price: '$45.00',
      imageUrl: '/dev-images/cotton15.jpg', // Replace with your image path
    },
    {
      id: 16,
      name: 'Cotton Fabric 16',
      price: '$48.00',
      imageUrl: '/dev-images/cotton16.jpg', // Replace with your image path
    },
  ];

  return (
    <div className='text-black mb-4'>
      {/* Grid of Product Cards with top margin */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
        {products.map(product => (
          <div key={product.id} className='bg-white rounded-lg shadow-md overflow-hidden'>
            <Image
              src={product.imageUrl}
              alt={product.name}
              className='w-full h-48 object-cover'
            />
            <div className='p-4'>
              <h3 className='text-lg font-semibold'>{product.name}</h3>
              <p className='text-xl font-bold text-[#FF6F61]'>{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManufacturerProduct;

'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebaseConfig'; // Import Firestore database instance

interface PurchaseData {
  id: string; // Add an ID to track the document
  designerName: string;
  productBought: string;
  price: string;
  purchaseDate: string; // Format: YYYY-MM-DD
}

const Dashboard2: React.FC = () => {
  const [data, setData] = useState<PurchaseData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'purchases')); // Assuming your Firestore collection is named 'purchases'
      const fetchedData: PurchaseData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Store the document ID to identify it for deletion
        designerName: doc.data().designerName as string,
        productBought: doc.data().productBought as string,
        price: doc.data().price as string,
        purchaseDate: doc.data().purchaseDate as string,
      }));
      setData(fetchedData);
      setError(null); // Clear any previous error
    } catch (err) {
      setError('Error fetching purchase data');
      console.error('Error fetching purchase data: ', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a purchase
  const deletePurchase = async (id: string) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'purchases', id));

      // Update the UI by filtering out the deleted purchase
      setData((prevData) => prevData?.filter((purchase) => purchase.id !== id) || null);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      setError('Failed to delete purchase');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white text-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard for Manufacturers</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {data ? (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Purchased Products</h2>
          {/* Purchases Table */}
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-6">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Designer Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Product Bought</th>
                <th className="py-3 px-4 text-left text-gray-600">Price</th>
                <th className="py-3 px-4 text-left text-gray-600">Purchase Date</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="py-3 px-4 border-b border-gray-200">{purchase.designerName}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{purchase.productBought}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{purchase.price}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{purchase.purchaseDate}</td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deletePurchase(purchase.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default Dashboard2;

'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase/firebaseConfig'; // Import Firestore database instance
import { Measurement } from '@/app/measurement/_components/MeasurementForm'; // Adjust the import path as necessary

interface ClientData {
  id: string; // Add an ID to track the document
  clientName: string;
  gender: string;
  measurements: Measurement[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ClientData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const fetchedData: ClientData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Store the document ID to identify it for deletion
        clientName: doc.data().clientName as string,
        gender: doc.data().gender as string,
        measurements: doc.data().measurements as Measurement[],
      }));
      setData(fetchedData);
      setError(null); // Clear any previous error
    } catch (err) {
      setError('Error fetching client data');
      console.error('Error fetching measurement data: ', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a client
  const deleteClient = async (id: string) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'clients', id));

      // Update the UI by filtering out the deleted client
      setData((prevData) => prevData?.filter((client) => client.id !== id) || null);
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white text-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {data ? (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Saved Measurements</h2>
          {/* Clients Table */}
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-6">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Client Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Gender</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((client) => (
                <tr key={client.id}>
                  <td className="py-3 px-4 border-b border-gray-200">{client.clientName}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{client.gender}</td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteClient(client.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Measurements Table */}
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Measurement Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Value (in inches)</th>
              </tr>
            </thead>
            <tbody>
              {data.flatMap((client) =>
                client.measurements.map((measurement) => (
                  <tr key={measurement.id}>
                    <td className="py-3 px-4 border-b border-gray-200">{measurement.name}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{measurement.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default Dashboard;

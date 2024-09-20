'use client';
import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebaseConfig'; // Import Firestore database and auth instance
import { signOut } from 'firebase/auth'; // Import signOut function from Firebase Authentication
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export interface Measurement {
  id: number;
  name: string;
  value: string;
}

interface MeasurementFormProps {
  onSubmit?: (formData: { clientName: string; gender: string; measurements: Measurement[] }) => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onSubmit }) => {
  const [clientName, setClientName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: 1, name: 'Neck', value: '' },
    { id: 2, name: 'Chest', value: '' },
  ]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter(); // Use router for navigation

  // Handle client name input
  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
  };

  // Handle gender selection
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  // Handle measurement change
  const handleMeasurementChange = (id: number, field: keyof Measurement, value: string) => {
    setMeasurements((prevMeasurements) =>
      prevMeasurements.map((measurement) =>
        measurement.id === id ? { ...measurement, [field]: value } : measurement
      )
    );
  };

  // Add a new measurement field
  const addMeasurementField = () => {
    setMeasurements((prevMeasurements) => [
      ...prevMeasurements,
      { id: prevMeasurements.length + 1, name: '', value: '' },
    ]);
  };

  // Remove a measurement field by its id
  const removeMeasurementField = (id: number) => {
    setMeasurements((prevMeasurements) =>
      prevMeasurements.filter((measurement) => measurement.id !== id)
    );
  };

  // Check if client name exists
  const checkClientExists = async (name: string) => {
    const q = query(collection(db, 'clients'), where('clientName', '==', name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Return true if client exists
  };

  // Handle form submission and save to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      clientName,
      gender,
      measurements,
    };

    try {
      const clientExists = await checkClientExists(clientName);

      if (clientExists) {
        console.error('Client already exists');
        return;
      }

      // Store data in Firestore under a 'clients' collection
      await addDoc(collection(db, 'clients'), formData);
      console.log('Measurement data stored successfully');

      // Clear form fields
      setClientName('');
      setGender('');
      setMeasurements([
        { id: 1, name: 'Neck', value: '' },
        { id: 2, name: 'Chest', value: '' },
      ]);

      // Set success message
      setSuccessMessage('Measurement submitted successfully!');

      // Optionally call the onSubmit prop for additional actions
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error saving measurement data: ', error);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Authentication
      router.push('/signin'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white text-black rounded-lg shadow-lg">
      {/* Success Message */}
      {successMessage && (
        <p className="text-green-500 text-lg font-semibold mb-6">{successMessage}</p>
      )}

      <h2 className="text-2xl font-bold mb-6">Client Measurement Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={handleClientNameChange}
            placeholder="Enter client name"
            className="p-2 border rounded-md"
            required
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Gender</label>
          <select
            value={gender}
            onChange={handleGenderChange}
            className="p-2 border rounded-md"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Dynamic Measurement Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Measurements</h3>
          {measurements.map((measurement) => (
            <div key={measurement.id} className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Measurement name (e.g., Neck)"
                value={measurement.name}
                onChange={(e) =>
                  handleMeasurementChange(measurement.id, 'name', e.target.value)
                }
                className="p-2 border rounded-md mr-2 flex-grow"
                required
              />
              <input
                type="text"
                placeholder="Value (in inches)"
                value={measurement.value}
                onChange={(e) =>
                  handleMeasurementChange(measurement.id, 'value', e.target.value)
                }
                className="p-2 border rounded-md flex-grow"
                required
              />
              <button
                type="button"
                onClick={() => removeMeasurementField(measurement.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Measurement Button */}
          <button
            type="button"
            onClick={addMeasurementField}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2"
          >
            Add Measurement
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-4 bg-black text-white rounded-md hover:bg-green-600"
        >
          Submit Measurements
        </button>
      </form>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="mt-6 w-full py-4 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default MeasurementForm;

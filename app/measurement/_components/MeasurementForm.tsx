'use client';
import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  const handleMeasurementChange = (id: number, field: keyof Measurement, value: string) => {
    setMeasurements((prevMeasurements) =>
      prevMeasurements.map((measurement) =>
        measurement.id === id ? { ...measurement, [field]: value } : measurement
      )
    );
  };

  const addMeasurementField = () => {
    setMeasurements((prevMeasurements) => [
      ...prevMeasurements,
      { id: prevMeasurements.length + 1, name: '', value: '' },
    ]);
  };

  const removeMeasurementField = (id: number) => {
    setMeasurements((prevMeasurements) =>
      prevMeasurements.filter((measurement) => measurement.id !== id)
    );
  };

  const checkClientExists = async (name: string) => {
    const q = query(collection(db, 'clients'), where('clientName', '==', name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = { clientName, gender, measurements };

    try {
      const clientExists = await checkClientExists(clientName);
      if (clientExists) {
        console.error('Client already exists');
        return;
      }

      await addDoc(collection(db, 'clients'), formData);
      console.log('Measurement data stored successfully');

      // Clear form fields
      setClientName('');
      setGender('');
      setMeasurements([
        { id: 1, name: 'Neck', value: '' },
        { id: 2, name: 'Chest', value: '' },
      ]);

      setSuccessMessage('Measurement submitted successfully!');
      
      // If there's an onSubmit callback, call it
      if (onSubmit) onSubmit(formData);

      // Redirect to the dashboard after successful submission
      router.push('/dashboard');  // Ensure this path is correct for your project
    } catch (error) {
      console.error('Error saving measurement data: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white text-gray-800 rounded-lg shadow-xl transition-all duration-500 ease-in-out transform hover:shadow-2xl">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Success! </strong>
          <span>{successMessage}</span>
        </div>
      )}

      <h2 className="text-3xl font-extrabold text-center mb-8">Client Measurement Form</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="font-semibold">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={handleClientNameChange}
            placeholder="Enter client name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Gender</label>
          <select
            value={gender}
            onChange={handleGenderChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Measurements</h3>
          {measurements.map((measurement) => (
            <div key={measurement.id} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Measurement name (e.g., Neck)"
                value={measurement.name}
                onChange={(e) => handleMeasurementChange(measurement.id, 'name', e.target.value)}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Value (in inches)"
                value={measurement.value}
                onChange={(e) => handleMeasurementChange(measurement.id, 'value', e.target.value)}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => removeMeasurementField(measurement.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMeasurementField}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4 transition-all"
          >
            Add Measurement
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-green-600 transition-all duration-300"
        >
          Submit Measurements
        </button>
      </form>

      <button
        onClick={handleSignOut}
        className="w-full py-4 mt-6 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
      >
        Sign Out
      </button>
    </div>
  );
};

export default MeasurementForm;

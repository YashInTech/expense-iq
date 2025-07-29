import { useUser } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => Promise<FinancialRecord>;
  updateRecord: (id: string, newRecord: FinancialRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  const fetchRecords = async () => {
    if (!user || !isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching records: ${response.status}`, errorText);
        throw new Error(`Failed to fetch records: ${response.status}`);
      }

      const records = await response.json();
      setRecords(records);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError(
        'Failed to load your financial records. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchRecords();
    }
  }, [user, isLoaded]);

  const addRecord = async (
    record: FinancialRecord
  ): Promise<FinancialRecord> => {
    try {
      setError(null);
      console.log('Sending record data:', record);

      const response = await fetch('http://localhost:3001/financial-records', {
        method: 'POST',
        body: JSON.stringify(record),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error ${response.status}: ${errorText}`);
        throw new Error(`Failed to add record: ${response.status}`);
      }

      const newRecord = await response.json();
      setRecords((prev) => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      console.error('Error in addRecord:', err);
      setError('Failed to add record. Please try again.');
      throw err;
    }
  };

  const updateRecord = async (
    id: string,
    newRecord: FinancialRecord
  ): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(newRecord),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error ${response.status}: ${errorText}`);
        throw new Error(`Failed to update record: ${response.status}`);
      }

      const updatedRecord = await response.json();
      setRecords((prev) =>
        prev.map((record) => (record._id === id ? updatedRecord : record))
      );
    } catch (err) {
      console.error('Error updating record:', err);
      setError('Failed to update record. Please try again.');
      throw err;
    }
  };

  const deleteRecord = async (id: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error ${response.status}: ${errorText}`);
        throw new Error(`Failed to delete record: ${response.status}`);
      }

      const deletedRecord = await response.json();
      setRecords((prev) =>
        prev.filter((record) => record._id !== deletedRecord._id)
      );
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record. Please try again.');
      throw err;
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{
        records,
        addRecord,
        updateRecord,
        deleteRecord,
        loading,
        error,
      }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      'useFinancialRecords must be used within a FinancialRecordsProvider'
    );
  }

  return context;
};

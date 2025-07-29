import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import './financial-record.css';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { useMemo } from 'react';

export const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const { records } = useFinancialRecords();

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });

    return totalAmount;
  }, [records]);

  if (!isSignedIn) {
    return (
      <div className='signin-message'>
        <h2>Welcome to ExpenseIQ</h2>
        <p>
          Please sign in to manage your expenses and view your financial
          records.
        </p>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <h1> Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <FinancialRecordForm />
      <div>Total Monthly: ₹{totalMonthly}</div>
      <h2>Your Transactions</h2>
      <FinancialRecordList />
    </div>
  );
};

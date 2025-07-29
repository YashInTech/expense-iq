import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import './financial-record.css';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
// Utility to group records by category
const getCategoryData = (records: any[]) => {
  const categoryMap: Record<string, number> = {};
  records.forEach((rec) => {
    if (!categoryMap[rec.category]) categoryMap[rec.category] = 0;
    categoryMap[rec.category] += rec.amount;
  });
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
};

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

  const categoryData = useMemo(() => getCategoryData(records), [records]);

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

      <h2>Spending by Category</h2>
      <div
        style={{ width: '100%', maxWidth: 400, height: 300, margin: '0 auto' }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={80}
              fill='#8884d8'
              label
            >
              {categoryData.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={
                    [
                      '#0088FE',
                      '#00C49F',
                      '#FFBB28',
                      '#FF8042',
                      '#A28CFF',
                      '#FF6699',
                    ][idx % 6]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h2>Your Transactions</h2>
      <FinancialRecordList />
    </div>
  );
};

import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  useFinancialRecords,
  FinancialRecord,
} from '../../contexts/financial-record-context';

export const FinancialRecordForm = () => {
  const { addRecord } = useFinancialRecords();
  const { user } = useUser();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [record, setRecord] = useState<Omit<FinancialRecord, 'userId' | '_id'>>(
    {
      description: '',
      amount: 0,
      category: '',
      paymentMethod: '',
      date: new Date(),
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRecord((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFormError('You must be signed in to add records');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      // Include the userId from Clerk
      await addRecord({
        ...record,
        userId: user.id,
      });

      // Reset form after successful submission
      setRecord({
        description: '',
        amount: 0,
        category: '',
        paymentMethod: '',
        date: new Date(),
      });
    } catch (err) {
      console.error('Failed to add record:', err);
      setFormError('Failed to add record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='record-form'>
      <h2>Add New Transaction</h2>

      {formError && <div className='form-error'>{formError}</div>}

      <div className='form-group'>
        <label htmlFor='description'>Description</label>
        <input
          type='text'
          id='description'
          name='description'
          value={record.description}
          onChange={handleChange}
          required
          style={{ color: 'black' }}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='amount'>Amount</label>
        <input
          type='number'
          id='amount'
          name='amount'
          value={record.amount}
          onChange={handleChange}
          required
          style={{ color: 'black' }}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='category'>Category</label>
        <select
          id='category'
          name='category'
          value={record.category}
          onChange={handleChange}
          required
          style={{ color: 'black' }}
        >
          <option value=''>Select a category</option>
          <option value='Food'>Food</option>
          <option value='Transportation'>Transportation</option>
          <option value='Entertainment'>Entertainment</option>
          <option value='Utilities'>Utilities</option>
          <option value='Shopping'>Shopping</option>
          <option value='Other'>Other</option>
        </select>
      </div>

      <div className='form-group'>
        <label htmlFor='paymentMethod'>Payment Method</label>
        <select
          id='paymentMethod'
          name='paymentMethod'
          value={record.paymentMethod}
          onChange={handleChange}
          required
          style={{ color: 'black' }}
        >
          <option value=''>Select payment method</option>
          <option value='Cash'>Cash</option>
          <option value='Credit Card'>Credit Card</option>
          <option value='Debit Card'>Debit Card</option>
          <option value='UPI'>UPI</option>
          <option value='Bank Transfer'>Bank Transfer</option>
        </select>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className={isSubmitting ? 'submitting' : ''}
      >
        {isSubmitting ? 'Adding...' : 'Add Record'}
      </button>
    </form>
  );
};

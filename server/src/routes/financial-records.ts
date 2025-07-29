import express from 'express';
import FinancialRecord from '../models/financial-record';

const router = express.Router();

// Get all financial records
router.get('/', async (req, res) => {
  try {
    const records = await FinancialRecord.find();
    res.json(records);
  } catch (error: any) {
    console.error('Error fetching all records:', error);
    res
      .status(500)
      .json({ message: 'Server error fetching records', error: error.message });
  }
});

// Get financial records by user ID
router.get('/getAllByUserID/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const records = await FinancialRecord.find({ userId });
    res.json(records);
  } catch (error: any) {
    console.error(
      `Error fetching records for user ${req.params.userId}:`,
      error
    );
    res.status(500).json({
      message: 'Server error fetching user records',
      error: error.message,
    });
  }
});

// Add a new financial record
router.post('/', async (req, res) => {
  try {
    console.log('Creating new record with data:', req.body);
    const record = new FinancialRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error: any) {
    console.error('Error creating record:', error);
    res
      .status(500)
      .json({ message: 'Server error creating record', error: error.message });
  }
});

// Update a financial record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecord = await FinancialRecord.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(updatedRecord);
  } catch (error: any) {
    console.error(`Error updating record ${req.params.id}:`, error);
    res
      .status(500)
      .json({ message: 'Server error updating record', error: error.message });
  }
});

// Delete a financial record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await FinancialRecord.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(deletedRecord);
  } catch (error: any) {
    console.error(`Error deleting record ${req.params.id}:`, error);
    res
      .status(500)
      .json({ message: 'Server error deleting record', error: error.message });
  }
});

export default router;

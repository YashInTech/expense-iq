"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financial_record_1 = __importDefault(require("../models/financial-record"));
const router = express_1.default.Router();
// Get all financial records
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield financial_record_1.default.find();
        res.json(records);
    }
    catch (error) {
        console.error('Error fetching all records:', error);
        res
            .status(500)
            .json({ message: 'Server error fetching records', error: error.message });
    }
}));
// Get financial records by user ID
router.get('/getAllByUserID/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const records = yield financial_record_1.default.find({ userId });
        res.json(records);
    }
    catch (error) {
        console.error(`Error fetching records for user ${req.params.userId}:`, error);
        res.status(500).json({
            message: 'Server error fetching user records',
            error: error.message,
        });
    }
}));
// Add a new financial record
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating new record with data:', req.body);
        const record = new financial_record_1.default(req.body);
        yield record.save();
        res.status(201).json(record);
    }
    catch (error) {
        console.error('Error creating record:', error);
        res
            .status(500)
            .json({ message: 'Server error creating record', error: error.message });
    }
}));
// Update a financial record
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedRecord = yield financial_record_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(updatedRecord);
    }
    catch (error) {
        console.error(`Error updating record ${req.params.id}:`, error);
        res
            .status(500)
            .json({ message: 'Server error updating record', error: error.message });
    }
}));
// Delete a financial record
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedRecord = yield financial_record_1.default.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(deletedRecord);
    }
    catch (error) {
        console.error(`Error deleting record ${req.params.id}:`, error);
        res
            .status(500)
            .json({ message: 'Server error deleting record', error: error.message });
    }
}));
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const financialRecordSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        index: true, // Add an index for better query performance
    },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('FinancialRecord', financialRecordSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const financial_records_1 = __importDefault(require("./routes/financial-records"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://expense-iq-finance.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// Updated MongoDB connection with proper options
mongoose_1.default
    .connect('mongodb+srv://yashchoudharytech:expenseiq2025@cluster0.yvmwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    // Add these options to handle TLS issues
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    // Retry mechanism
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('CONNECTED TO MONGODB!'))
    .catch((err) => console.error('Failed to Connect to MongoDB:', err));
app.use('/financial-records', financial_records_1.default);
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});

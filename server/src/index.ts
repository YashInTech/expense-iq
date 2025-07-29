import express, { Express } from 'express';
import mongoose from 'mongoose';
import financialRecordRouter from './routes/financial-records';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Updated MongoDB connection with proper options
mongoose
  .connect(
    'mongodb+srv://yashchoudharytech:expenseiq2025@cluster0.yvmwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
      // Add these options to handle TLS issues
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      // Retry mechanism
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  )
  .then(() => console.log('CONNECTED TO MONGODB!'))
  .catch((err) => console.error('Failed to Connect to MongoDB:', err));

app.use('/financial-records', financialRecordRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth/', authRouter);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Successfully connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB:', err));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})

export default app;
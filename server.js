import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Successfully connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB:', err));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})

export default app;
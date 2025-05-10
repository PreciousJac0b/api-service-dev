import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import exchangeRouter from './routes/exchangeRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth/', authRouter);
app.use("/api/users/", userRouter);
app.use("/api/products/", productRouter);
app.use("/api/exchange/", exchangeRouter);


const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'Greensol TaskAPI documentation',
      version: '1.0.0',
      description: 'Express API for converting currencies'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Successfully connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB:', err));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})

export default app;
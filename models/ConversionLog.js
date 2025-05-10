import mongoose from 'mongoose';

const conversionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    currency: {
      type: String,
      required: true
    },
    convertedPrice: {
      type: Number,
      required: true
    },
    exchangeRate: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }
);

const ConversionLog = mongoose.model('ConversionLog', conversionLogSchema);


export default ConversionLog;
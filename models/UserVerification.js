import mongoose from 'mongoose';

const userVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    uniqueString: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  }
);

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

export { UserVerification, userVerificationSchema };
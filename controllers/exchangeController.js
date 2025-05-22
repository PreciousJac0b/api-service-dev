import asyncHandler from 'express-async-handler';
import ConversionLog from '../models/ConversionLog.js';

const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  const logs = await ConversionLog.find({})
  .populate("productId", "name price description category")
  .populate("userId", "username email").skip(skip).limit(limit);
  res.json({ page, logs });
})

export default getHistory;
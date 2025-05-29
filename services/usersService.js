import { HttpStatusCode } from "axios";
import User from "../models/User.js";


async function getUsersService(req, res) {
  const { role, page = 1, limit = 10 } = req.query;

  if (role === 'superadmin') {
  return res.status(403).json({ message: "Access to superadmin users is not allowed." });
  }
  
  let query = { role: { $ne: 'superadmin' } };
  if (role && role !== 'all' && role !== 'superadmin') {
    query.role = role;
  }
  const skip = (page - 1) * limit
  const users = await User.find(query)
    .limit(parseInt(limit))
    .skip(skip)
    .select('-password');

  const total = await User.countDocuments(query);

  if (!users) {
    res.status(400);
    throw new Error("Users not found in DB")
  }
  return {page, limit, users, total}
}

async function deleteUsersService(req, res) {  
  const id = req.query.id;
  const all = req.query.all || false;
  let userIds = req.query.userIds;

  if (all === "true" && (id || Verified)) {
  return res.status(400).json({ error: "Provide either 'all', 'isVerified', or 'id' — not a mix" });
  }

  if (all === "true") {
    await User.deleteMany({});
    return res.status(200).json({ message: 'All users deleted successfully' })
  }

  if (userIds) {
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} user(s) deleted successfully`,
    });
  }

  if (!id) {
    res.status(HttpStatusCode.NotFound);
    throw new Error("Please provide id");
  }
  const user = await User.findById(id);
  if (!user) {
    res.status(HttpStatusCode.NotFound);
    throw new Error(`User with id ${id} not found`);
  }
  await user.deleteOne();
  return res.status(200).json({ message: `User with id ${id} deleted successfully` })
}

export { getUsersService, deleteUsersService };
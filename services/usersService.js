import { HttpStatusCode } from "axios";
import User from "../models/User.js";


async function getUsersService(req, res) {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const skip = (page - 1) * limit
  const users = await User.find({})
    .limit(limit)
    .skip(skip);

  if (!users) {
    res.status(400);
    throw new Error("Users not found in DB")
  }
  return users
}

async function deleteUsersService(req, res) {  // add option for admin to delete more than one user (1 < delete < all)
  const id = req.query.id; // Submit render url. Update documentation and send the updated documentation.
  const all = req.query.all || false;
  const Verified = req.query.isverified || undefined;

  if (all === "true" && (id || Verified)) {
  return res.status(400).json({ error: "Provide either 'all', 'isVerified', or 'id' — not a mix" });
}

  if (all === "true") {
    await User.deleteMany({});
    return res.status(200).json({ message: 'All users deleted successfully' })
  }

  if (Verified) {
    const isVerified = Verified === "true";
    const result = await User.deleteMany({ isVerified })
    res.json({
      message: `${result.deletedCount} user(s) deleted.`,
      success: true,
    })
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
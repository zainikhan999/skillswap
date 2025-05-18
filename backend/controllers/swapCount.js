import User from "../Model/User.js"; // or wherever your User model is
import { TryCatch } from "../middleware/error.js";
export const swapCount = TryCatch(async (req, res, next) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ success: false, message: "Missing users" });
  }

  const result = await User.updateMany(
    { username: { $in: [user1, user2] } },
    { $inc: { swapscount: 1 } }
  );

  return res.status(200).json({
    success: true,
    message: "Swap count updated for users",
    matchedUsers: result.matchedCount,
    modifiedUsers: result.modifiedCount,
  });
});

export const getSwapCount = TryCatch(async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ userName: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ swapCount: user.swapCount || 0 });
  } catch (error) {
    console.error("Error fetching swap count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

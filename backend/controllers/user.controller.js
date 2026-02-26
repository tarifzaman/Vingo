import User from "../models/user.model.js"; 

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; // মিডলওয়্যার থেকে আসছে

        if (!userId) {
            return res.status(400).json({ message: "User ID missing" });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error in controller" });
    }
};
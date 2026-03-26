import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        // 🔥 MUST BE 401
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({user});

    } catch (error) {
        return res.status(500).json({message: "Get current user error",error});
    }
};


export const updateUserLocation=async (req,res) => {
    try {
        const {lat,lon}=req.body
        const user=await User.findByIdAndUpdate(req.userId,{
            location:{
                type:'Point',
                coordinates:[lon,lat]
            }
        },{new:true})
        if(!user) {
            return res.status(401).json({ message: "User not found" });
        }
        return res.status(200).json({message:'location updated'})
    } catch (error) {
        return res.status(500).json({message: "Update location user error",error});
    }
}
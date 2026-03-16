import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

/* ===================== COOKIE OPTIONS ===================== */
const cookieOptions = {
    httpOnly: true,
    secure: false,          // DEV (prod me true)
    sameSite: "lax",        // 🔥 MOST IMPORTANT FIX
    maxAge: 7 * 24 * 60 * 60 * 1000
};

/* ===================== SIGN UP ===================== */
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (mobile.length < 10) {
            return res.status(400).json({ message: "Mobile number must be at least 10 digits" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        });

        const token = await genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({ message: "Signup error", error });
    }
};

/* ===================== SIGN IN ===================== */
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: "Signin error", error });
    }
};

/* ===================== SIGN OUT ===================== */
export const signOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({ message: "Logout successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error });
    }
};

/* ===================== SEND OTP ===================== */
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();
        await sendOtpMail(email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Send OTP error", error });
    }
};

/* ===================== VERIFY OTP ===================== */
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (
            !user ||
            user.resetOtp !== otp ||
            user.otpExpires < Date.now()
        ) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Verify OTP error", error });
    }
};

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP verification required" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Reset password error", error });
    }
};

/* ===================== GOOGLE AUTH ===================== */
export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName,
                email,
                mobile,
                role: "user"
            });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: "Google auth error", error });
    }
};

import User from "../models/user.model.js"; // Import the User database model
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: "User Already exist." });
    }

    // Validation: Ensure the password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be at least 6 characters.",
      });
    }

    // Validation: Ensure the mobile number is at least 11 digits
    if (mobile.length < 11) {
      return res.status(400).json({
        message: "mobile no must be at least 11 digits.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email: normalizedEmail, // ✅ FIX
      role,
      mobile,
      password: hashedPassword,
    });

    const token = genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(201).json(user);
  } catch (error) {
    // Log the error and send a 500 status if something goes wrong on the server
    console.log(error);
    return res.status(500).json(`sign up error ${error}`);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // 3. User Existence Check: If no user is found, return a 400 error
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist." });
    }

    // 4. Password Verification: Compare the plain-text password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    // 5. Credentials Check: If the passwords do not match, return a 400 error
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // 6. Token Generation: Create a unique JWT for the authenticated user session
    const token = genToken(user._id);

    // 7. Cookie Assignment: Attach the token to an HTTP-only cookie for secure transport
    res.cookie("token", token, {
      secure: false, // In production, set to true for HTTPS only
      sameSite: "strict", // Helps prevent Cross-Site Request Forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie remains valid for 7 days
      httpOnly: true, // Protects the cookie from being accessed by client-side scripts
    });

    // 8. Success Response: Send a 200 OK status and the user data back to the client
    return res.status(200).json(user);
  } catch (error) {
    // 9. Error Handling: Log the server-side error and return a 500 status code
    console.log(error);
    return res.status(500).json(`sign In error ${error}`);
  }
};

// Export the signOut function to be used in your routes
export const signOut = async (req, res) => {
  try {
    // 1. Clear the "token" cookie from the client's browser
    // This effectively logs the user out by removing their access credential
    res.clearCookie("token");

    // 2. Send a success response back to the client
    return res.status(200).json({ message: "log out successfully" });
  } catch (error) {
    // 3. Error Handling: Catch any unexpected issues during the sign-out process
    // Returns a 500 Internal Server Error status with the error message
    return res.status(500).json(`sign out error ${error}`);
  }
};

//reset otp

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    await sendOtpMail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log("Send OTP Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ১. ইমেইল সব সময় ছোট হাতের অক্ষরে রূপান্তর করে খুঁজুন
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ২. ওটিপি চেক করার সময় উভয়কেই String এ রূপান্তর করে নেওয়া নিরাপদ
    // এবং ইনপুট থেকে কোনো স্পেস থাকলে তা .trim() দিয়ে সরিয়ে দিন
    const isOtpValid =
      user.resetOtp && user.resetOtp.toString() === otp.toString().trim();

    // ৩. মেয়াদ শেষ কি না চেক করুন
    const isOtpExpired = user.otpExpires < Date.now();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({
        message: isOtpExpired ? "OTP has expired" : "Invalid OTP code",
      });
    }

    // ওটিপি সঠিক হলে আপডেট করুন
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verify successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Verify OTP error: ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "otp verification required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    return res.status(500).json(`reset password error ${error}`);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        role,
      });
    }
    const token = genToken(user._id);
    res.cookie("token", token, {
      secure: false, // In production, set to true for HTTPS only
      sameSite: "strict", // Helps prevent Cross-Site Request Forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie remains valid for 7 days
      httpOnly: true, // Protects the cookie from being accessed by client-side scripts
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`google auth error ${error}`);
  }
};

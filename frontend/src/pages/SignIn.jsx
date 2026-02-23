import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Merged imports
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app, auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
// REMOVED: import { signUp } from "../../../backend/controllers/auth.controller";

function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // FIXED: Added parentheses ()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err , setErr] = useState("")
  const [loading , setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/signIn`,
      { email, password },
      { withCredentials: true }
    );
    console.log(result);
    setErr("");
    setLoading(false)
    navigate("/"); // সাকসেস হলে হোম পেজে নিয়ে যাবে
  } catch (error) {
    setErr(error.response?.data?.message || "Invalid email or password");
    setLoading(false)
  }
};

const handleGoogleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider); // try এর ভেতরে আনা হয়েছে
    const data = await axios.post(
      `${serverUrl}/api/auth/google-auth`,
      { email: result.user.email },
      { withCredentials: true }
    );
    console.log(data);
    navigate("/");
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    setErr(error.response?.data?.message || "Google sign in failed");
    setLoading(false)
  }
};
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Vingo
        </h1>
        <p className="text-gray-600 mb-8">
          Sign In your account to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your email"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Enter your password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              type="button" // Prevent form submission
              className="absolute right-3 cursor-pointer top-[12px] text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <div
            className="text-right mb-4 font-medium text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password ?
          </div>
        </div>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
          onClick={handleSignIn} disabled={loading}
        >
          {loading?<ClipLoader size={20}/> : "Sign In"}
        </button>
        {err && <p className="text-red-500">*{err}</p>}
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer" onClick={handleGoogleAuth}>
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account ?{" "}
          <span className="text-[#ff4d2d]">Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;


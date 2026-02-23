import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners"

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading,setLoading] = useState(false)
 
  // ওটিপি পাঠানোর ফাংশন
  const handleSendOtp = async () => {
    setLoading(true)
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );
      setErr("");
      setStep(2);
      setLoading(false)
    } catch (error) {
      // messege -> message fix
      setErr(error.response?.data?.message || "Error sending OTP");
      setLoading(false)
    }
  };

  // ওটিপি ভেরিফাই করার ফাংশন
  const handleVerifyOtp = async () => {
    setLoading(true)
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true },
      );
      setErr("");
      setStep(3);
      setLoading(false)
    } catch (error) {
      // messege -> message fix
      setErr(error.response?.data?.message || "Invalid OTP");
      setLoading(false)
    }
  };

  // ৩. পাসওয়ার্ড রিসেট করার ফাংশন
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true },
      );
      alert(result.data.message || "Password reset successful!");
      setLoading(false)
      navigate("/signin"); // ✅ সফল হলে সরাসরি লগইন পেজে পাঠিয়ে দেবে
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false)
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
              onClick={handleSendOtp} disabled={loading}
            >
              {loading?<ClipLoader size={20}/> : "Send OTP"}
            </button>
            {err && <p className="text-red-500">*{err}</p>}
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                OTP
              </label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter 6-digit OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
              onClick={handleVerifyOtp} disabled={loading}
            >
              {loading?<ClipLoader size={20}/> : "Varify OTP"}
            </button>
            {err && <p className="text-red-500">*{err}</p>}
          </div>
        )}

        {/* Step 3: New Password Input */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border-[1px] border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
              onClick={handleResetPassword} disabled={loading}
            >
              {loading?<ClipLoader size={20}/> : "Reset Password"}
            </button>
            {err && <p className="text-red-500">*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

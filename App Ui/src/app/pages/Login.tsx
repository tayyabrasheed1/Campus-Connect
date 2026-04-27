import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login, loginWithDemo } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await loginWithDemo();
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[430px] h-screen bg-[#1A1A1A] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Decorative circles */}
        <div className="absolute top-24 right-0 w-32 h-32 bg-[#FF6B2B] rounded-full opacity-20 blur-2xl" />
        <div className="absolute bottom-24 left-0 w-24 h-24 bg-[#FF6B2B] rounded-full opacity-10 blur-xl" />

        {/* Back button */}
        <button onClick={() => navigate("/")} className="absolute top-12 left-6 text-white/60 hover:text-white">
          <ArrowLeft size={22} />
        </button>

        {/* Logo */}
        <div className="pt-16 pb-8 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="tracking-[0.3em] text-white text-sm font-semibold">CAMPUS CONNECT</p>
          </motion.div>
        </div>

        {/* White Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-white rounded-t-3xl px-7 pt-8 pb-10 flex flex-col"
        >
          <h2 className="text-gray-900 mb-1">Welcome back!</h2>
          <p className="text-gray-400 text-sm mb-8">Log in to your SZABIST account</p>

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1.5 block">University Email</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3.5 gap-3 focus-within:border-[#FF6B2B] transition-colors">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                placeholder="yourname@szabist-isb.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-xs text-gray-500 mb-1.5 block">Password</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3.5 gap-3 focus-within:border-[#FF6B2B] transition-colors">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
              />
              <button onClick={() => setShowPass(!showPass)} className="text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="text-right text-xs text-[#FF6B2B] mb-8">Forgot Password?</button>

          {error && (
            <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium tracking-wide hover:bg-black transition-colors mb-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Log In
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full border border-[#FF6B2B] text-[#FF6B2B] py-3.5 rounded-2xl font-medium text-sm hover:bg-orange-50 transition-colors mb-4"
          >
            Try Demo Account
          </button>

          {/* Domain notice */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mt-2">
            <p className="text-xs text-orange-600 text-center">
              🔒 Access restricted to <strong>@szabist-isb.edu.pk</strong> emails only
            </p>
          </div>

          <p className="text-center text-sm text-gray-400 mt-auto pt-8">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-[#FF6B2B] font-medium">
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

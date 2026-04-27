import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const roles = ["Student", "Faculty", "Alumni"];

export function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Student");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: selectedRole.toLowerCase(),
      });
      navigate("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[430px] h-screen bg-[#1A1A1A] flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute top-24 right-0 w-32 h-32 bg-[#FF6B2B] rounded-full opacity-20 blur-2xl" />

        <button onClick={() => step === 1 ? navigate("/") : setStep(1)} className="absolute top-12 left-6 text-white/60 hover:text-white">
          <ArrowLeft size={22} />
        </button>

        <div className="pt-16 pb-8 flex flex-col items-center">
          <p className="tracking-[0.3em] text-white text-sm font-semibold">CAMPUS CONNECT</p>
          <p className="text-white/40 text-xs mt-1">SZABIST Islamabad</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step >= s ? "w-8 bg-[#FF6B2B]" : "w-4 bg-white/20"}`} />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white rounded-t-3xl px-7 pt-8 pb-10 flex flex-col"
        >
          {step === 1 && (
            <>
              <h2 className="text-gray-900 mb-1">Create Account</h2>
              <p className="text-gray-400 text-sm mb-6">Join the SZABIST community</p>

              {/* Role selection */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 mb-2 block">I am a...</label>
                <div className="flex gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedRole === r
                          ? "bg-[#FF6B2B] text-white shadow-md shadow-orange-200"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name fields */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1.5 block">First Name</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#FF6B2B]">
                    <User size={14} className="text-gray-400" />
                    <input
                      placeholder="Muhammad"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1.5 block">Last Name</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#FF6B2B]">
                    <input
                      placeholder="Tayyab"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1.5 block">University Email</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3.5 gap-3 focus-within:border-[#FF6B2B]">
                  <Mail size={16} className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="yourname@szabist-isb.edu.pk"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 mb-1.5 block">Password</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3.5 gap-3 focus-within:border-[#FF6B2B]">
                  <Lock size={16} className="text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
                  />
                  <button onClick={() => setShowPass(!showPass)} className="text-gray-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button onClick={handleNext} className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2">
                Next <ChevronRight size={16} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-gray-900 mb-1">Verify Student Status</h2>
              <p className="text-gray-400 text-sm mb-6">Upload your university ID to verify your account</p>

              {/* Upload area */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center mb-6 bg-gray-50">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <User size={24} className="text-[#FF6B2B]" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Upload Student ID Card</p>
                <p className="text-xs text-gray-400 mt-1 text-center">JPEG, PNG or PDF • Max 5MB</p>
                <button className="mt-4 px-5 py-2 bg-[#FF6B2B] text-white text-sm rounded-full">
                  Browse File
                </button>
              </div>

              {/* Department selection */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 mb-1.5 block">Department</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 outline-none focus:border-[#FF6B2B]">
                  <option>Computer Science</option>
                  <option>Software Engineering</option>
                  <option>Business Administration</option>
                  <option>Electrical Engineering</option>
                  <option>Media Sciences</option>
                </select>
              </div>

              {/* Batch year */}
              <div className="mb-8">
                <label className="text-xs text-gray-500 mb-1.5 block">Batch Year</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 outline-none focus:border-[#FF6B2B]">
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                </select>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-orange-600 text-center">
                  🎓 We'll review your ID and notify you upon approval
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Submit for Verification
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-400 mt-auto pt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#FF6B2B] font-medium">
              Log in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

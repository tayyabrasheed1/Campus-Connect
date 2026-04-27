import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[430px] h-screen bg-white flex flex-col overflow-hidden shadow-2xl relative">
        {/* Decorative circles */}
        <div className="absolute top-6 right-8 w-16 h-16 bg-[#FF6B2B] rounded-full opacity-90" />
        <div className="absolute top-36 left-4 w-3 h-3 bg-[#FF6B2B] rounded-full opacity-50" />
        <div className="absolute bottom-56 right-6 w-2 h-2 bg-gray-300 rounded-full" />

        {/* Top Section */}
        <div className="flex-1 px-7 pt-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-gray-900 mb-2">
              Welcome to<br />
              <span className="text-[#FF6B2B]">Campus Connect</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Discover your fellow students, campus events,<br />and create your own!
            </p>
          </motion.div>

          {/* Floating student cards */}
          <div className="relative mt-8 h-72">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-0 left-6 w-48 h-32 rounded-2xl overflow-hidden shadow-lg"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Students"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 right-4 w-36 h-28 rounded-2xl overflow-hidden shadow-lg"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Studying"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute bottom-0 left-10 w-44 h-28 rounded-2xl overflow-hidden shadow-lg"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Campus"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="px-7 pb-12 space-y-3"
        >
          <p className="text-center text-gray-400 text-xs mb-4">
            The place to meet SZABIST students through<br />shared experiences
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-medium tracking-wide hover:bg-black transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full border border-gray-200 text-gray-700 py-4 rounded-2xl font-medium tracking-wide hover:bg-gray-50 transition-colors"
          >
            Already a Member? Log in
          </button>
          <p className="text-center text-gray-300 text-[10px] mt-4">
            By continuing you agree to our Terms of Service and Privacy Policy.<br />
            University email required for access.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

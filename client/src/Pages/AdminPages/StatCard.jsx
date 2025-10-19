import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl shadow-lg flex items-center justify-between text-white ${color}`}
    >
      <div>
        <h3 className="text-sm opacity-90">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-4xl opacity-70">{icon}</div>
    </motion.div>
  );
};

export default StatCard;

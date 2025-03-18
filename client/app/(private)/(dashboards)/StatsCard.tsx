import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, bgColor }) => (
  <motion.div
    className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4"
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    }}
  >
    <div className={`p-3 ${bgColor} text-white rounded-full`}>{icon}</div>
    <div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <motion.p
        className="text-3xl font-bold text-gray-900"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {value}
      </motion.p>
    </div>
  </motion.div>
);

export default StatsCard;

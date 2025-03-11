import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export const LoaderSpinner = () => {
  return (
    <div className="flex justify-center h-screen items-center p-12">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-12 h-12 text-primary" />
      </motion.div>
    </div>
  );
};

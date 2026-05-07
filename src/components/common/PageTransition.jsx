import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -12,
    scale: 0.99,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

export default function PageTransition({ children, className }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

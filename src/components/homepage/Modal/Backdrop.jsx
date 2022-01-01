import { motion } from 'framer-motion';
import classes from './Modal.module.css'

const Backdrop = ({ children, onClick }) => {
  return (
    <motion.div
      className={classes.backdrop}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;

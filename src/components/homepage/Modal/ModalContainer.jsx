import { AnimatePresence } from 'framer-motion';

export default function ModalContainer({ children }) {
  return (
    <AnimatePresence
      // Disable any initial animations on children that
      // are present when the component is first rendered
      initial={false}
      // Only render one component at a time.
      // The exiting component will finish its exit
      // animation before entering component is rendered
      exitBeforeEnter={true}
      // Fires when all exiting nodes have completed animating out
    >
      {children}
    </AnimatePresence>
  );
}

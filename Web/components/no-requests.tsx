import { AnimatePresence, motion } from "framer-motion";

export function NoRequests() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "12rem" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="grid place-items-center overflow-hidden rounded-xl border border-dashed p-4 text-sm font-bold text-muted-foreground"
      >
        No requests have been recieved.
      </motion.div>
    </AnimatePresence>
  );
}

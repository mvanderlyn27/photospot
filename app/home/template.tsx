'use client'
import { motion } from 'framer-motion';

export default function Transition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, ease: [0.25, 0.25, 0, 1] } }}
            exit={{ opacity: 0 }}

        >
            {children}
        </motion.div>
    )
}
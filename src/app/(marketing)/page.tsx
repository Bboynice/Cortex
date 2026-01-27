"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MarketingPage() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold bg-red-500 w-full h-screen border-b-1 border-black flex items-center justify-center text-center"
        style={{ height: '100vh' }}
      >
        Marketing Page 1
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold bg-blue-500 w-full h-screen flex items-center justify-center text-center border-b-1 border-black"
        style={{ height: '100vh' }}
      >
        Marketing Page 2
      </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold bg-blue-500 w-full h-screen flex items-center justify-center text-center border-b-1 border-black"
        style={{ height: '100vh' }}
      >
        Marketing Page 3
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold bg-blue-500 w-full h-screen flex items-center justify-center text-center"
        style={{ height: '100vh' }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/dashboard" className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors inline-block">
            Get Ready
          </Link>
        </motion.div>
      </motion.section>
    </>
  );
}

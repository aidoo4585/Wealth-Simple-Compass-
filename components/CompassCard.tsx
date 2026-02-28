import { motion } from 'motion/react';

interface CompassCardProps {
  title: string;
  content: string;
}

export function CompassCard({ title, content }: CompassCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } 
        },
      }}
      className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm"
    >
      <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-gray-800">
        {content}
      </p>
    </motion.div>
  );
}

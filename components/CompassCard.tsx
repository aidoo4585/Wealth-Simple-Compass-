import { motion } from 'motion/react';

type Severity = 'neutral' | 'warning' | 'critical';

interface CompassCardProps {
  title: string;
  heroValue?: string;
  heroSub?: string;
  body: string;
  severity?: Severity;
}

const severityStyles: Record<Severity, { card: string; label: string; hero: string }> = {
  neutral: {
    card: 'bg-white border border-gray-100',
    label: 'text-emerald-700',
    hero: 'text-gray-900',
  },
  warning: {
    card: 'bg-amber-50/50 border border-amber-200/60 border-l-4 border-l-amber-400',
    label: 'text-amber-700',
    hero: 'text-amber-900',
  },
  critical: {
    card: 'bg-red-50/40 border border-red-200/60 border-l-4 border-l-red-400',
    label: 'text-red-600',
    hero: 'text-red-600',
  },
};

export function CompassCard({
  title,
  heroValue,
  heroSub,
  body,
  severity = 'neutral',
}: CompassCardProps) {
  const styles = severityStyles[severity];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={`${styles.card} rounded-[20px] p-6 shadow-sm`}
    >
      <h3 className={`text-[11px] font-bold ${styles.label} uppercase tracking-wider mb-2`}>
        {title}
      </h3>
      {heroValue && (
        <div className="mb-2">
          <span className={`text-[28px] font-bold tracking-tight ${styles.hero}`}>
            {heroValue}
          </span>
          {heroSub && (
            <span className="text-[14px] text-gray-500 ml-2 font-medium">{heroSub}</span>
          )}
        </div>
      )}
      <p className="text-[15px] leading-relaxed text-gray-700">
        {body}
      </p>
    </motion.div>
  );
}

import { Check } from 'lucide-react';

interface ClarityCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function ClarityCheckbox({ label, checked, onChange }: ClarityCheckboxProps) {
  return (
    <button
      onClick={onChange}
      className="w-full text-left flex items-start gap-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
      <div
        className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-200 ${
          checked
            ? 'bg-gray-900 border-gray-900 text-white'
            : 'bg-white border-gray-300 text-transparent'
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </div>
      <span className={`text-[15px] leading-snug transition-colors duration-200 ${
        checked ? 'text-gray-900 font-medium' : 'text-gray-500'
      }`}>
        {label}
      </span>
    </button>
  );
}

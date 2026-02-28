interface SegmentedControlProps {
  mode: 'options' | 'averaging_up';
  onChange: (mode: 'options' | 'averaging_up') => void;
}

export function SegmentedControl({ mode, onChange }: SegmentedControlProps) {
  return (
    <div className="mb-8">
      <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
        <button
          onClick={() => onChange('options')}
          className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-300 z-10 ${
            mode === 'options' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Options (Call)
        </button>
        <button
          onClick={() => onChange('averaging_up')}
          className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-300 z-10 ${
            mode === 'averaging_up' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Averaging Up
        </button>
      </div>
      <div className="mt-3 text-center">
        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
          Demo Mode
        </span>
      </div>
    </div>
  );
}

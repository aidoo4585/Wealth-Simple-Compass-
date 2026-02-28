'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';
import { CompassCard } from '@/components/CompassCard';
import { ClarityCheckbox } from '@/components/ClarityCheckbox';
import { SegmentedControl } from '@/components/SegmentedControl';

type Mode = 'options' | 'averaging_up';
type Step = 'review' | 'compass' | 'success';

const OPTIONS_DATA = {
  break_even: "TSLA must reach $257.50 — a 3.0% rise — by Mar 21, 2027 for this trade to break even.",
  max_loss: "If TSLA closes below $250 on Mar 21, 2027, you lose the full $750.00 premium. That is 100% of the cash allocated to this trade.",
  leverage_ratio: "A $1 move in TSLA today moves this option approximately $0.55. Your position currently behaves like owning 55 shares.",
  acknowledgments: [
    "I understand I can lose 100% of the $750.00 premium if TSLA doesn't reach $257.50 by Mar 21, 2027.",
    "I understand this option expires worthless if the stock closes below the strike price.",
    "I understand buying shares with the same money would not carry an expiry or total loss risk."
  ]
};

const AVERAGING_UP_DATA = {
  new_average_cost: "Your average cost moves from $150.00 to $166.67 across 150 shares.",
  visual_return_shrinkage: "Your return percentage dropped because you bought more shares at a higher price. Your profit is now measured against a higher starting point — even though the stock price hasn't changed.",
  total_capital_exposure: "You are increasing your conviction and your exposure at a higher valuation. Your total capital at risk is now $25,000.",
  acknowledgments: [
    "I understand my average cost has increased from $150.00 to $166.67.",
    "I understand my return percentage will appear lower even if the stock price stays the same.",
    "I understand I am increasing my total exposure at today's price."
  ]
};

const OPTIONS_LABELS = [
  { key: 'break_even', title: "Break-Even %" },
  { key: 'max_loss', title: "Max Loss (100%)" },
  { key: 'leverage_ratio', title: "Leverage Ratio" },
];

const AVERAGING_UP_LABELS = [
  { key: 'new_average_cost', title: "New Average Cost" },
  { key: 'visual_return_shrinkage', title: "Visual Return Shrinkage" },
  { key: 'total_capital_exposure', title: "Total Capital Exposure" },
];

export default function CompassApp() {
  const [step, setStep] = useState<Step>('review');
  const [mode, setMode] = useState<Mode>('options');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setIsLoaded(false);
    setCheckedItems([false, false, false]);
  };

  const goToCompass = () => {
    setStep('compass');
    setIsLoaded(false);
    setCheckedItems([false, false, false]);
  };

  const goToReview = () => {
    setStep('review');
  };

  const goToSuccess = () => {
    setStep('success');
  };

  // Simulate data loading when entering compass step
  useEffect(() => {
    if (step === 'compass' && !isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step, isLoaded]);

  const currentData = mode === 'options' ? OPTIONS_DATA : AVERAGING_UP_DATA;
  const currentLabels = mode === 'options' ? OPTIONS_LABELS : AVERAGING_UP_LABELS;

  const allChecked = checkedItems.every(Boolean);

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-emerald-500 selection:text-white">
      {/* Mobile constraint container */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-x-hidden shadow-sm sm:border-x sm:border-gray-100 flex flex-col">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: REVIEW ORDER */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen flex flex-col bg-white"
            >
              {/* Top Nav */}
              <div className="flex items-center justify-between px-4 py-3">
                <button className="p-2 -ml-2 text-gray-900">
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <div className="text-[16px] font-semibold text-gray-900">Review Order</div>
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>

              {/* Demo Story Toggle */}
              <div className="px-6 pt-4 pb-2">
                <SegmentedControl mode={mode} onChange={handleModeChange} />
              </div>

              {/* Content */}
              <div className="px-6 pt-6 flex-1">
                <div className="text-center mb-12">
                  <h1 className="text-[44px] font-bold tracking-tight mb-1 text-gray-900">
                    {mode === 'options' ? '$750.00' : '$10,000.00'}
                  </h1>
                  <p className="text-[15px] text-gray-500 font-medium">
                    {mode === 'options' ? 'Buying 1 TSLA $250 Call, Mar 21, 2027 Exp' : 'Buying 50 TSLA Shares'}
                  </p>
                </div>

                <div className="space-y-6">
                  {mode === 'options' ? (
                    <>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <span className="text-[17px] font-semibold text-gray-900">Premium</span>
                        <span className="text-[17px] font-medium text-gray-600">$7.50</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <span className="text-[17px] font-semibold text-gray-900">Contracts</span>
                        <span className="text-[17px] font-medium text-gray-600">1</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <span className="text-[17px] font-semibold text-gray-900">Expiry Date</span>
                        <span className="text-[17px] font-medium text-gray-600">Mar 21, 2027</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <span className="text-[17px] font-semibold text-gray-900">Price per share</span>
                        <span className="text-[17px] font-medium text-gray-600">$200.00</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <span className="text-[17px] font-semibold text-gray-900">Quantity</span>
                        <span className="text-[17px] font-medium text-gray-600">50</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <span className="text-[17px] font-semibold text-gray-900">Account</span>
                        <span className="text-[17px] font-medium text-gray-600">TFSA</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 flex gap-3 bg-white sticky bottom-0 border-t border-gray-50 mt-auto z-20">
                <button className="px-8 py-4 rounded-full border border-gray-200 text-[16px] font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Max
                </button>
                <button 
                  onClick={goToCompass}
                  className="flex-1 py-4 rounded-full bg-gray-900 text-white text-[16px] font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-gray-200"
                >
                  <Sparkles size={18} className="text-emerald-400" />
                  Review with Compass AI
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: COMPASS INTERSTITIAL */}
          {step === 'compass' && (
            <motion.div
              key="compass"
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="min-h-screen bg-gray-50 flex flex-col"
            >
              {/* Fake Navigation Bar */}
              <div className="flex items-center px-4 py-3 border-b border-gray-200/60 bg-gray-50/80 backdrop-blur-md sticky top-0 z-30">
                <button 
                  onClick={goToReview}
                  className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <div className="flex-1 text-center pr-6">
                  <span className="text-[13px] font-semibold text-gray-900">
                    {mode === 'options' ? 'Review Order — TSLA Call $250 Strike' : 'Review Order — Buy 50 TSLA'}
                  </span>
                </div>
              </div>

              {/* Header */}
              <header className="px-6 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <h1 className="text-3xl font-medium tracking-tight">Compass</h1>
                </div>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  Before you submit, here&apos;s what changes if this executes.
                </p>
              </header>

              {/* Consequence Cards */}
              <div className="px-6 space-y-4 mb-12">
                <AnimatePresence mode="wait">
                  {isLoaded && (
                    <motion.div
                      key={mode}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.15,
                          },
                        },
                      }}
                      className="space-y-4"
                    >
                      {currentLabels.map((label) => {
                        const content = currentData[label.key as keyof typeof currentData];
                        if (!content || Array.isArray(content)) return null;

                        return (
                          <CompassCard
                            key={label.key}
                            title={label.title}
                            content={content}
                          />
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clarity Checkpoint */}
              <div className="px-6 pb-32 pt-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Clarity Checkpoint</h2>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="space-y-1">
                  <AnimatePresence mode="wait">
                    {isLoaded && (
                      <motion.div
                        key={`checks-${mode}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="space-y-1"
                      >
                        {currentData.acknowledgments.map((ack, index) => (
                          <ClarityCheckbox
                            key={index}
                            label={ack}
                            checked={checkedItems[index]}
                            onChange={() => toggleCheck(index)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Fixed Bottom Action */}
              <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-12 pb-8 px-6 z-20 mt-auto">
                <button
                  onClick={goToSuccess}
                  disabled={!allChecked || !isLoaded}
                  className={`w-full py-4 rounded-full text-[16px] font-medium transition-all duration-300 ${
                    allChecked
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 translate-y-0'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed translate-y-0'
                  }`}
                >
                  I Understand — Submit Order
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="min-h-screen bg-white flex flex-col items-center justify-center px-6 z-50"
            >
              <div className="flex flex-col items-center text-center max-w-xs">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                  className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted</h2>
                <p className="text-[15px] text-gray-500 mb-10 leading-relaxed">
                  {mode === 'options' 
                    ? "Your order to buy 1 TSLA Mar 21, 2027 $250 Call has been placed successfully."
                    : "Your order to buy 50 shares of TSLA has been placed successfully."}
                </p>
                <button 
                  onClick={goToReview}
                  className="w-full py-4 rounded-full bg-gray-100 text-gray-900 text-[16px] font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Portfolio
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

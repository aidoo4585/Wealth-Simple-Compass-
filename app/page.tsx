'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { CompassCard } from '@/components/CompassCard';
import { ClarityCheckbox } from '@/components/ClarityCheckbox';
import { SegmentedControl } from '@/components/SegmentedControl';

type Mode = 'options' | 'averaging_up';
type Step = 'review' | 'compass' | 'success';
type Severity = 'neutral' | 'warning' | 'critical';

const OPTIONS_PAYLOAD = {
  type: 'call_option',
  ticker: 'TSLA',
  current_price: 250,
  strike: 250,
  expiry: '2027-03-21',
  contracts: 1,
  premium: 7.50,
  premium_unit: 'per_share',
  delta: 0.55,
};

const AVERAGING_UP_PAYLOAD = {
  type: 'stock_buy',
  ticker: 'TSLA',
  current_price: 200,
  current_shares: 100,
  avg_cost: 150,
  buy_shares: 50,
  buy_price: 200,
};

interface CardConfig {
  key: string;
  title: string;
  severity: Severity;
}

const OPTIONS_CARDS: CardConfig[] = [
  { key: 'the_reality', title: 'The Reality', severity: 'neutral' },
  { key: 'break_even', title: 'Break-Even', severity: 'warning' },
  { key: 'max_loss', title: 'Max Loss', severity: 'critical' },
  { key: 'notional_and_leverage', title: 'Notional & Leverage', severity: 'warning' },
  { key: 'stock_comparison', title: 'Stock Comparison', severity: 'neutral' },
  { key: 'time_risk', title: 'Time Risk', severity: 'warning' },
  { key: 'sensitivity', title: 'Sensitivity', severity: 'neutral' },
];

const AVERAGING_UP_CARDS: CardConfig[] = [
  { key: 'new_reality', title: 'New Reality', severity: 'neutral' },
  { key: 'return_dilution', title: 'Return Dilution', severity: 'critical' },
  { key: 'structural_change', title: 'Capital Committed', severity: 'warning' },
  { key: 'downside_scenario', title: 'Downside Scenario', severity: 'warning' },
  { key: 'return_shift_explanation', title: 'Return Shift', severity: 'neutral' },
];

interface CardData {
  headline: string;
  body: string;
}

interface InterpretationResponse {
  [key: string]: CardData | string[] | string;
  acknowledgments: string[];
}

export default function CompassApp() {
  const [step, setStep] = useState<Step>('review');
  const [mode, setMode] = useState<Mode>('options');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false]);
  const [data, setData] = useState<InterpretationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setData(null);
    setError(null);
    setCheckedItems([false, false, false]);
  };

  const fetchInterpretation = useCallback(async (currentMode: Mode) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const payload = currentMode === 'options' ? OPTIONS_PAYLOAD : AVERAGING_UP_PAYLOAD;

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch {
      setError('Failed to connect to interpretation service.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToCompass = () => {
    setStep('compass');
    setCheckedItems([false, false, false]);
    fetchInterpretation(mode);
  };

  const goToReview = () => {
    setStep('review');
    setData(null);
    setError(null);
  };

  const goToSuccess = () => {
    setStep('success');
  };

  const currentCards = mode === 'options' ? OPTIONS_CARDS : AVERAGING_UP_CARDS;
  const allChecked = checkedItems.every(Boolean);

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-emerald-500 selection:text-white">
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
              <div className="flex items-center justify-between px-4 py-3">
                <button className="p-2 -ml-2 text-gray-900">
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <div className="text-[16px] font-semibold text-gray-900">Review Order</div>
                <div className="w-10"></div>
              </div>

              <div className="px-6 pt-4 pb-2">
                <SegmentedControl mode={mode} onChange={handleModeChange} />
              </div>

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
              {/* Nav Bar */}
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

              {/* Compact Header */}
              <header className="px-6 pt-5 pb-4">
                <div className="flex items-center gap-2.5 mb-1">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <h1 className="text-2xl font-semibold tracking-tight">Compass</h1>
                </div>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Before you submit, here&apos;s what changes if this executes.
                </p>
              </header>

              {/* Consequence Cards */}
              <div className="px-6 space-y-3 mb-8">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 size={32} className="text-emerald-500 animate-spin" />
                    <p className="text-[14px] text-gray-400 font-medium">Interpreting your trade...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-[20px] p-6">
                    <p className="text-[14px] text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {data && !isLoading && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.12,
                          },
                        },
                      }}
                      className="space-y-3"
                    >
                      {currentCards.map((card) => {
                        const cardData = data[card.key];
                        if (!cardData || typeof cardData !== 'object' || Array.isArray(cardData)) return null;

                        const typedCard = cardData as CardData;

                        return (
                          <CompassCard
                            key={card.key}
                            title={card.title}
                            heroValue={typedCard.headline}
                            body={typedCard.body}
                            severity={card.severity}
                          />
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Clarity Checkpoint */}
              {data && !isLoading && (
                <div className="px-6 pb-28 pt-4">
                  <div className="flex items-center justify-center gap-4 mb-5">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Clarity Checkpoint</h2>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                  <div className="space-y-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="space-y-1"
                    >
                      {data.acknowledgments.map((ack, index) => (
                        <ClarityCheckbox
                          key={index}
                          label={ack}
                          checked={checkedItems[index]}
                          onChange={() => toggleCheck(index)}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Fixed Bottom Action */}
              <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-6 pb-8 px-6 z-20 mt-auto">
                <motion.button
                  onClick={goToSuccess}
                  disabled={!allChecked || isLoading || !data}
                  whileTap={allChecked && data ? { scale: 0.97 } : undefined}
                  className={`w-full py-4 rounded-full text-[16px] font-medium transition-all duration-300 ${
                    allChecked && data
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  I Understand — Submit Order
                </motion.button>
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
                <p className="text-[15px] text-gray-500 mb-3 leading-relaxed">
                  {mode === 'options'
                    ? "Your order to buy 1 TSLA Mar 21, 2027 $250 Call has been placed successfully."
                    : "Your order to buy 50 shares of TSLA has been placed successfully."}
                </p>
                <p className="text-[12px] text-gray-400 mb-10">
                  Compass reviewed {mode === 'options' ? '7' : '5'} consequence areas before submission.
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

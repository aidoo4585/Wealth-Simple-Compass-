// Deterministic math engine — all numeric facts computed here, never by the LLM.

export interface CallOptionInput {
  type: 'call_option';
  ticker: string;
  current_price: number;
  strike: number;
  expiry: string;
  contracts: number;
  premium: number;
  premium_unit: 'per_share' | 'per_contract';
  delta?: number;
}

export interface StockBuyInput {
  type: 'stock_buy';
  ticker: string;
  current_price: number;
  current_shares: number;
  avg_cost: number;
  buy_shares: number;
  buy_price: number;
}

export interface CallOptionFacts {
  ticker: string;
  current_price: number;
  strike: number;
  expiry: string;
  contracts: number;
  premium_per_share: number;
  break_even_price: number;
  break_even_pct: number;
  max_loss_total: number;
  stock_shares_equivalent: number;
  notional_controlled: number;
  leverage_ratio: number;
  delta_move_per_dollar: number | null;
  share_equivalent: number | null;
}

export interface StockBuyFacts {
  ticker: string;
  current_price: number;
  current_shares: number;
  avg_cost: number;
  buy_shares: number;
  buy_price: number;
  new_total_shares: number;
  new_avg: number;
  total_cost_basis: number;
  old_return_pct: number;
  new_return_pct: number;
  return_dilution_pp: number;
  pnl_at_old_avg: number;
}

// Rounding helpers
const r2 = (n: number) => Math.round(n * 100) / 100;   // dollars, delta-derived
const r1 = (n: number) => Math.round(n * 10) / 10;     // percentages, shares

export function computeCallOptionFacts(input: CallOptionInput): CallOptionFacts {
  const premium_per_share =
    input.premium_unit === 'per_contract'
      ? r2(input.premium / 100)
      : input.premium;

  const break_even_price = r2(input.strike + premium_per_share);
  const break_even_pct = r1(
    ((break_even_price - input.current_price) / input.current_price) * 100
  );
  const max_loss_total = r2(premium_per_share * 100 * input.contracts);
  const stock_shares_equivalent = r1(max_loss_total / input.current_price);
  const notional_controlled = r2(input.strike * 100 * input.contracts);
  const leverage_ratio = r1(notional_controlled / max_loss_total);

  const delta_move_per_dollar =
    input.delta != null ? r2(input.delta * 100 * input.contracts) : null;
  const share_equivalent =
    input.delta != null ? r2(input.delta * 100 * input.contracts) : null;

  return {
    ticker: input.ticker,
    current_price: input.current_price,
    strike: input.strike,
    expiry: input.expiry,
    contracts: input.contracts,
    premium_per_share,
    break_even_price,
    break_even_pct,
    max_loss_total,
    stock_shares_equivalent,
    notional_controlled,
    leverage_ratio,
    delta_move_per_dollar,
    share_equivalent,
  };
}

export function computeStockBuyFacts(input: StockBuyInput): StockBuyFacts {
  const new_total_shares = r1(input.current_shares + input.buy_shares);
  const new_avg = r2(
    (input.current_shares * input.avg_cost + input.buy_shares * input.buy_price) /
      (input.current_shares + input.buy_shares)
  );
  const total_cost_basis = r2(
    input.current_shares * input.avg_cost + input.buy_shares * input.buy_price
  );
  const old_return_pct = r1(
    ((input.current_price - input.avg_cost) / input.avg_cost) * 100
  );
  const new_return_pct = r1(
    ((input.current_price - new_avg) / new_avg) * 100
  );
  const return_dilution_pp = r1(old_return_pct - new_return_pct);
  const pnl_at_old_avg = r2(
    (input.current_shares + input.buy_shares) * input.avg_cost - total_cost_basis
  );

  return {
    ticker: input.ticker,
    current_price: input.current_price,
    current_shares: input.current_shares,
    avg_cost: input.avg_cost,
    buy_shares: input.buy_shares,
    buy_price: input.buy_price,
    new_total_shares,
    new_avg,
    total_cost_basis,
    old_return_pct,
    new_return_pct,
    return_dilution_pp,
    pnl_at_old_avg,
  };
}

// Field validation
const REQUIRED_CALL_FIELDS = ['ticker', 'current_price', 'strike', 'expiry', 'contracts', 'premium', 'premium_unit'] as const;
const REQUIRED_STOCK_FIELDS = ['ticker', 'current_price', 'current_shares', 'avg_cost', 'buy_shares', 'buy_price'] as const;

export function validateCallOptionInput(body: Record<string, unknown>): string | null {
  for (const field of REQUIRED_CALL_FIELDS) {
    if (body[field] == null || body[field] === '') {
      return `Missing field: ${field}. Cannot compute trade consequences without it.`;
    }
  }
  return null;
}

export function validateStockBuyInput(body: Record<string, unknown>): string | null {
  for (const field of REQUIRED_STOCK_FIELDS) {
    if (body[field] == null || body[field] === '') {
      return `Missing field: ${field}. Cannot compute trade consequences without it.`;
    }
  }
  return null;
}

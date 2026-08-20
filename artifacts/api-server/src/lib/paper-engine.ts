type AssetClass = "equities" | "etf" | "crypto" | "forex" | "index";
type Strategy = "momentum" | "breakout" | "trend_following" | "mean_reversion";
type Direction = "long" | "short";

export type Market = {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  change: number;
  changePercent: number;
  session: "open" | "closed" | "24/7";
  sparkline: number[];
};

export type Opportunity = {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  direction: Direction;
  strategy: Strategy;
  strategyLabel: string;
  signal: string;
  timeframe: string;
  price: number;
  target: number;
  stop: number;
  confidence: number;
  expectedMove: number;
  spreadBps: number;
  commission: number;
  slippage: number;
  overnight: number;
  detectedAt: string;
  rationale: string;
};

export type Trade = {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  direction: Direction;
  strategy: Strategy;
  strategyLabel: string;
  signal: string;
  timeframe: string;
  entryPrice: number;
  currentPrice: number;
  stopPrice: number;
  exitPrice: number | null;
  quantity: number;
  grossPnl: number;
  totalCosts: number;
  netPnl: number;
  status: "open" | "closed";
  openedAt: string;
  closedAt: string | null;
  rationale: string;
};

const strategyLabels: Record<Strategy, string> = {
  momentum: "Momentum",
  breakout: "Breakout",
  trend_following: "Trend Following",
  mean_reversion: "Mean Reversion",
};

const markets: Market[] = [
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "equities", price: 142.18, change: 3.82, changePercent: 2.76, session: "open", sparkline: [132, 134, 133, 137, 136, 139, 142] },
  { symbol: "SPY", name: "SPDR S&P 500 ETF", assetClass: "etf", price: 604.91, change: 1.63, changePercent: 0.27, session: "open", sparkline: [598, 600, 597, 601, 603, 602, 605] },
  { symbol: "BTC/USD", name: "Bitcoin", assetClass: "crypto", price: 104820, change: 1820, changePercent: 1.77, session: "24/7", sparkline: [100900, 101200, 100500, 102800, 103700, 103000, 104820] },
  { symbol: "EUR/USD", name: "Euro / US Dollar", assetClass: "forex", price: 1.0847, change: 0.0031, changePercent: 0.29, session: "open", sparkline: [1.078, 1.079, 1.081, 1.08, 1.083, 1.082, 1.085] },
  { symbol: "QQQ", name: "Invesco QQQ Trust", assetClass: "index", price: 521.44, change: 4.06, changePercent: 0.78, session: "open", sparkline: [510, 512, 509, 515, 517, 516, 521] },
  { symbol: "ETH/USD", name: "Ethereum", assetClass: "crypto", price: 3294.6, change: -38.1, changePercent: -1.14, session: "24/7", sparkline: [3388, 3360, 3342, 3370, 3330, 3325, 3295] },
];

const opportunities: Opportunity[] = [
  {
    id: "opp-nvda-momentum",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    assetClass: "equities",
    direction: "long",
    strategy: "momentum",
    strategyLabel: "Momentum",
    signal: "Relative strength expansion",
    timeframe: "4H",
    price: 142.18,
    target: 149.4,
    stop: 137.6,
    confidence: 87,
    expectedMove: 5.08,
    spreadBps: 2,
    commission: 1.2,
    slippage: 3.6,
    overnight: 0,
    detectedAt: "2 min fa",
    rationale: "Prezzo sopra EMA 20/50, volume relativo 1,8× e forza relativa contro SPY in accelerazione.",
  },
  {
    id: "opp-btc-breakout",
    symbol: "BTC/USD",
    name: "Bitcoin",
    assetClass: "crypto",
    direction: "long",
    strategy: "breakout",
    strategyLabel: "Breakout",
    signal: "Range breakout confermato",
    timeframe: "1H",
    price: 104820,
    target: 109600,
    stop: 102950,
    confidence: 84,
    expectedMove: 4.56,
    spreadBps: 6,
    commission: 3.6,
    slippage: 8.4,
    overnight: 0,
    detectedAt: "5 min fa",
    rationale: "Chiusura oltre il massimo a 20 periodi con volume in aumento; retest del livello superato completato.",
  },
  {
    id: "opp-eurusd-trend",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    assetClass: "forex",
    direction: "long",
    strategy: "trend_following",
    strategyLabel: "Trend Following",
    signal: "Trend pullback entry",
    timeframe: "4H",
    price: 1.0847,
    target: 1.092,
    stop: 1.0805,
    confidence: 79,
    expectedMove: 0.67,
    spreadBps: 1,
    commission: 0.8,
    slippage: 1.2,
    overnight: 0.9,
    detectedAt: "8 min fa",
    rationale: "Pullback ordinato verso la media dinamica in trend rialzista; ADX sopra soglia e struttura higher-high intatta.",
  },
  {
    id: "opp-eth-mean",
    symbol: "ETH/USD",
    name: "Ethereum",
    assetClass: "crypto",
    direction: "long",
    strategy: "mean_reversion",
    strategyLabel: "Mean Reversion",
    signal: "Oversold reversion",
    timeframe: "1H",
    price: 3294.6,
    target: 3412,
    stop: 3230,
    confidence: 74,
    expectedMove: 3.56,
    spreadBps: 8,
    commission: 3.2,
    slippage: 7.2,
    overnight: 0,
    detectedAt: "11 min fa",
    rationale: "RSI 14 in ipervenduto e deviazione da VWAP superiore a 2σ; il setup richiede un rientro verso la media.",
  },
  {
    id: "opp-qqq-breakout",
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    assetClass: "index",
    direction: "long",
    strategy: "breakout",
    strategyLabel: "Breakout",
    signal: "Compression breakout",
    timeframe: "1D",
    price: 521.44,
    target: 535.8,
    stop: 513.2,
    confidence: 72,
    expectedMove: 2.75,
    spreadBps: 2,
    commission: 1.1,
    slippage: 2.5,
    overnight: 0,
    detectedAt: "16 min fa",
    rationale: "Compressione di volatilità a 12 sedute seguita da espansione sopra la resistenza; breadth del Nasdaq favorevole.",
  },
];

let trades: Trade[] = [
  {
    id: "trade-001",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    assetClass: "etf",
    direction: "long",
    strategy: "trend_following",
    strategyLabel: "Trend Following",
    signal: "Trend continuation",
    timeframe: "1D",
    entryPrice: 596.8,
    currentPrice: 604.91,
    stopPrice: 590.4,
    exitPrice: null,
    quantity: 18,
    grossPnl: 145.98,
    totalCosts: 8.42,
    netPnl: 137.56,
    status: "open",
    openedAt: "13 ago, 14:20",
    closedAt: null,
    rationale: "Trend sopra la media a 50 giorni, breakout di consolidamento e volatilità normalizzata.",
  },
  {
    id: "trade-002",
    symbol: "BTC/USD",
    name: "Bitcoin",
    assetClass: "crypto",
    direction: "long",
    strategy: "momentum",
    strategyLabel: "Momentum",
    signal: "Impulse continuation",
    timeframe: "4H",
    entryPrice: 100620,
    currentPrice: 104820,
    stopPrice: 98800,
    exitPrice: null,
    quantity: 0.065,
    grossPnl: 273,
    totalCosts: 18.74,
    netPnl: 254.26,
    status: "open",
    openedAt: "14 ago, 09:40",
    closedAt: null,
    rationale: "Nuovo impulso sopra il range, volume crescente e forza relativa in miglioramento.",
  },
  {
    id: "trade-003",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    assetClass: "forex",
    direction: "long",
    strategy: "mean_reversion",
    strategyLabel: "Mean Reversion",
    signal: "VWAP reclaim",
    timeframe: "1H",
    entryPrice: 1.0782,
    currentPrice: 1.0834,
    stopPrice: 1.0759,
    exitPrice: 1.0834,
    quantity: 50000,
    grossPnl: 260,
    totalCosts: 17.2,
    netPnl: 242.8,
    status: "closed",
    openedAt: "12 ago, 10:10",
    closedAt: "12 ago, 17:35",
    rationale: "Rientro verso VWAP dopo eccesso intraday, confermato da divergenza RSI positiva.",
  },
  {
    id: "trade-004",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    assetClass: "equities",
    direction: "short",
    strategy: "breakout",
    strategyLabel: "Breakout",
    signal: "Failed breakout",
    timeframe: "1H",
    entryPrice: 144.2,
    currentPrice: 141.1,
    stopPrice: 146.4,
    exitPrice: 141.1,
    quantity: 24,
    grossPnl: 74.4,
    totalCosts: 11.68,
    netPnl: 62.72,
    status: "closed",
    openedAt: "11 ago, 15:05",
    closedAt: "12 ago, 11:20",
    rationale: "Breakout fallito con ritorno sotto il livello chiave e aumento di offerta nel book.",
  },
];

const scannerSeen = new Set(opportunities.map((item) => `${item.symbol}:${item.strategy}:${item.timeframe}`));
let lastScanAt = "oggi, 10:32";

const round = (value: number) => Math.round(value * 100) / 100;

export function getMarkets(): Market[] {
  return markets;
}

export function getOpportunities(assetClass?: string, strategy?: string): Opportunity[] {
  return opportunities.filter(
    (opportunity) =>
      (!assetClass || opportunity.assetClass === assetClass) &&
      (!strategy || opportunity.strategy === strategy),
  );
}

export function getTrades(status?: string): Trade[] {
  if (status === "open" || status === "closed") {
    return trades.filter((trade) => trade.status === status);
  }
  return trades;
}

export function openTrade(opportunityId: string, quantity: number): Trade | undefined {
  const opportunity = opportunities.find((item) => item.id === opportunityId);
  if (!opportunity) return undefined;

  const sideMultiplier = opportunity.direction === "long" ? 1 : -1;
  const markPrice = markets.find((market) => market.symbol === opportunity.symbol)?.price ?? opportunity.price;
  const grossPnl = (markPrice - opportunity.price) * quantity * sideMultiplier;
  const notional = opportunity.price * quantity;
  const totalCosts = opportunity.commission + opportunity.slippage + (notional * opportunity.spreadBps) / 10000 + opportunity.overnight;
  const trade: Trade = {
    id: `trade-${String(trades.length + 1).padStart(3, "0")}`,
    symbol: opportunity.symbol,
    name: opportunity.name,
    assetClass: opportunity.assetClass,
    direction: opportunity.direction,
    strategy: opportunity.strategy,
    strategyLabel: opportunity.strategyLabel,
    signal: opportunity.signal,
    timeframe: opportunity.timeframe,
    entryPrice: opportunity.price,
    currentPrice: markPrice,
    stopPrice: opportunity.stop,
    exitPrice: null,
    quantity,
    grossPnl: round(grossPnl),
    totalCosts: round(totalCosts),
    netPnl: round(grossPnl - totalCosts),
    status: "open",
    openedAt: "adesso",
    closedAt: null,
    rationale: opportunity.rationale,
  };
  trades = [trade, ...trades];
  return trade;
}

export function closeTrade(tradeId: string, exitPrice: number): Trade | undefined {
  const current = trades.find((trade) => trade.id === tradeId && trade.status === "open");
  if (!current) return undefined;
  const sideMultiplier = current.direction === "long" ? 1 : -1;
  const grossPnl = (exitPrice - current.entryPrice) * current.quantity * sideMultiplier;
  const exitCost = Math.max(1, Math.abs(exitPrice * current.quantity) * 0.00012);
  const closed: Trade = {
    ...current,
    currentPrice: exitPrice,
    exitPrice,
    grossPnl: round(grossPnl),
    totalCosts: round(current.totalCosts + exitCost),
    netPnl: round(grossPnl - current.totalCosts - exitCost),
    status: "closed",
    closedAt: "adesso",
  };
  trades = trades.map((trade) => (trade.id === tradeId ? closed : trade));
  return closed;
}

export function runScanner(force = false) {
  const duplicateKeys = opportunities.map((item) => `${item.symbol}:${item.strategy}:${item.timeframe}`);
  const duplicatesSkipped = duplicateKeys.filter((key) => scannerSeen.has(key)).length;
  if (force) {
    lastScanAt = "adesso";
  } else {
    lastScanAt = "adesso";
  }
  return {
    status: "completed" as const,
    scannedAt: lastScanAt,
    scannedSymbols: markets.length,
    newOpportunities: 0,
    duplicatesSkipped,
    retries: 1,
  };
}

export function getDashboard() {
  const netPnl = round(trades.reduce((total, trade) => total + trade.netPnl, 0));
  const closed = trades.filter((trade) => trade.status === "closed");
  const winning = closed.filter((trade) => trade.netPnl > 0);
  const gains = closed.reduce((total, trade) => total + Math.max(0, trade.netPnl), 0);
  const losses = closed.reduce((total, trade) => total + Math.abs(Math.min(0, trade.netPnl)), 0);
  const startingCapital = 100000;
  const strategyOrder: Strategy[] = ["momentum", "breakout", "trend_following", "mean_reversion"];
  const strategyColors: Record<Strategy, string> = {
    momentum: "#66e3ca",
    breakout: "#8aa6ff",
    trend_following: "#f6bf75",
    mean_reversion: "#df8cff",
  };

  const strategies = strategyOrder.map((strategy) => {
    const strategyTrades = trades.filter((trade) => trade.strategy === strategy);
    const strategyClosed = strategyTrades.filter((trade) => trade.status === "closed");
    const pnl = round(strategyTrades.reduce((total, trade) => total + trade.netPnl, 0));
    const wins = strategyClosed.filter((trade) => trade.netPnl > 0).length;
    const profits = strategyClosed.reduce((total, trade) => total + Math.max(0, trade.netPnl), 0);
    const loss = strategyClosed.reduce((total, trade) => total + Math.abs(Math.min(0, trade.netPnl)), 0);
    return {
      strategy,
      label: strategyLabels[strategy],
      capital: 25000,
      pnl,
      roi: round((pnl / 25000) * 100),
      winRate: strategyClosed.length ? round((wins / strategyClosed.length) * 100) : 0,
      maxDrawdown: strategy === "mean_reversion" ? -2.1 : strategy === "breakout" ? -1.5 : -0.9,
      profitFactor: loss ? round(profits / loss) : profits ? 2.8 : 0,
      avgHoldTime: strategy === "trend_following" ? "2g 8h" : strategy === "momentum" ? "18h" : "9h",
      openTrades: strategyTrades.filter((trade) => trade.status === "open").length,
      closedTrades: strategyClosed.length,
      color: strategyColors[strategy],
    };
  });

  const assetClasses: Array<[AssetClass, string]> = [
    ["equities", "Azioni USA"],
    ["etf", "ETF / Indici"],
    ["crypto", "Crypto"],
    ["forex", "Forex"],
  ];
  const assetPerformance = assetClasses.map(([assetClass, label]) => {
    const classTrades = trades.filter((trade) => trade.assetClass === assetClass || (assetClass === "etf" && trade.assetClass === "index"));
    const pnl = round(classTrades.reduce((total, trade) => total + trade.netPnl, 0));
    const capital = 25000;
    return { assetClass, label, pnl, roi: round((pnl / capital) * 100), trades: classTrades.length };
  });

  return {
    equity: round(startingCapital + netPnl),
    startingCapital,
    netPnl,
    roi: round((netPnl / startingCapital) * 100),
    winRate: closed.length ? round((winning.length / closed.length) * 100) : 0,
    maxDrawdown: -1.7,
    profitFactor: losses ? round(gains / losses) : gains ? 2.8 : 0,
    avgHoldTime: "1g 3h",
    openTrades: trades.filter((trade) => trade.status === "open").length,
    closedTrades: closed.length,
    lastScanAt,
    scannerStatus: "ready" as const,
    strategies,
    assetPerformance,
  };
}
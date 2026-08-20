import { usePaperTrading } from "@/hooks/use-paper-trading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceFormatter, PercentBadge } from "@/components/ui/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Zap, TrendingUp, Anchor, BarChart } from "lucide-react";

export default function Strategies() {
  const { useGetDashboard } = usePaperTrading();
  const { data: dashboard, isLoading } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const strategies = dashboard.strategies;

  const getStrategyIcon = (strategyId: string) => {
    switch (strategyId) {
      case 'momentum': return <Zap className="h-5 w-5 text-amber-500" />;
      case 'breakout': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'trend_following': return <Activity className="h-5 w-5 text-green-500" />;
      case 'mean_reversion': return <Anchor className="h-5 w-5 text-purple-500" />;
      default: return <BarChart className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Strategy Engines</h1>
        <p className="text-slate-500 mt-1">Comparative performance of independent quantitative models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strat) => (
          <Card key={strat.strategy} className="shadow-sm border-t-4 hover-elevate transition-all" style={{ borderTopColor: strat.color || 'hsl(var(--primary))' }}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-100">
                    {getStrategyIcon(strat.strategy)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{strat.label}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">ID: {strat.strategy}</CardDescription>
                  </div>
                </div>
                <PercentBadge value={strat.roi} className="text-sm px-2 py-1" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Allocated Cap</span>
                  <div className="font-mono font-semibold text-slate-900"><PriceFormatter value={strat.capital} /></div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Net PnL</span>
                  <div className={`font-mono font-semibold ${strat.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {strat.pnl >= 0 ? '+' : ''}<PriceFormatter value={strat.pnl} />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</span>
                  <div className="font-mono font-semibold text-slate-900"><PriceFormatter value={strat.winRate} format="percent" /></div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Profit Factor</span>
                  <div className="font-mono font-semibold text-slate-900">{strat.profitFactor.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-md p-3 border grid grid-cols-3 gap-2 text-center divide-x">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Active Trades</span>
                  <span className="font-mono font-medium">{strat.openTrades}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Closed Trades</span>
                  <span className="font-mono font-medium">{strat.closedTrades}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Avg Hold Time</span>
                  <span className="font-mono font-medium">{strat.avgHoldTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

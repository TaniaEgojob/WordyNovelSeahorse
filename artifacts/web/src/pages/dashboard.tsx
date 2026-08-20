import { usePaperTrading } from "@/hooks/use-paper-trading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceFormatter, PercentBadge, PnlBadge, DirectionBadge } from "@/components/ui/formatters";
import { Sparkline } from "@/components/ui/charts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Radar, Activity, TrendingUp, BarChart3, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { useGetDashboard, useGetMarkets, useGetOpportunities, runScanner } = usePaperTrading();
  const { data: dashboard, isLoading: isLoadingDash } = useGetDashboard();
  const { data: markets, isLoading: isLoadingMarkets } = useGetMarkets();
  const { data: opportunities, isLoading: isLoadingOpps } = useGetOpportunities();

  if (isLoadingDash) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Control Room</h1>
          <p className="text-slate-500 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Simulation Active • Next scan in 14m
          </p>
        </div>
        <Button onClick={() => runScanner.mutate({ data: { force: true } })} disabled={runScanner.isPending}>
          <Radar className="mr-2 h-4 w-4" />
          {runScanner.isPending ? "Scanning..." : "Force Radar Scan"}
        </Button>
      </div>

      {/* Headline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-primary shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equity</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              <PriceFormatter value={dashboard.equity} />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <PnlBadge value={dashboard.netPnl} />
              <span className="text-xs text-muted-foreground">Net Pnl</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Return on Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              <PriceFormatter value={dashboard.roi} format="percent" />
            </div>
            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
              <span>Max DD: <span className="font-mono text-destructive">{formatPercent(dashboard.maxDrawdown)}</span></span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-slate-800">
              <PriceFormatter value={dashboard.winRate} format="percent" />
            </div>
            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
              <span>Profit Factor: <span className="font-mono font-medium">{dashboard.profitFactor.toFixed(2)}</span></span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Exposure</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-slate-800">
              {dashboard.openTrades} <span className="text-lg font-sans font-medium text-muted-foreground">Trades</span>
            </div>
            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
              <span>Avg Hold: {dashboard.avgHoldTime}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Top Opportunities */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="h-5 w-5 text-primary" /> Ranked Radar Opportunities
                </CardTitle>
                <CardDescription>Top quantitative signals from last scan.</CardDescription>
              </div>
              <Link href="/scanner">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingOpps ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : !opportunities || opportunities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                  No active opportunities detected.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Symbol</TableHead>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Signal</TableHead>
                        <TableHead className="text-right">Confidence</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {opportunities.slice(0, 5).map((opp) => (
                        <TableRow key={opp.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold font-mono">{opp.symbol}</span>
                              <span className="text-xs text-muted-foreground">{opp.assetClass}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className="w-fit">{opp.strategyLabel}</Badge>
                              <DirectionBadge direction={opp.direction} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">{opp.signal}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{opp.timeframe}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-mono font-medium">
                              <PriceFormatter value={opp.confidence} format="percent" />
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href="/scanner">
                              <Button size="sm" variant="secondary" className="h-8">Review</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strategies Brief */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" /> Strategy Engines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboard.strategies.slice(0,4).map(strat => (
                  <div key={strat.strategy} className="border rounded-md p-4 flex flex-col justify-between hover-elevate bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold text-sm">{strat.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">Capital: <PriceFormatter value={strat.capital} /></div>
                      </div>
                      <PercentBadge value={strat.roi} />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Win Rate</span>
                          <span className="font-mono font-medium"><PriceFormatter value={strat.winRate} format="percent" /></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Trades</span>
                          <span className="font-mono font-medium">{strat.closedTrades}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          {/* Watchlist */}
          <Card className="shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                Market Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto px-2">
              {isLoadingMarkets ? (
                <div className="space-y-3 p-4">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : !markets ? null : (
                <div className="flex flex-col gap-1">
                  {markets.map((market) => {
                    const isPositive = market.change >= 0;
                    return (
                      <div key={market.symbol} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col">
                          <div className="font-mono font-bold text-sm flex items-center gap-2">
                            {market.symbol}
                            {market.session === 'closed' && (
                              <span className="text-[9px] uppercase bg-slate-200 text-slate-600 px-1 py-0.5 rounded-sm leading-none">Closed</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate w-24 sm:w-32">{market.name}</div>
                        </div>
                        <div className="w-16 h-8 opacity-70">
                          <Sparkline data={market.sparkline} color={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} />
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="font-mono font-medium text-sm">
                            {market.price.toFixed(market.assetClass === 'forex' ? 4 : 2)}
                          </div>
                          <div className={`font-mono text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
                            {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatPercent(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val/100);
}

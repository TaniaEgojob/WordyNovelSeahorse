import { useState, useMemo } from "react";
import { usePaperTrading } from "@/hooks/use-paper-trading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceFormatter, PercentBadge, DirectionBadge } from "@/components/ui/formatters";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radar, Filter, Target, Zap, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Scanner() {
  const [assetClass, setAssetClass] = useState<string>("all");
  const [strategy, setStrategy] = useState<string>("all");
  
  const { useGetOpportunities, runScanner, createTrade } = usePaperTrading();
  
  // Transform 'all' to undefined for the API
  const params = useMemo(() => ({
    ...(assetClass !== "all" ? { assetClass } : {}),
    ...(strategy !== "all" ? { strategy } : {}),
  }), [assetClass, strategy]);
  
  const { data: opportunities, isLoading } = useGetOpportunities(params);
  const { toast } = useToast();

  const handleScan = () => {
    runScanner.mutate(
      { data: { force: true } },
      {
        onSuccess: (data) => {
          toast({ 
            title: "Scan Complete", 
            description: `Found ${data.newOpportunities} new opportunities across ${data.scannedSymbols} symbols.` 
          });
        },
        onError: () => {
          toast({ title: "Scan Failed", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Opportunity Radar</h1>
          <p className="text-slate-500 mt-1">Autonomous quant signals detected across multiple strategies.</p>
        </div>
        <Button onClick={handleScan} disabled={runScanner.isPending} size="lg" className="shadow-md">
          <Radar className="mr-2 h-5 w-5" />
          {runScanner.isPending ? "Scanning Markets..." : "Run Autonomous Scan"}
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground w-full sm:w-auto">
              <Filter className="h-4 w-4" /> Filters
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={assetClass} onValueChange={setAssetClass}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                  <SelectValue placeholder="Asset Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="equities">US Equities</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="etf">ETFs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="breakout">Breakout</SelectItem>
                  <SelectItem value="trend_following">Trend Following</SelectItem>
                  <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : !opportunities || opportunities.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Radar className="h-12 w-12 mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-700">No signals match criteria</p>
              <p className="text-sm mt-1">Try broadening your filters or running a new scan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10">
                    <TableHead className="w-[80px]">Score</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Signal Logic</TableHead>
                    <TableHead className="text-right">Price Targets</TableHead>
                    <TableHead className="text-right">Detected</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id} className="group">
                      <TableCell>
                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 border rounded-md">
                          <span className="font-mono text-sm font-bold text-primary">
                            {(opp.confidence).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-lg">{opp.symbol}</span>
                            <DirectionBadge direction={opp.direction} />
                          </div>
                          <span className="text-xs text-muted-foreground mt-0.5">{opp.name}</span>
                          <span className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">{opp.assetClass}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-none bg-slate-100 text-slate-600">
                              {opp.strategyLabel}
                            </Badge>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs font-mono text-slate-500">{opp.timeframe}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2" title={opp.rationale}>
                            {opp.rationale}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1 font-mono text-xs">
                          <div className="flex justify-between w-32">
                            <span className="text-muted-foreground">Entry:</span>
                            <span className="font-medium text-slate-900">{opp.price}</span>
                          </div>
                          <div className="flex justify-between w-32">
                            <span className="text-muted-foreground">Target:</span>
                            <span className="text-success font-medium">{opp.target}</span>
                          </div>
                          <div className="flex justify-between w-32">
                            <span className="text-muted-foreground">Stop:</span>
                            <span className="text-destructive font-medium">{opp.stop}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {format(new Date(opp.detectedAt), 'HH:mm:ss')}
                        <br/>
                        {format(new Date(opp.detectedAt), 'MMM d')}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <OpenTradeDialog opportunity={opp} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OpenTradeDialog({ opportunity }: { opportunity: any }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("10");
  const { createTrade } = usePaperTrading();
  const { toast } = useToast();

  const handleOpenTrade = () => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({ title: "Invalid quantity", variant: "destructive" });
      return;
    }
    
    createTrade.mutate(
      { data: { opportunityId: opportunity.id, quantity: qty } },
      {
        onSuccess: () => {
          setOpen(false);
          toast({ title: "Order Executed", description: `Opened ${qty} ${opportunity.symbol} paper position.` });
        },
        onError: (err: any) => {
          toast({ title: "Execution Failed", description: err?.message || "Unknown error", variant: "destructive" });
        }
      }
    );
  };

  const isLong = opportunity.direction === "long";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={isLong ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"}>
          Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Execute Paper Trade
            <DirectionBadge direction={opportunity.direction} />
          </DialogTitle>
          <DialogDescription>
            Simulation order based on {opportunity.strategyLabel} signal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-slate-50 border p-4 rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold font-mono text-lg">{opportunity.symbol}</span>
              <span className="font-mono font-medium"><PriceFormatter value={opportunity.price} format="number"/></span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
              <div>
                <span className="text-muted-foreground block text-xs">Target</span>
                <span className="font-mono text-success">{opportunity.target}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Stop Loss</span>
                <span className="font-mono text-destructive">{opportunity.stop}</span>
              </div>
            </div>

            <div className="pt-2 border-t text-xs text-slate-600">
              <span className="font-medium text-slate-900 block mb-1">Signal Rationale:</span>
              {opportunity.rationale}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity (Shares/Units)</Label>
            <Input 
              id="quantity" 
              type="number" 
              step="0.0001" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              className="font-mono text-lg"
            />
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Est. Value: <PriceFormatter value={(parseFloat(quantity) || 0) * opportunity.price} /></span>
              <span>Spread: {opportunity.spreadBps} bps</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleOpenTrade} 
            disabled={createTrade.isPending}
            className={isLong ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"}
          >
            {createTrade.isPending ? "Executing..." : `Execute ${opportunity.direction.toUpperCase()} Order`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

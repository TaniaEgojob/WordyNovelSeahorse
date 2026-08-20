import { useState, useMemo } from "react";
import { usePaperTrading } from "@/hooks/use-paper-trading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceFormatter, PercentBadge, PnlBadge, DirectionBadge } from "@/components/ui/formatters";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Clock, ArrowLeftRight, Target, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Trades() {
  const [status, setStatus] = useState<"open" | "closed">("open");
  const params = useMemo(() => ({ status }), [status]);
  const { useGetTrades } = usePaperTrading();
  const { data: trades, isLoading } = useGetTrades(params);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Simulated Trades</h1>
        <p className="text-slate-500 mt-1">Manage virtual positions and review historical execution performance.</p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as any)} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="open" className="w-32">Open Positions</TabsTrigger>
          <TabsTrigger value="closed" className="w-32">Trade History</TabsTrigger>
        </TabsList>
        
        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : !trades || trades.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                <ArrowLeftRight className="h-10 w-10 mb-4 opacity-20" />
                <p>No {status} trades found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Symbol/Class</TableHead>
                      <TableHead>Direction & Strategy</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Entry</TableHead>
                      <TableHead className="text-right">{status === 'open' ? 'Current' : 'Exit'}</TableHead>
                      <TableHead className="text-right">Net PnL</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                      {status === 'open' && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold font-mono">{trade.symbol}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{trade.assetClass}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 items-start">
                            <DirectionBadge direction={trade.direction} />
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={trade.strategyLabel}>
                              {trade.strategyLabel}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{trade.quantity}</TableCell>
                        <TableCell className="text-right">
                          <PriceFormatter value={trade.entryPrice} format="number" />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <PriceFormatter value={status === 'open' ? trade.currentPrice : (trade.exitPrice || 0)} format="number" />
                        </TableCell>
                        <TableCell className="text-right">
                          <PnlBadge value={trade.netPnl} />
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {format(new Date(trade.openedAt), 'MMM d, HH:mm')}
                          {status === 'closed' && trade.closedAt && (
                            <><br/>to {format(new Date(trade.closedAt), 'MMM d, HH:mm')}</>
                          )}
                        </TableCell>
                        {status === 'open' && (
                          <TableCell className="text-right">
                            <CloseTradeDialog trade={trade} />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

function CloseTradeDialog({ trade }: { trade: any }) {
  const [open, setOpen] = useState(false);
  const [exitPrice, setExitPrice] = useState(trade.currentPrice.toString());
  const { closeTrade } = usePaperTrading();
  const { toast } = useToast();

  const handleClose = () => {
    const price = parseFloat(exitPrice);
    if (isNaN(price) || price <= 0) {
      toast({ title: "Invalid price", variant: "destructive" });
      return;
    }
    
    closeTrade.mutate(
      { tradeId: trade.id, data: { exitPrice: price } },
      {
        onSuccess: () => {
          setOpen(false);
          toast({ title: "Trade closed successfully", description: `${trade.symbol} position exited.` });
        },
        onError: (err: any) => {
          toast({ title: "Failed to close trade", description: err?.message || "Unknown error", variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 border-destructive/20 text-destructive hover:bg-destructive hover:text-white">
          Close Pos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Position: {trade.symbol}</DialogTitle>
          <DialogDescription>
            Simulate closing this {trade.direction} position. 
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm border rounded-md p-3 bg-muted/30">
            <div>
              <div className="text-muted-foreground text-xs">Entry Price</div>
              <div className="font-mono font-medium">{trade.entryPrice}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Current Market Price</div>
              <div className="font-mono font-medium text-primary">{trade.currentPrice}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Quantity</div>
              <div className="font-mono">{trade.quantity}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Current PnL</div>
              <div className={`font-mono ${trade.netPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {trade.netPnl >= 0 ? '+' : ''}{trade.netPnl.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exitPrice">Simulated Exit Price</Label>
            <Input 
              id="exitPrice" 
              type="number" 
              step="0.0001" 
              value={exitPrice} 
              onChange={(e) => setExitPrice(e.target.value)} 
              className="font-mono text-lg"
            />
            <p className="text-xs text-muted-foreground">Defaulted to current market price for convenience.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={handleClose} 
            disabled={closeTrade.isPending}
          >
            {closeTrade.isPending ? "Closing..." : "Confirm Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

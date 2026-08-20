import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PriceFormatter({ value, format = "currency" }: { value: number; format?: "currency" | "percent" | "number" }) {
  if (format === "percent") {
    return <span className="font-mono">{formatPercent(value)}</span>;
  }
  if (format === "number") {
    return <span className="font-mono">{formatNumber(value)}</span>;
  }
  return <span className="font-mono">{formatCurrency(value)}</span>;
}

export function PnlBadge({ value, className }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  return (
    <Badge
      variant="outline"
      className={`font-mono font-bold ${
        isPositive
          ? "bg-success/10 text-success border-success/20"
          : "bg-destructive/10 text-destructive border-destructive/20"
      } ${className || ""}`}
    >
      {isPositive ? "+" : ""}{formatCurrency(value)}
    </Badge>
  );
}

export function PercentBadge({ value, className }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  return (
    <Badge
      variant="outline"
      className={`font-mono font-bold ${
        isPositive
          ? "bg-success/10 text-success border-success/20"
          : "bg-destructive/10 text-destructive border-destructive/20"
      } ${className || ""}`}
    >
      {isPositive ? "+" : ""}{formatPercent(value)}
    </Badge>
  );
}

export function DirectionBadge({ direction }: { direction: "long" | "short" }) {
  return (
    <Badge
      variant="outline"
      className={`uppercase tracking-wider text-[10px] font-bold ${
        direction === "long" 
          ? "bg-blue-100 text-blue-700 border-blue-200" 
          : "bg-purple-100 text-purple-700 border-purple-200"
      }`}
    >
      {direction}
    </Badge>
  );
}

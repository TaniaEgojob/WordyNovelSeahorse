import { Router, type IRouter } from "express";
import {
  CloseTradeBody,
  CloseTradeParams,
  CloseTradeResponse,
  CreateTradeBody,
  CreateTradeResponse,
  GetDashboardResponse,
  GetMarketsResponse,
  GetOpportunitiesQueryParams,
  GetOpportunitiesResponse,
  GetTradesQueryParams,
  GetTradesResponse,
  RunScannerBody,
  RunScannerResponse,
} from "@workspace/api-zod";
import {
  closeTrade,
  getDashboard,
  getMarkets,
  getOpportunities,
  getTrades,
  openTrade,
  runScanner,
} from "../lib/paper-engine";

const router: IRouter = Router();

router.get("/dashboard", (req, res): void => {
  req.log.info("Serving paper-trading dashboard");
  res.json(GetDashboardResponse.parse(getDashboard()));
});

router.get("/markets", (req, res): void => {
  req.log.info("Serving monitored markets");
  res.json(GetMarketsResponse.parse(getMarkets()));
});

router.get("/opportunities", (req, res): void => {
  const parsed = GetOpportunitiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid opportunity filters");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(GetOpportunitiesResponse.parse(getOpportunities(parsed.data.assetClass, parsed.data.strategy)));
});

router.post("/scanner/run", (req, res): void => {
  const parsed = RunScannerBody.safeParse(req.body ?? {});
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid scanner input");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const result = runScanner(parsed.data.force);
  req.log.info({ scannedSymbols: result.scannedSymbols, duplicatesSkipped: result.duplicatesSkipped }, "Scanner run completed");
  res.json(RunScannerResponse.parse(result));
});

router.get("/trades", (req, res): void => {
  const parsed = GetTradesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid trade filter");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(GetTradesResponse.parse(getTrades(parsed.data.status)));
});

router.post("/trades", (req, res): void => {
  const parsed = CreateTradeBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid paper-trade input");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const trade = openTrade(parsed.data.opportunityId, parsed.data.quantity);
  if (!trade) {
    res.status(404).json({ error: "Opportunity not found" });
    return;
  }
  req.log.info({ tradeId: trade.id, symbol: trade.symbol }, "Paper trade opened");
  res.status(201).json(CreateTradeResponse.parse(trade));
});

router.post("/trades/:tradeId/close", (req, res): void => {
  const params = CloseTradeParams.safeParse(req.params);
  const body = CloseTradeBody.safeParse(req.body);
  if (!params.success) {
    req.log.warn({ errors: params.error.message }, "Invalid paper-trade close request");
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    req.log.warn({ errors: body.error.message }, "Invalid paper-trade close request");
    res.status(400).json({ error: body.error.message });
    return;
  }
  const trade = closeTrade(params.data.tradeId, body.data.exitPrice);
  if (!trade) {
    res.status(404).json({ error: "Open paper trade not found" });
    return;
  }
  req.log.info({ tradeId: trade.id, exitPrice: trade.exitPrice }, "Paper trade closed");
  res.json(CloseTradeResponse.parse(trade));
});

export default router;
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDashboard,
  useGetMarkets,
  useGetOpportunities,
  useGetTrades,
  useCreateTrade,
  useCloseTrade,
  useRunScanner,
  getGetDashboardQueryKey,
  getGetMarketsQueryKey,
  getGetOpportunitiesQueryKey,
  getGetTradesQueryKey,
} from "@workspace/api-client-react";

export function usePaperTrading() {
  const queryClient = useQueryClient();

  const invalidateData = () => {
    queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetMarketsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetOpportunitiesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetTradesQueryKey() });
  };

  const createTrade = useCreateTrade({
    mutation: {
      onSuccess: () => {
        invalidateData();
      },
    },
  });

  const closeTrade = useCloseTrade({
    mutation: {
      onSuccess: () => {
        invalidateData();
      },
    },
  });

  const runScanner = useRunScanner({
    mutation: {
      onSuccess: () => {
        invalidateData();
      },
    },
  });

  return {
    useGetDashboard,
    useGetMarkets,
    useGetOpportunities,
    useGetTrades,
    createTrade,
    closeTrade,
    runScanner,
  };
}

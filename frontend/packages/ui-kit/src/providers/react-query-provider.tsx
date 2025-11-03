import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { useToast } from "../hooks/use-show-error-toast";

interface Props {
  children: ReactNode;
}

const ReactQueryProvider = ({ children }: Props) => {
  const { showErrorToast } = useToast();
  const [queryClient] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          if (!query.meta?.noErrorToast) {
            showErrorToast(error);
          }
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,      // 5 minutes - data stays fresh longer
          gcTime: 10 * 60 * 1000,         // 10 minutes - cache persists longer
          retry: 1,                        // Retry failed queries once
          refetchOnWindowFocus: false,     // Prevent excessive refetches on window focus
          refetchOnReconnect: true,        // Refetch when connection is restored
        },
        mutations: {
          retry: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { ReactQueryProvider };

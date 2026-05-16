"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Using useState ensures Next.js initializes the QueryClient exactly once per browser session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes before checking the server again
            staleTime: 1000 * 60 * 5,
            // Prevents your app from refetching data every single time the user switches browser tabs
            refetchOnWindowFocus: false,
            // Retry failed requests automatically 1 time before throwing an error
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
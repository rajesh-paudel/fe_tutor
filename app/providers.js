"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes standard caching threshold
          },
        },
      }),
  );

  useEffect(() => {
    const handleAuthChange = () => {
      queryClient.clear();
    };

    window.addEventListener("auth:changed", handleAuthChange);
    return () => window.removeEventListener("auth:changed", handleAuthChange);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#102033",
            border: "1px solid #dbe5ee",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

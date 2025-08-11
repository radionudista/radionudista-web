import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LanguageRouter from "./components/LanguageRouter";
import { DebugProvider } from "./contexts/DebugContext";
import DebugBar from "./components/ui/DebugBar";
import { useLanguageDebugInfo } from "@/hooks/useLanguageDebugInfo";

/**
 * Calls useLanguageDebugInfo to register language info in DebugContext.
 * Must be rendered inside DebugProvider.
 */
const LanguageDebugInfoProvider = () => {
  useLanguageDebugInfo();
  return null;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DebugProvider>
          <LanguageDebugInfoProvider /> {/* Now inside DebugProvider */}
          <Toaster />
          <Sonner />
          <LanguageRouter />
          <DebugBar />
        </DebugProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

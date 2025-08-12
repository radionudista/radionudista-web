import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LanguageRouter from "./components/LanguageRouter";
import { DebugProvider } from "./contexts/DebugContext";
import DebugBar from "./components/ui/DebugBar";
import DebugCollector from "./components/debug/DebugCollector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DebugProvider>
        <DebugCollector />
        <Toaster />
        <Sonner />
        <LanguageRouter />
        <DebugBar />
      </DebugProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

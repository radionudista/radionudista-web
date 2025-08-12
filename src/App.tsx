import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./config/i18n";
import LanguageRouter from "./components/LanguageRouter";
import { DebugProvider } from "./contexts/DebugContext";
import DebugBar from "./components/ui/DebugBar";
import HardwareAccelerationNotice from "./components/HardwareAccelerationNotice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DebugProvider>
        <HardwareAccelerationNotice />
        <Toaster />
        <Sonner />
        <LanguageRouter />
        <DebugBar />
      </DebugProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

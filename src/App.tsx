
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/auth/LoginForm";
import OnboardingSurvey from "./components/onboarding/OnboardingSurvey";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import AddCropPage from "./pages/AddCropPage";
import PredictPricePage from "./pages/PredictPricePage";
import FindMandiPage from "./pages/FindMandiPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import FloatingChatButton from "./components/FloatingChatButton";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, loading, hasProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm onSuccess={() => window.location.reload()} />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <OnboardingSurvey onComplete={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/add-crop" element={<AddCropPage />} />
        <Route path="/predict-price" element={<PredictPricePage />} />
        <Route path="/find-mandi" element={<FindMandiPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingChatButton />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthenticatedApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

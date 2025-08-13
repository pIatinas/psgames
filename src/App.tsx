
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth/AuthProvider";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import GameList from "./pages/GameList";
import GameDetail from "./pages/GameDetail";
import AccountList from "./pages/AccountList";
import AccountDetail from "./pages/AccountDetail";
import MemberList from "./pages/MemberList";
import MemberDetail from "./pages/MemberDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/MyProfile";
import MyAccounts from "./pages/MyAccounts";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/games" element={<ProtectedRoute><GameList /></ProtectedRoute>} />
            <Route path="/games/:slug" element={<ProtectedRoute><GameDetail /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute><AccountList /></ProtectedRoute>} />
            <Route path="/accounts/:slug" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />
            <Route path="/members" element={<ProtectedRoute><MemberList /></ProtectedRoute>} />
            <Route path="/members/:slug" element={<ProtectedRoute><MemberDetail /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/my-accounts" element={<ProtectedRoute><MyAccounts /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

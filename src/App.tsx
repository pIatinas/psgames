
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth/AuthProvider";
import ScrollToTop from "@/components/ScrollToTop";

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
import AdminGamesPage from "./pages/admin/AdminGamesPage";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage";
import AdminMembersPage from "./pages/admin/AdminMembersPage";

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
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/games/:slug" element={<GameDetail />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/accounts/:slug" element={<AccountDetail />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/members/:slug" element={<MemberDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-accounts" element={<MyAccounts />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminGamesPage />} />
              <Route path="games" element={<AdminGamesPage />} />
              <Route path="accounts" element={<AdminAccountsPage />} />
              <Route path="members" element={<AdminMembersPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

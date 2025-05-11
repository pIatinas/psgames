
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import GameList from './pages/GameList';
import GameDetail from './pages/GameDetail';
import AccountList from './pages/AccountList';
import AccountDetail from './pages/AccountDetail';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import MyProfile from './pages/MyProfile';
import MyAccounts from './pages/MyAccounts';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminGamesPage from './pages/admin/AdminGamesPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/accounts" element={<AccountList />} />
          <Route path="/accounts/:id" element={<AccountDetail />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/my-accounts" element={<MyAccounts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin routes with separate pages */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminGamesPage />} />
            <Route path="games" element={<AdminGamesPage />} />
            <Route path="accounts" element={<AdminAccountsPage />} />
            <Route path="members" element={<AdminMembersPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

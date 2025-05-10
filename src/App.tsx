
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import GameList from './pages/GameList';
import GameDetail from './pages/GameDetail';
import AccountList from './pages/AccountList';
import AccountDetail from './pages/AccountDetail';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

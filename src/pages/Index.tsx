import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import AccountCard from '@/components/AccountCard';
import MemberCard from '@/components/MemberCard';
import SectionTitle from '@/components/SectionTitle';
import SeeAllButton from '@/components/SeeAllButton';
import Loader from '@/components/Loader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Game, Account, User } from '@/types';
import { gameService, accountService, userService } from '@/services/supabaseService';
const Index = () => {
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [recentAccounts, setRecentAccounts] = useState<Account[]>([]);
  const [recentMembers, setRecentMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load games
        const games = await gameService.getAll();
        setRecentGames(games.slice(0, 8));

        // Load accounts
        const accounts = await accountService.getAll();
        setRecentAccounts(accounts.slice(0, 6));

        // Load members
        const members = await userService.getAll();
        setRecentMembers(members.slice(0, 6));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  if (loading) {
    return <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loader />
        </main>
        <Footer />
      </div>;
  }
  return <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs and Back Button */}
        <div className="container py-4">
          <Breadcrumbs />
        </div>
        {/* Seção de Jogos Recentes */}
        <section className="pb-16 container">
          <SectionTitle title="Jogos Recentes" subtitle="Os últimos jogos adicionados à nossa biblioteca" />
          
          {recentGames.length > 0 ? <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentGames.map(game => <GameCard key={game.id} game={game} />)}
              </div>
              
              <SeeAllButton to="/games" label="Ver Todos os Jogos" />
            </> : <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum jogo cadastrado ainda.</p>
            </div>}
        </section>
        
        {/* Seção de Contas */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <SectionTitle title="Contas Disponíveis" subtitle="Explore as contas com uma diversidade de jogos" />
            
            {recentAccounts.length > 0 ? <>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recentAccounts.map(account => <AccountCard key={account.id} account={account} />)}
                </div>
                
                <SeeAllButton to="/accounts" label="Ver Todas as Contas" />
              </> : <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma conta cadastrada ainda.</p>
              </div>}
          </div>
        </section>
        
        {/* Seção de Membros */}
        <section className="py-16 container">
          <SectionTitle title="Nosso Grupo" subtitle="Conheça os membros do nosso grupo de jogadores" />
          
          {recentMembers.length > 0 ? <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recentMembers.map(member => <MemberCard key={member.id} member={member} />)}
              </div>
              
              <SeeAllButton to="/members" label="Ver Todos os Membros" />
            </> : <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum membro cadastrado ainda.</p>
            </div>}
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;
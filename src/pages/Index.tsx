
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import GameCard from '@/components/GameCard';
import AccountCard from '@/components/AccountCard';
import MemberCard from '@/components/MemberCard';
import SectionTitle from '@/components/SectionTitle';
import SeeAllButton from '@/components/SeeAllButton';
import { getRecentGames, getRecentAccounts, members } from '@/data/mockData';

const Index = () => {
  const recentGames = getRecentGames();
  const recentAccounts = getRecentAccounts();
  const recentMembers = members.filter(member => member.isApproved).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <HeroSection games={recentGames.slice(0, 3)} />
        
        {/* Seção de Jogos Recentes */}
        <section className="py-16 container">
          <SectionTitle 
            title="Jogos Recentes" 
            subtitle="Os últimos jogos adicionados à nossa biblioteca"
          />
          
          {/* Grid de jogos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          
          <SeeAllButton to="/games" label="Ver Todos os Jogos" />
        </section>
        
        {/* Seção de Contas */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <SectionTitle 
              title="Contas Disponíveis" 
              subtitle="Explore as contas com uma diversidade de jogos"
            />
            
            {/* Grid de contas */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentAccounts.map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
            
            <SeeAllButton to="/accounts" label="Ver Todas as Contas" />
          </div>
        </section>
        
        {/* Seção de Membros */}
        <section className="py-16 container">
          <SectionTitle 
            title="Nossa Comunidade" 
            subtitle="Conheça os membros da nossa comunidade de jogadores"
          />
          
          {/* Grid de membros */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
          
          <SeeAllButton to="/members" label="Ver Todos os Membros" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

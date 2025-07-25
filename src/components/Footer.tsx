import React from 'react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="py-8 mt-12 r bg-black">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gradient">PSGames</h3>
            <p className="text-sm text-muted-foreground">
              Compartilhamento de contas e jogos para PS5 e outras plataformas.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-muted-foreground hover:text-primary">
                  Jogos
                </Link>
              </li>
              <li>
                <Link to="/accounts" className="text-muted-foreground hover:text-primary">
                  Contas
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-muted-foreground hover:text-primary">
                  Membros
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Email: suporte@psgames.com
              </li>
              <li className="text-muted-foreground">
                Discord: PSGames
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-8 pt-4 text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} PSGames. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
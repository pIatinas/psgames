import React from 'react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="py-8 mt-12 r bg-[#00000036]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gradient">PSGames</h3>
            <p className="text-sm text-muted-foreground">Grupo de compras para os jogos da Sony.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links</h4>
            <ul className="space-y-2 text-sm">
              
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
            <h4 className="font-semibold mb-4 text-foreground">Outros</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Cadastro</li>
              <li className="text-muted-foreground">Guias</li>
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
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const labelMap: Record<string, string> = {
  'games': 'Jogos',
  'accounts': 'Contas',
  'members': 'Membros',
  'admin': 'Admin',
  'login': 'Entrar',
  'register': 'Cadastro',
  'my-profile': 'Meu Perfil',
  'my-accounts': 'Minhas Contas',
};

const formatSegment = (seg: string) => labelMap[seg] || seg.replace(/-/g, ' ');

interface BreadcrumbsProps {
  backButton?: {
    href: string;
    label?: string;
  };
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ backButton }) => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const paths = segments.map((seg, idx) => ({
    name: formatSegment(seg),
    href: '/' + segments.slice(0, idx + 1).join('/'),
    isLast: idx === segments.length - 1,
  }));

  return (
    <nav className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {paths.map((p, i) => (
            <React.Fragment key={p.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {p.isLast ? (
                  <BreadcrumbPage>{p.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={p.href}>{p.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      {backButton && (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-white"
          asChild
        >
          <Link to={backButton.href}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backButton.label || 'Voltar'}
          </Link>
        </Button>
      )}
    </nav>
  );
};

export default Breadcrumbs;

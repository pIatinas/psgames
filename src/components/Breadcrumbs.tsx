import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const paths = segments.map((seg, idx) => ({
    name: formatSegment(seg),
    href: '/' + segments.slice(0, idx + 1).join('/'),
    isLast: idx === segments.length - 1,
  }));

  return (
    <nav className="mt-2">
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
    </nav>
  );
};

export default Breadcrumbs;

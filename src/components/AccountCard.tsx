
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User } from 'lucide-react';
import { Account } from '@/types';
import ImagePlaceholder from '@/components/ui/image-placeholder';

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Link to={`/accounts/${account.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                <p className="text-sm font-mono break-all">{account.email}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-sm font-mono">
                      {showPassword ? account.password : '••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        togglePasswordVisibility();
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Jogos</p>
                <div className="flex flex-wrap gap-1">
                  {account.games && account.games.length > 0 ? (
                    account.games.slice(0, 3).map((game) => (
                      <Badge key={game.id} variant="secondary" className="text-xs">
                        {game.name.length > 10 ? `${game.name.slice(0, 10)}...` : game.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Nenhum jogo</span>
                  )}
                  {account.games && account.games.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{account.games.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Slot 1</p>
                {account.slots?.find(slot => slot.slot_number === 1)?.user_id ? (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Ocupado</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Livre</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Slot 2</p>
                {account.slots?.find(slot => slot.slot_number === 2)?.user_id ? (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Ocupado</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Livre</span>
                  </div>
                )}
              </div>

              {account.security_answer && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resposta de Segurança</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {account.security_answer.length > 20 
                      ? `${account.security_answer.slice(0, 20)}...` 
                      : account.security_answer
                    }
                  </p>
                </div>
              )}

              {account.codes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Códigos</p>
                  <p className="text-xs font-mono">{account.codes}</p>
                </div>
              )}

              {account.qr_code && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">QR Code</p>
                  <div className="w-12 h-12">
                    <ImagePlaceholder
                      src={account.qr_code}
                      alt="QR Code"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AccountCard;

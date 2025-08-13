import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [psnId, setPsnId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const {
    currentUser,
    session
  } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (currentUser || session) {
      navigate('/');
    }
  }, [currentUser, session, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !psnId || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Register the user with Supabase Auth
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            psn_id: psnId
          }
        }
      });
      if (error) throw error;
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso! Faça login para continuar."
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao criar sua conta.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-foreground text-4xl font-bold">Cadastro</h1>
            <p className="text-white mt-2">
              Preencha os campos abaixo para se registrar
            </p>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Nome
                </label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  E-mail
                </label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="psn-id" className="text-sm font-medium leading-none">
                  PSN ID
                </label>
                <Input id="psn-id" value={psnId} onChange={e => setPsnId(e.target.value)} disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Senha
                </label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium leading-none">
                  Confirmar Senha
                </label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full bg-pink-600 hover:bg-pink-500">
                {isLoading ? <span>Processando...</span> : <span>Cadastrar</span>}
              </Button>
            </form>
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="text-sm text-white">
              <span>Já possui uma conta?</span>{" "}
              <Link to="/login" className="underline text-pink-600 no-underline hover:no-underline font-medium ">Entrar!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Register;
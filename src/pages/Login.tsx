import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const formSchema = z.object({
  emailOrPsnId: z.string().min(1, {
    message: "Campo obrigatório"
  }),
  password: z.string().min(1, {
    message: "Campo obrigatório"
  })
});
const Login = () => {
  const {
    login,
    currentUser,
    session
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin user should be created through Supabase dashboard for security

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser || session) {
      navigate('/');
    }
  }, [currentUser, session, navigate]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPsnId: "",
      password: ""
    }
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const success = await login(values.emailOrPsnId, values.password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <Card className="">
          <CardHeader>
            
            <CardTitle className="text-foreground text-center text-4xl">Login</CardTitle>
            <CardDescription className="text-center text-white opacity-60">Entre com seu e-mail e senha.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="emailOrPsnId" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-white">Email ou PSN ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email ou PSN ID" {...field} disabled={isLoading} className="text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-white">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="Digite sua senha" {...field} disabled={isLoading} className="pr-10 text-white" />
                          <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition" onClick={togglePasswordVisibility}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <Button type="submit" disabled={isLoading} className="w-full mt-6 bg-pink-600 hover:bg-pink-500">
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col  pt-6">
            <div className="text-center text-white text-sm">
              <Link to="/forgot-password" className="text-pink-600 hover:underline font-medium no-underline hover:no-underline ">Esqueceu a senha?</Link>
            </div>
            <div className="text-center text-white text-sm">
              Não tem uma conta? {" "}
              <Link to="/register" className="text-pink-600 hover:no-underline font-medium">Cadastre-se!</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default Login;
import React, { useState, useEffect, useRef } from 'react';
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
import ReCaptcha, { ReCaptchaRef } from '@/components/ReCaptcha';
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
    session,
    isLoading: authLoading
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<ReCaptchaRef>(null);

  // Admin user should be created through Supabase dashboard for security

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !authLoading) {
      navigate('/', { replace: true });
    }
  }, [currentUser, authLoading, navigate]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPsnId: "",
      password: ""
    }
  });
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    // Execute invisible reCAPTCHA first
    recaptchaRef.current?.execute();
  };

  const onRecaptchaChange = async (token: string | null) => {
    if (!token) return;
    
    setIsLoading(true);
    const formValues = form.getValues();
    
    try {
      const success = await login(formValues.emailOrPsnId, formValues.password);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!"
        });
        navigate('/');  // Always redirect to home after login
      } else {
        toast({
          title: "Erro",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        // Reset reCAPTCHA and enable form on error
        recaptchaRef.current?.reset();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login.",
        variant: "destructive"
      });
      // Reset reCAPTCHA and enable form on error
      recaptchaRef.current?.reset();
      setIsLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-foreground text-4xl font-bold">Login</h1>
            <p className="text-white opacity-60 mt-2">Entre com seu e-mail e senha.</p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField control={form.control} name="emailOrPsnId" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-white">E-mail</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} className="text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-white">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} {...field} disabled={isLoading} className="pr-10 text-white" />
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
            
            {/* Invisible reCAPTCHA */}
            <ReCaptcha 
              ref={recaptchaRef}
              onChange={onRecaptchaChange}
              onExpired={() => {
                recaptchaRef.current?.reset();
                setIsLoading(false);
              }}
              onError={() => {
                recaptchaRef.current?.reset();
                setIsLoading(false);
                toast({
                  title: "Erro",
                  description: "Erro na verificação. Tente novamente.",
                  variant: "destructive"
                });
              }}
            />
          </div>
          <div className="flex flex-col mt-6 space-y-2">
            <div className="text-center text-white text-sm">
              <Link to="/forgot-password" className="text-pink-600 hover:underline font-medium no-underline hover:no-underline hover:text-pink-500">Esqueceu a senha?</Link>
            </div>
            <div className="text-center text-white text-sm">
              Não tem uma conta? {" "}
              <Link to="/register" className="text-pink-600 hover:no-underline font-medium hover:text-pink-500">Cadastre-se!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Login;
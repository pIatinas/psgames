import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido"
  })
});
const ForgotPassword = () => {
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email de recuperação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (emailSent) {
    return <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md px-4">
          <Card className="border-border">
            <CardHeader>
              <Link to="/" className="flex items-center gap-2 mb-6 justify-center">
                <div className="p-1 rounded-full bg-primary/20">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-.5 5v6H5v2h6.5v6h1v-6H19v-2h-6.5V5h-1z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold"><span>PS</span>Games</span>
              </Link>
              <CardTitle className="text-foreground text-xl text-center">Email Enviado</CardTitle>
              <CardDescription className="text-center text-white">
                Verifique sua caixa de entrada para redefinir sua senha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Se você não receber o email em alguns minutos, verifique sua pasta de spam.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-foreground text-4xl font-bold">Esqueceu a Senha?</h1>
            <p className="text-white opacity-60 mt-2">Digite seu e-mail para redefinir sua senha</p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-white">E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled={isLoading} className="text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <Button type="submit" disabled={isLoading} className="w-full mt-6 bg-pink-600 hover:bg-pink-500">
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="text-center mt-6">
            <Button asChild variant="ghost" className="text-white hover:text-primary">
              <Link to="/login" className="hover:text-pink-500 ">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default ForgotPassword;
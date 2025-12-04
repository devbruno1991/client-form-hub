import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, FileText } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulação de login - em produção, isso seria conectado a um backend
    setTimeout(() => {
      // Credenciais de demo
      if (email === "admin@empresa.com" && password === "admin123") {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Erro de autenticação",
          description: "E-mail ou senha incorretos.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-center text-2xl font-bold text-card-foreground">
              Acesso Administrativo
            </h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Entre com suas credenciais para acessar o painel
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-card-foreground">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-background pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> admin@empresa.com / admin123
              </p>
            </div>
          </div>

          {/* Back link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline">
              ← Voltar ao formulário
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;

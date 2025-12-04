import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-card-foreground">Sistema de Cadastro</span>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Shield className="h-4 w-4 mr-2" />
              Área Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <FileText className="h-4 w-4" />
            Sistema de Abertura de Empresas
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Cadastro Empresarial
            <span className="block text-primary">Simples e Rápido</span>
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground">
            Preencha o formulário de abertura inicial e receba um documento Word 
            com todas as informações da sua empresa prontas para uso.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/formulario">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                Iniciar Cadastro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                Acesso Administrativo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">Formulário Completo</h3>
            <p className="text-sm text-muted-foreground">
              Todos os campos necessários para abertura da sua empresa
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <ArrowRight className="h-7 w-7 text-accent-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">Exportação Word</h3>
            <p className="text-sm text-muted-foreground">
              Baixe automaticamente um documento Word formatado
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Shield className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">Área Administrativa</h3>
            <p className="text-sm text-muted-foreground">
              Painel de controle para gerenciar os cadastros
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

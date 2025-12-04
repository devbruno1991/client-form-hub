import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, FileText, Users, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-card-foreground">Painel Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-foreground">
          Bem-vindo ao Painel Administrativo
        </h1>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Formulários</p>
                <p className="text-2xl font-bold text-card-foreground">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold text-card-foreground">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold text-card-foreground">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">
            Funcionalidades do Admin
          </h2>
          <p className="text-muted-foreground mb-4">
            Este painel administrativo permite gerenciar os formulários enviados pelos clientes.
            Para armazenar e visualizar os dados dos formulários, é necessário conectar um backend.
          </p>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="outline">
                Ver Formulário
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, FileText, Download, Eye, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateWordFromDbData } from "@/utils/generateWord";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SocioData {
  nome?: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  nacionalidade?: string;
  estadoCivil?: string;
  profissao?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  capitalSocial?: string;
}

interface QuotaData {
  nome?: string;
  percentual?: number;
  valor?: number;
}

interface ClientForm {
  id: string;
  razao_social: string;
  razao_social_opcao2: string | null;
  razao_social_opcao3: string | null;
  nome_fantasia: string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;
  endereco: string | null;
  numero: string | null;
  logradouro: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  referencia: string | null;
  tipo_juridico: string | null;
  porte_empresa: string | null;
  objetivo_social: string | null;
  regime_tributario: string | null;
  capital_social: string | null;
  socio1: boolean | null;
  socio2: boolean | null;
  socio3: boolean | null;
  socio1_data?: SocioData | null;
  socio2_data?: SocioData | null;
  socio3_data?: SocioData | null;
  quotas?: QuotaData[] | null;
  administracao?: string[] | null;
  created_at: string;
}

const formatCurrency = (value: number | undefined): string => {
  if (!value) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<ClientForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<ClientForm | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
      } else {
        fetchForms();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("client_forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms((data || []) as ClientForm[]);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar formulários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleDownloadWord = async (form: ClientForm) => {
    try {
      await generateWordFromDbData(form as any);
      toast({
        title: "Sucesso",
        description: "Documento Word gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar documento.",
        variant: "destructive",
      });
    }
  };

  const handleViewForm = (form: ClientForm) => {
    setSelectedForm(form);
    setDialogOpen(true);
  };

  const renderSocioData = (socioNum: number, socioData: SocioData | null | undefined) => {
    if (!socioData || !socioData.nome) return null;
    
    return (
      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold text-card-foreground mb-3">Sócio {socioNum}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-muted-foreground">Nome</p>
            <p>{socioData.nome || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">CPF</p>
            <p>{socioData.cpf || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">E-mail</p>
            <p>{socioData.email || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Telefone</p>
            <p>{socioData.telefone || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Capital Social (Sócio)</p>
            <p>{socioData.capitalSocial || "-"}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderQuotas = (quotas: QuotaData[] | null | undefined) => {
    if (!quotas || quotas.length === 0) return null;
    const hasData = quotas.some(q => q.nome || q.percentual || q.valor);
    if (!hasData) return null;
    
    return (
      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold text-card-foreground mb-3">Divisão das Cotas</h4>
        <div className="space-y-2">
          {quotas.map((quota, index) => (
            (quota.nome || quota.percentual || quota.valor) && (
              <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                <p><span className="text-muted-foreground">Nome:</span> {quota.nome || "-"}</p>
                <p><span className="text-muted-foreground">%:</span> {quota.percentual || 0}%</p>
                <p><span className="text-muted-foreground">Valor:</span> {formatCurrency(quota.valor)}</p>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  const renderAdministracao = (administracao: string[] | null | undefined) => {
    if (!administracao || administracao.length === 0) return null;
    const admins = administracao.filter(a => a && a.trim() !== "");
    if (admins.length === 0) return null;
    
    return (
      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold text-card-foreground mb-3">Administração da Sociedade</h4>
        <div className="space-y-1">
          {admins.map((admin, index) => (
            <p key={index}><span className="text-muted-foreground">Administrador {index + 1}:</span> {admin}</p>
          ))}
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Formulários Recebidos
          </h1>
          <Button variant="outline" onClick={fetchForms} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Formulários</p>
              <p className="text-2xl font-bold text-card-foreground">{forms.length}</p>
            </div>
          </div>
        </div>

        {/* Forms Table */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum formulário recebido ainda.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Compartilhe o link <code className="bg-muted px-2 py-1 rounded">/formulario</code> com seus clientes.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Razão Social</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">E-mail</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Telefone</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => (
                    <tr key={form.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm text-card-foreground">{form.razao_social}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{form.email || "-"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{form.telefone || form.celular || "-"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(form.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewForm(form)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDownloadWord(form)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* View Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Formulário</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-muted-foreground">Razão Social</p>
                  <p>{selectedForm.razao_social}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Nome Fantasia</p>
                  <p>{selectedForm.nome_fantasia || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">E-mail</p>
                  <p>{selectedForm.email || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Telefone</p>
                  <p>{selectedForm.telefone || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Celular</p>
                  <p>{selectedForm.celular || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Cidade/UF</p>
                  <p>{selectedForm.cidade || "-"} / {selectedForm.uf || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">CEP</p>
                  <p>{selectedForm.cep || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Tipo Jurídico</p>
                  <p>{selectedForm.tipo_juridico || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Porte da Empresa</p>
                  <p>{selectedForm.porte_empresa || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Capital Social</p>
                  <p>{selectedForm.capital_social || "-"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Data de Envio</p>
                  <p>{new Date(selectedForm.created_at).toLocaleString("pt-BR")}</p>
                </div>
              </div>

              {/* Render Socio Data */}
              {selectedForm.socio1 && renderSocioData(1, selectedForm.socio1_data as SocioData)}
              {selectedForm.socio2 && renderSocioData(2, selectedForm.socio2_data as SocioData)}
              {selectedForm.socio3 && renderSocioData(3, selectedForm.socio3_data as SocioData)}

              {/* Render Quotas */}
              {renderQuotas(selectedForm.quotas as QuotaData[])}

              {/* Render Administracao */}
              {renderAdministracao(selectedForm.administracao as string[])}

              <div className="pt-4">
                <Button onClick={() => handleDownloadWord(selectedForm)}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Word
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

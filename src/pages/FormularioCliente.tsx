import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/FormInput";
import { RadioOption } from "@/components/RadioOption";
import { generateWordDocument, FormData } from "@/utils/generateWord";
import { toast } from "@/hooks/use-toast";
import { FileText, Shield } from "lucide-react";

const FormularioCliente = () => {
  const [formData, setFormData] = useState<FormData>({
    razaoSocial: "",
    razaoSocialOpcao2: "",
    razaoSocialOpcao3: "",
    nomeFantasia: "",
    telefone: "",
    celular: "",
    email: "",
    endereco: "",
    numero: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    referencia: "",
    tipoJuridico: "",
    porteEmpresa: "",
    objetivoSocial: "",
    regimeTributario: "",
    capitalSocial: "",
    socio1: "nao",
    socio2: "nao",
    socio3: "nao",
  });

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
      toast({
        title: "Atenção",
        description: "Você precisa aceitar a política de privacidade para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.razaoSocial.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha a Razão Social.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await generateWordDocument(formData);
      toast({
        title: "Sucesso!",
        description: "Documento Word gerado e baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o documento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
          <Link 
            to="/admin" 
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm">Admin</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <Link to="/" className="text-primary hover:underline">Home</Link>
          <span className="mx-2 text-muted-foreground">|</span>
          <span className="text-muted-foreground">Fase de Abertura Inicial</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
          Fase de Abertura Inicial
        </h1>

        <div className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">
            Preencha o formulário inicial de abertura
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Razão Social */}
            <FormInput
              label="Razão Social"
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleChange}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Razão Social Opção 2"
                name="razaoSocialOpcao2"
                value={formData.razaoSocialOpcao2}
                onChange={handleChange}
              />
              <FormInput
                label="Razão Social Opção 3"
                name="razaoSocialOpcao3"
                value={formData.razaoSocialOpcao3}
                onChange={handleChange}
              />
            </div>

            <FormInput
              label="Nome Fantasia"
              name="nomeFantasia"
              value={formData.nomeFantasia}
              onChange={handleChange}
            />

            {/* Contato */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormInput
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                type="tel"
              />
              <FormInput
                label="Celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                type="tel"
              />
              <FormInput
                label="E-mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
            </div>

            {/* Endereço */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormInput
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
              />
              <FormInput
                label="N°"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="md:col-span-1"
              />
              <FormInput
                label="Logradouro"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
              />
              <FormInput
                label="Bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
              <FormInput
                label="UF"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
              />
              <FormInput
                label="Referência"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
              />
            </div>

            {/* Informações Jurídicas */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                label="Tipo Jurídico"
                name="tipoJuridico"
                value={formData.tipoJuridico}
                onChange={handleChange}
              />
              <FormInput
                label="Porte da Empresa"
                name="porteEmpresa"
                value={formData.porteEmpresa}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormInput
                label="Objetivo Social"
                name="objetivoSocial"
                value={formData.objetivoSocial}
                onChange={handleChange}
              />
              <FormInput
                label="Regime Tributário"
                name="regimeTributario"
                value={formData.regimeTributario}
                onChange={handleChange}
              />
              <FormInput
                label="Capital Social"
                name="capitalSocial"
                value={formData.capitalSocial}
                onChange={handleChange}
              />
            </div>

            {/* Sócios */}
            <div className="space-y-3 pt-2">
              <RadioOption
                label="Sócio 1:"
                name="socio1"
                value={formData.socio1}
                onChange={(value) => handleRadioChange("socio1", value)}
                selectedValue={formData.socio1}
              />
              <RadioOption
                label="Sócio 2:"
                name="socio2"
                value={formData.socio2}
                onChange={(value) => handleRadioChange("socio2", value)}
                selectedValue={formData.socio2}
              />
              <RadioOption
                label="Sócio 3:"
                name="socio3"
                value={formData.socio3}
                onChange={(value) => handleRadioChange("socio3", value)}
                selectedValue={formData.socio3}
              />
            </div>

            {/* Política de Privacidade */}
            <div className="flex items-start gap-2 pt-4">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
              />
              <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
                Declaro que li a{" "}
                <span className="text-primary hover:underline">POLÍTICA DE PRIVACIDADE</span>
                {" "}e estou de acordo.
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Gerando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FormularioCliente;

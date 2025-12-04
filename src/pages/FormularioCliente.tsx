import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/FormInput";
import { RadioOption } from "@/components/RadioOption";
import { toast } from "@/hooks/use-toast";
import { FileText, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  razaoSocial: string;
  razaoSocialOpcao2: string;
  razaoSocialOpcao3: string;
  nomeFantasia: string;
  telefone: string;
  celular: string;
  email: string;
  endereco: string;
  numero: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  referencia: string;
  tipoJuridico: string;
  porteEmpresa: string;
  objetivoSocial: string;
  regimeTributario: string;
  capitalSocial: string;
  socio1: string;
  socio2: string;
  socio3: string;
}

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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      const { error } = await supabase.from("client_forms").insert({
        razao_social: formData.razaoSocial,
        razao_social_opcao2: formData.razaoSocialOpcao2,
        razao_social_opcao3: formData.razaoSocialOpcao3,
        nome_fantasia: formData.nomeFantasia,
        telefone: formData.telefone,
        celular: formData.celular,
        email: formData.email,
        endereco: formData.endereco,
        numero: formData.numero,
        logradouro: formData.logradouro,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        uf: formData.uf,
        cep: formData.cep,
        referencia: formData.referencia,
        tipo_juridico: formData.tipoJuridico,
        porte_empresa: formData.porteEmpresa,
        objetivo_social: formData.objetivoSocial,
        regime_tributario: formData.regimeTributario,
        capital_social: formData.capitalSocial,
        socio1: formData.socio1 === "sim",
        socio2: formData.socio2 === "sim",
        socio3: formData.socio3 === "sim",
        aceita_privacidade: acceptedPrivacy,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulário.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Formulário Enviado!</h1>
          <p className="text-muted-foreground">Obrigado por preencher o formulário. Entraremos em contato em breve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center px-4 py-4">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">Formulário Empresarial</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FormularioCliente;
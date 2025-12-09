import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/FormInput";
import { RadioOption } from "@/components/RadioOption";
import { toast } from "@/hooks/use-toast";
import { FileText, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

interface SocioData {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  capitalSocial: string;
}

interface Quota {
  nome: string;
  percentual: string;
  valor: string;
}

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
  socio1Data: SocioData;
  socio2Data: SocioData;
  socio3Data: SocioData;
  quotas: Quota[];
  administracao: string[];
}

const emptySocioData: SocioData = {
  nome: "",
  cpf: "",
  rg: "",
  dataNascimento: "",
  nacionalidade: "",
  estadoCivil: "",
  profissao: "",
  telefone: "",
  email: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
  capitalSocial: "",
};

const FormularioCliente = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
    socio1Data: { ...emptySocioData },
    socio2Data: { ...emptySocioData },
    socio3Data: { ...emptySocioData },
    quotas: [
      { nome: "", percentual: "", valor: "" },
      { nome: "", percentual: "", valor: "" },
      { nome: "", percentual: "", valor: "" },
    ],
    administracao: ["", "", ""],
  });

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

  // Calculate dynamic steps based on selected socios
  const dynamicSteps = useMemo(() => {
    const steps: number[] = [];
    if (formData.socio1 === "sim") steps.push(1);
    if (formData.socio2 === "sim") steps.push(2);
    if (formData.socio3 === "sim") steps.push(3);
    return steps;
  }, [formData.socio1, formData.socio2, formData.socio3]);

  // Total steps: 3 base + dynamic socio steps + 1 cotas/admin step
  const getTotalSteps = () => 3 + dynamicSteps.length + 1;

  const getCotasStepNumber = () => 4 + dynamicSteps.length;

  const isLastStep = () => currentStep === getCotasStepNumber();

  // Currency formatting
  const formatCurrency = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const num = parseInt(digits, 10) / 100;
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrencyToNumber = (valueStr: string): number => {
    if (!valueStr) return 0;
    const digits = valueStr.replace(/[^\d,-]/g, "").replace(",", ".");
    return parseFloat(digits) || 0;
  };

  // Calculate quota totals
  const quotaTotals = useMemo(() => {
    const percentTotal = formData.quotas.reduce(
      (acc, q) => acc + (parseFloat(q.percentual || "0") || 0),
      0
    );
    const valueTotal = formData.quotas.reduce(
      (acc, q) => acc + parseCurrencyToNumber(q.valor),
      0
    );
    return { percentTotal, valueTotal };
  }, [formData.quotas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "capitalSocial") {
      setFormData((prev) => ({ ...prev, [name]: formatCurrency(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocioDataChange = (
    socioNum: 1 | 2 | 3,
    field: keyof SocioData,
    value: string
  ) => {
    const dataKey = `socio${socioNum}Data` as keyof FormData;
    
    let formattedValue = value;
    if (field === "capitalSocial") {
      formattedValue = formatCurrency(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [dataKey]: {
        ...(prev[dataKey] as SocioData),
        [field]: formattedValue,
      },
    }));
  };

  const handleQuotaChange = (index: number, field: keyof Quota, value: string) => {
    setFormData((prev) => {
      const newQuotas = [...prev.quotas];
      if (field === "valor") {
        newQuotas[index][field] = formatCurrency(value);
      } else if (field === "percentual") {
        // Allow only numbers, limit to 100
        const num = value.replace(/\D/g, "");
        const parsed = parseInt(num, 10);
        if (parsed > 100) {
          newQuotas[index][field] = "100";
        } else {
          newQuotas[index][field] = num;
        }
      } else {
        newQuotas[index][field] = value;
      }
      return { ...prev, quotas: newQuotas };
    });
  };

  const handleAdministracaoChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newAdmin = [...prev.administracao];
      newAdmin[index] = value;
      return { ...prev, administracao: newAdmin };
    });
  };

  const nextStep = () => {
    // Validation for step 1
    if (currentStep === 1 && !formData.razaoSocial.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha a Razão Social.",
        variant: "destructive",
      });
      return;
    }

    // Validation for step 2
    if (currentStep === 2 && !formData.email.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o E-mail.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, getTotalSteps()));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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

    // Validate quotas total percentage
    if (quotaTotals.percentTotal !== 100 && quotaTotals.percentTotal > 0) {
      toast({
        title: "Erro de validação",
        description: `A soma dos percentuais das cotas deve ser 100%. Atual: ${quotaTotals.percentTotal}%`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare quotas data for submission
      const quotasData = formData.quotas.map((q) => ({
        nome: q.nome,
        percentual: parseFloat(q.percentual || "0"),
        valor: parseCurrencyToNumber(q.valor),
      }));

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
        socio1_data: formData.socio1 === "sim" ? formData.socio1Data as unknown : null,
        socio2_data: formData.socio2 === "sim" ? formData.socio2Data as unknown : null,
        socio3_data: formData.socio3 === "sim" ? formData.socio3Data as unknown : null,
        quotas: quotasData as unknown,
        administracao: formData.administracao.filter((a) => a.trim() !== "") as unknown,
        aceita_privacidade: acceptedPrivacy,
      } as any);

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

  const renderStepIndicator = () => {
    const baseSteps = [
      { num: 1, label: "Informações\nBásicas" },
      { num: 2, label: "Informações\nde Contato" },
      { num: 3, label: "Sobre a\nEmpresa" },
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {baseSteps.map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                  currentStep >= step.num
                    ? "bg-green-600 text-white"
                    : "border-2 border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {step.num}
              </div>
              <span className="mt-1 text-xs text-center text-muted-foreground whitespace-pre-line">
                {step.label}
              </span>
            </div>
            {index < baseSteps.length - 1 && (
              <div className="mx-2 h-0.5 w-8 bg-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSocioStep = (socioNum: 1 | 2 | 3) => {
    const dataKey = `socio${socioNum}Data` as keyof FormData;
    const socioData = formData[dataKey] as SocioData;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-card-foreground border-b pb-2">
          Dados do Sócio {socioNum}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Nome Completo"
            name={`socio${socioNum}Data.nome`}
            value={socioData.nome}
            onChange={(e) => handleSocioDataChange(socioNum, "nome", e.target.value)}
            placeholder="Nome completo do sócio"
          />
          <FormInput
            label="CPF"
            name={`socio${socioNum}Data.cpf`}
            value={socioData.cpf}
            onChange={(e) => handleSocioDataChange(socioNum, "cpf", e.target.value)}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormInput
            label="RG"
            name={`socio${socioNum}Data.rg`}
            value={socioData.rg}
            onChange={(e) => handleSocioDataChange(socioNum, "rg", e.target.value)}
            placeholder="00.000.000-0"
          />
          <FormInput
            label="Data de Nascimento"
            name={`socio${socioNum}Data.dataNascimento`}
            value={socioData.dataNascimento}
            onChange={(e) => handleSocioDataChange(socioNum, "dataNascimento", e.target.value)}
            placeholder="DD/MM/AAAA"
          />
          <FormInput
            label="Nacionalidade"
            name={`socio${socioNum}Data.nacionalidade`}
            value={socioData.nacionalidade}
            onChange={(e) => handleSocioDataChange(socioNum, "nacionalidade", e.target.value)}
            placeholder="Brasileiro(a)"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormInput
            label="Estado Civil"
            name={`socio${socioNum}Data.estadoCivil`}
            value={socioData.estadoCivil}
            onChange={(e) => handleSocioDataChange(socioNum, "estadoCivil", e.target.value)}
            placeholder="Solteiro(a), Casado(a)..."
          />
          <FormInput
            label="Profissão"
            name={`socio${socioNum}Data.profissao`}
            value={socioData.profissao}
            onChange={(e) => handleSocioDataChange(socioNum, "profissao", e.target.value)}
            placeholder="Profissão"
          />
          <FormInput
            label="Telefone"
            name={`socio${socioNum}Data.telefone`}
            value={socioData.telefone}
            onChange={(e) => handleSocioDataChange(socioNum, "telefone", e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <FormInput
          label="E-mail"
          name={`socio${socioNum}Data.email`}
          value={socioData.email}
          onChange={(e) => handleSocioDataChange(socioNum, "email", e.target.value)}
          placeholder="email@exemplo.com"
          type="email"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormInput
            label="Endereço"
            name={`socio${socioNum}Data.endereco`}
            value={socioData.endereco}
            onChange={(e) => handleSocioDataChange(socioNum, "endereco", e.target.value)}
            placeholder="Rua Exemplo"
            className="md:col-span-2"
          />
          <FormInput
            label="N°"
            name={`socio${socioNum}Data.numero`}
            value={socioData.numero}
            onChange={(e) => handleSocioDataChange(socioNum, "numero", e.target.value)}
            placeholder="123"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Complemento"
            name={`socio${socioNum}Data.complemento`}
            value={socioData.complemento}
            onChange={(e) => handleSocioDataChange(socioNum, "complemento", e.target.value)}
            placeholder="Apto, Sala..."
          />
          <FormInput
            label="Bairro"
            name={`socio${socioNum}Data.bairro`}
            value={socioData.bairro}
            onChange={(e) => handleSocioDataChange(socioNum, "bairro", e.target.value)}
            placeholder="Centro"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormInput
            label="Cidade"
            name={`socio${socioNum}Data.cidade`}
            value={socioData.cidade}
            onChange={(e) => handleSocioDataChange(socioNum, "cidade", e.target.value)}
            placeholder="Nome da cidade"
          />
          <FormInput
            label="UF"
            name={`socio${socioNum}Data.uf`}
            value={socioData.uf}
            onChange={(e) => handleSocioDataChange(socioNum, "uf", e.target.value)}
            placeholder="SP"
          />
          <FormInput
            label="CEP"
            name={`socio${socioNum}Data.cep`}
            value={socioData.cep}
            onChange={(e) => handleSocioDataChange(socioNum, "cep", e.target.value)}
            placeholder="00000-000"
          />
        </div>

        <FormInput
          label="Capital Social (do sócio)"
          name={`socio${socioNum}Data.capitalSocial`}
          value={socioData.capitalSocial}
          onChange={(e) => handleSocioDataChange(socioNum, "capitalSocial", e.target.value)}
          placeholder="R$ 0,00"
        />
      </div>
    );
  };

  const renderCotasAdministracao = () => {
    const isPercentValid = quotaTotals.percentTotal === 100 || quotaTotals.percentTotal === 0;

    return (
      <div className="space-y-8">
        {/* Divisão das Cotas */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground border-b pb-2 mb-4">
            Divisão das Cotas
          </h3>

          <div className="space-y-4">
            {formData.quotas.map((quota, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-3">
                <FormInput
                  label={`Nome ${index + 1}`}
                  name={`quotas[${index}].nome`}
                  value={quota.nome}
                  onChange={(e) => handleQuotaChange(index, "nome", e.target.value)}
                  placeholder="Nome do cotista"
                />
                <FormInput
                  label="Percentual (%)"
                  name={`quotas[${index}].percentual`}
                  value={quota.percentual}
                  onChange={(e) => handleQuotaChange(index, "percentual", e.target.value)}
                  placeholder="0"
                />
                <FormInput
                  label="Valor"
                  name={`quotas[${index}].valor`}
                  value={quota.valor}
                  onChange={(e) => handleQuotaChange(index, "valor", e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
            ))}
          </div>

          {/* Totals Row */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Totais:</span>
              <div className="flex gap-8">
                <span
                  className={`font-semibold ${
                    isPercentValid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quotaTotals.percentTotal}%
                  {!isPercentValid && quotaTotals.percentTotal > 0 && (
                    <span className="text-sm ml-2">
                      (faltam {100 - quotaTotals.percentTotal}%)
                    </span>
                  )}
                </span>
                <span className="font-semibold">
                  {quotaTotals.valueTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Administração da Sociedade */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground border-b pb-2 mb-4">
            Administração da Sociedade
          </h3>

          <div className="space-y-4">
            {formData.administracao.map((admin, index) => (
              <FormInput
                key={index}
                label={`Administrador ${index + 1}`}
                name={`administracao[${index}]`}
                value={admin}
                onChange={(e) => handleAdministracaoChange(index, e.target.value)}
                placeholder="Nome do administrador"
              />
            ))}
          </div>
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-2 pt-4">
          <Checkbox
            id="privacy"
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
          />
          <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
            Declaro que li a{" "}
            <span
              className="text-primary hover:underline cursor-pointer"
              onClick={() => setShowPrivacyDialog(true)}
            >
              POLÍTICA DE PRIVACIDADE
            </span>
            {" "}e estou de acordo.
          </label>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    // Step 1: Basic Info
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <FormInput
            label="Razão Social"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={handleChange}
            placeholder="Nome empresarial completo"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Razão Social Opção 2"
              name="razaoSocialOpcao2"
              value={formData.razaoSocialOpcao2}
              onChange={handleChange}
              placeholder="Opção alternativa 1"
            />
            <FormInput
              label="Razão Social Opção 3"
              name="razaoSocialOpcao3"
              value={formData.razaoSocialOpcao3}
              onChange={handleChange}
              placeholder="Opção alternativa 2"
            />
          </div>

          <FormInput
            label="Nome Fantasia"
            name="nomeFantasia"
            value={formData.nomeFantasia}
            onChange={handleChange}
            placeholder="Nome comercial"
          />
        </div>
      );
    }

    // Step 2: Contact Info
    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <FormInput
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 0000-0000"
              type="tel"
            />
            <FormInput
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              type="tel"
            />
            <FormInput
              label="E-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              type="email"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormInput
              label="Endereço"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Rua Exemplo"
              className="md:col-span-2"
            />
            <FormInput
              label="N°"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="123"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              placeholder="Centro"
            />
            <FormInput
              label="Complemento"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              placeholder="Apto, Sala, etc"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormInput
              label="Cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Nome da cidade"
            />
            <FormInput
              label="UF"
              name="uf"
              value={formData.uf}
              onChange={handleChange}
              placeholder="SP"
            />
            <FormInput
              label="CEP"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="00000-000"
            />
          </div>

          <FormInput
            label="Referência"
            name="referencia"
            value={formData.referencia}
            onChange={handleChange}
            placeholder="Próximo a..."
          />
        </div>
      );
    }

    // Step 3: Company Info
    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Tipo Jurídico</label>
              <Select
                value={formData.tipoJuridico}
                onValueChange={(value) => handleSelectChange("tipoJuridico", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="ei">EI</SelectItem>
                  <SelectItem value="eireli">EIRELI</SelectItem>
                  <SelectItem value="ltda">LTDA</SelectItem>
                  <SelectItem value="sa">S/A</SelectItem>
                  <SelectItem value="slu">SLU</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Porte da Empresa</label>
              <Select
                value={formData.porteEmpresa}
                onValueChange={(value) => handleSelectChange("porteEmpresa", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="me">ME - Microempresa</SelectItem>
                  <SelectItem value="epp">EPP - Empresa de Pequeno Porte</SelectItem>
                  <SelectItem value="medio">Médio Porte</SelectItem>
                  <SelectItem value="grande">Grande Porte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Objetivo Social</label>
            <Textarea
              name="objetivoSocial"
              value={formData.objetivoSocial}
              onChange={handleChange}
              placeholder="Descreva as atividades da empresa..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Regime Tributário</label>
              <Select
                value={formData.regimeTributario}
                onValueChange={(value) => handleSelectChange("regimeTributario", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormInput
              label="Capital Social"
              name="capitalSocial"
              value={formData.capitalSocial}
              onChange={handleChange}
              placeholder="R$ 0,00"
            />
          </div>

          {/* Sócios */}
          <div className="space-y-3 pt-4">
            <label className="text-sm font-medium text-primary">Possui sócios?</label>
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
        </div>
      );
    }

    // Dynamic Socio Steps (4, 5, 6 depending on selection)
    if (currentStep >= 4 && currentStep < getCotasStepNumber()) {
      const socioIndex = currentStep - 4;
      const socioNum = dynamicSteps[socioIndex] as 1 | 2 | 3;
      return renderSocioStep(socioNum);
    }

    // Cotas e Administração Step
    if (currentStep === getCotasStepNumber()) {
      return renderCotasAdministracao();
    }

    return null;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Formulário Enviado!</h1>
          <p className="text-muted-foreground">
            Obrigado por preencher o formulário. Entraremos em contato em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1e293b]">
        <div className="container mx-auto flex items-center px-4 py-4">
          <Link to="/" className="text-white hover:text-white/80">
            Início
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-center text-xl font-semibold text-foreground">
          Preencha o Formulário de Abertura
        </h1>

        {renderStepIndicator()}

        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit}>
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              {isLastStep() ? (
                <Button
                  type="submit"
                  disabled={isSubmitting || !acceptedPrivacy}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Formulário"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold">1. Coleta de Dados</h4>
              <p className="text-muted-foreground">
                Coletamos informações pessoais fornecidas voluntariamente pelo usuário durante o
                preenchimento do formulário, incluindo nome, CPF, endereço, telefone e e-mail.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">2. Uso das Informações</h4>
              <p className="text-muted-foreground">
                As informações coletadas são utilizadas exclusivamente para fins de abertura de
                empresa e cumprimento de obrigações legais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">3. Compartilhamento de Dados</h4>
              <p className="text-muted-foreground">
                Seus dados podem ser compartilhados com órgãos governamentais e parceiros
                autorizados para processos de abertura de empresa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">4. Segurança</h4>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus
                dados contra acesso não autorizado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">5. Direitos do Titular</h4>
              <p className="text-muted-foreground">
                Você tem direito de acessar, corrigir ou solicitar a exclusão de seus dados
                pessoais a qualquer momento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">6. Alterações</h4>
              <p className="text-muted-foreground">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças
                significativas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">7. Contato</h4>
              <p className="text-muted-foreground">
                Para dúvidas sobre esta política, entre em contato conosco através do e-mail:
                privacidade@empresa.com
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                setAcceptedPrivacy(true);
                setShowPrivacyDialog(false);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Aceitar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormularioCliente;

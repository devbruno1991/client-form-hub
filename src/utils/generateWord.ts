import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

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

interface DbFormData {
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

const createFieldParagraph = (label: string, value: string) => {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value || "-" }),
    ],
    spacing: { after: 100 },
  });
};

const formatCurrency = (value: number | undefined): string => {
  if (!value) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const createSocioSection = (socioNum: number, socioData: SocioData | null | undefined): Paragraph[] => {
  if (!socioData) return [];
  
  return [
    new Paragraph({
      text: `Dados do Sócio ${socioNum}`,
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
    createFieldParagraph("Nome Completo", socioData.nome || ""),
    createFieldParagraph("CPF", socioData.cpf || ""),
    createFieldParagraph("RG", socioData.rg || ""),
    createFieldParagraph("Data de Nascimento", socioData.dataNascimento || ""),
    createFieldParagraph("Nacionalidade", socioData.nacionalidade || ""),
    createFieldParagraph("Estado Civil", socioData.estadoCivil || ""),
    createFieldParagraph("Profissão", socioData.profissao || ""),
    createFieldParagraph("Telefone", socioData.telefone || ""),
    createFieldParagraph("E-mail", socioData.email || ""),
    createFieldParagraph("Endereço", `${socioData.endereco || ""}, ${socioData.numero || ""}`),
    createFieldParagraph("Complemento", socioData.complemento || ""),
    createFieldParagraph("Bairro", socioData.bairro || ""),
    createFieldParagraph("Cidade/UF", `${socioData.cidade || ""} - ${socioData.uf || ""}`),
    createFieldParagraph("CEP", socioData.cep || ""),
    createFieldParagraph("Capital Social (Sócio)", socioData.capitalSocial || ""),
  ];
};

const createQuotasSection = (quotas: QuotaData[] | null | undefined): Paragraph[] => {
  if (!quotas || quotas.length === 0) return [];
  
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "Divisão das Cotas",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
  ];
  
  let totalPercent = 0;
  let totalValue = 0;
  
  quotas.forEach((quota, index) => {
    if (quota.nome || quota.percentual || quota.valor) {
      paragraphs.push(
        createFieldParagraph(`Cotista ${index + 1}`, quota.nome || "-"),
        createFieldParagraph(`Percentual ${index + 1}`, quota.percentual ? `${quota.percentual}%` : "-"),
        createFieldParagraph(`Valor ${index + 1}`, formatCurrency(quota.valor)),
      );
      totalPercent += quota.percentual || 0;
      totalValue += quota.valor || 0;
    }
  });
  
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "TOTAL: ", bold: true }),
        new TextRun({ text: `${totalPercent}% - ${formatCurrency(totalValue)}` }),
      ],
      spacing: { before: 200, after: 100 },
    })
  );
  
  return paragraphs;
};

const createAdministracaoSection = (administracao: string[] | null | undefined): Paragraph[] => {
  if (!administracao || administracao.length === 0) return [];
  
  const admins = administracao.filter(a => a && a.trim() !== "");
  if (admins.length === 0) return [];
  
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "Administração da Sociedade",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
  ];
  
  admins.forEach((admin, index) => {
    paragraphs.push(createFieldParagraph(`Administrador ${index + 1}`, admin));
  });
  
  return paragraphs;
};

export const generateWordFromDbData = async (data: DbFormData) => {
  const children: Paragraph[] = [
    new Paragraph({
      text: "Fase de Abertura Inicial",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Formulário de Cadastro Empresarial",
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Data de Preenchimento: ", bold: true }),
        new TextRun({ text: new Date(data.created_at).toLocaleDateString("pt-BR") }),
      ],
      spacing: { after: 300 },
    }),
    new Paragraph({
      text: "Dados da Empresa",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
    createFieldParagraph("Razão Social", data.razao_social),
    createFieldParagraph("Razão Social Opção 2", data.razao_social_opcao2 || ""),
    createFieldParagraph("Razão Social Opção 3", data.razao_social_opcao3 || ""),
    createFieldParagraph("Nome Fantasia", data.nome_fantasia || ""),
    new Paragraph({
      text: "Contato",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
    createFieldParagraph("Telefone", data.telefone || ""),
    createFieldParagraph("Celular", data.celular || ""),
    createFieldParagraph("E-mail", data.email || ""),
    new Paragraph({
      text: "Endereço",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
    createFieldParagraph("Endereço", data.endereco || ""),
    createFieldParagraph("Número", data.numero || ""),
    createFieldParagraph("Logradouro", data.logradouro || ""),
    createFieldParagraph("Complemento", data.complemento || ""),
    createFieldParagraph("Bairro", data.bairro || ""),
    createFieldParagraph("Cidade", data.cidade || ""),
    createFieldParagraph("UF", data.uf || ""),
    createFieldParagraph("CEP", data.cep || ""),
    createFieldParagraph("Referência", data.referencia || ""),
    new Paragraph({
      text: "Informações Jurídicas",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
    createFieldParagraph("Tipo Jurídico", data.tipo_juridico || ""),
    createFieldParagraph("Porte da Empresa", data.porte_empresa || ""),
    createFieldParagraph("Objetivo Social", data.objetivo_social || ""),
    createFieldParagraph("Regime Tributário", data.regime_tributario || ""),
    createFieldParagraph("Capital Social", data.capital_social || ""),
    new Paragraph({
      text: "Sócios",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    }),
    createFieldParagraph("Sócio 1", data.socio1 ? "Sim" : "Não"),
    createFieldParagraph("Sócio 2", data.socio2 ? "Sim" : "Não"),
    createFieldParagraph("Sócio 3", data.socio3 ? "Sim" : "Não"),
  ];

  // Add socio data sections
  if (data.socio1 && data.socio1_data) {
    children.push(...createSocioSection(1, data.socio1_data as SocioData));
  }
  if (data.socio2 && data.socio2_data) {
    children.push(...createSocioSection(2, data.socio2_data as SocioData));
  }
  if (data.socio3 && data.socio3_data) {
    children.push(...createSocioSection(3, data.socio3_data as SocioData));
  }

  // Add quotas section
  children.push(...createQuotasSection(data.quotas as QuotaData[]));

  // Add administracao section
  children.push(...createAdministracaoSection(data.administracao as string[]));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Cadastro_${data.razao_social || "Empresa"}_${new Date().toISOString().split("T")[0]}.docx`;
  saveAs(blob, fileName.replace(/[^a-zA-Z0-9_.-]/g, "_"));
};

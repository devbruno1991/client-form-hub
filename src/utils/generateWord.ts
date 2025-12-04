import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export interface FormData {
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
  created_at: string;
}

export const generateWordFromDbData = async (data: DbFormData) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
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
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Cadastro_${data.razao_social || "Empresa"}_${new Date().toISOString().split("T")[0]}.docx`;
  saveAs(blob, fileName.replace(/[^a-zA-Z0-9_.-]/g, "_"));
};

export const generateWordDocument = async (data: FormData) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
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
              new TextRun({ text: new Date().toLocaleDateString("pt-BR") }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: "Dados da Empresa",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 },
          }),
          createFieldParagraph("Razão Social", data.razaoSocial),
          createFieldParagraph("Razão Social Opção 2", data.razaoSocialOpcao2),
          createFieldParagraph("Razão Social Opção 3", data.razaoSocialOpcao3),
          createFieldParagraph("Nome Fantasia", data.nomeFantasia),
          new Paragraph({
            text: "Contato",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 },
          }),
          createFieldParagraph("Telefone", data.telefone),
          createFieldParagraph("Celular", data.celular),
          createFieldParagraph("E-mail", data.email),
          new Paragraph({
            text: "Endereço",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 },
          }),
          createFieldParagraph("Endereço", data.endereco),
          createFieldParagraph("Número", data.numero),
          createFieldParagraph("Logradouro", data.logradouro),
          createFieldParagraph("Complemento", data.complemento),
          createFieldParagraph("Bairro", data.bairro),
          createFieldParagraph("Cidade", data.cidade),
          createFieldParagraph("UF", data.uf),
          createFieldParagraph("CEP", data.cep),
          createFieldParagraph("Referência", data.referencia),
          new Paragraph({
            text: "Informações Jurídicas",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 },
          }),
          createFieldParagraph("Tipo Jurídico", data.tipoJuridico),
          createFieldParagraph("Porte da Empresa", data.porteEmpresa),
          createFieldParagraph("Objetivo Social", data.objetivoSocial),
          createFieldParagraph("Regime Tributário", data.regimeTributario),
          createFieldParagraph("Capital Social", data.capitalSocial),
          new Paragraph({
            text: "Sócios",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 },
          }),
          createFieldParagraph("Sócio 1", data.socio1 === "sim" ? "Sim" : "Não"),
          createFieldParagraph("Sócio 2", data.socio2 === "sim" ? "Sim" : "Não"),
          createFieldParagraph("Sócio 3", data.socio3 === "sim" ? "Sim" : "Não"),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Cadastro_${data.razaoSocial || "Empresa"}_${new Date().toISOString().split("T")[0]}.docx`;
  saveAs(blob, fileName.replace(/[^a-zA-Z0-9_.-]/g, "_"));
};

const createFieldParagraph = (label: string, value: string) => {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value || "-" }),
    ],
    spacing: { after: 100 },
  });
};
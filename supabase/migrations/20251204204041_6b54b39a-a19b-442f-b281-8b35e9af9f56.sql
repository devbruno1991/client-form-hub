-- Create table for client form submissions
CREATE TABLE public.client_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razao_social TEXT NOT NULL,
  razao_social_opcao2 TEXT,
  razao_social_opcao3 TEXT,
  nome_fantasia TEXT,
  telefone TEXT,
  celular TEXT,
  email TEXT,
  endereco TEXT,
  numero TEXT,
  logradouro TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  cep TEXT,
  referencia TEXT,
  tipo_juridico TEXT,
  porte_empresa TEXT,
  objetivo_social TEXT,
  regime_tributario TEXT,
  capital_social TEXT,
  socio1 BOOLEAN DEFAULT false,
  socio2 BOOLEAN DEFAULT false,
  socio3 BOOLEAN DEFAULT false,
  aceita_privacidade BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_forms ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (clients don't need to be logged in)
CREATE POLICY "Allow public insert" 
ON public.client_forms 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can view forms
CREATE POLICY "Admins can view all forms" 
ON public.client_forms 
FOR SELECT 
TO authenticated
USING (true);
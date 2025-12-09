-- Add new columns for quotas, administration, and socio data
ALTER TABLE public.client_forms 
ADD COLUMN IF NOT EXISTS quotas jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS administracao jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS socio1_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS socio2_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS socio3_data jsonb DEFAULT '{}'::jsonb;
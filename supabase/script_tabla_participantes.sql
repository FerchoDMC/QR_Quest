-- ==============================================================================
-- SCRIPT OFICIAL: CREACIÓN DE TABLA Y CAMPOS EN SUPABASE
-- Proyecto: El Desafío Mágico de TI (Feria de TI · UIDE Sede Loja)
-- ==============================================================================
-- INSTRUCCIONES:
-- 1. Inicia sesión en tu consola de Supabase: https://supabase.com/dashboard
-- 2. Selecciona tu proyecto ("tgmqfdmvnqndmmpowbmz" o el correspondiente).
-- 3. Dirígete a la sección "SQL Editor" en el menú izquierdo.
-- 4. Pega este contenido y presiona "Run" (Ejecutar).
-- 
-- NOTA: Este script es idempotente (usa IF NOT EXISTS). No causará errores si
-- la tabla ya existía previamente.
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs si no estuviese activa
create extension if not exists "pgcrypto";

-- 2. Crear tabla de participantes de la feria
create table if not exists public.participantes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(trim(nombre)) >= 2 and char_length(nombre) <= 60),
  puntuacion integer not null default 0 check (puntuacion >= 0 and puntuacion <= 500),
  codigo_verificacion text,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- 3. Índices para optimización de consultas en el stand
-- Permite validar al instante el código que el estudiante muestra en el stand
create index if not exists idx_participantes_codigo 
  on public.participantes (codigo_verificacion) 
  where codigo_verificacion is not null;

-- Permite ordenar cronológicamente las partidas recibidas
create index if not exists idx_participantes_fecha 
  on public.participantes (created_at desc);

-- 4. Habilitar Seguridad a Nivel de Fila (Row Level Security - RLS)
alter table public.participantes enable row level security;

-- 5. Políticas de acceso (RLS)
-- Política A: Permitir que los dispositivos móviles (rol anon) guarden su partida terminada
drop policy if exists "Permitir insercion anonima" on public.participantes;
create policy "Permitir insercion anonima"
  on public.participantes
  for insert
  to anon, authenticated
  with check (true);

-- Política B: Permitir consultar partidas y códigos de canje (para verificación de stickers)
drop policy if exists "Permitir lectura publica" on public.participantes;
create policy "Permitir lectura publica"
  on public.participantes
  for select
  to anon, authenticated
  using (true);

-- 6. Comentarios descriptivos para el panel de Supabase
comment on table public.participantes is 'Registro simplificado de partidas y puntuaciones del Desafío Mágico de TI para entrega de stickers';
comment on column public.participantes.id is 'Identificador único de la partida o sesión';
comment on column public.participantes.nombre is 'Nombre del estudiante participante registrado en el Gran Libro';
comment on column public.participantes.puntuacion is 'Puntaje total obtenido sobre 500 puntos (umbral sticker >= 350)';
comment on column public.participantes.codigo_verificacion is 'Código único generado (ej: TI-AB12CD) para canje presencial';
comment on column public.participantes.created_at is 'Marca temporal UTC de registro de la partida';

-- ==============================================================================
-- CONSULTA RÁPIDA DE COMPROBACIÓN PARA EL STAFF (Ejemplo de uso):
-- SELECT id, nombre, puntuacion, codigo_verificacion, created_at 
-- FROM public.participantes 
-- WHERE codigo_verificacion = 'TI-XXXXXX';
-- ==============================================================================

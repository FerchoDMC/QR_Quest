-- ==============================================================================
-- TABLA SIMPLIFICADA DE REGISTRO DE PARTIDAS · FERIA DE TI (UIDE SEDE LOJA)
-- ==============================================================================
-- Solo almacena los 4 campos esenciales solicitados:
-- 1. id: Identificador único de la partida (UUID automático o generado)
-- 2. nombre: Nombre completo del participante
-- 3. puntuacion: Puntuación final obtenida (0 a 500)
-- 4. codigo_verificacion: Código único para reclamar sticker/premio (ej. TI-ABC123)
-- (Incluye created_at para orden cronológico de la feria)
-- ==============================================================================

create table if not exists public.participantes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  puntuacion integer not null default 0,
  codigo_verificacion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.participantes enable row level security;

-- Permitir a cualquier visitante (anon) registrar su partida al terminar el juego
create policy "Permitir insercion anonima"
  on public.participantes
  for insert
  to anon, authenticated
  with check (true);

-- Permitir consultar las partidas (para validar códigos de premio o ver ranking)
create policy "Permitir lectura publica"
  on public.participantes
  for select
  to anon, authenticated
  using (true);

-- Comentario descriptivo en la tabla
comment on table public.participantes is 'Registro simplificado de participantes y puntuaciones del Desafío Mágico de TI';

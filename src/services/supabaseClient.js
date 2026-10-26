/**
 * Cliente de conexión directa y ligera a Supabase
 * Almacena los 4 campos solicitados: id, nombre, puntuacion y codigo_verificacion
 * Utiliza fetch nativo (0 dependencias adicionales) con tolerancia a fallos offline.
 */

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://tgmqfdmvnqndmmpowbmz.supabase.co';
const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || 'sb_publishable_P0YQnOc36zM3zPOjzrg6cA_OmTbM5ke';

/**
 * Guarda una nueva partida en Supabase con los 4 campos
 * @param {Object} data - { id?, nombre, puntuacion, codigo_verificacion }
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function guardarParticipante({ id, nombre, puntuacion, codigo_verificacion }) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[Supabase] Variables de entorno no configuradas. Se mantendrá registro local.');
    return { success: false, error: 'Credenciales de Supabase no configuradas' };
  }

  const payload = {
    nombre: (nombre || 'Aspirante Mágico').trim(),
    puntuacion: typeof puntuacion === 'number' ? puntuacion : 0,
    codigo_verificacion: codigo_verificacion || null
  };

  // Si se provee un UUID válido se envía, sino Supabase genera gen_random_uuid()
  if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    payload.id = id;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/participantes`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('[Supabase] Error al insertar en la tabla participantes:', response.status, errText);
      return { success: false, error: errText };
    }

    const result = await response.json();
    return { success: true, data: result[0] || result };
  } catch (networkError) {
    console.warn('[Supabase] Error de red o sin conexión (la partida se guardó localmente):', networkError.message);
    return { success: false, error: networkError.message, isOffline: true };
  }
}

/**
 * Valida o consulta un participante por su código de verificación
 * @param {string} codigo - ej: "TI-ABC123"
 */
export async function consultarPorCodigo(codigo) {
  if (!codigo) return { success: false, error: 'Código requerido' };

  try {
    const encoded = encodeURIComponent(codigo.trim().toUpperCase());
    const response = await fetch(`${SUPABASE_URL}/rest/v1/participantes?codigo_verificacion=eq.${encoded}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return { success: false, error: 'Error al consultar código' };
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return { success: true, participante: data[0] };
    }
    return { success: false, notFound: true, message: 'Código no encontrado' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene el listado de participantes para el panel administrativo
 * @param {number} limit - Límite de registros a consultar (default: 200)
 */
export async function obtenerTodosParticipantes(limit = 200) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { success: false, error: 'Credenciales de Supabase no configuradas', participantes: [] };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/participantes?select=*&order=created_at.desc&limit=${limit}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: errText, participantes: [] };
    }

    const data = await response.json();
    return { success: true, participantes: data || [] };
  } catch (error) {
    return { success: false, error: error.message, participantes: [] };
  }
}


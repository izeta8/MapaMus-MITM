'use server';

import { supabaseServer } from './supabaseServer';
import { Tournament } from '@/types';

/**
 * Limpia un objeto convirtiendo strings vacíos en null recursivamente.
 */
function cleanObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (value === '') return [key, null];
        if (typeof value === 'object') return [key, cleanObject(value)];
        return [key, value];
      })
    );
  }
  return obj;
}

/**
 * Server Action para actualizar un torneo usando la Service Role Key (master key)
 * Saltándose todas las políticas de RLS de Supabase.
 */
export async function updateTournament(data: Tournament) {
  try {
    const { id, created_at, ...updateData } = data;
    const cleanedData = cleanObject(updateData);

    const { error } = await supabaseServer
      .from('tournaments')
      .update(cleanedData)
      .eq('id', id);

    if (error) {
      console.error('Error de Supabase en Servidor:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error inesperado en Servidor:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteTournament(id: string) {
  try {
    const { error } = await supabaseServer
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error de Supabase en Servidor:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error inesperado en Servidor:', err);
    return { success: false, error: err.message };
  }
}

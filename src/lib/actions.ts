'use server';

import { supabaseServer } from './supabaseServer';
import { Tournament } from '@/types';

/**
 * Server Action para actualizar un torneo usando la Service Role Key (master key)
 * Saltándose todas las políticas de RLS de Supabase.
 */
export async function updateTournament(data: Tournament) {
  try {
    const { id, created_at, ...updateData } = data;

    const { error } = await supabaseServer
      .from('tournaments')
      .update(updateData)
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

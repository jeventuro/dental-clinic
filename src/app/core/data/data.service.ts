// src/app/core/data/data.service.ts actualizado
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';

// ============================================================
// MODELOS (Interfaces)
// ============================================================
export interface Usuario {
  id: string;
  email: string;
  nombre_completo: string;
  telefono?: string;
  rol: 'admin' | 'doctor' | 'cliente';
  dni?: string;
  avatar_url?: string;
  sede_id?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Paciente {
  id: string;
  usuario_id: string;
  fecha_nacimiento?: string;
  dni?: string;
  sexo?: 'M' | 'F' | 'Otro';
  historial_medico?: string;
  created_at: string;
  usuarios?: Usuario;
}

export interface Doctor {
  id: string;
  usuario_id: string;
  especialidad?: string;
  horario?: string;
  sede_id?: string;
  created_at: string;
  usuarios?: Usuario;
}

export interface Cita {
  id: string;
  paciente_id: string;
  doctor_id: string;
  sede_id?: string;
  fecha: string;
  hora: string;
  duracion: number;
  tratamiento?: string;
  estado: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  notas?: string;
  created_at: string;
  updated_at: string;
  pacientes?: Paciente;
  doctores?: Doctor;
  sede?: Sede;
}

export interface TratamientoCatalogo {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion: number;
  especialidad?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PacienteTratamiento {
  id: string;
  paciente_id: string;
  tratamiento_id: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  progreso: number;
  estado: 'activo' | 'completado' | 'cancelado';
  notas?: string;
  created_at: string;
  updated_at: string;
  tratamiento?: TratamientoCatalogo;
}

export interface Pago {
  id: string;
  paciente_id: string;
  cita_id?: string;
  monto: number;
  metodo: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  estado: 'pendiente' | 'pagado' | 'cancelado';
  descripcion?: string;
  fecha_vencimiento?: string;
  fecha_pago?: string;
  created_at: string;
}

export interface Factura {
  id: string;
  paciente_id: string;
  numero_factura: string;
  monto_total: number;
  monto_pagado: number;
  estado: 'emitida' | 'pagada' | 'anulada';
  fecha_emision: string;
  fecha_vencimiento?: string;
  created_at: string;
}

export interface Notificacion {
  id: string;
  usuario_id: string;
  titulo: string;
  mensaje?: string;
  tipo: 'info' | 'exito' | 'advertencia' | 'error';
  leido: boolean;
  enlace?: string;
  created_at: string;
}

export interface Sede {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  // ==========================================================
  // 🔐 AUTH - Métodos de autenticación
  // ==========================================================
  async signUp(email: string, password: string, metadata: any) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: { 
        data: metadata,
        emailRedirectTo: window.location.origin + '/login', 
      },
    });
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    const { data } = await this.supabase.auth.getUser();
    return data?.user;
  }



  // ==========================================================
  // 👤 PERFIL DE USUARIO (con creación automática si no existe)
  // ==========================================================
  async getCurrentUserProfile(): Promise<(Usuario & { sede_nombre?: string }) | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data: perfil, error} = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    console.log('Perfil obtenido:', perfil, 'Error:', error);
      
    if (!perfil) {
      console.error(
          'Perfil no encontrado para:',
          user.id
      );
      return null;
    }

    let sedeNombre: string | undefined;
    if (perfil.sede_id) {
      const { data: sede } = await this.supabase
        .from('sedes')
        .select('nombre')
        .eq('id', perfil.sede_id)
        .maybeSingle();
      sedeNombre = sede?.nombre;
    }
    // 3. Extraer nombre de la sede
    return {
      ...perfil,
      sede_nombre: sedeNombre,
    };
  }

  // ==========================================================
  // 👤 USUARIOS (CRUD)
  // ==========================================================
  async getUsuarios() {
    return this.supabase.from('usuarios').select('*');
  }

  async getUsuarioById(id: string) {
    return this.supabase.from('usuarios').select('*').eq('id', id).single();
  }

  async updateUsuario(id: string, updates: Partial<Usuario>) {
    return this.supabase.from('usuarios').update(updates).eq('id', id);
  }

  async deleteUsuario(id: string) {
    return this.supabase.from('usuarios').delete().eq('id', id);
  }

  // ==========================================================
  // 🏢 SEDES (CRUD)
  // ==========================================================
  async getSedes() {
    return this.supabase.from('sedes').select('*').order('nombre');
  }

  async getSedeById(id: string) {
    return this.supabase.from('sedes').select('*').eq('id', id).single();
  }

  async createSede(data: Omit<Sede, 'id' | 'created_at'>) {
    return this.supabase.from('sedes').insert(data);
  }

  async updateSede(id: string, updates: Partial<Sede>) {
    return this.supabase.from('sedes').update(updates).eq('id', id);
  }

  async deleteSede(id: string) {
    return this.supabase.from('sedes').delete().eq('id', id);
  }

  // ==========================================================
  // 👨‍⚕️ PACIENTES (CRUD) con soporte de paginación
  // ==========================================================
  async getPacientes(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return this.supabase
      .from('pacientes')
      .select('*, usuarios(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
  }

  async getPacienteById(id: string) {
    return this.supabase
      .from('pacientes')
      .select('*, usuarios(*)')
      .eq('id', id)
      .single();
  }

  async createPaciente(data: Omit<Paciente, 'id' | 'created_at'>) {
    return this.supabase.from('pacientes').insert(data);
  }

  async updatePaciente(id: string, updates: Partial<Paciente>) {
    return this.supabase.from('pacientes').update(updates).eq('id', id);
  }

  async deletePaciente(id: string) {
    return this.supabase.from('pacientes').delete().eq('id', id);
  }

  async getPacienteByUsuarioId(usuarioId: string) {
    return this.supabase
      .from('pacientes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .maybeSingle();
  }

  // ==========================================================
  // 🩺 DOCTORES (CRUD)
  // ==========================================================
  async getDoctores() {
    return this.supabase
      .from('doctores')
      .select('*, usuarios(*)')
      .order('created_at', { ascending: false });
  }

  async getDoctorById(id: string) {
    return this.supabase
      .from('doctores')
      .select('*, usuarios(*)')
      .eq('id', id)
      .single();
  }

  async createDoctor(data: Omit<Doctor, 'id' | 'created_at'>) {
    return this.supabase.from('doctores').insert(data);
  }

  async updateDoctor(id: string, updates: Partial<Doctor>) {
    return this.supabase.from('doctores').update(updates).eq('id', id);
  }

  async deleteDoctor(id: string) {
    return this.supabase.from('doctores').delete().eq('id', id);
  }

  // ==========================================================
  // 📅 CITAS (CRUD) con filtros avanzados
  // ==========================================================
  async getCitas(filtros?: { paciente_id?: string; doctor_id?: string; fecha?: string }) {
    let query = this.supabase
      .from('citas')
      .select('*, pacientes(*), doctores(*, usuarios(*)), sedes(*)')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (filtros?.paciente_id) {
      query = query.eq('paciente_id', filtros.paciente_id);
    }
    if (filtros?.doctor_id) {
      query = query.eq('doctor_id', filtros.doctor_id);
    }
    if (filtros?.fecha) {
      query = query.eq('fecha', filtros.fecha);
    }

    return query;
  }

  async getProximaCita(pacienteId: string): Promise<Cita | null> {
  const hoy = new Date().toISOString().split('T')[0];
  const { data, error } = await this.supabase
    .from('citas')
    .select('*, pacientes(*), doctores(*, usuarios(*)), sedes(*)')
    .eq('paciente_id', pacienteId)
    .gte('fecha', hoy)  // solo citas desde hoy en adelante
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error al obtener próxima cita:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
}

  async getCitasByPaciente(pacienteId: string) {
    return this.getCitas({ paciente_id: pacienteId });
  }

  async getCitaById(id: string) {
    return this.supabase
      .from('citas')
      .select('*, pacientes(*), doctores(*, usuarios(*)), sedes(*)')
      .eq('id', id)
      .single();
  }

  async createCita(data: Omit<Cita, 'id' | 'created_at' | 'updated_at'>) {
    return this.supabase.from('citas').insert(data);
  }

  async updateCita(id: string, updates: Partial<Cita>) {
    return this.supabase
      .from('citas')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
  }

  async deleteCita(id: string) {
    return this.supabase.from('citas').delete().eq('id', id);
  }

  // ==========================================================
  // 💊 TRATAMIENTOS (CRUD)
  // ==========================================================
  async getTratamientos(activos?: boolean): Promise<TratamientoCatalogo[]> {
    let query = this.supabase
      .from('tratamientos')
      .select('*')
      .order('nombre', { ascending: true });

    if (activos !== undefined) {
      query = query.eq('activo', activos);
    }

    const { data, error } = await query;
    if (error) {
      console.error('❌ Error al obtener tratamientos:', error);
      return [];
    }
    return data || [];
  }

async getTratamientoById(id: string): Promise<TratamientoCatalogo | null> {
    const { data, error } = await this.supabase
      .from('tratamientos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error al obtener tratamiento:', error);
      return null;
    }
    return data;
  }

  async createTratamiento(data: Omit<TratamientoCatalogo, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await this.supabase
      .from('tratamientos')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al crear tratamiento:', error);
      throw error;
    }
    return result;
  }

  async updateTratamiento(id: string, updates: Partial<TratamientoCatalogo>) {
    const { data, error } = await this.supabase
      .from('tratamientos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al actualizar tratamiento:', error);
      throw error;
    }
    return data;
  }

  async deleteTratamiento(id: string) {
    const { error } = await this.supabase
      .from('tratamientos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error al eliminar tratamiento:', error);
      throw error;
    }
    return true;
  }

  /**
   * ahora FUNCIONES para pacientes con tratamientos 
   */

  async getPacienteTratamientos(pacienteId: string) {
    const { data, error } = await this.supabase
      .from('paciente_tratamientos')
      .select('*, tratamiento:tratamiento_id(*)')
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener tratamientos del paciente:', error);
      return [];
    }
    return data || [];
  }
  
  async getTratamientoActivoPaciente(pacienteId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('paciente_tratamientos')
      .select('*, tratamiento:tratamiento_id(*)')
      .eq('paciente_id', pacienteId)
      .eq('estado', 'activo')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error al obtener tratamiento activo del paciente:', error);
      return null;
    }
    return data && data.length > 0 ? data[0] : null;
  }


  async createPacienteTratamiento(data: Omit<PacienteTratamiento, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await this.supabase
      .from('paciente_tratamientos')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al asignar tratamiento al paciente:', error);
      throw error;
    }
    return result;
  }

  async updatePacienteTratamiento(id: string, updates: Partial<PacienteTratamiento>) {
    const { data, error } = await this.supabase
      .from('paciente_tratamientos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al actualizar tratamiento del paciente:', error);
      throw error;
    }
    return data;
  }

  async deletePacienteTratamiento(id: string) {
    const { error } = await this.supabase
      .from('paciente_tratamientos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error al eliminar asignación de tratamiento:', error);
      throw error;
    }
    return true;
  }

  // ==========================================================
  // 💰 PAGOS (CRUD)
  // ==========================================================
  
  async getResumenCuenta(pacienteId: string): Promise<{ balance: number; totalPaid: number }> {
    const { data: pagos, error: errorPagos } = await this.supabase
      .from('pagos')
      .select('monto')
      .eq('paciente_id', pacienteId)
      .eq('estado', 'pagado');

    if (errorPagos) {
      console.error('Error al obtener pagos:', errorPagos);
      return { balance: 0, totalPaid: 0 };
    }

    const totalPagado = pagos?.reduce((sum, p) => sum + p.monto, 0) || 0;

    // 2. Obtener total facturado (facturas emitidas)
    const { data: facturas, error: errorFacturas } = await this.supabase
      .from('facturacion')
      .select('monto_total')
      .eq('paciente_id', pacienteId)
      .in('estado', ['emitida', 'pagada']);

    if (errorFacturas) {
      console.error('Error al obtener facturas:', errorFacturas);
      return { balance: 0, totalPaid: totalPagado };
    }

    const totalFacturado = facturas?.reduce((sum, f) => sum + f.monto_total, 0) || 0;
    const balance = Math.max(0, totalFacturado - totalPagado);

    return {
      balance,
      totalPaid: totalPagado,
    };
  }
  
  async getPagos() {
    return this.supabase
      .from('pagos')
      .select('*, pacientes(*)')
      .order('created_at', { ascending: false });
  }

  async getPagosByPaciente(pacienteId: string) {
    return this.supabase
      .from('pagos')
      .select('*, pacientes(*)')
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false });
  }

  async getPagoById(id: string) {
    return this.supabase
      .from('pagos')
      .select('*, pacientes(*)')
      .eq('id', id)
      .single();
  }

  async createPago(data: Omit<Pago, 'id' | 'created_at'>) {
    return this.supabase.from('pagos').insert(data);
  }

  async updatePago(id: string, updates: Partial<Pago>) {
    return this.supabase.from('pagos').update(updates).eq('id', id);
  }

  async deletePago(id: string) {
    return this.supabase.from('pagos').delete().eq('id', id);
  }

  // ==========================================================
  // 📄 FACTURACION (CRUD)
  // ==========================================================
  async getFacturas() {
    return this.supabase
      .from('facturacion')
      .select('*, pacientes(*)')
      .order('created_at', { ascending: false });
  }

  async getFacturasByPaciente(pacienteId: string) {
    return this.supabase
      .from('facturacion')
      .select('*, pacientes(*)')
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false });
  }

  async getFacturaById(id: string) {
    return this.supabase
      .from('facturacion')
      .select('*, pacientes(*)')
      .eq('id', id)
      .single();
  }

  async createFactura(data: Omit<Factura, 'id' | 'created_at'>) {
    return this.supabase.from('facturacion').insert(data);
  }

  async updateFactura(id: string, updates: Partial<Factura>) {
    return this.supabase.from('facturacion').update(updates).eq('id', id);
  }

  async deleteFactura(id: string) {
    return this.supabase.from('facturacion').delete().eq('id', id);
  }

  // ==========================================================
  // 🔔 NOTIFICACIONES (CRUD)
  // ==========================================================
  async getNotificaciones(usuarioId: string) {
    return this.supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });
  }

  async getNotificacionById(id: string) {
    return this.supabase
      .from('notificaciones')
      .select('*')
      .eq('id', id)
      .single();
  }

  async createNotificacion(data: Omit<Notificacion, 'id' | 'created_at'>) {
    return this.supabase.from('notificaciones').insert(data);
  }

  async updateNotificacion(id: string, updates: Partial<Notificacion>) {
    return this.supabase.from('notificaciones').update(updates).eq('id', id);
  }

  async marcarNotificacionLeida(id: string) {
    return this.supabase
      .from('notificaciones')
      .update({ leido: true })
      .eq('id', id);
  }

  async deleteNotificacion(id: string) {
    return this.supabase.from('notificaciones').delete().eq('id', id);
  }

  async getActividadReciente(usuarioId: string, limit: number = 5): Promise<any[]> {
 
    const { data: notificaciones, error: errorNotif } = await this.supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (errorNotif) {
      console.error('Error al obtener notificaciones:', errorNotif);
      return [];
    }

    const { data: paciente } = await this.supabase
      .from('pacientes')
      .select('id')
      .eq('usuario_id', usuarioId)
      .single();

    let citasRecientes: any[] = [];
    if (paciente) {
      const { data: citas, error: errorCitas } = await this.supabase
        .from('citas')
        .select('*, doctores(*, usuarios(*))')
        .eq('paciente_id', paciente.id)
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false })
        .limit(limit);

      if (!errorCitas && citas) {
        citasRecientes = citas.map(c => ({
          id: c.id,
          titulo: `Cita ${c.estado}`,
          descripcion: `${c.tratamiento || 'Consulta'} con ${c.doctores?.usuarios?.nombre_completo || 'Doctor'}`,
          fecha: new Date(`${c.fecha}T${c.hora}`).toLocaleString(),
          tipo: 'cita',
          leido: true,
        }));
      }
    }

    const notificacionesFormateadas = notificaciones.map(n => ({
      id: n.id,
      titulo: n.titulo,
      descripcion: n.mensaje || '',
      fecha: new Date(n.created_at).toLocaleString(),
      tipo: n.tipo,
      leido: n.leido,
    }));

    const combinadas = [...notificacionesFormateadas, ...citasRecientes];
    combinadas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return combinadas.slice(0, limit);
  }

  // ==========================================================
  // 📊 ESTADÍSTICAS DEL DASHBOARD (optimizadas)
  // ==========================================================
  async getDashboardStats() {
    const hoy = new Date().toISOString().split('T')[0];
    const [
      { count: totalPacientes },
      { count: citasHoy },
      { data: pagosMes },
    ] = await Promise.all([
      this.supabase.from('pacientes').select('*', { count: 'exact', head: true }),
      this.supabase.from('citas').select('*', { count: 'exact', head: true })
        .eq('fecha', hoy),
      this.supabase.from('pagos').select('monto')
        .eq('estado', 'pagado'),
    ]);

    const ingresosMes = pagosMes?.reduce((sum, p) => sum + p.monto, 0) || 0;

    return {
      totalPacientes: totalPacientes || 0,
      citasHoy: citasHoy || 0,
      ingresosMes,
    };
  }
}
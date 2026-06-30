// src/app/features/branches/branches.page.ts
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  addCircleOutline,
  createOutline,
  trashOutline,
  refreshOutline,
  searchOutline,
  locationOutline,
  callOutline,
} from 'ionicons/icons';
import { DataService, Sede } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.page.html',
  styleUrls: ['./branches.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchesPage implements OnInit {
  sedes: Sede[] = [];
  sedesFiltradas: Sede[] = [];
  isLoading = false;
  searchTerm = '';
  isAdmin = false;

  // Formulario
  showForm = false;
  formData = {
    id: '',
    nombre: '',
    direccion: '',
    telefono: '',
  };
  isEditing = false;
  isSubmitting = false;

  // Caché
  private cacheSedes: Sede[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef
  ) {
    addIcons({
      businessOutline,
      addCircleOutline,
      createOutline,
      trashOutline,
      refreshOutline,
      searchOutline,
      locationOutline,
      callOutline,
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
    await this.cargarSedes();
  }

  // ============================================================
  // CACHE Y CARGA DE DATOS
  // ============================================================

  private isCacheValid(): boolean {
    return this.cacheSedes !== null && (Date.now() - this.cacheTimestamp) < this.CACHE_TTL;
  }

  async cargarSedes(forceRefresh: boolean = false) {
    // Si el caché es válido y no se fuerza refresco, usar caché
    if (!forceRefresh && this.isCacheValid()) {
      this.sedes = this.cacheSedes!;
      this.aplicarFiltros();
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    try {
      const { data, error } = await this.dataService.getSedes();
      if (error) throw error;

      this.sedes = data || [];
      this.cacheSedes = this.sedes;
      this.cacheTimestamp = Date.now();
      this.aplicarFiltros();
    } catch (error) {
      console.error('Error al cargar sedes:', error);
      await this.mostrarToast('Error al cargar sedes', 'danger');
      
      // Si hay caché previa, usarla como fallback
      if (this.cacheSedes) {
        this.sedes = this.cacheSedes;
        this.aplicarFiltros();
      } else {
        this.sedes = [];
        this.sedesFiltradas = [];
      }
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  // ============================================================
  // FILTROS Y BÚSQUEDA
  // ============================================================

  aplicarFiltros() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.sedesFiltradas = [...this.sedes];
    } else {
      this.sedesFiltradas = this.sedes.filter(s =>
        s.nombre.toLowerCase().includes(term) ||
        s.direccion?.toLowerCase().includes(term) ||
        s.telefono?.includes(term)
      );
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail?.value || '';
    this.aplicarFiltros();
    this.cd.detectChanges();
  }

  // ============================================================
  // TRACK BY PARA OPTIMIZACIÓN DE RENDERIZADO
  // ============================================================

  trackBySedeId(index: number, sede: Sede): string {
    return sede.id;
  }

  // ============================================================
  // FORMULARIO
  // ============================================================

  nuevaSede() {
    this.showForm = true;
    this.isEditing = false;
    this.formData = { id: '', nombre: '', direccion: '', telefono: '' };
    setTimeout(() => {
      document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  editarSede(sede: Sede) {
    this.showForm = true;
    this.isEditing = true;
    this.formData = {
      id: sede.id,
      nombre: sede.nombre,
      direccion: sede.direccion || '',
      telefono: sede.telefono || '',
    };
    setTimeout(() => {
      document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  cancelarFormulario() {
    this.showForm = false;
    this.isEditing = false;
    this.formData = { id: '', nombre: '', direccion: '', telefono: '' };
  }

  async guardarSede() {
    if (!this.formData.nombre.trim()) {
      await this.mostrarToast('El nombre de la sede es obligatorio', 'warning');
      return;
    }

    this.isSubmitting = true;
    try {
      if (this.isEditing && this.formData.id) {
        await this.dataService.updateSede(this.formData.id, {
          nombre: this.formData.nombre,
          direccion: this.formData.direccion,
          telefono: this.formData.telefono,
        });
        await this.mostrarToast('Sede actualizada correctamente', 'success');
      } else {
        await this.dataService.createSede({
          nombre: this.formData.nombre,
          direccion: this.formData.direccion,
          telefono: this.formData.telefono,
        });
        await this.mostrarToast('Sede creada correctamente', 'success');
      }
      this.cancelarFormulario();
      await this.cargarSedes(true);
    } catch (error) {
      console.error('Error al guardar sede:', error);
      await this.mostrarToast('Error al guardar sede', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  // ============================================================
  // ELIMINACIÓN
  // ============================================================

  async eliminarSede(sede: Sede) {
    if (!this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar sede',
      message: `¿Estás seguro de eliminar "${sede.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.dataService.deleteSede(sede.id);
              await this.mostrarToast('Sede eliminada correctamente', 'success');
              await this.cargarSedes(true);
            } catch (error) {
              await this.mostrarToast('Error al eliminar sede', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ============================================================
  // UTILIDADES
  // ============================================================

  async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000, // ✅ Aumentado a 3 segundos
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
// src/app/features/tratamientos/treatment-list/treatment-list.page.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  medicalOutline,
  addCircleOutline,
  createOutline,
  trashOutline,
  refreshOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  searchOutline
} from 'ionicons/icons';
import { DataService, TratamientoCatalogo } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.page.html',
  styleUrls: ['./treatment-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentListPage implements OnInit {
  tratamientos: TratamientoCatalogo[] = [];
  tratamientosFiltrados: TratamientoCatalogo[] = [];
  isLoading = true;
  isAdmin = false;
  searchTerm = '';
  filtroActivos: 'todos' | 'activos' | 'inactivos' = 'todos';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef
  ) {
    addIcons({
      medicalOutline,
      addCircleOutline,
      createOutline,
      trashOutline,
      refreshOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      searchOutline
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
    await this.cargarTratamientos();
  }

  async cargarTratamientos() {
    this.isLoading = true;
    try {
      const data = await this.dataService.getTratamientos();
      this.tratamientos = data;
      this.aplicarFiltros();
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error al cargar tratamientos:', error);
      await this.mostrarToast('Error al cargar tratamientos', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  aplicarFiltros() {
    let filtrados = [...this.tratamientos];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(t =>
        t.nombre.toLowerCase().includes(term) ||
        (t.especialidad?.toLowerCase().includes(term) || '')
      );
    }

    if (this.filtroActivos === 'activos') {
      filtrados = filtrados.filter(t => t.activo);
    } else if (this.filtroActivos === 'inactivos') {
      filtrados = filtrados.filter(t => !t.activo);
    }

    this.tratamientosFiltrados = filtrados;
  }

  cambiarFiltroActivos(filtro: 'todos' | 'activos' | 'inactivos') {
    this.filtroActivos = filtro;
    this.aplicarFiltros();
    this.cd.detectChanges();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail?.value || '';
    this.aplicarFiltros();
    this.cd.detectChanges();
  }

  nuevoTratamiento() {
    this.router.navigate(['/admin/treatments/new']);
  }

  editarTratamiento(id: string) {
    this.router.navigate([`/admin/treatments/edit/${id}`]);
  }

  async toggleActivo(tratamiento: TratamientoCatalogo) {
    if (!this.isAdmin) return;
    const nuevoEstado = !tratamiento.activo;
    const { error } = await this.dataService.updateTratamiento(tratamiento.id, { activo: nuevoEstado });
    if (error) {
      await this.mostrarToast('Error al actualizar estado', 'danger');
      return;
    }
    await this.mostrarToast(
      `Tratamiento ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
      'success'
    );
    await this.cargarTratamientos();
  }

  async eliminarTratamiento(tratamiento: TratamientoCatalogo) {
    if (!this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar tratamiento',
      message: `¿Estás seguro de eliminar "${tratamiento.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.dataService.deleteTratamiento(tratamiento.id);
              await this.mostrarToast('Tratamiento eliminado correctamente', 'success');
              await this.cargarTratamientos();
            } catch (error) {
              await this.mostrarToast('Error al eliminar tratamiento', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
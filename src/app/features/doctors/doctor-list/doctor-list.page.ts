// src/app/features/doctors/doctor-list/doctor-list.page.ts
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  medicalOutline,
  addCircleOutline,
  createOutline,
  trashOutline,
  refreshOutline,
  searchOutline,
  personOutline,
  mailOutline,
  callOutline,
  businessOutline,
  chevronForwardOutline,
  timeOutline,
  eyeOutline
} from 'ionicons/icons';
import { DataService, Doctor } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.page.html',
  styleUrls: ['./doctor-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorListPage implements OnInit {
  doctores: Doctor[] = [];
  doctoresFiltrados: Doctor[] = [];
  isLoading = false;
  searchTerm = '';
  isAdmin = false;

  // Caché
  private cacheDoctores: Doctor[] | null = null;
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
      medicalOutline,
      addCircleOutline,
      createOutline,
      trashOutline,
      refreshOutline,
      searchOutline,
      personOutline,
      mailOutline,
      callOutline,
      businessOutline,
      chevronForwardOutline,
      timeOutline,
      eyeOutline
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
    await this.cargarDoctores();
  }

  // ============================================================
  // CACHE Y CARGA DE DATOS
  // ============================================================

  private isCacheValid(): boolean {
    return this.cacheDoctores !== null && (Date.now() - this.cacheTimestamp) < this.CACHE_TTL;
  }

  async cargarDoctores(forceRefresh: boolean = false) {
    if (!forceRefresh && this.isCacheValid()) {
      this.doctores = this.cacheDoctores!;
      this.aplicarFiltros();
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    try {
      const doctores = await this.dataService.getDoctores(this.isAdmin ? false : true);
      this.doctores = doctores || [];
      this.cacheDoctores = this.doctores;
      this.cacheTimestamp = Date.now();
      this.aplicarFiltros();
    } catch (error: any) {
      console.error('❌ Error al cargar doctores:', error);
      await this.mostrarToast(error?.message || 'Error al cargar doctores', 'danger');
      if (this.cacheDoctores) {
        this.doctores = this.cacheDoctores;
        this.aplicarFiltros();
      } else {
        this.doctores = [];
        this.doctoresFiltrados = [];
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
      this.doctoresFiltrados = [...this.doctores];
    } else {
      this.doctoresFiltrados = this.doctores.filter(d =>
        d.usuarios?.nombre_completo?.toLowerCase().includes(term) ||
        d.especialidad?.toLowerCase().includes(term) ||
        d.usuarios?.email?.toLowerCase().includes(term) ||
        d.usuarios?.telefono?.includes(term)
      );
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail?.value || '';
    this.aplicarFiltros();
    this.cd.detectChanges();
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByDoctorId(index: number, doctor: Doctor): string {
    return doctor.id;
  }

  // ============================================================
  // NAVEGACIÓN Y ACCIONES
  // ============================================================

  nuevoDoctor() {
    this.router.navigate(['/admin/doctors/new']);
  }

  verDetalle(id: string) {
    this.router.navigate([`/admin/doctors/${id}`]);
  }

  editarDoctor(id: string) {
    this.router.navigate([`/admin/doctors/edit/${id}`]);
  }

  async eliminarDoctor(doctor: Doctor) {
    if (!this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar doctor',
      message: `¿Estás seguro de eliminar a "${doctor.usuarios?.nombre_completo}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.dataService.deleteDoctor(doctor.id);
              await this.mostrarToast('Doctor eliminado correctamente', 'success');
              await this.cargarDoctores(true);
            } catch (error) {
              await this.mostrarToast('Error al eliminar doctor', 'danger');
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
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
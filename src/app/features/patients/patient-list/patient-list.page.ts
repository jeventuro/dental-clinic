// src/app/features/patients/patient-list/patient-list.page.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  addCircleOutline,
  createOutline,
  trashOutline,
  refreshOutline,
  searchOutline,
  personOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { DataService, Paciente, Usuario } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListPage implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  isLoading = true;
  searchTerm = '';
  isAdmin = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef
  ) {
    addIcons({
      peopleOutline,
      addCircleOutline,
      createOutline,
      trashOutline,
      refreshOutline,
      searchOutline,
      personOutline,
      mailOutline,
      callOutline,
      calendarOutline,
      chevronForwardOutline
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
    await this.cargarPacientes();
  }

  async cargarPacientes() {
    this.isLoading = true;
    try {
      const { data, error } = await this.dataService.getPacientes();
      if (error) throw error;
      this.pacientes = data || [];
      this.aplicarFiltros();
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      await this.mostrarToast('Error al cargar pacientes', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  aplicarFiltros() {
    const term = this.searchTerm.toLowerCase().trim();
    this.pacientesFiltrados = this.pacientes.filter(p =>
      p.usuarios?.nombre_completo?.toLowerCase().includes(term) ||
      p.usuarios?.email?.toLowerCase().includes(term) ||
      p.dni?.includes(term) ||
      p.usuarios?.telefono?.includes(term)
    );
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail?.value || '';
    this.aplicarFiltros();
    this.cd.detectChanges();
  }

  nuevoPaciente() {
    this.router.navigate(['/admin/patients/new']);
  }

  verDetalle(id: string) {
    this.router.navigate([`/admin/patients/${id}`]);
  }

  editarPaciente(id: string) {
    this.router.navigate([`/admin/patients/edit/${id}`]);
  }

  async eliminarPaciente(paciente: Paciente) {
    if (!this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar paciente',
      message: `¿Estás seguro de eliminar a "${paciente.usuarios?.nombre_completo}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.dataService.deletePaciente(paciente.id);
              await this.mostrarToast('Paciente eliminado correctamente', 'success');
              await this.cargarPacientes();
            } catch (error) {
              await this.mostrarToast('Error al eliminar paciente', 'danger');
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
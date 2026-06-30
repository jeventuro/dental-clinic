// src/app/features/doctors/doctor-form/doctor-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  saveOutline,
  closeOutline,
  personOutline,
  mailOutline,
  callOutline,
  businessOutline,
  medicalOutline,
  timeOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import { DataService, Sede } from '@core/data/data.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.page.html',
  styleUrls: ['./doctor-form.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class DoctorFormPage implements OnInit {
  isEdit = false;
  doctorId: string = '';
  isLoading = false;
  isSubmitting = false;

  formData = {
    nombre_completo: '',
    email: '',
    telefono: '',
    especialidad: '',
    horario: '',
    sede_id: '',
  };

  sedes: Sede[] = [];
  generatedPassword: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      saveOutline,
      closeOutline,
      personOutline,
      mailOutline,
      callOutline,
      businessOutline,
      medicalOutline,
      timeOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  async ngOnInit() {
    await this.cargarSedes();
    this.doctorId = this.route.snapshot.paramMap.get('id') || '';
    if (this.doctorId) {
      this.isEdit = true;
      await this.cargarDoctor();
    }
  }

  async cargarSedes() {
    try {
      const { data, error } = await this.dataService.getSedes();
      if (error) throw error;
      this.sedes = data || [];
    } catch (error) {
      console.error('Error al cargar sedes:', error);
      await this.mostrarToast('Error al cargar sedes', 'danger');
    }
  }

  async cargarDoctor() {
    this.isLoading = true;
    try {
      const doctor = await this.dataService.getDoctorById(this.doctorId);
      this.formData = {
        nombre_completo: doctor.usuarios?.nombre_completo || '',
        email: doctor.usuarios?.email || '',
        telefono: doctor.usuarios?.telefono || '',
        especialidad: doctor.especialidad || '',
        horario: doctor.horario || '',
        sede_id: doctor.sede_id || '',
      };
    } catch (error: any) {
      console.error('Error al cargar doctor:', error);
      await this.mostrarToast(error.message || 'Error al cargar doctor', 'danger');
      this.router.navigate(['/admin/doctors']);
    } finally {
      this.isLoading = false;
    }
  }

  private validarFormulario(): boolean {
    if (!this.formData.nombre_completo.trim()) {
      this.mostrarToast('El nombre completo es obligatorio', 'warning');
      return false;
    }
    if (!this.formData.email.trim()) {
      this.mostrarToast('El correo electrónico es obligatorio', 'warning');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.mostrarToast('Ingresa un correo electrónico válido', 'warning');
      return false;
    }
    if (!this.formData.especialidad.trim()) {
      this.mostrarToast('La especialidad es obligatoria', 'warning');
      return false;
    }
    if (!this.formData.sede_id) {
      this.mostrarToast('Selecciona una sede', 'warning');
      return false;
    }
    return true;
  }

  async onSubmit() {
    if (!this.validarFormulario()) return;

    this.isSubmitting = true;
    this.generatedPassword = null;

    try {
      if (this.isEdit) {
        await this.dataService.updateDoctorWithUser(this.doctorId, {
          nombre_completo: this.formData.nombre_completo,
          email: this.formData.email,
          telefono: this.formData.telefono,
          especialidad: this.formData.especialidad,
          horario: this.formData.horario,
          sede_id: this.formData.sede_id,
        });
        await this.mostrarToast('Doctor actualizado correctamente', 'success');
      } else {
        const result = await this.dataService.createDoctorWithUser({
          nombre_completo: this.formData.nombre_completo,
          email: this.formData.email,
          telefono: this.formData.telefono,
          especialidad: this.formData.especialidad,
          horario: this.formData.horario,
          sede_id: this.formData.sede_id,
        });
        this.generatedPassword = result.password;
        await this.mostrarToast(
          `Doctor creado. Contraseña temporal: ${this.generatedPassword}`,
          'info'
        );
      }
      this.router.navigate(['/admin/doctors']);
    } catch (error: any) {
      console.error('Error al guardar doctor:', error);
      await this.mostrarToast(error.message || 'Error al guardar doctor', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin/doctors']);
  }

  async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger' | 'info' = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: color === 'info' ? 6000 : 3000,
      color,
      position: 'bottom',
      buttons: color === 'info' ? [{ text: 'Copiar', handler: () => this.copiarPassword() }] : []
    });
    await toast.present();
  }

  copiarPassword() {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword);
      this.mostrarToast('Contraseña copiada al portapapeles', 'success');
    }
  }
}
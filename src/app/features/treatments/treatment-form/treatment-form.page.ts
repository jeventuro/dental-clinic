// src/app/features/tratamientos/treatment-form/treatment-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  saveOutline,
  closeOutline
} from 'ionicons/icons';
import { DataService, TratamientoCatalogo } from '@core/data/data.service';

@Component({
  selector: 'app-treatment-form',
  templateUrl: './treatment-form.page.html',
  styleUrls: ['./treatment-form.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class TreatmentFormPage implements OnInit {
  isEdit = false;
  tratamientoId: string = '';
  isLoading = false;
  isSubmitting = false;

  formData: Partial<TratamientoCatalogo> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 30,
    especialidad: '',
    activo: true,
  };

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      saveOutline,
      closeOutline
    });
  }

  async ngOnInit() {
    this.tratamientoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tratamientoId) {
      this.isEdit = true;
      await this.cargarTratamiento();
    }
  }

  async cargarTratamiento() {
    this.isLoading = true;
    try {
      const data = await this.dataService.getTratamientoById(this.tratamientoId);
      if (data) {
        this.formData = { ...data };
      } else {
        await this.mostrarToast('Tratamiento no encontrado', 'danger');
        this.router.navigate(['/admin/treatments']);
      }
    } catch (error) {
      console.error('Error al cargar tratamiento:', error);
      await this.mostrarToast('Error al cargar tratamiento', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (!this.formData.nombre?.trim()) {
      await this.mostrarToast('El nombre es obligatorio', 'warning');
      return;
    }
    if (!this.formData.precio || this.formData.precio <= 0) {
      await this.mostrarToast('El precio debe ser mayor a 0', 'warning');
      return;
    }
    if (!this.formData.duracion || this.formData.duracion <= 0) {
      await this.mostrarToast('La duración debe ser mayor a 0', 'warning');
      return;
    }

    this.isSubmitting = true;
    try {
      if (this.isEdit && this.tratamientoId) {
        await this.dataService.updateTratamiento(this.tratamientoId, this.formData);
        await this.mostrarToast('Tratamiento actualizado correctamente', 'success');
      } else {
        await this.dataService.createTratamiento(this.formData as any);
        await this.mostrarToast('Tratamiento creado correctamente', 'success');
      }
      this.router.navigate(['/admin/treatments']);
    } catch (error) {
      console.error('Error al guardar tratamiento:', error);
      await this.mostrarToast('Error al guardar tratamiento', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin/treatments']);
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
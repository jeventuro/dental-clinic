// src/app/features/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  callOutline,
  cardOutline,
  locationOutline,
  medicalOutline,
  saveOutline,
  closeOutline,
  logOutOutline
} from 'ionicons/icons';
import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/auth/auth.service';

interface PatientProfile {
  id?: string;
  fullName: string;
  email: string;
  dni: string;
  phone: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ProfilePage implements OnInit {
  patient: PatientProfile = {
    fullName: '',
    email: '',
    dni: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
  };
  isLoading = true;
  isEditing = false;
  isAdmin = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      cardOutline,
      locationOutline,
      medicalOutline,
      saveOutline,
      closeOutline,
      logOutOutline
    });
  }

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    this.isLoading = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.isAdmin = user.rol === 'admin';

      // Obtener paciente asociado al usuario
      const { data: paciente } = await this.dataService.getPacienteByUsuarioId(user.id);
      if (paciente) {
        this.patient = {
          id: paciente.id,
          fullName: user.nombre_completo || '',
          email: user.email || '',
          dni: paciente.dni || '',
          phone: user.telefono || '',
          address: paciente.direccion || '',
          emergencyContact: paciente.contacto_emergencia || '',
          bloodType: paciente.tipo_sangre || '',
          allergies: paciente.alergias || '',
        };
      } else {
        this.patient = {
          fullName: user.nombre_completo || '',
          email: user.email || '',
          dni: '',
          phone: user.telefono || '',
          address: '',
          emergencyContact: '',
          bloodType: '',
          allergies: '',
        };
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      await this.showToast('Error al cargar el perfil', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async saveProfile() {
    this.isLoading = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      // Actualizar usuario
      await this.dataService.updateUsuario(user.id, {
        nombre_completo: this.patient.fullName,
        telefono: this.patient.phone,
      });

      // Actualizar paciente (si existe)
      if (this.patient.id) {
        await this.dataService.updatePaciente(this.patient.id, {
          dni: this.patient.dni,
          // direccion: this.patient.address,
          // contacto_emergencia: this.patient.emergencyContact,
          // tipo_sangre: this.patient.bloodType,
          // alergias: this.patient.allergies,
        });
      }

      await this.showToast('Perfil actualizado correctamente', 'success');
      this.isEditing = false;
      await this.loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      await this.showToast('Error al guardar el perfil', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  logout() {
    this.authService.logout();
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
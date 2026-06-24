// src/app/features/auth/register/register.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '@core/auth/auth.service';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterLink,
  ],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        terms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      personOutline,
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      // Redirigir al dashboard correspondiente
      const user = this.authService.getCurrentUser();
      if (user) {
        this.router.navigate([`/${user.rol}/dashboard`]);
      }
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, phone, dni, password } = this.registerForm.value;
    this.isLoading = true;

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      // Llamar a register con email, password y metadata
      await this.authService.register(email, password, {
        nombre_completo: name,
        telefono: phone,
        rol: 'cliente',
        dni: dni,
      });
      await loading.dismiss();
      this.isLoading = false;
      const toast = await this.toastCtrl.create({
        message: 'Cuenta creada exitosamente. ¡Bienvenido!',
        duration: 2500,
        color: 'success',
      });
      toast.present();
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error completo:', error);
      const toast = await this.toastCtrl.create({
        message: error?.message || 'Error al crear la cuenta. Intenta de nuevo.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Getters
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get dni() { return this.registerForm.get('dni'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }
}
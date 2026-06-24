// src/app/features/auth/login/login.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '@core/auth/auth.service';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterLink,
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.navigateByRole();
    }
  }

  ngOnDestroy() {}

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading = true;

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const user = await this.authService.login(email, password);
      await loading.dismiss();
      this.isLoading = false;
      // user tiene la propiedad 'rol'
      this.navigateByRole(user?.rol);
    } catch (error: any) {
      await loading.dismiss();
      this.isLoading = false;
      const toast = await this.toastCtrl.create({
        message: error?.message || 'Error al iniciar sesión. Verifica tus credenciales.',
        duration: 3000,
        color: 'danger',
        position: 'bottom',
      });
      toast.present();
    }
  }

  private navigateByRole(rol?: string) {
    const currentUser = this.authService.getCurrentUser();
    const userRol = rol || currentUser?.rol;
    switch (userRol) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'doctor':
        this.router.navigate(['/doctor/dashboard']);
        break;
      case 'cliente':
      default:
        this.router.navigate(['/client/dashboard']);
        break;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
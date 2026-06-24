// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DataService, Usuario } from '@core/data/data.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.loadUser();
  }

  private async loadUser() {
    const profile = await this.dataService.getCurrentUserProfile();
    this.currentUserSubject.next(profile);
  }

  async login(email: string, password: string): Promise<Usuario> {
    const { data, error } = await this.dataService.signIn(email, password);
    if (error) throw new Error(error.message);
    const profile = await this.dataService.getCurrentUserProfile();
    this.currentUserSubject.next(profile);
    return profile!;
  }

  async register(email: string, password: string, metadata: any): Promise<any> {
    const { data, error } = await this.dataService.signUp(email, password, metadata);
    if (error) throw new Error(error.message);
    return data.user;
  }

  async logout(): Promise<void> {
    await this.dataService.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.rol || null;
  }
}
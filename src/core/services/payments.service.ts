import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PendingPayment {
  id: number;
  treatment: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface PaymentHistory {
  id: number;
  treatment: string;
  amount: number;
  date: string;
  method: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  // Listado de deudas iniciales (Hardcodeadas por defecto)
  private pendingList: PendingPayment[] = [
    { id: 1, treatment: 'Ortodoncia Premium', amount: 320, dueDate: '25 Mayo 2026', status: 'Pendiente' },
    { id: 2, treatment: 'Limpieza Dental', amount: 80, dueDate: '30 Mayo 2026', status: 'Pendiente' }
  ];

  // Historial inicial
  private historyList: PaymentHistory[] = [
    { id: 50, treatment: 'Implantes Dentales', amount: 1200, date: '12 Abril 2026', method: 'Visa' }
  ];

  // BehaviorSubjects para propagar los cambios reactivamente en toda la app
  private pendingSubject = new BehaviorSubject<PendingPayment[]>(this.pendingList);
  private historySubject = new BehaviorSubject<PaymentHistory[]>(this.historyList);

  public pendingPayments$ = this.pendingSubject.asObservable();
  public paymentHistory$ = this.historySubject.asObservable();

  constructor() {}

  /**
   * Genera una nueva deuda pendiente desde el módulo de Citas
   */
  public addPendingPayment(treatment: string, amount: number) {
    const today = new Date();
    today.setDate(today.getDate() + 2); // Vence en 2 días por defecto
    const formattedDate = `${today.getDate()} ${today.toLocaleString('es-PE', { month: 'long' })} ${today.getFullYear()}`;

    const newDebt: PendingPayment = {
      id: Math.floor(100 + Math.random() * 900),
      treatment,
      amount,
      dueDate: formattedDate,
      status: 'Pendiente'
    };

    this.pendingList.unshift(newDebt);
    this.pendingSubject.next([...this.pendingList]);
  }

  /**
   * Registra un pago directo completado (Para citas pagadas por adelantado)
   */
  public addDirectToHistory(treatment: string, amount: number, method: string) {
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString('es-PE', { month: 'long' })} ${today.getFullYear()}`;

    const newHistory: PaymentHistory = {
      id: Math.floor(100 + Math.random() * 900),
      treatment,
      amount,
      date: formattedDate,
      method
    };

    this.historyList.unshift(newHistory);
    this.historySubject.next([...this.historyList]);
  }

  /**
   * Realiza la transacción de liquidar una deuda existente
   */
  public payDebt(id: number, method: string): number {
    const index = this.pendingList.findIndex(p => p.id === id);
    if (index === -1) return 0;

    const debt = this.pendingList[index];
    
    // Lo añade al historial
    this.addDirectToHistory(debt.treatment, debt.amount, method);

    // Lo remueve de pendientes
    this.pendingList.splice(index, 1);
    this.pendingSubject.next([...this.pendingList]);

    return debt.amount; // Retorna el monto pagado para actualizar estadísticas superiores
  }
}
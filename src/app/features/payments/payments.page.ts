import { Component, OnInit, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PaymentsService, PendingPayment, PaymentHistory } from 'src/core/services/payments.service';
import { addIcons } from 'ionicons';
import { 
  alertCircleOutline, 
  checkmarkDoneOutline, 
  cardOutline, 
  phonePortraitOutline, 
  downloadOutline, 
  closeOutline, 
  cashOutline,
  addOutline,
  receiptOutline
} from 'ionicons/icons';



interface PaymentMethod {
  id: number;
  type: 'Visa' | 'MasterCard' | 'Yape' | 'Plin';
  number: string;
}


@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PaymentsPage implements OnInit, OnDestroy {
  
  public isPayModalOpen = false;
  public isAddMethodModalOpen = false;

  // Listas vacías preparadas para recibir el estado global del servicio
  public pendingPayments: PendingPayment[] = [];
  public paymentHistory: PaymentHistory[] = [];


  public paymentMethods: PaymentMethod[] = [
    { id: 10, type: 'Visa', number: '**** **** **** 4552' },
    { id: 11, type: 'Yape', number: '+51 987 654 321' }
  ];

  public totalPending: number = 0;
  public totalPaid: number = 1520; // Base acumulada histórica

  public checkoutForm = { paymentId: null as number | null, methodId: null as number | null };
  public newMethodForm: {
  type: 'Visa' | 'MasterCard' | 'Yape' | 'Plin';
  identifier: string;
    } = {type: 'Visa', identifier: '' };

  // Control de memoria para evitar fugas de rendimiento al cambiar de pantallas
  private subscriptions: Subscription = new Subscription();
  

 
  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private paymentsService: PaymentsService
  ) {
    addIcons({
      alertCircleOutline, checkmarkDoneOutline, cardOutline, 
      phonePortraitOutline, downloadOutline, closeOutline, 
      cashOutline, addOutline, receiptOutline
    });
  }

  ngOnInit() {
    // Escucha permanente y reactiva de deudas pendientes
    this.subscriptions.add(
      this.paymentsService.pendingPayments$.subscribe(list => {
        this.pendingPayments = list;
        this.calculateTotals();
      })
    );

    // Escucha permanente y reactiva del historial clínico-financiero
    this.subscriptions.add(
      this.paymentsService.paymentHistory$.subscribe(list => {
        this.paymentHistory = list;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Destrucción limpia al salir de la página
  }

  /**
   * Recalcula los cuadros informativos superiores en base al estado real de los arreglos
   */
  private calculateTotals(): void {
    this.totalPending = this.pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);
  }

  /**
   * Abre la pasarela inyectando opcionalmente una deuda específica elegida
   */
  public openPayModal(specificPaymentId: number | null = null): void {
    this.checkoutForm.paymentId = specificPaymentId;
    if (this.paymentMethods.length > 0) {
      this.checkoutForm.methodId = this.paymentMethods[0].id;
    }
    this.isPayModalOpen = true;
  }

  public closePayModal(): void {
    this.isPayModalOpen = false;
  }

  /**
   * Ejecuta la lógica transaccional de la pasarela de pagos
   */
  public async executePayment() {
    const { paymentId, methodId } = this.checkoutForm;

    if (!paymentId || !methodId) {
      this.presentToast('Por favor, selecciona la deuda y tu método de pago.', 'warning');
      return;
    }

    const methodSelected = this.paymentMethods.find(m => m.id === methodId);
    if (!methodSelected) return;

    // Procesamos la transacción en el servicio y nos devuelve el monto cobrado
    const amountPaid = this.paymentsService.payDebt(paymentId, methodSelected.type);

    if (amountPaid > 0) {
      this.totalPaid += amountPaid; // Sumamos a la caja de cobrados exitosos
      await this.presentToast('¡Transacción completada! Tu estado de cuenta ha sido actualizado.', 'success');
    }

    this.closePayModal();
  }

  // ---- CONTROL DE AGREGAR MÉTODOS DE PAGO ----
  public openAddMethodModal(): void {
    this.newMethodForm = { type: 'Visa', identifier: '' };
    this.isAddMethodModalOpen = true;
  }

  public closeAddMethodModal(): void {
    this.isAddMethodModalOpen = false;
  }

  public async registerPaymentMethod() {
    const form = this.newMethodForm;
    if (!form.identifier || form.identifier.trim().length < 8) {
      this.presentToast('Por favor, ingresa un número de tarjeta o celular válido.', 'warning');
      return;
    }

    let maskedIdentifier = form.identifier;
    if (form.type === 'Visa' || form.type === 'MasterCard') {
      const clean = form.identifier.replace(/\s+/g, '');
      maskedIdentifier = `**** **** **** ${clean.slice(-4)}`;
    } else {
      maskedIdentifier = `+51 ${form.identifier.replace(/\s+/g, '')}`;
    }

    this.paymentMethods.push({
      id: Math.floor(Math.random() * 1000),
      type: form.type,
      number: maskedIdentifier
    });

    this.closeAddMethodModal();
    await this.presentToast(`Método de pago ${form.type} vinculado correctamente.`, 'success');
  }

  /**
   * Simulación del servicio de descarga de PDFs clínicos / Comprobantes Sunat
   */
  public async downloadInvoice(historyItem: PaymentHistory) {
    const alert = await this.alertController.create({
      header: 'Comprobante Electrónico',
      subHeader: `B001-0000${historyItem.id}`,
      message: `Se ha iniciado la descarga automática de tu Boleta de Venta por el concepto de ${historyItem.treatment} (Monto: S/ ${historyItem.amount}.00).`,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({ message, duration: 3000, color, position: 'bottom' });
    await toast.present();
  }
}
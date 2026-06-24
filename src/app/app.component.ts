import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, calendarOutline, walletOutline, medicalOutline, 
  settingsOutline, logOutOutline, personOutline, notificationsOutline,
  gridOutline, peopleOutline, cashOutline, analyticsOutline,
  searchOutline, addCircleOutline, chevronDownOutline, chevronForwardOutline,
  mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, callOutline,
  cardOutline, lockOpenOutline, personAddOutline, calendarClearOutline,
  phonePortraitOutline, medkitOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      homeOutline,
      calendarOutline,
      walletOutline,
      medicalOutline,
      settingsOutline,
      logOutOutline,
      personOutline,
      notificationsOutline,
      gridOutline,
      peopleOutline,
      cashOutline,
      analyticsOutline,
      searchOutline,
      addCircleOutline,
      chevronDownOutline,
      chevronForwardOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      callOutline,
      cardOutline,
      lockOpenOutline,
      personAddOutline,
      calendarClearOutline,
      phonePortraitOutline,
      medkitOutline
    });
  }
}

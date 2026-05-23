import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
// Přidali jsme import NgIf, protože budeme v šabloně používat *ngIf pro offline lištu
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  // DŮLEŽITÉ: Do imports jsme přidali NgIf, aby Angular uměl zpracovat *ngIf v HTML
  imports: [IonRouterOutlet],
})
export class AppComponent {
  // Sledování stavu sítě pro celou aplikaci
  isOffline: boolean = !navigator.onLine;

  constructor() {
    this.initializeApp();
    this.setupNetworkListeners();
  }

  initializeApp() {
    // Tvoje původní logika pro kontrolu a nastavení Dark Modu
    const theme = localStorage.getItem('user-theme');
    const isDark = theme === 'dark' || theme === null;

    document.body.classList.toggle('dark', isDark);
  }

  // Nová metoda, která hlídá, jestli uživatel neztratil nebo nezískal internet
  setupNetworkListeners() {
    window.addEventListener('online', () => this.isOffline = false);
    window.addEventListener('offline', () => this.isOffline = true);
  }


}

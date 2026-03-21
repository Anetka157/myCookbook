import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonItem, IonLabel, IonList, IonAvatar, IonToggle
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personCircleOutline, mailOutline, logOutOutline,
  notificationsOutline, colorPaletteOutline, shieldCheckmarkOutline
} from 'ionicons/icons';

import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, //IonHeader, IonToolbar, IonTitle,
    IonButton, IonIcon, IonItem, IonLabel, IonList, IonAvatar, IonToggle
  ],
})
export class Tab3Page implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  user: any = null;
  notificationsEnabled: boolean = false;
  isDarkMode: boolean = true;

  constructor() {
    addIcons({
      personCircleOutline, mailOutline, logOutOutline,
      notificationsOutline, colorPaletteOutline, shieldCheckmarkOutline
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe(userData => {
      this.user = userData;
    });

    const savedSettings = localStorage.getItem('user_notifications');
    this.notificationsEnabled = savedSettings === 'true';

    const theme = localStorage.getItem('user-theme');
    this.isDarkMode = theme === 'dark' || theme === null; // Pokud nic není, dáme dark
    this.applyTheme();
  }

  toggleTheme(event: any) {
    this.isDarkMode = event.detail.checked;
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('user-theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleNotifications(event: any) {
    this.notificationsEnabled = event.detail.checked;
    localStorage.setItem('user_notifications', this.notificationsEnabled.toString());
    console.log('Nastavení uloženo do localStorage:', this.notificationsEnabled);
  }

  async showPrivacyPolicy() {
    const alert = await this.alertCtrl.create({
      header: 'Ochrana osobních údajů',
      subHeader: 'Zásady zpracování',
      message: 'Vaše údaje (email a jméno) používáme výhradně pro personalizaci receptů a nejsou sdíleny s třetími stranami. Data jsou bezpečně uložena v databázi Firebase.',
      buttons: ['Rozumím']
    });

    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Odhlášení',
      message: 'Opravdu se chcete odhlásit?',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Odhlásit',
          role: 'confirm',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}

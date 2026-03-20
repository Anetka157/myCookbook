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

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent,
    IonButton, IonIcon, IonItem, IonLabel, IonList, IonAvatar, IonToggle
  ],
})
export class Tab3Page implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: any = null;
  // Perzistentní nastavení - tohle učitel chce!
  notificationsEnabled: boolean = false;
  isDarkMode: boolean = true;

  constructor() {
    addIcons({
      personCircleOutline, mailOutline, logOutOutline,
      notificationsOutline, colorPaletteOutline, shieldCheckmarkOutline
    });
  }

  ngOnInit() {
    // Načtení dat o uživateli z Firebase
    this.authService.user$.subscribe(userData => {
      this.user = userData;
    });

    // NAČTENÍ PERZISTENTNÍCH DAT (z paměti telefonu)
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
    // Tohle přepne třídu přímo na body aplikace
    document.body.classList.toggle('dark', this.isDarkMode);
    // Uložíme do paměti
    localStorage.setItem('user-theme', this.isDarkMode ? 'dark' : 'light');
  }

  // ULOŽENÍ PERZISTENTNÍCH DAT
  toggleNotifications(event: any) {
    this.notificationsEnabled = event.detail.checked;
    localStorage.setItem('user_notifications', this.notificationsEnabled.toString());
    console.log('Nastavení uloženo do localStorage:', this.notificationsEnabled);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}

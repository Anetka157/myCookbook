import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private auth = inject(Auth);
  private navCtrl = inject(NavController);

  constructor() {
    this.initializeApp();
    this.checkUserStatus();
  }

  initializeApp(): void {
    const theme = localStorage.getItem('user-theme');
    const isDark = !theme || theme === 'dark';
    document.body!.classList.toggle('dark', isDark);
  }

  checkUserStatus() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if (window.location.pathname.includes('login')) {
          this.navCtrl.navigateRoot(['/tabs/tab1']);
        }
      } else {
        this.navCtrl.navigateRoot(['/login']);
      }
    });
  }
}

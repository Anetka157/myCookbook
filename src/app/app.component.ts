import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }


  initializeApp() {
    const theme = localStorage.getItem('user-theme');
    const isDark = theme === 'dark' || theme === null;

    document.body.classList.toggle('dark', isDark);
  }
}

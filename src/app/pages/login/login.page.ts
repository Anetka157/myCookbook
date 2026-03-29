import {ChangeDetectorRef, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  isRegister = false;
  email = '';
  password = '';
  confirmPassword = '';
  displayName = '';

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);

  private cd = inject(ChangeDetectorRef);

  toggleMode() {
    console.log('Kliknuto na přepínač. Před změnou:', this.isRegister);
    this.isRegister = !this.isRegister;

    this.cd.detectChanges();

    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  async onLogin() {
    if (!this.email || !this.password) {
      await this.showAlert('Chyba', 'Zadej prosím email a heslo.');
      return;
    }
    try {

      await this.authService.login(this.email, this.password);
      this.navCtrl.navigateRoot(['/tabs/tab1']);
    } catch (e: any) {
      console.error('Login error detail:', e); // Tohle nám v konzoli řekne víc
      await this.showAlert('Chyba přihlášení', 'Nesprávný email nebo heslo.');
    }
  }

  async onRegister() {
    // 1. Kontrola jména
    if (!this.displayName || this.displayName.trim().length < 2) {
      await this.showAlert('Chyba', 'Zadej prosím platné jméno (aspoň 2 znaky).');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      await this.showAlert('Chyba', 'Zadej prosím platný e-mail.');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);

    if (this.password.length < 8) {
      await this.showAlert('Slabé heslo', 'Heslo musí mít minimálně 8 znaků.');
      return;
    }
    if (!hasUpperCase || !hasNumber) {
      await this.showAlert('Slabé heslo', 'Heslo musí obsahovat aspoň jedno velké písmeno a jedno číslo.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Chyba', 'Hesla se neshodují.');
      return;
    }

    try {
      await this.authService.register(this.email, this.password, this.displayName);
      this.navCtrl.navigateRoot(['/tabs/tab1']);
    } catch (e: any) {
      await this.showAlert('Chyba registrace', 'Registrace se nezdařila. Zkuste jiný e-mail.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

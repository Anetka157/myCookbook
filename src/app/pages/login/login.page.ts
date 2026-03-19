import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  // Stav formuláře
  isRegister = false;

  // Modely
  email = '';
  password = '';
  confirmPassword = '';
  displayName = '';

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);

  toggleMode() {
    this.isRegister = !this.isRegister;
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.showAlert('Chyba', 'Zadej prosím email a heslo.');
      return;
    }
    try {
      await this.authService.login(this.email, this.password);
      this.navCtrl.navigateRoot(['/tabs/tab1']);
    } catch (e: any) {
      this.showAlert('Chyba přihlášení', 'Nesprávný email nebo heslo.');
    }
  }

  async onRegister() {
    if (this.displayName.length < 2) {
      this.showAlert('Chyba', 'Zadej prosím své jméno.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showAlert('Chyba', 'Hesla se neshodují.');
      return;
    }
    if (this.password.length < 6) {
      this.showAlert('Chyba', 'Heslo musí mít aspoň 6 znaků.');
      return;
    }

    try {
      await this.authService.register(this.email, this.password, this.displayName);
      this.showAlert('Úspěch', 'Účet byl vytvořen!');
      this.navCtrl.navigateRoot(['/tabs/tab1']);
    } catch (e: any) {
      this.showAlert('Chyba registrace', 'Uživatel s tímto emailem již existuje.');
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

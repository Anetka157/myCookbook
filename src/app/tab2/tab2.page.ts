import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/services/data';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})

export class Tab2Page {
  private dataService = inject(DataService);
  private authService = inject(AuthService);

  favorites: any[] = [];

  async ionViewWillEnter() {
    const user = await firstValueFrom(this.authService.user$);
    if (user) {
      // Zavoláme tvoji funkci a pošleme tam UID přihlášeného uživatele
      this.dataService.getCollectionData('favorites', user.uid).subscribe(res => {
        this.favorites = res;
        console.log('Moje oblíbené:', this.favorites);
      });
    }
  }

  removeFromFavorites(docId: string) {
    this.dataService.deleteFromCollection('favorites', docId).subscribe(() => {
      // Po smazání seznam prostě znovu načteme
      this.ionViewWillEnter();
    });
  }
}

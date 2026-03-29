import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/services/data';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom } from 'rxjs';

import { addIcons } from 'ionicons';
import { heart, heartOutline, calendarOutline } from 'ionicons/icons';

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

  constructor() {
    addIcons({
      heart,
      'heart-outline': heartOutline,
      'calendar-outline': calendarOutline
    });
  }

  favorites: any[] = [];

  async ionViewWillEnter() {
    const user = await firstValueFrom(this.authService.user$);
    if (user) {
      this.dataService.getCollectionData('favorites', user.uid).subscribe(res => {
        this.favorites = res;
        console.log('Moje oblíbené:', this.favorites);
      });
    }
  }

  removeFromFavorites(docId: string) {
    this.dataService.deleteFromCollection('favorites', docId).subscribe(() => {
      this.ionViewWillEnter();
    });
  }
}

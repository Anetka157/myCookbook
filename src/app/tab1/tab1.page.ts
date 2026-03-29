import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';
import { FilterComponent } from 'src/app/filter/filter.component';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/services/data';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom } from 'rxjs';
import { Firestore, collection, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';

import { addIcons } from 'ionicons';
import {
  heart, heartOutline, timeOutline, statsChartOutline,
  restaurantOutline, searchOutline, optionsOutline, flameOutline, star, closeCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class Tab1Page implements OnInit {

  private mealService = inject(MealService);
  private modalCtrl = inject(ModalController);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private cd = inject(ChangeDetectorRef);

  public displayName: string = '';

  recipes: any[] = [];
  favoriteIds: number[] = [];
  searchTerm: string = '';
  offset = 0;
  filters: any = {};
  totalRecipes = 0;
  isLoading = false;

  constructor() {
    addIcons({
      'heart': heart,
      'heart-outline': heartOutline,
      'time-outline': timeOutline,
      'stats-chart-outline': statsChartOutline,
      'restaurant-outline': restaurantOutline,
      'search-outline': searchOutline,
      'options-outline': optionsOutline,
      'flame-outline': flameOutline,
      'star': star,
      'close-circle-outline': closeCircleOutline
    });
  }

  ngOnInit() {
    this.loadMeals(false);
    this.loadUserData();
    this.loadFavorites();

  }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }


  clearSearch() {
    this.searchTerm = ''; // Vymaže text
    this.offset = 0;      // Resetuje stránkování
    this.recipes = [];    // Vyčistí aktuální seznam
    this.loadMeals(false); // načte základní seznam bez filtrů
  }

  loadMeals(append: boolean = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    const activeFilters = { ...this.filters, query: this.searchTerm };

    this.mealService.getMeals(this.offset, activeFilters).subscribe({
      next: (res: any) => {
        if (append) {
          this.recipes = this.recipes.concat(res.results);
        } else {
          this.recipes = res.results;
        }

        this.totalRecipes = res.total;

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  handleSearch() {
    this.offset = 0;
    this.recipes = [];
    this.loadMeals(false);
  }


  onContentScroll(event: any) {
    if (this.isLoading || this.recipes.length >= this.totalRecipes) {
      return;
    }

    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 300) {
      this.offset = this.recipes.length;
      this.loadMeals(true);
    }
  }


  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      componentProps: { ...this.filters }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.filters = data;
      this.handleSearch();
    }
  }



  loadUserData() {
    this.authService.user$.subscribe(user => {
      if (user) {
        setTimeout(() => {
          const nameFromEmail = user.email?.split('.')[0] || 'Kuchaři';
          this.displayName = user.displayName || nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          this.cd.detectChanges();
        }, 0);
      }
    });
  }

  async loadFavorites() {
    try {
      const user = await firstValueFrom(this.authService.user$);
      if (!user) return;
      const q = query(collection(this.firestore, 'favorites'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      this.favoriteIds = querySnapshot.docs.map(doc => doc.data()['recipeId']);
    } catch (error) {
      console.error('Chyba oblíbených:', error);
    }
  }

  isFavorite(recipeId: number): boolean {
    return this.favoriteIds.includes(recipeId);
  }

  async toggleFavorite(recipe: any) {
    const user = await firstValueFrom(this.authService.user$);
    if (!user) { alert('Musíš se přihlásit.'); return; }

    if (this.isFavorite(recipe.id)) {
      const q = query(collection(this.firestore, 'favorites'), where('userId', '==', user.uid), where('recipeId', '==', recipe.id));
      const snap = await getDocs(q);
      snap.forEach(async (d) => await deleteDoc(doc(this.firestore, 'favorites', d.id)));
      this.favoriteIds = this.favoriteIds.filter(id => id !== recipe.id);
    } else {
      const fav = { userId: user.uid, recipeId: recipe.id, title: recipe.title, image: recipe.image, addedAt: new Date() };
      await this.dataService.addToCollection('favorites', fav);
      this.favoriteIds.push(recipe.id);
    }
  }
}

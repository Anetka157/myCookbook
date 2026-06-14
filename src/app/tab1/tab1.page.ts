import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';
import { FilterComponent } from 'src/app/filter/filter.component';
import { RouterModule, Router } from '@angular/router';
import { DataService } from 'src/app/services/data';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom } from 'rxjs';
import { Firestore, collection, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';

import { Auth } from '@angular/fire/auth';

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
  private fbAuth = inject(Auth);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);

  public displayName: string = '';
  public isOnline: boolean = navigator.onLine;

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
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.cd.detectChanges();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.cd.detectChanges();
    });

    this.authService.user$.subscribe(user => {
      if (!user) {
        console.log('Uživatel není přihlášen, přesun na login screen.');
        this.router.navigate(['/login']);
      } else {
        console.log('Uživatel ověřen přes AuthService:', user.email);
        if (this.recipes.length === 0) {
          this.loadMeals(false);
        }
        this.loadUserData();
        this.loadFavorites();
      }
    });
  }

  ionViewWillEnter() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadFavorites();
      }
    });
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  clearSearch() {
    this.searchTerm = '';
    this.offset = 0;
    this.recipes = [];
    this.loadMeals(false);
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

  loadMoreRecipes() {
    if (this.isLoading || this.recipes.length >= this.totalRecipes) {
      return;
    }
    this.offset = this.recipes.length;
    this.loadMeals(true);
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

  // Pomocná metodá pro správu zobrazení aktivních filtrů v UI
  hasActiveFilters(): boolean {
    if (!this.filters) return false;
    return Object.keys(this.filters).some(
      key => this.filters[key] !== null && this.filters[key] !== undefined && this.filters[key] !== '' && this.filters[key] !== false
    );
  }

  getActiveFiltersKeys(): string[] {
    if (!this.filters) return [];
    return Object.keys(this.filters).filter(
      key => this.filters[key] !== null && this.filters[key] !== undefined && this.filters[key] !== '' && this.filters[key] !== false
    );
  }

  getFilterLabel(key: string): string {
    const val = this.filters[key];
    if (val === null || val === undefined || val === '') return '';

    // Převod na řetězec a odstranění mezer pro jistotu
    const stringVal = String(val).toLowerCase().trim();

    // Slovníček pro překlad z API do češtiny (přidej si sem další, pokud máš ve filtru jiné)
    const translations: { [key: string]: string } = {
      // Typy jídel (mealType)
      'breakfast': 'Snídaně',
      'lunch': 'Oběd',
      'dinner': 'Večeře',
      'dessert': 'Dezert',

      // Kuchyně (cuisine)
      'italian': 'Italská',
      'mexican': 'Mexická',
      'chinese': 'Čínská',
      'indian': 'Indická',
      'french': 'Francouzská',
      'czech': 'Česká',

      // Dieta
      'vegetarian': 'Vegetariánská',
      'vegan': 'Veganská',
      'gluten free': 'Bezlepková',

      // Obtížnosti (difficulty)
      'easy lvl': 'Snadná',
      'medium lvl': 'Střední',
      'hard lvl': 'Náročná'
    };

    if (translations[stringVal]) {
      return translations[stringVal];
    }

    if (typeof val === 'boolean' && val === true) {
      if (key === 'vegetarian') return 'Vegetariánské';
      if (key === 'vegan') return 'Veganské';
      if (key === 'glutenFree') return 'Bezlepkové';
      return key;
    }

    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  removeFilter(key: string) {
    if (!this.filters) return;

    // Reset filtr podle typu hodnoty
    if (typeof this.filters[key] === 'boolean') {
      this.filters[key] = false;
    } else {
      this.filters[key] = '';
    }

    this.handleSearch();
  }

  async loadUserData() {
    this.authService.user$.subscribe(async user => {
      if (user) {
        let currentName = user.displayName;

        // Pokud jméno chybí, vynutíme reload přes nativní Firebase Auth
        if (!currentName) {
          try {
            const rawUser = this.fbAuth.currentUser;
            if (rawUser) {
              await rawUser.reload(); // Stáhne čerstvá data ze serveru
              currentName = rawUser.displayName; // Vezme čerstvé jméno
            }
          } catch (e) {
            console.error('Nepodařilo se znovu načíst profil uživatele:', e);
          }
        }

        // Pokud jméno mám, ukáže se, jinak bereme e-mail jako zálohu
        if (currentName) {
          this.displayName = currentName;
        } else {
          const nameFromEmail = user.email?.split('.')[0] || 'Kuchaři';
          this.displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        }

        // Vynutíme překreslení stránky
        this.cd.detectChanges();
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

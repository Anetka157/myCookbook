import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';
import { FilterComponent } from 'src/app/filter/filter.component';
import { RouterModule } from '@angular/router';
import { DataService } from 'src/app/services/data';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
})
export class Tab1Page implements OnInit {
  private mealService = inject(MealService);
  private modalCtrl = inject(ModalController);
  private dataService = inject(DataService);
  private authService = inject(AuthService);

  userName: string = '';
  recipes: any[] = [];
  searchTerm: string = '';
  offset = 0;
  filters: any = {};
  totalRecipes = 0;

  ngOnInit() {
    this.loadMeals();
    this.loadUserData();
  }

  loadUserData() {
    this.authService.user$.subscribe(user => {
      if (user) {
        const nameFromEmail = user.email?.split('.')[0] || 'Kuchaři';
        const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        this.userName = user.displayName || capitalizedName;
      }
    });
  }

  loadMeals() {
    const activeFilters = { ...this.filters, query: this.searchTerm };
    this.mealService.getMeals(this.offset, activeFilters).subscribe((res: any) => {
      if (this.offset === 0) {
        this.recipes = res.results;
      } else {
        this.recipes = [...this.recipes, ...res.results];
      }
      this.totalRecipes = res.total;
    });
  }

  loadMore(event: any) {
    this.offset += 20;
    this.loadMeals(); // Použijeme loadMeals, aby se zachovala logika přidávání
    event.target.complete();
    if (this.recipes.length >= this.totalRecipes) {
      event.target.disabled = true;
    }
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      componentProps: {
        // Posíláme aktuální nastavení do modalu
        type: this.filters.type || '',
        cuisine: this.filters.cuisine || '',
        diet: this.filters.diet || ''
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      // Kompletně přepíšeme filtry daty z modalu
      this.filters = data;
      this.handleSearch();
    }
  }

  handleSearch() {
    this.resetList();
    this.loadMeals();
  }

  private resetList() {
    this.offset = 0;
    this.recipes = [];
    this.totalRecipes = 0;
  }

  async addToFavorites(recipe: any) {
    try {
      const user = await firstValueFrom(this.authService.user$);
      if (!user) {
        alert('Pro ukládání receptů se musíš přihlásit.');
        return;
      }

      const favRecipe = {
        userId: user.uid,
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        addedAt: new Date()
      };

      await this.dataService.addToCollection('favorites', favRecipe);
      console.log('Recept uložen!', favRecipe);
    } catch (error) {
      console.error('Chyba při ukládání:', error);
    }
  }
}

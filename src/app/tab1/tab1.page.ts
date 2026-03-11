import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';
import { FilterComponent } from 'src/app/filter/filter.component';
import { RouterModule } from '@angular/router'; // <--- TENTO IMPORT JE KLÍČOVÝ

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule // <--- MUSÍ BÝT TADY, ABY FUNGOVAL routerLink
  ],
})
export class Tab1Page implements OnInit {
  private mealService = inject(MealService);
  private modalCtrl = inject(ModalController);

  recipes: any[] = [];
  searchTerm: string = '';
  offset = 0;
  filters: any = {};
  totalRecipes = 0;

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {
    const activeFilters = { ...this.filters, query: this.searchTerm };
    this.mealService.getMeals(this.offset, activeFilters).subscribe((res: any) => {
      this.recipes = [...this.recipes, ...res.results];
      this.totalRecipes = res.total;
    });
  }

  loadMore(event: any) {
    this.offset += 20;
    this.mealService.getMeals(this.offset, this.filters).subscribe((res: any) => {
      this.recipes = [...this.recipes, ...res.results];
      this.totalRecipes = res.total;
      event.target.complete();

      if (this.recipes.length >= this.totalRecipes) {
        event.target.disabled = true;
      }
    });
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.filters = data;
      this.resetList();
      this.loadMeals();
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
}

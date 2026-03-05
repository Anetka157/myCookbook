import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {

  private mealService = inject(MealService);

  recipes: any[] = [];
  filteredRecipes: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {
    this.mealService.getAllMeals().subscribe((res: any) => {
      this.recipes = res.results;
      this.filteredRecipes = res.results;
    });
  }

  filterRecipes() {
    this.filteredRecipes = this.recipes.filter((r: any) =>
      r.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';
import { Meal } from 'src/app/models/meal.model';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {

  private mealService = inject(MealService);

  recipes: Meal[] = [];
  filteredRecipes: Meal[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {
    this.mealService.getAllMeals().subscribe(res => {
      this.recipes = res.meals;
      this.filteredRecipes = res.meals;
    });
  }

  filterRecipes() {
    this.filteredRecipes = this.recipes.filter(r =>
      r.strMeal.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from 'src/app/core/services/meal.service';
import { FilterComponent } from 'src/app/filter/filter.component';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FilterComponent],
})
export class Tab1Page implements OnInit {

  private mealService = inject(MealService);
  private modalCtrl = inject(ModalController);

  recipes: any[] = [];
  searchTerm: string = '';
  offset = 0;
  filters: any = {};

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {

    this.mealService.getMeals(this.offset, this.filters).subscribe((res: any) => {

      this.recipes = [...this.recipes, ...res.results];

    });

  }

  loadMore(event: any) {

    this.offset += 20;

    this.mealService.getMeals(this.offset, this.filters).subscribe((res: any) => {

      this.recipes = [...this.recipes, ...res.results];

      event.target.complete();

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

      this.offset = 0;
      this.recipes = [];

      this.loadMeals();

    }

  }

}

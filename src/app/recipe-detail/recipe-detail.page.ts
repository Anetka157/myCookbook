import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import {
  arrowBack,      // Tato chybí pro tu šipku zpět!
  timeOutline,
  flameOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeDetailPage implements OnInit {

  recipe: any;
  instructionsArray: string[] = [];

  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({
      'arrow-back': arrowBack,
      'time-outline': timeOutline,
      'flame-outline': flameOutline
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/tabs/tab1');
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const cachedData = localStorage.getItem('my_recipes_cache');

    if (cachedData) {
      const allRecipes = JSON.parse(cachedData);
      this.recipe = allRecipes.find((r: any) => r.id == id);

      if (this.recipe) {
        if (typeof this.recipe.instructions === 'string') {
          this.instructionsArray = this.recipe.instructions
            .split(/\d+\.|\. /) // Rozdělí podle "1." nebo ". "
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);
        } else {
          this.instructionsArray = this.recipe.instructions;
        }
      }
    }
  }
}

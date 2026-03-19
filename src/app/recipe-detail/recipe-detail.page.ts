import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Přidáno pro checkboxy

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeDetailPage implements OnInit {
  recipe: any;
  instructionsArray: string[] = []; // Tady budeme mít rozsekaný postup
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const cachedData = localStorage.getItem('my_recipes_cache');

    if (cachedData) {
      const allRecipes = JSON.parse(cachedData);
      this.recipe = allRecipes.find((r: any) => r.id == id);

      if (this.recipe) {
        // Pokud jsou instrukce string, rozsekáme je podle teček nebo čísel
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

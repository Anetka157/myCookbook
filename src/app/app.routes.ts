import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'recipe-detail/:id',
    loadComponent: () => import('./recipe-detail/recipe-detail.page').then( m => m.RecipeDetailPage)
  },
  // Pokud tvoje Tab1 v HTML odkazuje na 'recipe/:id', přidej i tohle:
  {
    path: 'recipe/:id',
    redirectTo: 'recipe-detail/:id',
    pathMatch: 'full'
  }
];

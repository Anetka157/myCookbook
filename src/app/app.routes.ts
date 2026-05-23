import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/tab1', // ZMĚNA: Startujeme na hlavní stránce, ne na loginu
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'recipe-detail/:id',
    loadComponent: () => import('./recipe-detail/recipe-detail.page').then( m => m.RecipeDetailPage)
  },
  {
    path: 'recipe/:id',
    redirectTo: 'recipe-detail/:id',
    pathMatch: 'full'
  }
];

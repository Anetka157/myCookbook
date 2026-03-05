import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
  private API_KEY = '1091013dc3d3484686c6c9fd746b940a';

  constructor(private http: HttpClient) {}

  getMeals() {
    return this.http.get(`${this.API_URL}?number=20&addRecipeInformation=true&apiKey=${this.API_KEY}`);
  }

  searchMeals(query: string) {
    return this.http.get(`${this.API_URL}?query=${query}&number=20&apiKey=${this.API_KEY}`);
  }

  getAllMeals() {
    return this.http.get(`${this.API_URL}?number=20&apiKey=${this.API_KEY}`);
  }

}

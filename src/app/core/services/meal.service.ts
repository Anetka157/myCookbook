import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
  private API_KEY = '1091013dc3d3484686c6c9fd746b940a';

  constructor(private http: HttpClient) {}

  getMeals(offset: number = 0, filters: any = {}) {

    let url = `${this.API_URL}?number=20&offset=${offset}&addRecipeInformation=true&sort=popularity&apiKey=${this.API_KEY}`;

    if(filters.type){
      url += `&type=${filters.type}`;
    }

    if(filters.cuisine){
      url += `&cuisine=${filters.cuisine}`;
    }

    if(filters.diet){
      url += `&diet=${filters.diet}`;
    }

    return this.http.get(url);
  }

}

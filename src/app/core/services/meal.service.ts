import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private http = inject(HttpClient);

  // Odkaz na tvůj JSON na Gistu
  private apiUrl = 'https://corsproxy.io/?https://gist.github.com/Anetka157/dbef31727bef96b1317d1758037b9ccc/raw/763fc3b3ce51393919a7bdf56d03cbfeb5363fad/recipes.json';

  getMeals(offset: number = 0, filters: any = {}) {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(allData => {
        // Uložení do cache pro offline režim
        localStorage.setItem('my_recipes_cache', JSON.stringify(allData));
        return this.processData(allData, offset, filters);
      }),
      catchError(err => {
        const cachedData = localStorage.getItem('my_recipes_cache');
        if (cachedData) {
          const allData = JSON.parse(cachedData);
          return of(this.processData(allData, offset, filters));
        } else {
          return of({ results: [], total: 0 });
        }
      })
    );
  }

  private processData(data: any[], offset: number, filters: any) {
    let filtered = [...data];

    // 1. FILTR: Vyhledávání (Text v searchbaru)
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(m => m.title.toLowerCase().includes(q));
    }

    // 2. FILTR: Typ jídla (Snídaně, Oběd, Dezert...)
    if (filters.type && filters.type !== '') {
      const t = filters.type.toLowerCase();
      filtered = filtered.filter(m =>
        // Hledáme v poli dishTypes (standard Spoonacular) nebo v přímé vlastnosti type
        (m.dishTypes && m.dishTypes.some((dt: string) => dt.toLowerCase().includes(t))) ||
        (m.type && m.type.toLowerCase() === t)
      );
    }

    // 3. FILTR: Kuchyně (Italská, Americká...)
    if (filters.cuisine && filters.cuisine !== '') {
      const c = filters.cuisine.toLowerCase();
      filtered = filtered.filter(m =>
        (m.cuisines && m.cuisines.some((cs: string) => cs.toLowerCase() === c)) ||
        (m.cuisine && m.cuisine.toLowerCase() === c)
      );
    }

    // 4. FILTR: Dieta (Vegetariánská, Bezlepková...)
    if (filters.diet && filters.diet !== '') {
      const d = filters.diet.toLowerCase();
      filtered = filtered.filter(m =>
        (m.diets && m.diets.some((di: string) => di.toLowerCase() === d)) ||
        (m.diet && m.diet.toLowerCase() === d)
      );
    }

    // Stránkování (Pagination)
    const results = filtered.slice(offset, offset + 20);

    return {
      results: results,
      total: filtered.length
    };
  }
}

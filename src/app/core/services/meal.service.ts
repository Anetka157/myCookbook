import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private http = inject(HttpClient);

  // Tvůj fungující odkaz
  private apiUrl = 'https://corsproxy.io/?https://gist.github.com/Anetka157/dbef31727bef96b1317d1758037b9ccc/raw/763fc3b3ce51393919a7bdf56d03cbfeb5363fad/recipes.json';

  getMeals(offset: number = 0, filters: any = {}) {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(allData => {
        // ONLINE: Data přišla v pořádku, uložíme je do LocalStorage pro příště
        localStorage.setItem('my_recipes_cache', JSON.stringify(allData));
        console.log('Data stažena z API a uložena do LocalStorage');
        return this.processData(allData, offset, filters);
      }),
      catchError(err => {
        // OFFLINE: Internet nejde, zkusíme najít data v LocalStorage
        console.warn('API nedostupné, zkouším LocalStorage...');
        const cachedData = localStorage.getItem('my_recipes_cache');

        if (cachedData) {
          const allData = JSON.parse(cachedData);
          console.log('Zobrazuji data z LocalStorage (Offline režim)');
          return of(this.processData(allData, offset, filters));
        } else {
          // Pokud nemáme internet ani uložená data, vrátíme prázdný výsledek
          console.error('Žádná data nejsou k dispozici (offline a bez cache)');
          return of({ results: [], total: 0 });
        }
      })
    );
  }

  // Tahle pomocná funkce dělá filtrování, aby se kód neopakoval
  private processData(data: any[], offset: number, filters: any) {
    let filtered = [...data];

    // Vyhledávání
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(m => m.title.toLowerCase().includes(q));
    }

    // Tady můžeš přidat další filtry z tvého FilterComponent
    if (filters.cuisine) {
      filtered = filtered.filter(m => m.cuisine === filters.cuisine);
    }

    const results = filtered.slice(offset, offset + 20);

    return {
      results: results,
      total: filtered.length
    };
  }
}

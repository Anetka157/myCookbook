export interface Recipe {
  id?: string | number; // Firebase dává ID jako string, tvoje data mají číslo, tak povolíme obojí
  title: string;
  image: string;
  type: string;
  cuisine: string;
  diets: string[];      // Pole řetězců
  description: string;
  ingredients: string[]; // Pole řetězců
  instructions: string;
}

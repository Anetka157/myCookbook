export interface Recipe {
  id?: string | number;
  title: string;
  image: string;
  type: string;
  cuisine: string;
  diets: string[];
  description: string;
  ingredients: string[];
  instructions: string;
}

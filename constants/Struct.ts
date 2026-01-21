export interface FoodItem {
  id: string;
  name: string;
  ingredients: string[];
  allergens: string[];
  isDangerous?: boolean;
}

export interface AnalysisResponse {
  foods: FoodItem[];
}
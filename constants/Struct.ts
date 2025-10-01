export interface FoodItem {
  id: string;
  name: string;
  ingredients: string[];
  allergens: string[];
}

export interface AnalysisResponse {
  foods: FoodItem[];
}
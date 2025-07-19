// src/api/mockApi.ts

// Defines the structure for a single food item identified in the menu.
export interface FoodItem {
  id: string;
  name: string;
  ingredients: string[];
  allergens: string[];
}

// Defines the structure for the entire API response.
export interface AnalysisResponse {
  foods: FoodItem[];
}

// The mock data, now strongly typed with our AnalysisResponse interface.
const MOCK_RESPONSE: AnalysisResponse = {
  foods: [
    {
      id: "1",
      name: "Spicy Tuna Roll",
      ingredients: [
        "Tuna",
        "Rice",
        "Nori",
        "Spicy Mayo",
        "Cucumber",
        "Avocado",
      ],
      allergens: ["Fish", "Egg (in mayo)", "Soy (in soy sauce)"],
    },
    {
      id: "2",
      name: "Pad Thai",
      ingredients: [
        "Rice Noodles",
        "Shrimp",
        "Tofu",
        "Bean Sprouts",
        "Peanuts",
        "Egg",
        "Fish Sauce",
        "Tamarind Paste",
      ],
      allergens: ["Shellfish", "Peanuts", "Egg", "Fish", "Soy (in Tofu)"],
    },
    {
      id: "3",
      name: "Caesar Salad",
      ingredients: [
        "Romaine Lettuce",
        "Croutons",
        "Parmesan Cheese",
        "Caesar Dressing",
      ],
      allergens: ["Dairy (in cheese)", "Gluten (in croutons)", "Fish (in dressing)"],
    },
  ],
};

/**
 * Simulates analyzing an image and returning allergy information.
 * The function signature is now typed for its arguments and return value.
 * @param imageUri - The URI of the image to analyze (not used in mock).
 * @returns A promise that resolves with the typed analysis data.
 */
export const analyzeImage = (
  imageUri?: string,
): Promise<AnalysisResponse> => {
  console.log("Simulating analysis for image:", imageUri);

  return new Promise((resolve) => {
    // Simulate a network delay of 2 seconds
    setTimeout(() => {
      console.log("Analysis complete. Returning mock data.");
      resolve(MOCK_RESPONSE);
    }, 2000);
  });
};